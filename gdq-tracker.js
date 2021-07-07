// ==UserScript==
// @name         GDQ Current Run Highlighter
// @version      0.1
// @description  Hhighlight the current active run during a GDQ event.
// @author       Visible Stink
// @match        https://gamesdonequick.com/schedule
// @icon         https://gamesdonequick.com/static/res/img/favicon/favicon.ico
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==

$(document).ready(() => {
  const getCurrentDayHeader = () => {
    var zeroNow = new Date();
    zeroNow.setHours(0, 0, 0, 0);
    return $("tr.day-split")
      .toArray()
      .find((element, index) => {
        if (index > 0) {
          var headerDateStr = getDateStrFromHeader($(element));
          var headerDate = new Date();
          headerDate.setTime(Date.parse(headerDateStr));
          return zeroNow.getTime() === headerDate.getTime();
        }
        return false;
      });
  };

  const getDateStrFromHeader = (tr) => {
    const headerText = tr.children("td:first").html();
    const split = headerText.split(" ");
    const day = split[2].substring(0, split[2].length - 2);
    const month = split[1];
    return `${day} ${month} ${new Date().getFullYear()}`;
  };

  const highlightRun = (tr) => {
    var css = { background: "#ffc0ce" };
    tr.css(css);
    tr.prev("tr").css(css);
    tr.prev().prevAll("tr:not(.day-split)").css("color", "#878787");
    setTimeout(() => {
      tr.prev()[0].scrollIntoView();
    }, 300);
  };

  const header = getCurrentDayHeader();
  const dateStr = getDateStrFromHeader($(header));

  $(header)
    .nextAll("tr")
    .not(".second-row")
    .each(function () {
      const runStart = $(this).children("td.start-time:first").html();
      const runDate = Date.parse(`${dateStr} ${runStart}`);
      if (runDate > Date.now()) {
        highlightRun($(this).prevAll("tr.second-row:first"));
        return false;
      }
    });
});
