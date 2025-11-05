const preview = document.getElementById("preview");
const empty = document.getElementById("empty");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const clearBtn = document.getElementById("clearBtn");

document.getElementById("cropBtn").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
  // Ping content script (optional) to ensure it's live; ignore response
  try { chrome.tabs.sendMessage(tab.id, { type: "ENABLE_CROP" }); } catch (_) {}
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === "CROPPED_IMAGE" && message.dataUrl) {
    preview.src = message.dataUrl;
    preview.style.display = "block";
    empty.style.display = "none";
    // Persist and trigger upload
    try {
      chrome.storage.local.set({ lastCroppedImage: message.dataUrl }, () => {
        uploadToBackend(message.dataUrl);
      });
    } catch (_) {
      uploadToBackend(message.dataUrl);
    }
  }
});

// On popup open, restore last cropped image if present
document.addEventListener("DOMContentLoaded", () => {
  try {
    chrome.storage.local.get(["lastCroppedImage"], ({ lastCroppedImage }) => {
      if (lastCroppedImage) {
        preview.src = lastCroppedImage;
        preview.style.display = "block";
        empty.style.display = "none";
        uploadToBackend(lastCroppedImage);
      }
    });
  } catch (_) {}
});

function dataUrlToFile(dataUrl, filename) {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

async function uploadToBackend(dataUrl) {
  if (!dataUrl) return;
  statusEl.textContent = "Uploading cropped image...";
  resultEl.textContent = "";
  try {
    const file = dataUrlToFile(dataUrl, "crop.png");
    const formData = new FormData();
    formData.append("image", file, file.name);
    const res = await fetch("http://localhost:8000/api/detect", {
      method: "POST",
      body: formData
    });
    const text = await res.text();
    statusEl.textContent = res.ok ? "Upload complete" : `Upload failed (${res.status})`;
    // Try to parse JSON and render nicely
    try {
      const json = JSON.parse(text);
      renderResult(json);
    } catch (_) {
      resultEl.textContent = text;
    }
  } catch (err) {
    statusEl.textContent = "Upload error";
    resultEl.textContent = String(err);
  }
}

clearBtn.addEventListener("click", () => {
  try {
    chrome.storage.local.remove(["lastCroppedImage"], () => {
      // Reset UI
      preview.src = "";
      preview.style.display = "none";
      empty.style.display = "block";
      statusEl.textContent = "";
      resultEl.textContent = "";
      // Reload popup for full reset
      location.reload();
    });
  } catch (_) {
    location.reload();
  }
});

function renderResult(payload) {
  if (!payload || typeof payload !== "object") {
    resultEl.textContent = String(payload);
    return;
  }

  // Main fields from new payload structure
  const createdAt = payload.created_at;
  const id = payload.id;
  const report = payload.report || {};
  const aiGenerated = report.ai_generated || {};
  const deepfake = payload.deepfake || {};
  const meta = payload.meta || {};
  const nsfw = payload.nsfw || {};
  const quality = payload.quality || {};

  // Verdict and badge (from new style, fallbacks)
  let verdictText = "Unknown";
  let badgeClass = "badge";
  if (aiGenerated.verdict === "ai") {
    verdictText = "Likely AI";
    badgeClass = "badge badge-fake";
  } else if (aiGenerated.verdict === "human") {
    verdictText = "Likely Real";
    badgeClass = "badge badge-real";
  }

  // Deepfake info
  const deepfakeDetected = deepfake.is_detected ? "Yes" : "No";
  const deepfakeConfidence = (typeof deepfake.confidence === "number")
    ? Math.round(deepfake.confidence * 100)
    : null;

  // NSFW
  const nsfwDetected = nsfw.is_detected ? "Yes" : "No";

  // Quality
  const qualityDetected = quality.is_detected ? "Yes" : "No";

  // Meta info
  const width = meta.width ?? "";
  const height = meta.height ?? "";
  const format = meta.format ?? "";
  const sizeKB = typeof meta.size_bytes === "number"
    ? (meta.size_bytes / 1024).toFixed(1) + " KB"
    : "";
  const md5 = meta.md5 ?? "";

  // Compose HTML
  resultEl.innerHTML = `
    <div class="row">
      <div>
        <strong>Analysis</strong> <span class="${badgeClass}">${verdictText}</span>
      </div>
      <div style="font-size:11px;color:#666;">${format ? format : "image"}</div>
    </div>
    <div style="margin:4px 0 2px;">
    </div>
    ${deepfakeConfidence !== null ? `
      <div class="meter"><div class="bar bar-fake" style="width:${deepfakeConfidence}%;"></div></div>
    ` : ""}
    <div style="margin:4px 0 2px;">
      <b>NSFW:</b> ${nsfwDetected}
    </div>
    <div style="margin:4px 0 2px;">
      <b>Quality Issues:</b> ${qualityDetected}
    </div>
    <div style="margin:10px 0 2px;color:#aaa;">
      <b>ID:</b> <code>${id || ""}</code>
      <br><b>Created At:</b> <time>${createdAt ? new Date(createdAt).toLocaleString() : ""}</time>
      <br><b>Size:</b> ${sizeKB}
      <br><b>Dimensions:</b> ${width && height ? `${width} x ${height}` : ""}
      <br><b>MD5:</b> <span style="font-size:10px;">${md5}</span>
    </div>
  `;
}
  