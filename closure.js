"use strict";

function closure(){
    //stores the Date Object
    let dateObject = new Date();
    return {
        /**
         * @returns {Object} Date Object of the previous month than the current one
         */
        prevMonth: function(){
            dateObject = new Date(dateObject.getFullYear(), dateObject.getMonth() - 1, 1);
            return dateObject;
        },
        /**
         * @returns {Object} Date Object of the next month than the current one
         */
        nextMonth: function(){
            dateObject = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 1);
            return dateObject;
        },
        /**
         * @returns {Object} Date Object of the current month
         */
        currentDate: function(){
            return dateObject;
        }
    }

}