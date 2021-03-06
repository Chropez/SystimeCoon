(function(enabled) {
  if (enabled) {
    document.body.classList.add("loading");
    window.history.pushState('home', 'Title', '/');
    
    var xhr = new XMLHttpRequest();

    xhr.open("GET", chrome.extension.getURL("index.html"));

    xhr.onload = function() {
      document.open();
      document.write(xhr.responseText.replace(/assets\//g, chrome.extension.getURL("assets/")));
      document.close();

      // Fix broken images
      document.addEventListener("error", function (event) {
        var el = event.target, src = el.getAttribute("src");

        if (el.tagName === "IMG" && src && src.indexOf(chrome.extension.getURL("/")) < 0) {
          el.setAttribute("src", chrome.extension.getURL(src));
        }
      }, true);
    };

    xhr.send(null);

    chrome.runtime.onMessage.addListener(
      function(request, sender) {
        if (request === "toggle" && !sender.tab) {
          window.sessionStorage.setItem("disable-coon", true);
          window.location.reload();
        }
      }
    );

    chrome.runtime.sendMessage("enabled");
  } else {
    document.body.classList.add("coon-disabled");

    chrome.runtime.onMessage.addListener(
      function(request, sender) {
        if (request === "toggle" && !sender.tab) {
          window.sessionStorage.removeItem("disable-coon");
          window.location.reload();
        }
      }
    );

    chrome.runtime.sendMessage("disabled");
  }
})(
  window.location.search.indexOf("coon=0") < 0 &&
  !window.sessionStorage.getItem("disable-coon")
);
