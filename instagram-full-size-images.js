// ==UserScript==
// @name         Instagram Full Size Images
// @namespace    http://tampermonkey.net/
// @version      2024-11-06
// @description  Add link in posts to full size images/video thumbnails
// @author       You
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// ==/UserScript==

const imageClass = "_aagv";
const videoThumbnailClass = "xmz0i5r";
const processedClass = "processed";

const addButtonClassToDocument = () => {
  const style = document.createElement("style");
  style.innerHTML = `
    .btn-full-view {
        position: absolute;
        top: 6px;
        left: 6px;
        width: 2.5rem;
        height:2.5rem;
        max-width: 2.5rem;
        max-height:2.5rem;
        z-index:9999;

        display: flex;
        align-content: center;
        justify-content: center;

        font-size: 1.5rem;
        text-decoration: none !important;
        line-height: 2.25rem;

        transform: scaleX(-100%);

        background: #fff4;
        border: 0px solid #222;
        border-radius: 0.4rem;
        color: #222;
        padding: 0rem;
    }
   .btn-full-view:hover {
        background: #009fff;
        border-color: #fff;
        color: #fff;
    }`;

  document.head.appendChild(style);
};

const addButtonToMedia = (node, imgUrl) => {
  node.style.position = "relative";

  const button = document.createElement("a");
  button.textContent = "🔎︎";
  button.innerHTML =
    '<svg style="width: 1.5rem" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="white" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>';
  button.classList.add("btn-full-view");
  button.href = imgUrl;
  node.appendChild(button);
};

const mutationCallback = (mutationsList) => {
  for (const mutation of mutationsList) {
    mutation.addedNodes.forEach((node) => {
      // process img media
      const imgNodes = document.querySelectorAll(
        `.${imageClass}:not(.${processedClass})`,
      );
      [...imgNodes].forEach((node) => {
        if (node.classList.contains(processedClass)) return;

        const imgUrl = node.firstChild.getAttribute("src");
        const parentNode = node.parentNode.parentNode.parentNode;

        addButtonToMedia(parentNode, imgUrl);
        node.classList.add(processedClass);
      });

      // process video media
      const videoNodes = document.querySelectorAll(
        `.${videoThumbnailClass}:not(.${processedClass})`,
      );

      [...videoNodes].forEach((node) => {
        if (node.classList.contains(processedClass)) return;

        const imgUrl = node.getAttribute("src");
        const parentNode =
          node.parentNode.parentNode.parentNode.parentNode.parentNode;

        addButtonToMedia(parentNode, imgUrl);
        node.classList.add(processedClass);
      });
    });
  }
};
const observer = new MutationObserver(mutationCallback);

// add button styles
addButtonClassToDocument();

// start observing
observer.observe(document.getElementsByTagName("body")[0], {
  childList: true,
  subtree: true,
});

// observer.disconnect();
