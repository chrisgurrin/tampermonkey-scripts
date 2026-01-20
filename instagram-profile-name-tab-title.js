// ==UserScript==
// @name         Set instagram tab title to profile name
// @namespace    http://tampermonkey.net/
// @version      2025-05-18
// @description  Prevents the document title being changed from profile name to "Instagram"
// @author       You
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  const targetNode = document.querySelector("title");
  const config = { attributes: true, childList: true, subtree: true };

  const callback = (mutationList, observer) => {
    observer.disconnect();
    document.title = mutationList[0].removedNodes[0].data;
    observer.observe(targetNode, config);
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
})();
