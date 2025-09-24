chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === "CROPPED_IMAGE") {
    // Try to open the extension popup UI to show preview automatically
    try {
      chrome.action.openPopup().catch(() => {
        // Fallback: open a small window with the popup page
        chrome.windows.create({
          url: chrome.runtime.getURL("popup.html"),
          type: "popup",
          width: 360,
          height: 520
        });
      });
    } catch (_) {
      try {
        chrome.windows.create({
          url: chrome.runtime.getURL("popup.html"),
          type: "popup",
          width: 360,
          height: 520
        });
      } catch (__) {}
    }
  }
});


