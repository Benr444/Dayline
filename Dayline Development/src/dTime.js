function dTime(constructorInput)
{
	//-----------------------PRIVATE CONSTANTS AND PROPERTIES-----------------------
	var minutes = 0;
	var hours = 0;
	var trueHours = 0;
	var meridian = "";
	
	//-----------------------PUBLIC FUNCTIONS-----------------------
	//---  ---
	this.setTime = function(input)
	{
		switch(typeof input)
		{
			case "date":
				hours = start.getHours();                                       //Direct assignment, later modified
				minutes = start.getMinutes();                                   //Direct assignment
				trueHours = obj.hours;                                          //Date hours are 24 hour by default
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
				//Explained via example. Let start = "12:00AM", and end = "11:35PM"
				hours = Number(input.split(":")[0]);                            //12
				minutes = Number(input.split(":")[1].slice(0, 2));              //0
				meridian = input.split(":")[1].slice(2, 5);                     //"AM"
				trueHours = hours + ((meridian === "PM") ? (12) : (0));         //If the base hours are in the PM, the true hours are in the 12+ hour zone
				if (hours == 12 && meridian === "AM") {trueHours = 0;}          //Special case for 12:XXAM
				if (hours > 12) {hours = 12;}                                   //Hour capping
				if (minutes > 59) {minutes = 59;}                               //Minute capping
				if (hours < 0) {hours = 0;}                                     //Hour minimizing
				if (minutes < 0) {minutes = 0;}                                 //Minute minimizing
			break;
			case "number":
				if (input > (24 * 60))                                          //If the input exceeds the maximum number of minutes in a day
				{
					input = (24 * 60);                                          //Cap at the maximum minutes in a day
				}
				minutes = Math.trunc(input % 60);                               //Minute value is assigned to the reminder of the hour division. Truncated to create integer
				trueHours = Math.trunc(input / 60);                             //TrueHour value is the number of 60-minute segments passed. Trucated to create integers
				meridian = (trueHours < 12) ? "AM" : "PM";                      //If there are less than 12 trueHours, then it is an AM time. Reminder: 12 hours = PM, since noon is 12PM
				hours = (trueHours < 12) ? trueHours : trueHours - 12;          //Subtract 12 hours if at 13 -> 24
				hours = (hours == 0) ? 12 : obj.hours;                          //0AM/PM => 12AM/PM
			break;
			case "object":
				if (input instanceof this)
				{
					this.assign({}, input);
				}
			break;
		}
		
	}
	
	//---  ---
	this.getTime = function()
	{
		return hours + ":" + (minutes == 0 ? "00" : minutes) + meridian;
	}
	
	//---  ---
	this.setMinutes = function(minuteNumber)
	{
		if (minuteNumber > 59) {minuteNumber = 59;}
		minutes = minuteNumber;
	}
	
	//---  ---
	this.getMinutes = function()
	{
		return minutes;
	}
	
	//---  ---
	this.setHours = function(hourNumber)
	{
		if (hourNumber > 12) {hourNumber = 12;} //Maximum constraint
		if (hourNumber <= 0) {hourNumber = 12;} //Minimum constraint
		hours = hourNumber;                     //Assignment
		//Update trueHours to reflect hours
		if (meridian == "AM")                   //
		{
			trueHours = hourNumber;             //In AM, trueHours and hours match
		}
		else
		{
			trueHours = hourNumber + 12;        //In the PM, trueHours are 12 hours after
		}
	}
	
	//---  ---
	this.getHours = function()
	{
		return hours;
	}
	
	//---  ---
	this.setTrueHours = function(trueHourNumber)
	{
		if (trueHourNumber > 24) {trueHourNumber = 24;}  //Maximum constraint
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
	
	//---  ---
	this.getTrueHours = function()
	{
		return trueHours;
	}
	
	//---  ---
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
	
	//---  ---
	this.getMeridian = function()
	{
		return meridian;
	}
	
	//-----------------------CONSTRUCTOR CODE-----------------------
	this.setTime(constructorInput);
}