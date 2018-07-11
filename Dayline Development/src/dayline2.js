function Dayline(allowConflictsInput)
{
	//-----------------------PRIVATE CONSTANTS AND PROPERTIES-----------------------
	var identifier = 0;              //
	var allowConflicts = true;       //
	var dFrames = [];                //Array of all frames inside this Dayline
	var selectorTime = 0;            //Minutes-since-midnight value for the selector's position
	var display = null;              //
	var timelineDisplay = null;      //
	var selectorDisplay = null;      //
	var timelabelDisplays = [];      //All timelabels in the Dayline
	var timebarDisplays = [];        //All timebars in the Dayline
	const spacing = 150;             //Spacing between minute segments
	const minuteSegment = 15;        //# of minutes between minute divisions

	//-----------------------PRIVATE FUNCTIONS-----------------------
	//--- Private function that ups the identifier number for any possible Dayline ---
	this.__proto__.increaseInstance = (function()
	{
		var instanceCount = -1; //Begins at -1 so that the first instance is 0.
		return function() {instanceCount += 1; return instanceCount;}
	})();
	
	//-----------------------PUBLIC FUNCTIONS-----------------------
	//---  ---
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
			var tempTime = new dTime(h * minuteSegment);            //The temporary dTime element allows converting minutes to actual time past midnight
			timebarDisplays[h].innerText = tempTime.getTime();      //
			timebarDisplays[h].style.left = (h * spacing) + "px"    //
			timebarDisplays[h].style.height = "100%";
			timebarDisplays[h].style.width = 0;
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
		}
		else
		{
			
		}
		updateDisplay();
		return display;
	}
	
	//---  ---
	this.addFrame = function()
	{
		
	}
	
	//--- Sets the selector position, in minutes past midnight ---
	this.setSelectorTime = function(input)
	{
		var tempSelectorTimeObj = new dTime(input);
		selectorTime = tempSelectorTimeObj.getTotalMinutes();
		updateDisplay();
	}
	
	//--- Returns the selector position, in a dTime object ---
	this.getSelectorTime = function()
	{
		return new dTime(selectorTime);
	}
	
	//---  ---
	this.addEventListener = function()
	{
		
	}
	
	//---  ---
	var triggerEvent = function()
	{
		
	}
	
	//-----------------------CONSTRUCTOR CODE-----------------------
	identifier = this.increaseInstance();
	allowConflicts = allowConflictsInput;
}