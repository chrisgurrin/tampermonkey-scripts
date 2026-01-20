// ==UserScript==
// @name         Fansly Full Size Images
// @namespace    http://tampermonkey.net/
// @version      2025-10-21
// @description  try to take over the world!
// @author       You
// @match        https://fansly.com/*/posts
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fansly.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  // CONSTANTS
  //
  const _svgMagnifierGlass =
    '<svg width="25px" height="25px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M17.545 15.467l-3.779-3.779a6.15 6.15 0 0 0 .898-3.21c0-3.417-2.961-6.377-6.378-6.377A6.185 6.185 0 0 0 2.1 8.287c0 3.416 2.961 6.377 6.377 6.377a6.15 6.15 0 0 0 3.115-.844l3.799 3.801a.953.953 0 0 0 1.346 0l.943-.943c.371-.371.236-.84-.135-1.211zM4.004 8.287a4.282 4.282 0 0 1 4.282-4.283c2.366 0 4.474 2.107 4.474 4.474a4.284 4.284 0 0 1-4.283 4.283c-2.366-.001-4.473-2.109-4.473-4.474z"/></svg>';
  const _btnFullsizeClass = "modal-fullsize";
  const _linkAddedClass = "link-added";

  // FUNCTIONS
  //
  const getMediaWrappers = () => {
    const modal = document.querySelector("app-media-browser-modal");
    return modal ? [...modal.querySelectorAll(".media-wrapper")] : [];
  };

  const appendFullsizeBtn = (wrapper) => {
    const btn = createFullsizeBtn(wrapper);
    const controlOverlay = wrapper.querySelector(".control-overlay");
    if (controlOverlay) {
      controlOverlay.append(btn);
      wrapper.classList.add(_linkAddedClass);
    }
  };

  const createFullsizeBtn = (wrapper) => {
    const btn = document.createElement("a");
    btn.innerHTML = _svgMagnifierGlass;
    btn.classList.add(_btnFullsizeClass);
    btn.addEventListener("mouseenter", (event) => {
      const img = wrapper.querySelector("app-media.image img");
      if (img && event.target.href == "") {
        event.target.href = img.src;
      }
    });
    return btn;
  };

  // MAIN
  //
  // Step 1. Add btn styles
  const btnFullsizeStyle = `
    .${_btnFullsizeClass} {
	pointer-events: all;
	position: absolute;
	cursor: pointer;
	z-index: 2;
	top: 15px;
	right: 5.25em;
	border-radius: 999px;
	display: flex;
	flex-direction: Row;
	justify-content: center;
	align-items: center;
	color: var(--pure-white);
    text-decoration: none;
    }`;
  var styleSheet = document.createElement("style");
  styleSheet.textContent = btnFullsizeStyle;
  document.head.appendChild(styleSheet);

  // Step 2: set up observer
  const targetNode = document.querySelector("body");
  const config = { attributes: true, childList: true, subtree: true };
  const callback = (mutationList, observer) => {
    console.log("callback");
    observer.disconnect(); // disconnect to stop new button triggering another mutation

    getMediaWrappers().forEach((wrapper) => {
      if (wrapper.classList.contains(_linkAddedClass)) return;

      appendFullsizeBtn(wrapper);
    });

    observer.observe(targetNode, config); //start listening again
  };

  // Step 3: Begin observer
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
})();
