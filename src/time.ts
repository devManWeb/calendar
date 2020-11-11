"use strict";

/**
 * @param {number} index number from getDay() 
 * @returns {number} 0=Monday, ..., 6=Sunday
 */
function mondayStart(index:number):number{
    const order = [6,0,1,2,3,4,5];
    return order[index];
}

/**
 * @param {number} Day index 
 * @returns {string} Day name
 */
function getDayName(index:number):string{
    
    const internalArray:string[] = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    
    //necessary because it is considered Monday = 0
    let fixedIndex = index + 1;
    if(fixedIndex > 6){
        fixedIndex = 0;
    }
    return internalArray[mondayStart(fixedIndex)];
}

/**
 * @param {string} Day name 
 * @returns {number} Day index
 */
function getDayNumber(input:string):number{
    const internalArray:string[] = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    const indexFound = internalArray.indexOf(input);
    return mondayStart(indexFound);
}

/**
 * @param {number} Month index 
 * @returns {string} Month name
 */
function getMonthName(index:number):string{
    const internalArray:string[] = [
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
 * @param {number} Index of the month 
 * @param {number} Year of the month
 * @returns {number} Number of days 
 */
function getMonthLength(month:number,year:number):number{
    if(month === 3 || month === 5 || month === 8 || month === 10){
        return 30;
    } else if(month === 1 && (year % 4 === 0)){
        return 29;    
    } else if(month === 1 && (year % 4 !== 0)){
        return 28;  
    } else {
        return 31;
    }
}

/**
 * For a given date, get the week number
 * NOTE: The first week of the year is where January 4th falls
 * @param {Object} date object provided
 * @returns {number} current week number
 */
function getWeekNumStart4Jan(dateObject:Date):number{

    //date clone (to avoid edits to dateObject)
    const dateObjectCopy:Date = new Date(dateObject.getTime());
    dateObjectCopy.setHours(0, 0, 0, 0);

    //The first week of the year is where January 4th falls
    dateObjectCopy.setDate(dateObjectCopy.getDate() + 3 - (dateObjectCopy.getDay() + 6) % 7);
    const dateObjectJan4th:Date = new Date(dateObjectCopy.getFullYear(), 0, 4);
    const deltaDateObjects:number = dateObjectCopy.getTime() - dateObjectJan4th.getTime();
    const fixFirstWeek:number = (dateObjectJan4th.getDay() + 6) % 7;

    //Adjusts to Thursday of the 1st weeks and gets number of weeks from there
    const numWeeksZeroStart = Math.round((deltaDateObjects / 86400000 - 3 + fixFirstWeek) / 7);
    return numWeeksZeroStart + 1;

}

interface ArrayMonth{
    //used in addPreviousAndNextMonth(),updateThirdItem() and generateMonth()
    0:          number,
    1:          string,
    2:          string,
    3:          number
}

/**
 * Add days to the given date
 * @param {Object} dateObject 
 * @param {number} daysToAdd, if > 0 it sums, if < 0 it subtracts
 * @returns {Object} date object in the future (relatively to dateObject)
 */
function addDaysToDate(dateObject:Date,daysToAdd:number):Date{
    return new Date(
        dateObject.getTime() + (daysToAdd * 86400000)
    );
}

/**
 * if the third entry in one of the sub-array is empty, inserts toAdd
 * @param {Array} array of arrays (day number/day name and which month)
 * @param {string} toAdd string to add if the 3rd item is an empty string
 * @returns {Array} array of arrays (see comments in generateMonth())
 */
function updateThirdItem(array:ArrayMonth[],toAdd:string):ArrayMonth[]{
    return array.map(function(item:ArrayMonth){
            return [
                item[0],
                item[1],
                item[2] === "" ? toAdd : item[2],
                item[3]
            ];
        }
    );
}

/**
 * Data of the days to display (some of the previous month,
 * all of dateObject's month and some of the next month)
 * @param {Object} Date object
 * @returns {Array} array of arrays (see comments in generateMonth())
 */
function addPreviousAndNextMonth(dateObject:Date):ArrayMonth[]{

    const prevMonth:ArrayMonth[] = generateMonth(
        new Date(dateObject.getFullYear(), dateObject.getMonth() - 1)
    );
    const currentMonth:ArrayMonth[] = generateMonth(dateObject);
    const nextMonth:ArrayMonth[] = generateMonth(
        new Date(dateObject.getFullYear(), dateObject.getMonth() + 1)
    );

    let fixedMonth:ArrayMonth[] = currentMonth;
    fixedMonth = updateThirdItem(fixedMonth,"current");

    //fixed: before we could have wrong results here
    const numberOfDaysToDisplayLastMonth:number = getDayNumber(currentMonth[0][1].toString());
    for(let a = 0; a < numberOfDaysToDisplayLastMonth; a++){
        const dayToAdd = prevMonth[prevMonth.length - 1 - a];
        fixedMonth.unshift(dayToAdd);
    }

    fixedMonth = updateThirdItem(fixedMonth,"past");

    const numberOfDaysToDisplayNextMonth:number = 42 - fixedMonth.length;
    for(let b = 0; b < numberOfDaysToDisplayNextMonth; b++){
        fixedMonth.push(nextMonth[b]);
    }   

    fixedMonth = updateThirdItem(fixedMonth,"next");
    return fixedMonth;
}

/**
 * Data to display for dateObject's month
 * @param {Object} date Object (must be the 1st day of the month)
 * @returns {Array} array of arrays (see comments in generateMonth())
 */
function generateMonth(dateObject:Date):ArrayMonth[]{

    const dayInTheWeek:number = dateObject.getDay();
    const dayNumber:number = dateObject.getDate();
    let array = [] as ArrayMonth[];

    // --- 1st day of the month --- //
    const dayName:string = getDayName(dayInTheWeek);
    array.push([
        dayNumber,                          //day number
        dayName,                            //day name (monday,ecc...)
        "",                                 //empty string for the month type (past/ecc...)
        getWeekNumStart4Jan(dateObject)     //number of the week this day is in
    ]);

    // --- from 2nd day to the last day of the month --- //

    const year:number = dateObject.getFullYear();
    const month:number = dateObject.getMonth();
    const end:number = getMonthLength(month,year);

    {
        let temp:number = dayInTheWeek
        let temp2:number = dayNumber;

        for(let i = dayNumber; i < end; i++){
            if(temp === 6){
                temp = 0;
            } else {
                temp++;
            }
            temp2++;
            const dateObjOfThisDay:Date = addDaysToDate(dateObject,temp2); 
            array.push([
                temp2,
                getDayName(temp),
                "",
                getWeekNumStart4Jan(dateObjOfThisDay)
            ]);
        }
    }

    return array;
}