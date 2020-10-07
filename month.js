"use strict";

/**
 * @param {Number} Day index 
 * @returns {String} Day name
 */
function getDayName(index){
    const internalArray = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return internalArray[index];
}

/**
 * @param {String} Day name 
 * @returns {Number} Day index
 */
function getDayNumber(string){
    const internalArray = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return internalArray.indexOf(string);
}

/**
 * @param {Number} Month index 
 * @returns {String} Month name
 */
function getMonthName(index){
    const internalArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    return internalArray[index];
}

/**
 * It gives me the month to display in the table,
 * as well as the first days of the following month 
 * and the last of the previous mont
 * @param {Object} Date object
 * @returns {Array} Day number/name/class to use on the table
 */
function addPreviousAndNextMonth(dateObject){

    const prevMonth = generateMonth(
        new Date(dateObject.getFullYear(), dateObject.getMonth() - 1)
    );
    const currentMonth = generateMonth(dateObject);
    const nextMonth = generateMonth(
        new Date(dateObject.getFullYear(), dateObject.getMonth() + 1)
    );

    let fixedMonth = currentMonth;
    fixedMonth.forEach(function(item){
        item[2] = "current";
        return item;
    })

    const numberOfDaysToDisplayLastMonth = getDayNumber(currentMonth[0][1]) + 1;
    for(let a = 0; a < numberOfDaysToDisplayLastMonth; a++){
        const dayToAdd = prevMonth[prevMonth.length - 1 - a];
        fixedMonth.unshift(dayToAdd);
    }

    fixedMonth.forEach(function(item){
        if(item[2] == undefined){
            item[2] = "past";
            return item;
        }
    })

    const numberOfDaysToDisplayNextMonth = 42 - fixedMonth.length;
    for(let b = 0; b < numberOfDaysToDisplayNextMonth; b++){
        fixedMonth.push(nextMonth[b]);
    }   

    fixedMonth.forEach(function(item){
        if(item[2] == undefined){
            item[2] = "next";
            return item;
        }
    })

    return fixedMonth;
}

/**
 * @param {Number} Index of the month 
 * @param {Number} Year of the month
 * @returns {Number} Number of days 
 */
function getMonthLength(month,year){
    if(month == 8 || month == 3 || month == 5 || month == 11){
        return 30;
    } else if(month == 1 && (year % 4 == 0)){
        return 29;    
    } else if(month == 1 && (year % 4 != 0)){
        return 28;  
    } else {
        return 31;
    }
}

/**
 * @param {Object} date object 
 * @returns {Number} current week number
 */
function getWeekNum(dateObject){

    const dateObjectCopy = new Date(dateObject.valueOf());  
    /*
    * STEPS:
    * 1) calculates the days after Monday of the first week of the year
    * 2) since January 4th is always the first week of the year, changes dateObjectCopy
    * 3) calculates the number of days between dateObjectCopy and January 4th
    * 4) return the current week number
    */
    
    //step 1
    const dayPastMondayFirstYearWeek = (dateObjectCopy.getDay() + 6) % 7;

    //step 2
    dateObjectCopy.setDate(dateObjectCopy.getDate() - dayPastMondayFirstYearWeek + 3);
    const dateObjJanuary4th = new Date(dateObjectCopy.getFullYear(), 0, 4);  

    //step 3
    const dayBtwDateObject4thJanuary = (dateObjectCopy - dateObjJanuary4th) / 86400000;

    //step 4
    return 1 + Math.ceil(dayBtwDateObject4thJanuary / 7);
}


/**
 * @param {Object} date Object 
 * @returns {Array} [day number, day name]
 */
function generateMonth(dateObject){

    let array = [];
    
    array.push(function(){

        let toAdd = [];
        const nomeGiorno = getDayName(dateObject.getDay());
        const numeroGiorno = dateObject.getDate();

        let temp = dateObject.getDay();
        let temp2 = numeroGiorno;

        for(let i = numeroGiorno; i > 1; i--){
            temp--;
            temp2--;
            if(temp < 0){
                temp = 6;
            }
            toAdd.push([temp2,getDayName(temp)]);
        }

        toAdd.reverse();
        toAdd.push([numeroGiorno,nomeGiorno]);

        return toAdd;

    }());

    array.push(function(){

        const anno = dateObject.getYear();
        const month = dateObject.getMonth();
        const end = getMonthLength(month,anno);

        const numeroGiorno = dateObject.getDate();
        let temp3 = dateObject.getDay();
        let temp4 = numeroGiorno;
        let toAdd = [];

        for(let i = numeroGiorno; i < end; i++){
            if(temp3 == 6){
                temp3 = 0;
            } else {
                temp3++;
            }
            temp4++;
            toAdd.push([temp4,getDayName(temp3)]);
        }

        return toAdd;

    }());

    return array.flat();

}