"use strict";

function closure(){
    //stores the Date Object

    //start date: first day of the month we are in
    let dateObject:Date = new Date();
    dateObject = new Date(dateObject.getFullYear(), dateObject.getMonth(), 1);

    /**
     * Checks if the date object provided is valid 
     * and if the year is >= 2000 and the day is the 1st of the month
     * @param {object} dateToCheck 
     * @returns {boolean} evaluation result
     */
    function isTheDateValid(dateObj:Date):boolean{
        if(dateObj instanceof Date){
            if(isNaN(dateObj.getTime()) === false){

                if(dateObj.getFullYear() >= 2000 && dateObj.getDate() === 1){
                    return true;
                }
            }
        }
        return false;
    }

    return {
        /**
         * @returns Object of the previous month/undefined if the date is not valid
         */
        prevMonth: function():Date {
            const prevMonthDate = new Date(dateObject.getFullYear(), dateObject.getMonth() - 1, 1);
            if(isTheDateValid(prevMonthDate) === true){
                dateObject = prevMonthDate;
                return dateObject;
            }
            return dateObject;
        },
        
        /**
         * @returns Object of the next month/undefined if the date is not valid
         */
        nextMonth: function():Date  {
            const nextMonthDate = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 1);
            if(isTheDateValid(nextMonthDate) === true){
                dateObject = nextMonthDate;
                return dateObject;
            }
            return dateObject;
        },

        /**
         * @returns {Object} Date Object of the current month
         */
        currentDate: function():Date {
            return dateObject;
        },

        /**
         * Used if there is the need to manually change month/year
         * @param {object} new Date object
         * @returns {boolean} true if the date object was change, otherwise false
         */
        manuallySetDate: function(newDate:Date):boolean{
            if(isTheDateValid(newDate)){
                dateObject = newDate;
                return true;
            } else {
                return false;
            }
        }
    }
}