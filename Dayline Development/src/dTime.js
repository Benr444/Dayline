function dTime(constructorInput)
{
	//-----------------------PRIVATE CONSTANTS AND PROPERTIES-----------------------
	var minutes = 0;
	var hours = 0;
	var trueHours = 0;
	var meridian = "";
	
	//-----------------------PUBLIC FUNCTIONS-----------------------
	//--- Sets minutes, hours, trueHours, and meridian values in one fell swoop, with special inputs. Takes Dates, strings, numbers, and other dTimes ---
	this.setTime = function(input)
	{
		switch(typeof input)
		{
			case "date":
				hours = input.getHours();                                       //Direct assignment, later modified
				minutes = input.getMinutes();                                   //Direct assignment
				trueHours = input.getHours();                                   //Date hours are 24 hour by default
				if (hours >= 12)                                                //Conversion from 24 to 12 hour clock
				{
					hours -= 12;                                                //13 becomes 1PM. 12 becomes 0PM
					meridian = "PM";                                            //
				}
				else
				{
					meridian = "AM";                                            //
				}
				if (hours == 0)                                                 //If the hours are 0, they're actually 12
				{
					hours = 12;
				}
			break;
			case "string":
				if (input.includes("AM") || input.includes("AM"))               //If the input string is for 12-hour clocks
				{
					//Explained via example. Let input = "12:00AM"
					var hoursStr = input.split(":")[0];                         //12
					var minutesStr = input.split(":")[1].slice(0, 2);           //0
					var meridianStr = input.split(":")[1].slice(2, 5);          //"AM"
					this.setHours(Number(hoursStr));                            //Uses inbuilt scrubbing to assign
					this.setMinutes(Number(minutesStr));                        //Uses inbuilt scrubbing to assign
					this.setMeridian(meridianStr);                              //Uses inbuilt scrubbing to assign
				}
				else
				{
					//Explained via example. Let input = "23:00"
					var trueHoursStr = input.split(":")[0];                     //23
					var minutesStr = input.split(":")[1].slice(0, 2);           //0
					this.setMinutes(Number(minutesStr));                        //Uses inbuilt scrubbing to assign
					this.setTrueHours(Number(trueHoursStr));                    //Uses inbuilt scrubbing to assign
					//Meridian assigned automatically
				}
			break;
			case "number":
				if (input > (24 * 60))                                          //If the input exceeds the maximum number of minutes in a day
				{
					input = (24 * 60);                                          //Cap at the maximum minutes in a day
				}
				var initialMinutes = Math.trunc(input % 60);                    //Minute value is assigned to the reminder of the hour division. Truncated to create integer
				var initialTrueHours = Math.trunc(input / 60);                  //TrueHour value is the number of 60-minute segments passed. Trucated to create integers
				var initialMeridian = (trueHours < 12) ? "AM" : "PM";           //If there are less than 12 trueHours, then it is an AM time. Reminder: 12 hours = PM, since noon is 12PM
				this.setMinutes(initialMinutes);                                //Uses inbuilt scrubbing to assign
				this.setTrueHours(initialTrueHours);                            //Uses inbuilt scrubbing to assign
				this.setMeridian(initialMeridian);                              //Uses inbuilt scrubbing to assign
			break;
			case "object":
				if (input instanceof this)
				{
					this.assign({}, input);                                     //Assigns this object to be a new copy of that one
				}
			break;
		}
	}
	
	//--- Returns a nicely formatted 12-hour time string like 12:00PM for 12-hour clocks ---
	this.getTime = function()
	{
		return hours + ":" + (minutes == 0 ? "00" : minutes) + meridian;
	}
	
	//--- Returns a nicely formatted 12-hour time string like 12:00PM for 24-hour clocks ---
	this.getTrueTime = function()
	{
		return trueHours + ":" + (minutes == 0 ? "00" : minutes);
	}
	
	//--- Sets the minute value to a number between 0-59 ---
	this.setMinutes = function(minuteNumber)
	{
		if (minuteNumber > 59) {minuteNumber = 59;} //Maximum constraint
		if (minuteNumber < 0) {minuteNumber = 0;}   //Minimum constraint
		minutes = minuteNumber;
	}
	
	//--- Returns the minute value (number) ---
	this.getMinutes = function()
	{
		return minutes;
	}
	
	//--- Sets the 12-hour clock hour value to a number (between 1-12) irrespective of meridian ---
	this.setHours = function(hourNumber)
	{
		if (hourNumber > 12) {hourNumber = 12;}   //Maximum constraint
		if (hourNumber <= 0) {hourNumber = 12;}   //Minimum constraint
		hours = hourNumber;                       //Assignment
		//Update trueHours to reflect hours
		if (meridian == "AM")                     //
		{
			trueHours = hourNumber;               //In AM, trueHours and hours match
			if (trueHours == 12) {trueHours = 0}; //Except for midnight, which is 12:00AM or 00:00 true
		}
		else
		{
			if (hourNumber == 12)                 //In the PM, trueHours are 12 hours after
			{
				trueHours = 12;                   //Except for noon, which is 12:00PM and 12:00
			}
			else
			{
				trueHours = hourNumber + 12;      //e.g. 1:00PM -> 13:00
			}   
		}
	}
	
	//--- Returns the 12-hour clock hours as a number ---
	this.getHours = function()
	{
		return hours;
	}
	
	//--- Sets the 24-hour clock value to a number between 0 and 23 ---
	this.setTrueHours = function(trueHourNumber)
	{
		if (trueHourNumber > 23) {trueHourNumber = 23;}  //Maximum constraint
		if (trueHourNumber <= 0) {trueHourNumber = 0;}   //Minimum constraint
		trueHours = trueHourNumber;                      //Assignment
		//Update hours to reflect trueHours
		if (trueHourNumber >= 12)
		{
			meridian = "PM";                             //After noon = PM
			hours = trueHourNumber - 12;                 //Normal hours are 12 behind
		}
		else
		{
			meridian = "AM";                             //In the morning
			hours = trueHourNumber;                      //trueHours and hours match
		}
		if (hours == 0) {hours = 12};                    //No such thing as 0 o' clock!
	}
	
	//--- Returns the 24-hour clock hours as a number ---
	this.getTrueHours = function()
	{
		return trueHours;
	}
	
	//--- Sets the meridian to either "AM" or "PM" irrespective of all other values ---
	this.setMeridian = function(meridianString)
	{
		meridianString.toUpperCase();  //Must be uppercase
		if (meridianString === "PM" || meridianString === "AM")
		{
			meridian = meridianString;
		}
		else
		{
			throw "dTime.setMeridian: Meridians must be set to either \"PM\" or \"AM\"!: " + console.trace();
		}
	}
	
	//--- Returns either "AM" or "PM". This is not relevant for 24-hour clock values, but will be "AM" by default ---
	this.getMeridian = function()
	{
		return meridian;
	}
	
	//-----------------------CONSTRUCTOR CODE-----------------------
	this.setTime(constructorInput);
}