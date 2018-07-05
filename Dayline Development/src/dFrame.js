function dFrame(startInput, endInput, constructorTitle, constructorDescription, constructorIdentifier)
{
	//-----------------------PRIVATE CONSTANTS AND PROPERTIES-----------------------
	var start = {};              //
	var end = {};                //
	var title = "";              //
	var description = "";        //
	var category = "";           //
	var identifier = 0;          //
	
	//-----------------------PUBLIC FUNCTIONS-----------------------
	//--- Takes a valid dTime constructor value, and assigns the start time to be the resulting dTime ---
	this.setStartTime = function(startInput)
	{
		start = new dTime(startInput);
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
	}
	
	//---  ---
	this.getDescription = function()
	{
		return description;
	}
	
	//---  ---
	this.getIdentifier = function()
	{
		return identifier;
	}
	
	//---  ---
	this.getCategory = function()
	{
		return category;
	}
	
	//-----------------------CONSTRUCTOR CODE-----------------------
	identifier = constructorIdentifier;
	this.setStartTime(startInput);
	this.setEndTime(endInput);
	this.setTitle(constructorTitle);
	this.setDescription(constructorDescription);
}