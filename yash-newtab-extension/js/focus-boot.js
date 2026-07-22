(function () {
  if (location.search === '?x') return;

  var url = chrome.runtime.getURL('newtab.html') + '?x';

  chrome.tabs.getCurrent(function (tab) {
    if (chrome.runtime.lastError || !tab || tab.id == null) {
      location.replace(url);
      return;
    }
    chrome.tabs.create({ url: url, index: tab.index, active: true }, function () {
      chrome.tabs.remove(tab.id);
    });
  });
})();
