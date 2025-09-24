// Drag directly on any image to select a rectangular region and crop it

// Prevent duplicate initialization and block any legacy auto-download behavior
if (!window.__imageCropperInitialized) {
  window.__imageCropperInitialized = true;
  // Intercept legacy download anchors created by older versions
  document.addEventListener("click", function(e) {
    const a = e.target && e.target.closest && e.target.closest("a[download]");
    if (a && /cropped_image\.png$/i.test(String(a.getAttribute("download") || ""))) {
      e.preventDefault();
      e.stopImmediatePropagation();
      // Remove the element to be safe
      if (a.parentNode) a.parentNode.removeChild(a);
    }
  }, true);
}

function enableDragSelectionOnImages() {
  document.querySelectorAll("img").forEach(img => {
    // Improve UX and prevent default image dragging/ghosting
    img.style.cursor = "crosshair";
    img.addEventListener("dragstart", e => e.preventDefault());

    function beginSelection(startClientX, startClientY) {
      const rect = img.getBoundingClientRect();
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.left = rect.left + "px";
      overlay.style.top = rect.top + "px";
      overlay.style.width = rect.width + "px";
      overlay.style.height = rect.height + "px";
      overlay.style.zIndex = 999999;
      overlay.style.cursor = "crosshair";
      overlay.style.background = "rgba(0,0,0,0.05)";
      overlay.style.pointerEvents = "auto";
      document.body.appendChild(overlay);

      let startX, startY, endX, endY;
      const selectionBox = document.createElement("div");
      selectionBox.style.position = "absolute";
      selectionBox.style.border = "2px dashed #2196f3";
      selectionBox.style.background = "rgba(33,150,243,0.15)";
      selectionBox.style.display = "none";
      overlay.appendChild(selectionBox);

      function getRelativeCoords(clientX, clientY) {
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
        return { x, y };
      }

      // Initialize with the initial down point
      const init = getRelativeCoords(startClientX, startClientY);
      startX = init.x;
      startY = init.y;
      selectionBox.style.left = startX + "px";
      selectionBox.style.top = startY + "px";
      selectionBox.style.width = "0px";
      selectionBox.style.height = "0px";
      selectionBox.style.display = "block";

      function updateSelection(clientX, clientY) {
        const coords = getRelativeCoords(clientX, clientY);
        endX = coords.x;
        endY = coords.y;
        const x = Math.min(startX, endX);
        const y = Math.min(startY, endY);
        const w = Math.abs(endX - startX);
        const h = Math.abs(endY - startY);
        selectionBox.style.left = x + "px";
        selectionBox.style.top = y + "px";
        selectionBox.style.width = w + "px";
        selectionBox.style.height = h + "px";
      }

      function finishSelection(clientX, clientY) {
        selectionBox.style.display = "none";
        const coords = getRelativeCoords(clientX, clientY);
        endX = coords.x;
        endY = coords.y;
        const x = Math.round(Math.min(startX, endX));
        const y = Math.round(Math.min(startY, endY));
        const w = Math.round(Math.abs(endX - startX));
        const h = Math.round(Math.abs(endY - startY));

        if (w > 0 && h > 0) {
          const scaleX = img.naturalWidth / img.width;
          const scaleY = img.naturalHeight / img.height;
          const sx = Math.round(x * scaleX);
          const sy = Math.round(y * scaleY);
          const sw = Math.round(w * scaleX);
          const sh = Math.round(h * scaleY);

          const canvas = document.createElement("canvas");
          canvas.width = sw;
          canvas.height = sh;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

          const croppedDataUrl = canvas.toDataURL("image/png");
          try {
            if (chrome && chrome.storage && chrome.storage.local) {
              chrome.storage.local.set({ lastCroppedImage: croppedDataUrl });
            }
          } catch (_) {}
          try {
            chrome.runtime && chrome.runtime.sendMessage({ type: "CROPPED_IMAGE", dataUrl: croppedDataUrl });
          } catch (_) {}
        }

        document.body.removeChild(overlay);
        window.removeEventListener("mousemove", onWindowMouseMove, true);
        window.removeEventListener("mouseup", onWindowMouseUp, true);
        window.removeEventListener("touchmove", onWindowTouchMove, { passive: false, capture: true });
        window.removeEventListener("touchend", onWindowTouchEnd, true);
      }

      function onWindowMouseMove(ev) {
        ev.preventDefault();
        updateSelection(ev.clientX, ev.clientY);
      }
      function onWindowMouseUp(ev) {
        ev.preventDefault();
        finishSelection(ev.clientX, ev.clientY);
      }
      function onWindowTouchMove(ev) {
        ev.preventDefault();
        const t = ev.touches[0];
        if (t) updateSelection(t.clientX, t.clientY);
      }
      function onWindowTouchEnd(ev) {
        ev.preventDefault();
        const t = ev.changedTouches && ev.changedTouches[0];
        if (t) finishSelection(t.clientX, t.clientY);
      }

      window.addEventListener("mousemove", onWindowMouseMove, true);
      window.addEventListener("mouseup", onWindowMouseUp, true);
      window.addEventListener("touchmove", onWindowTouchMove, { passive: false, capture: true });
      window.addEventListener("touchend", onWindowTouchEnd, true);
    }

    // Start selection on mouse or touch down directly over the image
    img.addEventListener("mousedown", e => {
      e.preventDefault();
      e.stopPropagation();
      beginSelection(e.clientX, e.clientY);
    });
    img.addEventListener("touchstart", e => {
      if (!e.touches || !e.touches[0]) return;
      e.preventDefault();
      e.stopPropagation();
      const t = e.touches[0];
      beginSelection(t.clientX, t.clientY);
    }, { passive: false });
  });
}

enableDragSelectionOnImages();