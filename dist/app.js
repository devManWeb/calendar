"use strict";
var memory = closure();
/**
 * Removes an item from the DOM
 * @param {string} tagName
 */
function DOMRemover(tagName) {
    var toRemove = document.getElementsByTagName(tagName);
    if (toRemove.length != 0) {
        for (var i = 0; i < toRemove.length; i++) {
            var parent_1 = toRemove[i].parentNode;
            //this also removes the associated listeners
            parent_1.removeChild(toRemove[i]);
        }
    }
}
/**
 * Adds a new h1 element with the given title
 * @param {string} title
 */
function newDOMTitle(title) {
    DOMRemover("h1");
    var titleDOM = document.createElement("h1");
    var titleTxt = document.createTextNode(title);
    titleDOM.appendChild(titleTxt);
    var calendarDiv = document.getElementById("calendar-div");
    calendarDiv.appendChild(titleDOM);
}
/**
 * Creates the table with all its elements in the dom
 * @param {Object} dateObject
 */
function newDOMCalendar(dateObject) {
    var fixedCalendar = addPreviousAndNextMonth(dateObject);
    var monthName = getMonthName(dateObject.getMonth());
    var year = dateObject.getFullYear();
    newDOMTitle("Month of " + monthName + " " + year);
    var table = document.createElement("table");
    var header = table.createTHead();
    for (var i = 0; i < 7; i++) {
        var th_1 = document.createElement('th');
        var dayText = fixedCalendar[i][1];
        var dayName_1 = document.createTextNode(dayText);
        th_1.appendChild(dayName_1);
        header.appendChild(th_1);
    }
    fixedCalendar.forEach(function (value, index) {
        if (index % 7 === 0) {
            table.insertRow();
        }
        var rowNumber = Math.floor(index / 7);
        var newCell = table.rows[rowNumber].insertCell();
        var fullText = document.createTextNode(value[0].toString());
        newCell.classList.add(value[2]);
        newCell.appendChild(fullText);
    });
    var th = document.createElement('th');
    var dayName = document.createTextNode("Week n.");
    th.appendChild(dayName);
    header.appendChild(th);
    fixedCalendar.forEach(function (element, index) {
        if (index % 7 === 0) {
            var rowNumber = index / 7;
            var newCell = table.rows[rowNumber].insertCell();
            var weekNum = element[3].toString();
            var fullText = document.createTextNode(weekNum);
            newCell.appendChild(fullText);
        }
    });
    var calendarDiv = document.getElementById("calendar-div");
    calendarDiv.appendChild(table);
}
/**
 * Adds into the page an input to manually select the desired year/month
 * this function also adds an event listener for the input, since it is deleted
 * with DOMRemover("input")
 * @param {Object} dateObject
 */
function newDOMinputMonthYear(dateObject) {
    var inputDiv = document.getElementById("input-div");
    var input = document.createElement('input');
    var year = dateObject.getFullYear().toString();
    var month = (dateObject.getMonth() + 1).toString(); //+1 because January = 0
    var monthFixed = (month.length === 1) ? ("0" + month) : (month); //extra 0 if needed
    input.type = "month";
    input.min = "2000-01";
    input.value = year + "-" + monthFixed;
    inputDiv.appendChild(input);
    document.getElementsByTagName("input")[0].addEventListener("input", function () {
        //checks if the provided input is a string like YYYY-MM or YYYY-M
        if (typeof (this.value) === "string") {
            var pattern = /[0-9]{4}-[0-9]{1,2}/g;
            if (pattern.test(this.value) === true) {
                var insertedYear = this.value.substr(0, 4);
                var insertedMonth = this.value.substr(5);
                if (insertedMonth.length === 1) {
                    //extra zero if needed
                    insertedMonth = "0" + insertedMonth;
                }
                //first day of the month
                var datestamp = insertedYear + "-" + insertedMonth + "-01";
                var selectedDate = new Date(datestamp);
                var status_1 = memory.manuallySetDate(selectedDate);
                if (status_1 === true) {
                    DOMRemover("table");
                    newDOMCalendar(selectedDate);
                }
            }
        }
    });
}
newDOMCalendar(memory.currentDate());
newDOMinputMonthYear(memory.currentDate());
// ------- button listeners -------
document.getElementsByTagName("button")[0].addEventListener("click", function () {
    var prevMonth = memory.prevMonth();
    DOMRemover("table");
    newDOMCalendar(prevMonth);
    DOMRemover("input");
    newDOMinputMonthYear(prevMonth);
});
document.getElementsByTagName("button")[1].addEventListener("click", function () {
    var nextMonth = memory.nextMonth();
    DOMRemover("table");
    newDOMCalendar(nextMonth);
    DOMRemover("input");
    newDOMinputMonthYear(nextMonth);
});
