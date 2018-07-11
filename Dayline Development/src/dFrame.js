function dFrame(startInput, endInput, constructorTitle, constructorDescription)
{
	//-----------------------PRIVATE CONSTANTS AND PROPERTIES-----------------------
	var start = {};              //
	var end = {};                //
	var title = "";              //
	var description = "";        //
	var category = "";           //
	var identifier = 0;          //Unique number for this dFrame on this webpage
	var display = null;          //HTML element for this dFrame
	var popDisplay = {};         //HTML element that only becomes visible when the frame becomes clicked
	var titleDisplay = {};       //
	var descriptionDisplay = {}; //
	var startDisplay = {};       //
	var endDisplay = {};         //
	var spacing = 0;             //Pixels between 15 minute segments
	var popState = false;        //True when a frame is displaying its inner popup
	const fMax = 1000;           //A number that helps determine the maximum number of dFrames that can display properly on a timeline. Raising this raises the zIndex of all frames as well
	
	//-----------------------PRIVATE FUNCTIONS-----------------------
	//--- Returns a unique identifier for each call ---
	this.__proto__.increaseInstance = (function()
	{
		var instanceCount = -1; //Begins at -1 so that the first instance is 0.
		return function() {instanceCount += 1; return instanceCount;}
	})();
	
	var updateDisplay = function()
	{
		/* A Guide to Z-Index
		 * - dFrame           : fMax - 1 - identifier
		 *    - title         : fMax + 2 - identifier
		 *    - pop           : fMax - identifier
		 *      - description : fMax + 1 - identifier
		 *      - start       : fMax + 1 - identifier
		 *      - end         : fMax + 1 - identifier
		 */
		if (display == null)
		{
			//Do nothing if the display has not been initialized
		}
		else
		{
			//== display updates ==
			//display.style.height -> This is controlled by the Dayline, not the frame
			display.style.left = ((start.getTotalMinutes() / 15) * spacing) + "px";
			display.style.width = (((end.getTotalMinutes() - start.getTotalMinutes()) / 15) * spacing) + "px";
			display.style.height = "10%";
			display.style.position = "relative";
			display.style.zIndex = fMax - 1 - identifier;
			//== titleDisplay updates ==
			titleDisplay.style.width = "100%";
			titleDisplay.style.height = "100%";
			titleDisplay.style.position = "relative";
			titleDisplay.style.zIndex = fMax + 2 - identifier;
			titleDisplay.innerHTML = title;
			//== popDisplay updates ==
			popDisplay.style.width = "100%";
			
			if (popState == true)
			{
				popDisplay.style.top = "100%";
				popDisplay.style.height = "300%";
			}
			else
			{
				popDisplay.style.top = "0";
				popDisplay.style.height = "100%";
			}
	        popDisplay.style.position = "relative";
			popDisplay.style.zIndex = fMax - identifier;
			//== descriptionDisplay updates ==
			descriptionDisplay.innerHTML = description;
			descriptionDisplay.style.position = "relative";
			display.style.zIndex = fMax + 1 - identifier;
			//== startDisplay updates ==
			startDisplay.innerHTML = start.getTime();
			startDisplay.style.position = "relative";
			startDisplay.style.zIndex = fMax + 1 - identifier;
			//== endDisplay updates ==
			endDisplay.innerHTML = end.getTime();
			endDisplay.style.position = "relative";
			endDisplay.style.zIndex = fMax + 1 - identifier;
		}
	}
	
	//-----------------------PUBLIC FUNCTIONS-----------------------
	//--- Returns the HTML representation of this dFrame ---
	this.getDisplay = function()
	{
		if (display == null) //Only create a display element if it doesnt exist yet
		{
			//== display config ==
			display = document.createElement("div");
			display.id = "dFrame-n" + identifier;
			display.classList.add("dayline-dFrame");
			display.style.position = "relative";
			//== titleDisplay config ==
			titleDisplay = document.createElement("div");
			titleDisplay.id = display.id + "-title"
			titleDisplay.classList.add("dayline-dFrame-title");
			titleDisplay.style.position = "relative";
			titleDisplay.dFrame = this;                                //Allows the onclick function to access the methods of this class
			titleDisplay.addEventListener("click", function()
			{
				this.dFrame.setPopState(!this.dFrame.setPopState);     //Toggle the popState
			});
			display.appendChild(titleDisplay);
			//== popDisplay config ==
			popDisplay = document.createElement("div");
			popDisplay.id = display.id + "-pop";
			popDisplay.classList.add("dayline-dFrame-pop");
			popDisplay.style.position = "relative";
			display.appendChild(popDisplay);
			//== descriptionDisplay config ==
			display.appendChild(titleDisplay);
			descriptionDisplay = document.createElement("div");
			descriptionDisplay.id = display.id + "-description"
			descriptionDisplay.classList.add("dayline-dFrame-description");
			descriptionDisplay.style.position = "relative";
			popDisplay.appendChild(descriptionDisplay);
			//== startDisplay config ==
			startDisplay = document.createElement("div");
			startDisplay.id = display.id + "-start"
			startDisplay.classList.add("dayline-dFrame-start");
			startDisplay.style.position = "relative";
			popDisplay.appendChild(startDisplay);
			//== endDisplay config ==
			endDisplay = document.createElement("div");
			endDisplay.id = display.id + "-end"
			endDisplay.classList.add("dayline-dFrame-end");
			endDisplay.style.position = "relative";
			popDisplay.appendChild(endDisplay);
			//== Updates and Widths, Heights, etc via the updateDisplay() function ==
			updateDisplay();
			return display;
		}
		else
		{
			updateDisplay();
			return display;
		}
	}
	
	//--- Returns the pixels between 15 minutes for this dFrame. Should match the Dayline this belongs to ---
	this.setSpacing = function(inputSpacing)
	{
		spacing = inputSpacing;
		updateDisplay();
	}
	
	//--- Sets the state of the pop display ---
	this.setPopState = function(popInput)
	{
		popState = popInput;
		updateDisplay();
	}
	
	//--- Returns the state of the pop display ---
	this.getPopState = function()
	{
		return popState;
	}
	
	//--- Takes a valid dTime constructor value, and assigns the start time to be the resulting dTime ---
	this.setStartTime = function(startInput)
	{
		start = new dTime(startInput);
		updateDisplay();
	}
	
	//--- Returns a copy of the dTime object that represents the start time ---
	this.getStartTimes = function()
	{
		return Object.assign({}, start); //Return a copy of the start time object
	}
	
	//--- Takes a valid dTime constructor value, and assigns the end time to be the resulting dTime ---
	this.setEndTime = function(endInput)
	{
		end = new dTime(endInput)
		updateDisplay();
	}
	
	//--- Returns a copy of the dTime object that represents the start time ---
	this.getEndTime = function()
	{
		return Object.assign({}, end); //Return a copy of the start time object
	}
	
	//--- Sets the title of the event to the passed string ---
	this.setTitle = function(titleString)
	{
		title = titleString;
		updateDisplay();
	}
	
	//--- Returns the title as a string. Can be HTML ---
	this.getTitle = function()
	{
		return title;
	}
	
	//--- Sets the description of the event as the passed string. Can be HTML ---
	this.setDescription = function(descriptionString)
	{
		description = descriptionString;
		updateDisplay();
	}
	
	//--- Returns the html descript of this dFrame ---
	this.getDescription = function()
	{
		return description;
	}
	
	//--- Returns the unique number for this Dayline for this dFrame ---
	this.getIdentifier = function()
	{
		return identifier;
	}
	
	//--- Returns the category this dFrame belongs to ---
	this.getCategory = function()
	{
		return category;
	}
	
	//-----------------------CONSTRUCTOR CODE-----------------------
	identifier = this.increaseInstance();               //Assigns a webpage/script-unique identifier number to this dFrame
	this.setStartTime(startInput);
	this.setEndTime(endInput);
	this.setTitle(constructorTitle);
	this.setDescription(constructorDescription);
}