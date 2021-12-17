(async () => {
  const src = chrome.extension.getURL('scripts/content/content.js');
  const contentScript = await import(src);
  contentScript.main();
})();
