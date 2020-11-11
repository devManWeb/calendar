"use strict";

const memory = closure();

/**
 * Removes an item from the DOM
 * @param {string} tagName 
 */
function DOMRemover(tagName:string):void{
    const toRemove = document.getElementsByTagName(tagName) as HTMLCollection;
    if(toRemove.length != 0){
        for(var i = 0; i < toRemove.length; i++){
            const parent = toRemove[i].parentNode as HTMLDivElement;
            //this also removes the associated listeners
            parent.removeChild(toRemove[i]);
        }
    }
}

/**
 * Adds a new h1 element with the given title
 * @param {string} title 
 */
function newDOMTitle(title:string):void{
    DOMRemover("h1");
    const titleDOM = document.createElement("h1") as HTMLHeadingElement;
    const titleTxt = document.createTextNode(title) as Text;
    titleDOM.appendChild(titleTxt);
    const calendarDiv = document.getElementById("calendar-div") as HTMLDivElement;
    calendarDiv.appendChild(titleDOM);
}

/**
 * Creates the table with all its elements in the dom
 * @param {Object} dateObject 
 */
function newDOMCalendar(dateObject:Date):void{
    const fixedCalendar:ArrayMonth[] = addPreviousAndNextMonth(dateObject);     
    const monthName:string = getMonthName(dateObject.getMonth());
    const year:number = dateObject.getFullYear();
    newDOMTitle("Month of " + monthName + " " + year);

    const table = document.createElement("table") as HTMLTableElement;
    const header = table.createTHead() as HTMLTableSectionElement;
    for(let i=0; i<7; i++){
        let th = document.createElement('th') as HTMLTableHeaderCellElement;
        const dayText:string = fixedCalendar[i][1];
        const dayName = document.createTextNode(dayText) as Text;
        th.appendChild(dayName);
        header.appendChild(th);
    }

    fixedCalendar.forEach(function(value,index){
        if(index % 7 === 0){
            table.insertRow();
        }
        const rowNumber:number = Math.floor(index / 7);
        const newCell = table.rows[rowNumber].insertCell() as HTMLTableDataCellElement;
        let fullText = document.createTextNode(value[0].toString()) as Text;
        newCell.classList.add(value[2]);
        newCell.appendChild(fullText);
    });

    let th = document.createElement('th') as HTMLTableHeaderCellElement;
    let dayName = document.createTextNode("Week n.") as Text;
    th.appendChild(dayName);
    header.appendChild(th);
    fixedCalendar.forEach(function(element,index){
        if(index % 7 === 0){
            const rowNumber:number = index/7;
            const newCell = table.rows[rowNumber].insertCell() as HTMLTableDataCellElement;
            const weekNum:string = element[3].toString();
            const fullText = document.createTextNode(weekNum) as Text;
            newCell.appendChild(fullText);
        }
    });

    const calendarDiv = document.getElementById("calendar-div") as HTMLDivElement;
    calendarDiv.appendChild(table);
}

/**
 * Adds into the page an input to manually select the desired year/month
 * this function also adds an event listener for the input, since it is deleted
 * with DOMRemover("input")
 * @param {Object} dateObject 
 */
function newDOMinputMonthYear(dateObject:Date):void{
    
    const inputDiv = document.getElementById("input-div") as HTMLDivElement;
    const input = document.createElement('input') as HTMLInputElement;
    const year:string = dateObject.getFullYear().toString();
    const month:string = (dateObject.getMonth() + 1).toString();        //+1 because January = 0
    const monthFixed = (month.length === 1) ? ("0" + month) : (month);  //extra 0 if needed
    input.type = "month";
    input.min = "2000-01";
    input.value = year + "-" + monthFixed; 
    inputDiv.appendChild(input);

    document.getElementsByTagName("input")[0].addEventListener("input", function(){
        //checks if the provided input is a string like YYYY-MM or YYYY-M
        if(typeof(this.value) === "string"){
            const pattern:RegExp = /[0-9]{4}-[0-9]{1,2}/g;
            if(pattern.test(this.value) === true){

                const insertedYear:string = this.value.substr(0,4);
                let insertedMonth:string = this.value.substr(5);
                if(insertedMonth.length === 1){
                    //extra zero if needed
                    insertedMonth = "0" + insertedMonth;
                }

                //first day of the month
                const datestamp:string = insertedYear + "-" + insertedMonth + "-01";
                const selectedDate:Date = new Date(datestamp);
                const status:boolean = memory.manuallySetDate(selectedDate);
                if(status === true){
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

document.getElementsByTagName("button")[0].addEventListener("click", function(){
    const prevMonth:Date = memory.prevMonth();
    DOMRemover("table");
    newDOMCalendar(prevMonth);
    DOMRemover("input");
    newDOMinputMonthYear(prevMonth);
}); 

document.getElementsByTagName("button")[1].addEventListener("click", function(){
    const nextMonth:Date = memory.nextMonth();
    DOMRemover("table");
    newDOMCalendar(nextMonth);
    DOMRemover("input");
    newDOMinputMonthYear(nextMonth);
}); 