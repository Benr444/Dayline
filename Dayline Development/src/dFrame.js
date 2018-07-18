function dFrame(startInput, endInput, constructorTitle, constructorDescription)
{
	//-----------------------PRIVATE CONSTANTS AND PROPERTIES-----------------------
	var start = {};              //dTime object for the start-time
	var end = {};                //dTime object for the end-time
	var title = "";              //
	var description = "";        //
	var category = "";           //String assigned at construction
	var identifier = 0;          //Unique number for this dFrame on this webpage
	var display = null;          //HTML element for this dFrame
	var popDisplay = {};         //HTML element that only becomes visible when the frame becomes clicked
	var titleDisplay = {};       //HTML element for title label
	var descriptionDisplay = {}; //HTML element for description label
	var startDisplay = {};       //HTML element for start-time label
	var endDisplay = {};         //HTML element for end-time label
	var spacing = 150;           //Pixels between 15 minute segments
	var popState = false;        //True when a frame is displaying its inner popup
	const fMax = 1000;           //A number that helps determine the maximum number of dFrames that can display properly on a timeline. Raising this raises the zIndex of all frames as well
	
	//-----------------------PRIVATE FUNCTIONS-----------------------
	//--- Returns a unique identifier for each call ---
	if (this.__proto__.instanceCount == null)     //If this class-wide property does not exist
	{
		this.__proto__.instanceCount = 0;         //Create it. Shared by all dFrames
	}
	this.__proto__.increaseInstance = function()
	{
		this.__proto__.instanceCount += 1;
		return this.__proto__.instanceCount;
	}
	
	var updateDisplay = function()
	{
		/* A Guide to Z-Index
		 * - dFrame           : fMax - (2*identifier) - 2
		 *    - title         : fMax - (2*identifier)
		 *    - pop           : fMax - (2*identifier) - 1
		 *      - description : fMax - (2*identifier) - 1
		 *      - start       : fMax - (2*identifier) - 1
		 *      - end         : fMax - (2*identifier) - 1
		 */
		if (display == null)
		{
			//Do nothing if the display has not been initialized
		}
		else
		{
			//== display updates ==
			//display.style.top -> This is controlled by the Dayline, not the frame
			display.style.left = ((start.getTotalMinutes() / 15) * spacing) + "px";
			display.style.width = (((end.getTotalMinutes() - start.getTotalMinutes()) / 15) * spacing) + "px";
			display.style.height = "10%";
			display.style.position = "relative";
			display.style.zIndex = fMax - (2 * identifier) - 2;
			//== titleDisplay updates ==
			titleDisplay.style.width = "100%";
			titleDisplay.style.height = "100%";
			titleDisplay.style.position = "absolute";
			titleDisplay.style.zIndex = fMax - (2 * identifier) - 0;
			titleDisplay.innerHTML = title;
			titleDisplay.style.backgroundColor = "lightblue";
			//== popDisplay updates ==
			popDisplay.style.width = "100%";
			if (popState == true)
			{
				popDisplay.style.display = "block";                //Shows the popup (hidden under title still)
				setTimeout(function()                              //Slides the popup out after short delay. This delay allows css transition to work properly
				{
					popDisplay.style.top = "100%";
					popDisplay.style.height = "300%";
				}, 1);
			}
			else
			{
				popDisplay.style.top = "0";                       //Slides the popup under immediately
				popDisplay.style.height = "100%";
				setTimeout(function()                             //Hides the popup after a short delay. The delay allows css transition to work properly 
				{
					popDisplay.style.display = "none";            
				}, 250);
			}
	        popDisplay.style.position = "absolute";
			popDisplay.style.zIndex = fMax - (2 * identifier) - 1;
			popDisplay.style.backgroundColor = "lightGreen";
			//== descriptionDisplay updates ==
			descriptionDisplay.innerHTML = description;
			descriptionDisplay.style.position = "relative";
			display.style.zIndex = fMax - (2 * identifier) - 1;
			//== startDisplay updates ==
			startDisplay.innerHTML = "Start: " + start.getTime();
			startDisplay.style.position = "relative";
			startDisplay.style.zIndex = fMax - (2 * identifier) - 1;
			//== endDisplay updates ==
			endDisplay.innerHTML = "End: " + end.getTime();
			endDisplay.style.position = "relative";
			endDisplay.style.zIndex = fMax - (2 * identifier);
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
			display.classList.add("dayline-dframe");
			//== titleDisplay config ==
			titleDisplay = document.createElement("div");
			titleDisplay.id = display.id + "-title"
			titleDisplay.classList.add("dayline-dframe-title");
			titleDisplay.dFrame = this;                                //Allows the onclick function to access the methods of this class
			titleDisplay.addEventListener("click", function()
			{
				this.dFrame.setPopState(!this.dFrame.getPopState());   //Toggle the popState
			});
			display.appendChild(titleDisplay);
			//== popDisplay config ==
			popDisplay = document.createElement("div");
			popDisplay.id = display.id + "-pop";
			popDisplay.classList.add("dayline-dframe-pop");
			display.appendChild(popDisplay);
			//== descriptionDisplay config ==
			display.appendChild(titleDisplay);
			descriptionDisplay = document.createElement("div");
			descriptionDisplay.id = display.id + "-description"
			descriptionDisplay.classList.add("dayline-dframe-description");
			popDisplay.appendChild(descriptionDisplay);
			//== startDisplay config ==
			startDisplay = document.createElement("div");
			startDisplay.id = display.id + "-start"
			startDisplay.classList.add("dayline-dframe-start");
			popDisplay.appendChild(startDisplay);
			//== endDisplay config ==
			endDisplay = document.createElement("div");
			endDisplay.id = display.id + "-end"
			endDisplay.classList.add("dayline-dframe-end");
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
	this.setStart = function(startInput)
	{
		start = new dTime(startInput);
		updateDisplay();
	}
	
	//--- Returns a copy of the dTime object that represents the start time ---
	this.getStart = function()
	{
		return Object.assign({}, start); //Return a copy of the start time object
	}
	
	//--- Takes a valid dTime constructor value, and assigns the end time to be the resulting dTime ---
	this.setEnd = function(endInput)
	{
		end = new dTime(endInput)
		updateDisplay();
	}
	
	//--- Returns a copy of the dTime object that represents the start time ---
	this.getEnd = function()
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
	identifier = this.increaseInstance(); //Assigns a webpage/script-unique identifier number to this dFrame
	this.setStart(startInput);
	this.setEnd(endInput);
	this.setTitle(constructorTitle);
	this.setDescription(constructorDescription);
}