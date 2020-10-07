"use strict";

/**
 * @param {String} tagName 
 */
function DOMRemover(tagName){
    const toRemove = document.getElementsByTagName(tagName);
    if(toRemove.length != 0){
        for(var i = 0; i < toRemove.length; i++){
            toRemove[i].remove();
        }
    }
}

/**
 * @param {String} title 
 */
function newDOMTitle(title){
    DOMRemover("h1");
    const titleDOM = document.createElement("h1");
    const titleTxt = document.createTextNode(title);
    titleDOM.appendChild(titleTxt);
    document.getElementById("calendar-div").appendChild(titleDOM);
}

/**
 * @param {Object} dateObject 
 */
function newDOMCalendar(dateObject){
    
    DOMRemover("table");
    const fixedCalendar = addPreviousAndNextMonth(dateObject);
     
    const monthName = getMonthName(dateObject.getMonth());
    const year = dateObject.getFullYear();
    newDOMTitle("Month of " + monthName + " " + year);

    const table = document.createElement("table");
    const header = table.createTHead();
    for(let i=0; i<7; i++){
        let th = document.createElement('th');
        let dayName = document.createTextNode(getDayName(i));
        th.appendChild(dayName);
        header.appendChild(th);
    }

    fixedCalendar.forEach(function(value,index){
        if(index % 7 == 0){
            table.insertRow();
        }
        const rowNumber = Math.floor(index / 7);
        const newCell = table.rows[rowNumber].insertCell();
        let fullText = document.createTextNode(value[0]);
        newCell.classList.add(value[2]);
        newCell.appendChild(fullText);
    });

    document.getElementById("calendar-div").appendChild(table);

    let th = document.createElement('th');
    let dayName = document.createTextNode("Week n.");
    th.appendChild(dayName);
    header.appendChild(th);

    
    const numRows = fixedCalendar.length / 7;
    const firstWeekNum = getWeekNum(dateObject);

    for(let l=0; l < numRows; l++){
        const newCell = table.rows[l].insertCell();
        let fullText = document.createTextNode(firstWeekNum + l);
        newCell.appendChild(fullText);
    }
    
}

const memory = new closure();
newDOMCalendar(memory.currentDate(),0);

document.getElementsByTagName("button")[0].addEventListener("click", function(){
    newDOMCalendar(memory.prevMonth());
}); 

document.getElementsByTagName("button")[1].addEventListener("click", function(){
    newDOMCalendar(memory.nextMonth());
}); 

