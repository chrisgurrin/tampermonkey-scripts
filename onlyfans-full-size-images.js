// ==UserScript==
// @name         OnlyFans Full Size Images
// @namespace    http://tampermonkey.net/
// @version      2025-02-12
// @description  try to take over the world!
// @author       You
// @match        https://onlyfans.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onlyfans.com
// @grant        none
// ==/UserScript==

const imageClass = ".b-post__media__img";
const swiperClass = ".swiper-slide";

const pswpClass = ".pswp__img";

const processImg = (img) => {
  if (img && !img.classList.contains("done")) {
    const button = document.createElement("a");
    button.href = img.src;
    button.innerHTML = "🔍";
    button.style.position = "absolute";
    button.style.top = "1rem";
    button.style.left = "1rem";
    button.style.borderRadius = "1rem";
    button.style.padding = "4px";
    button.style.fontSize = "4rem";
    button.style.zIndex = 999999;

    img.parentNode.style.position = "relative";
    img.parentNode.prepend(button);

    img.classList.add("done");
  }
};

// observer
let observerConfig = { childList: true, subtree: true };

const onImageAdded = (mutationsList, observer) => {
  const swipers = document.querySelectorAll(swiperClass);
  swipers.forEach((swiper, i) => {
    const img = swiper.querySelector(`img${imageClass}`);
    processImg(img);
    console.log(img.src, "small " + i);
  });

  const pswpContainers = document.querySelectorAll(pswpClass);
  pswpContainers.forEach((pswp, i) => {
    const img = pswp.querySelector(`img`);
    processImg(img);
    console.log(img.src, "big " + i);
  });
};
const observer = new MutationObserver(onImageAdded);

// main
observer.observe(document.querySelector("body"), observerConfig);
