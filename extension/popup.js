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
    formData.append("file", file, file.name);
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
  const type = payload.type || "image";
  const result = payload.result || {};
  const realism = Number(result.Realism ?? result.realism ?? 0);
  const deepfake = Number(result.Deepfake ?? result.deepfake ?? 0);
  const verdict = deepfake >= realism ? "Likely Deepfake" : "Likely Real";
  const badgeClass = deepfake >= realism ? "badge badge-fake" : "badge badge-real";

  const realismPct = Math.round(realism * 100);
  const deepfakePct = Math.round(deepfake * 100);

  resultEl.innerHTML = `
    <div class="row">
      <div><strong>Analysis</strong> <span class="badge ${badgeClass}">${verdict}</span></div>
      <div style="font-size:11px;color:#666;">${type}</div>
    </div>
    <div style="margin:4px 0 2px;">Realism: ${realismPct}%</div>
    <div class="meter"><div class="bar bar-real" style="width:${realismPct}%;"></div></div>
    <div style="margin:8px 0 2px;">Deepfake: ${deepfakePct}%</div>
    <div class="meter"><div class="bar bar-fake" style="width:${deepfakePct}%;"></div></div>
  `;
}
  