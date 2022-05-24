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

const now  = new Date();
const red  = 'rgba(242, 24, 71, 0.5)';
const blue = 'rgba(0, 174, 239, 0.5)';
const grey = 'rgba(128,128,128,0.1';
const liveEventStatus = 'Event is live!';

const previousRunsCss = {
    'text-decoration':'line-through',
    'background-color': grey
};
const activeRunCss = {'background-color': `${blue}`}; //change blue to red here for red highlight color!

const getCurrentDayHeader = () => {
    var zeroNow = new Date(now);
    zeroNow.setHours(0,0,0,0);

    return $('tr.day-split').toArray().find((element, index)=> {
        if(index > 0){
            var headerDateStr = getDateStrFromHeader($(element));
            var headerDate = new Date();
            headerDate.setTime(Date.parse(headerDateStr));
            return zeroNow.getTime() === headerDate.getTime();
        }
        return false;
    });
}

const getDateStrFromHeader = (header) => {
    const tr = $(header);
    const headerText = tr.children('td:first').html();
    const split = headerText.split(' ');
    const day = split[2].substring(0, split[2].length-2);
    const month = split[1];
    return `${day} ${month} ${new Date().getFullYear()}`;
}

const highlightRun = (tr) => {
    tr.css(activeRunCss);
    tr.prev('tr').css(activeRunCss);
    tr.prev().prevAll('tr:not(.day-split)').css(previousRunsCss);
    setTimeout(() => {tr.prev()[0].scrollIntoView()}, 300);
}

const getRunTime = (row) => {
    const dayHeader = $(row).prevAll('tr.day-split');
    const dateStr = getDateStrFromHeader(dayHeader);
    const runStart = $(row).children('td.start-time:first').html();
    return Date.parse(`${dateStr} ${runStart}`);
}

const getTimeUnitHtml = (time, unit) => {
    return time > 0 ? `<span class="text-gdq-red">${Math.floor(time)}</span> ${unit}`:'';
}

const updateTimer = (firstRunTime) => {
    const diff = firstRunTime - new Date().getTime();
    var days = diff / (1000 * 60 * 60 * 24);
    var hours = (days - Math.floor(days)) * 24;
    var mins = (hours - Math.floor(hours)) * 60;
    var secs = (mins - Math.floor(mins)) * 60;

    setStatusHeader(`Event begins in: ${getTimeUnitHtml(days, 'days')} ${getTimeUnitHtml(hours, 'hours')} ${getTimeUnitHtml(mins, 'minutes')} ${getTimeUnitHtml(secs, 'seconds')}`);

    if(days + hours + mins + secs > 0){
        setTimeout(() => updateTimer(firstRunTime), 1000);
    }
    else{
       setStatusHeader(`<h2>${liveEventStatus}</h2>`);
    }
}

const createStatusHeader = () => {
    $('h1.text-gdq-red').after(`<h2 id="divStatus" class="extra-spacing"></h2>`);
}

const setStatusHeader = (status) => {
    $('#divStatus').html(status);
}

$(document).ready(() => {
    createStatusHeader();
    const header = getCurrentDayHeader();
    if(header){
        $(header).nextAll('tr').not('.second-row').each(function(){
            if(getRunTime(this) > now){
                highlightRun($(this).prevAll('tr.second-row:first'));
                return false;
            }
        });
        setStatusHeader(`<h2>${liveEventStatus}</h2>`);
    }
    else{
        const firstDayHeader = $('tr.day-split').toArray()[1];
        const firstRunRow = $(firstDayHeader).next('tr');
        updateTimer(getRunTime(firstRunRow));
    }
});
