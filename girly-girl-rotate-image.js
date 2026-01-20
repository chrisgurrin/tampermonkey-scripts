// ==UserScript==
// @name         GirlyGirlPic - Rotate images
// @namespace    http://tampermonkey.net/
// @version      2025-06-23
// @description  try to take over the world!
// @author       You
// @match        https://en.girlygirlpic.com/a/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=girlygirlpic.com
// @grant        none
// ==/UserScript==
var rotation = 0;

const addStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
      .hide-after::after {
        display: none !important;
      }

      .box-shadow{
        box-shadow: 0 0 8px rgba(0,0,0,.6)
      }

      .toolbar{
        display: flex;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        padding-inline: 2rem;
        inset-inline: 0;
        background: transparent !important;
      }

      .toolbar .mfp-close {
        position: relative !important;
        width: min-content !important;
        display: flex;
        align-content: center;
        padding: 0;
      }

      .toolbar.rotate{
          inset-inline: 10rem;
          z-index: 9999;
          opacity: 0.1;
          transition: all 0.3s ease-in;
          background: transparent !important;
      }

      .toolbar.rotate:hover{
          opacity: 1;
      }

      .toolbar.close .mfp-close:last-child{
        margin-left: auto;
        align-self: end;
      }

      .toolbar .btn-rotate{
        transform: rotate(180deg);
        z-index: 99999;
        cursor: pointer !important;
        opacity: 1 !important;
        align-self: center;
      }

      .mfp-figure figure{
        display: contents;
      }

      .mfp-figure img{
        padding: 0 !important;
        max-height: calc(100vh - 0px) !important;
      }`;
  document.head.appendChild(style);
};

const updateRotation = (r) => {
  rotation += r;
  if (rotation < 0) {
    rotation = 270;
  }
};

const setImageRotation = (img) => {
  img.style.transform = `rotate(${rotation}deg)`;

  if ((rotation / 90) % 2 == 1) {
    if (img.width > window.innerHeight) {
      img.style.setProperty("max-width", "calc(100vh - 0px)", "important");
    }
  } else {
    img.style.setProperty("max-width", "100%", "important");
  }
};

const createRotateControl = (text, dir, onClick) => {
  var btn = document.createElement("button");
  btn.classList.add("mfp-close");
  btn.classList.add("btn-rotate");
  btn.innerHTML = text;
  btn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };
  btn.title = `Rotate ${dir}`;
  return btn;
};

const addRotateControls = (mfpFigure, img) => {
  var toolbarRotate = document.createElement("div");
  var toolbarClose = document.createElement("div");

  toolbarRotate.classList.add("toolbar");
  toolbarRotate.classList.add("rotate");

  toolbarClose.classList.add("toolbar");
  toolbarClose.classList.add("close");

  var btnClose = mfpFigure.querySelector(".mfp-close");
  toolbarClose.prepend(btnClose);
  mfpFigure.prepend(toolbarClose);

  var left = createRotateControl("↪️", "anti-clockwise", () => {
    updateRotation(-90);
    setImageRotation(img);
  });
  var right = createRotateControl("↩️", "clockwise", () => {
    updateRotation(90);
    setImageRotation(img);
  });

  toolbarRotate.append(left);
  toolbarRotate.append(right);
  mfpFigure.prepend(toolbarRotate);
};

(function () {
  "use strict";

  // 1. Add styles
  addStyles();

  // 2. Create observer
  const mfpFigureClass = ".mfp-figure";

  const observer = new MutationObserver((mutationsList) => {
    var elements = document.querySelectorAll(mfpFigureClass);
    if (elements.Length < 1) {
      return;
    }

    rotation = 0;

    var mfpFigure = elements[0];
    if (!mfpFigure || mfpFigure.classList.contains("done")) return;

    var figure = mfpFigure.querySelector("figure");
    var img = mfpFigure.querySelector("img");
    if (!mfpFigure || !mfpFigure) return;

    mfpFigure.classList.add("hide-after");
    img.classList.add("box-shadow");

    mfpFigure.classList.add("done");

    addRotateControls(mfpFigure, img);
  });

  // 3. Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
