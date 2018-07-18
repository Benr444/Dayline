function Dayline(allowConflictsInput)
{
	//-----------------------PRIVATE CONSTANTS AND PROPERTIES-----------------------
	var identifier = 0;              //
	var allowConflicts = true;       //
	var selectorTime = 0;            //Minutes-since-midnight value for the selector's position
	const spacing = 150;             //Spacing between minute segments
	const minuteSegment = 15;        //# of minutes between minute divisions
	var dFrames = [];                //Array of all frames inside this Dayline
	var display = null;              //
	var timelineDisplay = null;      //
	var selectorDisplay = null;      //
	var timelabelDisplays = [];      //All timelabels in the Dayline
	var timebarDisplays = [];        //All timebars in the Dayline
	var eventListeners = {};          //Contains all arrays which contain all event listening functions. See bottom constructor code or docs for possible hooks

	//-----------------------PRIVATE FUNCTIONS-----------------------
	//--- Private function that ups the identifier number for any possible Dayline ---
	this.__proto__.increaseInstance = (function()
	{
		var instanceCount = -1; //Begins at -1 so that the first instance is 0.
		return function() {instanceCount += 1; return instanceCount;}
	})();
	
	this.dTime = function(constructorInput)
	{
		//-----------------------PRIVATE CONSTANTS AND PROPERTIES-----------------------
		var minutes = 0;                    //Minute value
		var hours = 0;                      //12-hour clock hour-value
		var trueHours = 0;                  //24-hour clock hour-value
		var meridian = "";                  //AM or PM
		var loopStop = false;               //Used to prevent infinite loop calls when uodating values
		
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
					if (input.includes("AM") || input.includes("PM"))               //If the input string is for 12-hour clocks
					{
						//Explained via example. Let input = "12:00AM"
						var hoursStr = input.split(":")[0];                         //12
						var minutesStr = input.split(":")[1].slice(0, 2);           //0
						var meridianStr = input.split(":")[1].slice(2, 5);          //"AM"
						this.setMinutes(Number(minutesStr));                        //Uses inbuilt scrubbing to assign
						this.setMeridian(meridianStr);                              //Uses inbuilt scrubbing to assign
						this.setHours(Number(hoursStr));                            //Uses inbuilt scrubbing to assign. Must be called after setMeridian
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
					this.setTotalMinutes(Number(input))
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
			if (minuteNumber > 59) {minuteNumber = 59;}            //Maximum constraint
			if (minuteNumber < 0) {minuteNumber = 0;}              //Minimum constraint
			minutes = minuteNumber;
		}
		
		//--- Returns the minute value (number) ---
		this.getMinutes = function()
		{
			return minutes;
		}
		
		//--- Sets the total minutes since midnight value to a number between 1440 ---
		this.setTotalMinutes = function(totalMinuteNumber)
		{
			if (totalMinuteNumber > (24 * 60))                              //If the input exceeds the maximum number of minutes in a day
			{
				totalMinuteNumber = (24 * 60);                              //Cap at the maximum minutes in a day
			}
			else if (totalMinuteNumber < 0)                                 //Minimal cap
			{
				totalMinuteNumber = 0;                                      //
			}
			var initialMinutes = Math.trunc(totalMinuteNumber % 60);        //Minute value is assigned to the reminder of the hour division. Truncated to create integer
			var initialTrueHours = Math.trunc(totalMinuteNumber / 60);      //TrueHour value is the number of 60-minute segments passed. Trucated to create integers
			this.setTrueHours(initialTrueHours);                            //Uses inbuilt scrubbing to assign
			this.setMinutes(initialMinutes);
			var initialMeridian = (trueHours < 12) ? "AM" : "PM";           //If there are less than 12 trueHours, then it is an AM time. Reminder: 12 hours = PM, since noon is 12PM
			this.setMeridian(initialMeridian);                              //Uses inbuilt scrubbing to assign
		}
		
		//--- Returns the total minutes since midnight value (number) ---
		this.getTotalMinutes = function()
		{
			return ((this.getTrueHours() * 60) + this.getMinutes());
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
				console.log("meridian is pm");
				if (hourNumber == 12)                 //In the PM, trueHours are 12 hours after
				{
					trueHours = 12;                   //Except for noon, which is 12:00PM and 12:00
				}
				else
				{
					trueHours = hourNumber + 12;      //e.g. 1:00PM -> 13:00
				}   
			}
			totalMinutes = (trueHours * 60) + minutes;
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
			if (hours == 0) {hours = 12;}                    //No such thing as 0 o' clock!
			totalMinutes = (trueHours * 60) + minutes;       //
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
	
	//-----------------------PUBLIC FUNCTIONS-----------------------
	//--- Forces html to reflect internal values ---
	var updateDisplay = function()
	{
		//== display update ==
		display.style.height = "100%";
		display.style.width = "100%";
		display.style.display = "flex";           //Centering
		display.style.flexFlow = "column nowrap"; //Centering
		display.style.alignItems = "center";      //Centering
		display.style.justifyContent = "center";  //Centering
		//== timeline update ==
		timelineDisplay.style.height = "90%";
		timelineDisplay.style.width = "90%";
		timelineDisplay.style.overflow = "auto";
		timelineDisplay.style.position = "relative";
		//== selector update ==
		selectorDisplay.style.position = "absolute";
		selectorDisplay.style.left = ((selectorTime / minuteSegment) * spacing) + "px";
		selectorDisplay.style.height = "90%";
		selectorDisplay.style.width = "0";
		selectorDisplay.style.top = "10%";
		//== timelabel update ==
		for (var g = 0; g < timelabelDisplays.length; g++)
		{
			timelabelDisplays[g].style.display = "flex";           //Centering
			timelabelDisplays[g].style.flexFlow = "column nowrap"; //Centering
			timelabelDisplays[g].style.alignItems = "center";      //Centering
			timelabelDisplays[g].style.justifyContent = "center";  //Centering
			timelabelDisplays[g].style.position = "absolute";      //Necessary for proper positioning
			timelabelDisplays[g].style.left = (g * spacing) + "px"
			timelabelDisplays[g].style.height = "10%";
			timelabelDisplays[g].style.width = spacing + "px";
		}
		//== timebar update ==
		for (var h = 0; h < timebarDisplays.length; h++)
		{
			timebarDisplays[h].style.position = "absolute";         //Necessary for proper positioning
			var tempTime = new this.dTime(h * minuteSegment);            //The temporary dTime element allows converting minutes to actual time past midnight
			timebarDisplays[h].innerText = tempTime.getTime();      //
			timebarDisplays[h].style.left = (h * spacing) + "px"    //
			timebarDisplays[h].style.height = "100%";
			timebarDisplays[h].style.width = 0;
		}
		//== dFrames updates ==
		for (var k = 0; k < dFrames.length; k++)
		{
			//console.log(JSON.stringify(dFrames[k]));
			var dFrameDisplay = dFrames[k].getDisplay();          //Temporary variable to specify additional HTML parameters
			dFrameDisplay.style.top = "10%";                      //Calculate proper displacement from the top of the timeline
			timelineDisplay.appendChild(dFrameDisplay);           //dFrames are completely redrawn each update
		}
	}
	
	//---  ---
	this.getDisplay = function()
	{
		if (display == null)
		{
			//== display config == 
			display = document.createElement("div");
			display.id = "dayline-n" + identifier;
			display.classList.add("dayline");
			//== timelineDisplay config ==
			timelineDisplay = document.createElement("div");
			timelineDisplay.id = display.id + "-timeline"
			timelineDisplay.classList.add("dayline-timeline");
			timelineDisplay.Dayline = this;                               //Add the Dayline to the timeline so that the onclick function can access Dayline functions
			timelineDisplay.addEventListener("click", function(e)         
			{
				if (e.target == this)                                     //Only execute if the timeline was clicked on but NOT a dFrame
				{
					
				}
			});
			display.appendChild(timelineDisplay);
			//== selectorDisplay config ==
			selectorDisplay = document.createElement("div");
			selectorDisplay.id = display.id + "-selector";
			selectorDisplay.classList.add("dayline-selector");
			timelineDisplay.appendChild(selectorDisplay);
			for (var j = 0; j < Math.trunc(1440 / minuteSegment); j++)     //One timebar/timelabel for each segment (1440 = total daily minutes. 1440 / minuteSegement = number of segments in a day)
			{
				//== timelabel configs ==
				var tempTimelabelDisplay = document.createElement("div");
				tempTimelabelDisplay.id = display.id + "-timelabel-n" + j;
				tempTimelabelDisplay.classList.add("dayline-timelabel");
				timelineDisplay.appendChild(tempTimelabelDisplay);
				timelabelDisplays.push(tempTimelabelDisplay);
				//== timebar configs ==
				var tempTimebarDisplay = document.createElement("div");
				tempTimebarDisplay.id = display.id + "-timebar-n" + j;
				tempTimebarDisplay.classList.add("dayline-timebar");
				timelineDisplay.appendChild(tempTimebarDisplay);
				timebarDisplays.push(tempTimebarDisplay);
			}
			//== dFrames configs ==
			//None. dFrames are redrawn completely on each update. See updateDisplay()
		}
		else
		{
			
		}
		updateDisplay();
		return display;
	}
	
	//---  ---
	this.addFrame = function(startInput, endInput, constructorTitle, constructorDescription)
	{
		var nDFrame = new dFrame(startInput, endInput, constructorTitle, constructorDescription);
		dFrames.push(nDFrame);
		updateDisplay();
	}
	
	//--- Sets the selector position, in minutes past midnight ---
	this.setSelectorTime = function(input)
	{
		var tempSelectorTimeObj = new this.dTime(input);
		selectorTime = tempSelectorTimeObj.getTotalMinutes();
		updateDisplay();
	}
	
	//--- Returns the selector position, in a dTime object ---
	this.getSelectorTime = function()
	{
		return new this.dTime(selectorTime);
	}
	
	//--- Add a function to execute when the eventTypeStr event happens. Will throw an error if an invalid event is specified ---
	this.addEventListener = function(eventTypeStr, functionInput)
	{
		eventListeners[eventTypeStr].push(functionInput); //All javascript objects are also associative arrays
	}
	
	//--- Execute the specified event ---
	var triggerEvent = function(eventTypeStr, eventData)
	{
		for (var u = 0; u < eventListeners[eventTypeStr].length; u++) //For each stored function of the type
		{
			eventListeners[eventTypeStr][u](eventData);               //Execute it with the passed data
		}
	}
	
	//-----------------------CONSTRUCTOR CODE-----------------------
	identifier = this.increaseInstance();
	allowConflicts = allowConflictsInput;
	//Below: initializing the arrays that contain all the listening functions
	eventListeners.addFrame = [];
	eventListeners.removeFrame = [];
	eventListeners.hideFrame = [];
	eventListeners.showFrame = [];
	eventListeners.inspectFrame = [];
	eventListeners.frameChange = [];
	eventListeners.frameConflict = [];
	eventListeners.selectorChange = [];
	eventListeners.timelineClick = [];
}