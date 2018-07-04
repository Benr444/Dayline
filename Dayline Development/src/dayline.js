/*
 * |----- DAYLINE.JS -----|
 * Dayline (Portmanteau of 'Day' and 'Timeline') is a javascript class that handles the display and collision of timeframes (referred to as "frames")
 *     on a simple timeline. To be used in scheduling programs to provide a graphical interface for creating frames and
 *     preventing unwanted frames from happening at the same time. The dayline program focuses on events that happen within the span of a single day
 * Development Start Date: 6/13/2018
 * Author: Benjamin Ranson
 * Example Usage:
 *     var DL = new Dayline();
 *     parent.appendChild(DL.getDisplay());
 *     var frame = new Frame( "12:00AM", "3:36PM", "Title", "Desc");
 *     DL.addFrame(frame, true);
 * 
 * === CSS Class Guide ===
 * - ".dayline-main": Contains the entirety of the dayline system
 *     - ".dayline-timeline": Contains all frames, labels, borders, etc. Larger than dayline itself, the element that is scrolled around
 *         - ".dayline-timelabel": Labels at top of .dayline-timeline that indicate time
 *         - ".dayline-timebar":   Thin border-only elements that extend timelabels down to the bottom of the timeline
 *         - ".dayline-frame":     Boxes that stretch stretch between timebars. Represent frames themselves on the timeline
 *         - ".dayline-framepop":  Boxes that appear when dayline-frames are clicked on. Reveal data about start and stop times
 *         - ".dayline-selector":  Thin border-only element that appears where the user clicks. Used to create new frames
 *  
 * === Z-Index Hierarchy ====
 * All elements are created on the default z-index except the following:
 *     - The first frame added occupies z-index = 1000
 *         - The first frame's framepop occupies z-index = 999
 *     - The second frame added occupies z-index = 998
 *         - The second frame's framepop occupies z-index= 997
 *     - etc, etc for all subsequent frames and framepops
 *     - The selector elements occupy z-index = 10,000
 *     
 * === Scope and Properties Guidelines ===
 * Due to the odd scoping of onClick functions generated within greater JS files, it is important to control scope while at the same time ensuring parent
 *     properties are simple to access within specific contexts. The following guidelines mostly serve as rules for further development
 * # Daylines:
 *     - ID Number of the dayline-main they are associated with  
 * # Dayline-Divs
 *     - 
 * # Dayline-Timelines
 *     - 
 * # Dayline-Timeline-Divs
 *     -
 * # Dayline-Frames:
 *     - 
 * # Dayline-Frame-Divs
 *     - 
 * # Dayline-Framepops:
 *     - 
 * # Dayline-Framepop-Divs
 *     - 
 *     
 *     
 */ 

/*
 * Creates and defines a dayline
 *    Param1 = Private variable that determines if events are allowed to happen at the same time
 *    Param2 = Private variable that determins if events are allows to happen at the same time if they have the same category
 */
function Dayline(allowConflict, allowCategoryConflict)
{	
	// --- FIELDS --- //
	this.dN; //The unique ID number of the div element that contains this Dayline's data
	var zoom = 0; //Private variable that determines the scale of the timeline
	this.frames = []; //Array of all frames stored within the timeline
	var divisions = 4; //Private variable. The number of divisions of an hour. Changed by zoom level
	this.eventListeners = //Object containing arrays of event listeners for each respective kind of event 
	{
		"addFrame": [],
		"removeFrame": [],
		"inspectFrame": [],
		"frameConflict": [],
		"zoomChange": [],
		"selectorChange": []
	};
	
	// --- "PROTO" METHODS/FIELDS --- //
	/*
	 * Determins the number of pixels between labels
	 */
	this.__proto__.getResolution = (function()
	{
		var baseResolution = 150; //Immutable.
		return function() {return baseResolution;}
	})();
	
	/*
	 * Creates a "private" instanceCount field shared by all dayline elements that ensures that each dayline instance has a unique ID.
	 */
	this.__proto__.increaseInstance = (function()
	{
		var instanceCount = -1; //Begins at -1 so that the first instance is 0.
		return function() {instanceCount += 1; return instanceCount;}
	})();
	
	// --- EVENT-RELATED FUNCTIONS--- //
	/*
	 * Allows registry of event listeners
	 */
	this.addEventListener = function(eventType, listenerFunc)
	{
		switch (String(eventType))
		{
			case "addFrame": 
				this.eventListeners.addFrame.push(listenerFunc);
			break;
			case "inspectFrame":
				this.eventListeners.inspectFrame.push(listenerFunc);
			break;
			case "frameConflict":
				this.eventListeners.frameConflict.push(listenerFunc);
			break;
			case "selectorChange":
				this.eventListeners.selectorChange.push(listenerFunc);
			break;
		}
	}
	
	/*
	 * Called when an event triggers
	 *     parameter1 = type of event to be triggered
	 *     parameter2 = event data object
	 */
	this.triggerEvent = function(eventType, e)
	{
		var u = 0; //Index variable for event for-loop
		switch (eventType)
		{
			case "addFrame":
				for (u = 0; u < this.eventListeners.addFrame.length; u++)
				{
					try
					{
						this.eventListeners.addFrame[u](e); //Call each function stored in the addFrame array
					}
					catch(err)
					{
						throw err; //If the function cannot handle being called, throw an error
					}
				}
			break;
			case "inspectFrame":
				for (u = 0; u < this.eventListeners.inspectFrame.length; u++)
				{
					try
					{
						this.eventListeners.inspectFrame[u](e); //Call each function stored in the addFrame array
					}
					catch(err)
					{
						throw err; //If the function cannot handle being called, throw an error
					}
				}
			break;
			case "frameConflict":
				for (u = 0; u < this.eventListeners.frameConflict.length; u++)
				{
					try
					{
						this.eventListeners.frameConflict[u](e); //Call each function stored in the addFrame array
					}
					catch(err)
					{
						throw err; //If the function cannot handle being called, throw an error
					}
				}
			break;
			case "selectorChange":
				for (u = 0; u < this.eventListeners.selectorChange.length; u++)
				{
					try
					{
						this.eventListeners.selectorChange[u](e); //Call each function stored in the addFrame array
					}
					catch(err)
					{
						throw err; //If the function cannot handle being called, throw an error
					}
				}
			break;
		}
	}
	
	// --- "INSTANCE" METHODS --- //
	/*
	 * Adds the passed event to the dayline.
	 *     parameter1 = the frame object
	 *     parameter2 = boolean. true to display on the dayline, false to hide
	 * 
	 * Return
	 *     true -> if frame is accepted
	 *     false -> if frame is rejected
	 */
	this.addFrame = function(newFrame, display)
	{
		var passedCheck = true; //Gets set to true if the event is allowed to be added
		if (allowConflict == false) //If this dayline does not allow conflicts, we must ensure that there is no event overlap before adding it
		{
			var sStart; //Stored event start "value"
			var sEnd; //Stored event end "value"
			var nStart = (newFrame.trueStartHours * 60) + (newFrame.startMinutes); //New event start "value"
			var nEnd = (newFrame.trueEndHours * 60) + (newFrame.endMinutes); //New event end "value"
			var conflictFrameIndex = null; //If there is a frame conflict, then this will store the conflicting frame's index
			//console.log("For event " + newFrame.title);
			//console.log("	nStart: " + nStart);
			//console.log("	nEnd: " + nEnd);
			if (this.frames.length == 0) //If there are no already-added frames
			{
				passedCheck = true; //There can be no conflict, thus the frames is valid
			}
			else
			{
				for (var u in this.frames) //For each previously stored frame
				{
					//The value is the number of minutes past midnight. Add 960 minutes if the time is PM
					sStart = (this.frames[u].trueStartHours * 60) + (this.frames[u].startMinutes);
					sEnd = (this.frames[u].trueEndHours * 60) + (this.frames[u].endMinutes);
					//console.log("	sStart: " + sStart);
					//console.log("	sEnd: " + sEnd);
					//console.log("   nEnd <= sStart: " + (nEnd <= sStart));
					//console.log("   nStart >= sEnd: " + (nStart >= sEnd));
					if ((nEnd <= sStart) || (nStart >= sEnd))
					{
						//Nothing happens. The frame is considered to be passed until it fails a check
					}
					else
					{
						passedCheck = false; //As soon as the frame fails one check, it is done for good
						conflictFrameIndex = u; //The conflicting frame is at this index
					}
				}
			}
		}
		else //If this dayline allows conflict, then all frames pass checks
		{
			passedCheck = true; //If there's no checks, then it definitely passed
		}
		if (passedCheck == true)
		{
			this.frames.push(newFrame); //Add the newFrame onto the list of frames
			var frameIndex = (this.frames.length - 1); //Index of the newly added frame
			var frameDiv = document.createElement("div"); //Create element that will represent the frame on the timeline
			frameDiv.dN = this.dN; //Share the dayline number with the frame;
			frameDiv.innerHTML = newFrame.title; //Set the frame to be labeled as "title"
			frameDiv.classList.add("dayline-frame");
			frameDiv.id = "dayline-n" + this.dN + "-frame-n" + frameIndex;
			frameDiv.style.position = "absolute";
			frameDiv.style.zIndex = 1000 - (2 * frameIndex);
			frameDiv.style.backgroundColor = "lightblue";
			frameDiv.style.textAlign = "center";
			frameDiv.style.height = "10%"; //Fix below if you change this
			frameDiv.style.margin = "0";
			frameDiv.style.fontSize = "2vh";
			frameDiv.style.border = "1px solid black";
			frameDiv.style.flexFlow = "column nowrap";
			frameDiv.style.justifyContent = "center";
			frameDiv.style.alignItems = "center";
			frameDiv.style.top = 10 * (frameIndex + 1) + "%"; //Fix below if you change this
			//Below:  the "width" value is saved directly to the element itself, as well as in its style
			frameDiv.width = (this.getResolution() * 4 * (newFrame.trueEndHours - newFrame.trueStartHours)) + (this.getResolution() * (newFrame.endMinutes - newFrame.startMinutes) / 15);
			frameDiv.style.width = frameDiv.width + "px";
			//Below: the "left" value is saved directly to the element itself, as well as in its style
			frameDiv.left = this.getResolution() * (newFrame.trueStartHours * 4) + this.getResolution() * (newFrame.startMinutes / 15) + this.getResolution() * ((newFrame.startMeridian === "PM") ? (12) : (0));
			frameDiv.style.left =  frameDiv.left + "px";
			frameDiv.style.display = (display ? "flex" : "none"); //Only show this div if it was set to be displayed
			//---Creating popup on click
			var framepopDiv = document.createElement("div"); //This div floats under selected frames and displays more information about them. Revealed on clicking frame divs
			framepopDiv.classList.add("dayline-framepop");
			framepopDiv.id = frameDiv.id + "-framepop";
			framepopDiv.style.display = "flex";
			framepopDiv.style.visibility = "hidden";
			framepopDiv.style.flexFlow = "row nowrap";
			framepopDiv.style.justifyContent = "space-around";
			framepopDiv.style.alignItems = "center";
			framepopDiv.style.position = "absolute";
			framepopDiv.style.zIndex = (frameDiv.style.zIndex - 1);
			framepopDiv.style.backgroundColor = "lightgreen";
			framepopDiv.style.border = "1px solid black";
			framepopDiv.dataset.initialTop = Number(10 * (frameIndex + 1));
			framepopDiv.style.top = framepopDiv.dataset.initialTop + "%"; //Initially same top
			framepopDiv.style.left = frameDiv.style.left; //Always the same left value
			framepopDiv.style.width = frameDiv.style.width; //Set width as the same as it's frame div
			framepopDiv.dataset.initialHeight = Number(10); //BASED ON ABOVE
			framepopDiv.style.height = framepopDiv.dataset.initialHeight + "%"; //Same width as the it's frame div
			framepopDiv.style.transition = "height 0.25s, top 0.25s"; //Causes reveal/hide to be animated
			frameDiv.addEventListener("click", function(e)
			{
				var popup = document.getElementById(this.id + "-framepop");
				//console.log(popup.style.top);
				//console.log(Number(popup.dataset.initialTop) + Number(popup.dataset.initialHeight) + "%");
				var visibilitySet = false; //set to true to prevent double-setting
				if (popup.style.visibility === "hidden")
				{
					popup.style.visibility = "visible";
					visibilitySet = true;
				}
				if (popup.style.top === (popup.dataset.initialTop + "%")) //If the top-position is in it's initial value
				{
					popup.style.top = (Number(popup.dataset.initialTop) + Number(popup.dataset.initialHeight)) + "%"; //Set it to the drop-down value
				}
				else if (popup.style.top === (Number(popup.dataset.initialTop) + Number(popup.dataset.initialHeight)) + "%") //If it's already dropped-down
				{
					popup.style.top = (popup.dataset.initialTop + "%") //Set it to initial
				}
				if (popup.style.height === (popup.dataset.initialHeight + "%")) //If the height-position is in it's initial value
				{
					popup.style.height = "30%"; //Set it to expanded value
				}
				else if (popup.style.height === "30%") //If it is expanded
				{
					popup.style.height = (popup.dataset.initialHeight + "%"); //Then shrink it
				}
				if (popup.style.visibility === "visible" && visibilitySet == false)
				{
					setTimeout(function() {popup.style.visibility = "hidden";}, 200)
				}
				var iFE = //Create inspectFrame event data
				{
					"dN": this.dN, //The Dayline ID the clicked frame belongs to
					"div": this, //The clicked frame
					"popupDiv": popup //The popup frame that will show up when this frame is inspected
				};
				document.getElementById("dayline-n" + this.dN).dayline.triggerEvent("inspectFrame", iFE);
			});
			//---Section for Adding Popup subelements
			var eventNameDiv = document.createElement("div"); //Contains the name of the event
			var eventDescDiv = document.createElement("div"); //Contains the description of the event
			var startTimeDiv = document.createElement("div"); //Contains the start time of the event
			var endTimeDiv = document.createElement("div"); //Contains the end time of the div
			eventNameDiv.innerHTML = "<b>" + newFrame.title + "</b>"; //Bolded title
			eventDescDiv.innerText = newFrame.desc;
			startTimeDiv.innerHTML = "<b>Start Time: </b>" + newFrame.startHours + ":" + (newFrame.startMinutes == 0 ? "00" : newFrame.startMinutes) + newFrame.startMeridian;
			endTimeDiv.innerHTML = "<b>End Time: </b>" + newFrame.endHours + ":" + (newFrame.endMinutes == 0 ? "00" : newFrame.endMinutes) + newFrame.endMeridian;
			eventNameDiv.style.textDecoration = "underline";
			framepopDiv.appendChild(eventNameDiv);
			framepopDiv.appendChild(eventDescDiv);
			framepopDiv.appendChild(startTimeDiv);
			framepopDiv.appendChild(endTimeDiv);
			//---Add main elements to the document
			var targetTimeline = document.getElementById("dayline-n" + this.dN + "-timeline");
			targetTimeline.appendChild(frameDiv); //Add this div as a child
			targetTimeline.appendChild(framepopDiv);
			var aFE = //Create addFrame event data
			{
				"dN": this.dN, //ID-number of the dayline this frame was added to
				"initDisplay": display, //True if the event was added with display = true
				"div": frameDiv, //HTML div object representing this frame
				"frame": newFrame //Frame data
			}
			this.triggerEvent("addFrame", aFE); //Fire off event
			return true;
		}
		else
		{
			//Do nothing. the frame is rejected from being added to the timeline display
			var fCE = //Create frameConflict event data
			{
				"dN": this.dN, //ID-number of the dayline this frame as added to
				"initDisplay": display, //True if the event was to be displayed by default
				"rejectedFrame": newFrame, //Frame that was rejecteds
				"conflictFrame": frames[conflictFrameIndex] //Frame that already existed in the time where this one wanted to exist
			}
			this.triggerEvent("frameConflict", fCE);
			return false;
		}
	}
	
	/*
	 * Returns an HTML DOM Object representing the main visual body of the dayline system
	 */
	this.getDisplay = function()
	{
		//---Create main div element for the dayline
		var mainDiv = document.createElement("div"); //Create an HTML DIV object that serves as the main element for the whole display
		mainDiv.dayline = this; //Important!: The dayline element on the page has it's associated dayline as a js property to allow access.
		this.dN = this.increaseInstance(); //dN = dayline number. Shared amoung all subelements. Numeric part of the unique dayline ID.
		mainDiv.dN = this.dN; //dayline number shared to subelements
		mainDiv.id = "dayline-n" + this.dN //Assign an id to the dayline gui
		mainDiv.classList.add("dayline-main"); //Create a class to allow css hooking
		mainDiv.style.width = "100%";
		mainDiv.style.height = "100%";
		//---Creating the timeline display
		var timelineDiv = document.createElement("div"); //Create the timeline div. This div is draggable and and displays all the frame data
		mainDiv.appendChild(timelineDiv); //Set the timeline as a child of the main div
		timelineDiv.classList.add("dayline-timeline"); //Create a class to allow css hooking
		timelineDiv.id = mainDiv.id + "-timeline"; //Unique ID for this timeline
		timelineDiv.dN = this.dN; //dayline number shared to subelements
		timelineDiv.style.height = "100%"; //Timeline div is contained to fit height-wise in the main div
		timelineDiv.style.position = "relative"; //Allows absolute positioning of subelements
		timelineDiv.style.overflow = "auto"; //Creates scrollbar when needed
		timelineDiv.onclick = function(e) //Triggered when you click on the timeline
		{
			if (e.target == this) //If the user click exclusively on the timeline background and not any inner elements
			{
				//---Remove old selector element
				var oldStartSelectorDiv = document.getElementById(this.id + "-selector-start")
				if (document.contains(oldStartSelectorDiv)) {oldStartSelectorDiv.remove();} //Test for old selector existence. If it exists, remove it
				//---Create and display selector element
				var startSelectorDiv = document.createElement("div");
				this.appendChild(startSelectorDiv);
				startSelectorDiv.dN = this.dN; //Dayline number shared to subelements
				startSelectorDiv.classList.add("dayline-selector-start")
				startSelectorDiv.classList.add("dayline-selector")
				startSelectorDiv.id = this.id + "-selector-start";
				startSelectorDiv.style.height = "90%";
				startSelectorDiv.style.margin = "0";
				startSelectorDiv.style.width = "0";
				startSelectorDiv.style.borderLeft = "2px dashed red";
				startSelectorDiv.style.position = "absolute";
				startSelectorDiv.style.zIndex = 10000;
				startSelectorDiv.style.top = "10%";
				var relativeX = ((e.clientX  + this.scrollLeft) - this.getBoundingClientRect().left); //How far, in pixels, the element is from the left side of the timeline
				//console.log("relativeX: " + relativeX);
				//console.log("e.clientX: " + e.clientX);
				//console.log("getBoundingClientRect().left: " + this.getBoundingClientRect().left);
				//console.log("scrollLeft: " + this.scrollLeft)
				var frameList = document.getElementsByClassName("dayline-frame"); //List of all frames in the timeline
				var smallestDiff = 10; 
				//Above: If a click occurs within a distance less than the smallestDiff of a frame start or end, then the cursor will snap to that start or end value
				var smallestDiffIndex = null; //This is the index of the frame who had an endpoint closest to where the cursor clicked
				var wasEndpoint = false; //Specifies whether the closest frame was closest at the start or end points
				for (var j = 0; j < frameList.length; j++) //For each frame
				{
					var startDiff = Math.abs(frameList[j].left - relativeX); //Distance from the start of this frame
					var endDiff =  Math.abs((frameList[j].left + frameList[j].width) - relativeX); //Distance from the end of this frame
					if (startDiff < smallestDiff) //If the start diff is less than the previous record
					{
						smallestDiff = startDiff; //This is the new record
						smallestDiffIndex = j; //This is the associated frame
						wasEndpoint = false; //Snap to this associated frame's start point
					}
					if (endDiff < smallestDiff) //If the end diff is less than the previous record (including this frame's own start point)
					{
						smallestDiff = endDiff; //This is the new record
						smallestDiffIndex = j; //This is the associated frame
						wasEndpoint = true; //Snap to this associated frame's end point
					}
				}
				if (smallestDiffIndex != null) //If some sort of snap-operation happened
				{
					if (wasEndpoint == true)
					{
						relativeX = frameList[smallestDiffIndex].left + frameList[smallestDiffIndex].width; //The new left-side displacement becomes equal to the frame end
					}
					else
					{
						relativeX = frameList[smallestDiffIndex].left; //The new left-side displacement becomes equal to the frame start
					}
				}
				startSelectorDiv.style.left =  relativeX + "px"; //Change the selector's position to where it was clicked
				var minutesSinceMidnight = (relativeX / document.getElementById("dayline-n" + this.dN).dayline.getResolution()) * 15;
				var timeObj = extractTime(minutesSinceMidnight); //Converts the minutes since midnight into a clock time
				var sCE = //Prepare to fire off selector change event by preparing data to pass
				{
					"selector": startSelectorDiv,                  //Selector element itself
					"timeObj": timeObj,                            //
					"selectorType": "start",                       //Type of selector
					"mouseX": e.clientX,                           //X-Position of mouse at time of firing
					"scrollX": this.scrollLeft,                    //How far the timeline has scrolled
					"visibleX": this.getBoundingClientRect().left, //The visible left-side of the timeline's x-position
				};
				document.getElementById("dayline-n" + this.dN).dayline.triggerEvent("selectorChange", sCE);
			}
		}
		/*
		timelineDiv.oncontextmenu= function(e) //Triggered when you right-click on the timeline
		{
			if (e.target == this) //If the user click exclusively on the timeline background and not any inner elements
			{
				e.preventDefault();
				//---Remove old selector element
				var oldEndSelectorDiv = document.getElementById(this.id + "-selector-end")
				if (document.contains(oldEndSelectorDiv)) {oldEndSelectorDiv.remove();} //Test for old selector existence. If it exists, remove it
				//---Create and display selector element
				var endSelectorDiv = document.createElement("div");
				this.appendChild(endSelectorDiv);
				endSelectorDiv.dN = this.dN; //Dayline number shared to subelements
				endSelectorDiv.classList.add("dayline-selector-end")
				endSelectorDiv.classList.add("dayline-selector")
				endSelectorDiv.id = this.id + "-selector-end";
				endSelectorDiv.style.height = "90%";
				endSelectorDiv.style.margin = "0";
				endSelectorDiv.style.width = "0";
				endSelectorDiv.style.borderLeft = "2px dashed blue";
				endSelectorDiv.style.position = "absolute";
				endSelectorDiv.style.zIndex = 10000;
				endSelectorDiv.style.top = "10%";
				var relativeX = ((e.clientX  + this.scrollLeft) - this.offsetLeft); //How far, in pixels, the element is from the left side of the timeline
				//console.log("relativeX: " + relativeX);
				//console.log("e.clientX: " + e.clientX);
				//console.log("offsetLeft: " + this.offsetLeft);
				//console.log("scrollLeft: " + this.scrollLeft)
				var frameList = document.getElementsByClassName("dayline-frame"); //List of all frames in the timeline
				var smallestDiff = 10; 
				//Above: If a click occurs within a distance less than the smallestDiff of a frame start or end, then the cursor will snap to that start or end value
				var smallestDiffIndex = null; //This is the index of the frame who had an endpoint closest to where the cursor clicked
				var wasEndpoint = false; //Specifies whether the closest frame was closest at the start or end points
				for (var j = 0; j < frameList.length; j++) //For each frame
				{
					var startDiff = Math.abs(frameList[j].left - relativeX); //Distance from the start of this frame
					var endDiff =  Math.abs((frameList[j].left + frameList[j].width) - relativeX); //Distance from the end of this frame
					if (startDiff < smallestDiff) //If the start diff is less than the previous record
					{
						smallestDiff = startDiff; //This is the new record
						smallestDiffIndex = j; //This is the associated frame
						wasEndpoint = false; //Snap to this associated frame's start point
					}
					if (endDiff < smallestDiff) //If the end diff is less than the previous record (including this frame's own start point)
					{
						smallestDiff = endDiff; //This is the new record
						smallestDiffIndex = j; //This is the associated frame
						wasEndpoint = true; //Snap to this associated frame's end point
					}
				}
				if (smallestDiffIndex != null) //If some sort of snap-operation happened
				{
					if (wasEndpoint == true)
					{
						relativeX = frameList[smallestDiffIndex].left + frameList[smallestDiffIndex].width; //The new left-side displacement becomes equal to the frame end
					}
					else
					{
						relativeX = frameList[smallestDiffIndex].left; //The new left-side displacement becomes equal to the frame start
					}
				}
				endSelectorDiv.style.left =  relativeX + "px";
			}
		}
		*/
		var meridiem = "AM"; //Indicates which side of the 12 hour clock the label is on
		for (var k = 0; k <= 12; k += 12) //Forces the inner loops to execute twice, once with k=0 and once with k=12. Divides the clock into AM and PM
		{
			if (k == 12) {meridiem = "PM";} //Second loop is PM labels
			for (var i = 0; i < 12; i++)
			{
				for (var j = 0; j < divisions; j++)
				{
					var divisionLength = 60 / divisions; //The number of minutes each division lasts
					var timelabelDiv = document.createElement("div"); //Time-label div element. Displays at top of timeline to indicate time
					var timebarDiv = document.createElement("div"); //Small line that creates a grid-system on timeline
					timebarDiv.classList.add("dayline-timebar")
					timelabelDiv.classList.add("dayline-timelabel");
					timeIndex = (k * divisions) + (i * divisions) + j; //A count of how many timebars/timelabels have come before
					timebarDiv.id = "dayline-n" + this.dN + "-timebar-n" + timeIndex;
					timelabelDiv.id = "dayline-n" + this.dN + "-timelabel-n" + timeIndex; //Unique numberic id for each label
					timebarDiv.dN = this.dN; //Shared from dayline object
					timelabelDiv.dN = this.dM; //Shared from dayline object
					timelabelDiv.style.left = (timeIndex * this.getResolution()) + "px";
					timebarDiv.style.left = (timeIndex * this.getResolution()) + "px";
					timelabelDiv.style.height = "10%";
					timebarDiv.style.height = "100%";
					timelabelDiv.style.margin = "0";
					timebarDiv.style.margin = "0";
					timelabelDiv.style.width = this.getResolution() + "px";
					timebarDiv.style.width = "0";
					timelabelDiv.style.fontSize = "3vh";
					timelabelDiv.style.position = "absolute";
					timebarDiv.style.position = "absolute";
					timelabelDiv.style.display = "flex";
					timelabelDiv.style.flexFlow = "row nowrap";
					timelabelDiv.style.justifyContent = "flex-start";
					timelabelDiv.style.alignItems = "center";
					timebarDiv.style.display = "block";
					timelabelDiv.style.backgroundColor = "gray";
					timebarDiv.style.borderLeft = "1px dashed black";
					if (i == 0) //k=0 means that the hour is 12, not 0
					{
						timelabelDiv.innerHTML = "12"; //Ignore math, make it 12
					}
					else //If not a 0-hour label
					{
						timelabelDiv.innerHTML = i; //Calculate the hour
					}
					if (j == 0) //0-minutes display as 12:00 not 12:0
					{
						timelabelDiv.innerHTML = timelabelDiv.innerHTML + ":00" + meridiem; //Displayed text of the time label
					}
					else //If not a 0-minute label
					{
						timelabelDiv.innerHTML = timelabelDiv.innerHTML + ":" + (divisionLength * j) + meridiem; //Displayed text of the time label
					}
					timelineDiv.appendChild(timelabelDiv); //Add this element to the timeline
					timelineDiv.appendChild(timebarDiv); //Add this element to the timeline
				}
			}
		}
		return mainDiv;
	}
	
	/*
	 * Slides the dayline to the specified time
	 */
	this.traverseToTime = function(timeStr)
	{
		
	}
}

/*
 * Given a date, minutes since midnight, or timeString, pulls out the hour, minute, and meridian for a normalized clock and returns them as an obj like so
 * obj =
 * {
 *     "hours": 0-12,
 *     "minutes": 0-59,
 *     "meridian": "AM" or "PM",
 *     "trueHours": 0-24;
 *     "time": "12:00AM"
 * }
 */
function extractTime(input)
{
	//console.log("extractTime input: " + input);
	var obj = //Returned time object. Gets filled in by following code
	{
		"hours": 0,
		"minutes": 0,
		"meridian": "AM",
		"trueHours": 0,
		"getTime": function()
		{
			return this.hours + ":" + (this.minutes == 0 ? "00" : this.minutes) + this.meridian;
		}
	}
	switch (typeof input)
	{
		case "string":
			//Explained via example. Let start = "12:00AM", and end = "11:35PM"
			obj.hours = Number(input.split(":")[0]); //12
			obj.minutes = Number(input.split(":")[1].slice(0, 2)); //0
			obj.meridian = input.split(":")[1].slice(2, 5); //"AM"
			obj.trueHours = obj.hours + ((obj.meridian === "PM") ? (12) : (0));
			if (obj.hours == 12 && obj.meridian === "AM") {obj.trueHours = 0;} //Special case for 12:XXAM
			if (obj.hours > 12) {obj.hours = 12;} //Hour capping
			if (obj.minutes > 59) {obj.minutes = 59;} //Minute capping
			if (obj.hours < 0) {obj.hours = 0;} //Hour minimizing
			if (obj.minutes < 0) {obj.minutes = 0;} //Minute minimizing
		break;
		case "number":
			obj.minutes = Math.trunc(input % 60);
			obj.hours = Math.trunc(input / 60);
			obj.meridian = (obj.hours < 12) ? "AM" : "PM";
			obj.hours += (obj.hours > 12) ? -12 : 0; //Subtract 12 hours if at 13 -> 24
			obj.hours = (obj.hours == 0 && obj.meridian === "AM") ? 12 : obj.hours; //0AM => 12AM
		break;
		case "date":
			obj.hours = start.getHours(); //Direct assignment, later modified
			obj.minutes = start.getMinutes(); //Direct assignment
			obj.trueHours = obj.hours;
			if (obj.hours > 12) //Conversion from 24 to 12 hour clock
			{
				obj.hours -= 12;
				this.startMeridian = "PM";
			}
			else
			{
				this.startMeridian = "AM";
			}
		break;
	}
	return obj;
}

/*
 * Constructor function for an event object.
 * Frames display on the dayline and have a duration and a set of defining properties.
 * The frame can be created by passing through two dates or two specially formatted strings
 * e.x. "12:00AM", "1:00PM", "3:54AM"
 */
function Frame(start, end, title, desc)
{
	this.title = title;
	this.desc = desc;
	this.startMeridian = "AM";
	this.startHours = 12;
	this.trueStartHours = 0; //24-hour clock start hours
	this.startMinutes = 0;
	this.startTime = ""; //Complete, final start time like "1:15AM"
	this.endMeridian = "PM";
	this.endHours = 12;
	this.trueEndHours = 0; //24-hour clock end hours
	this.endMinutes = 0;
	this.endTime = ""; //Complete, final end time like "5:56PM"
	if (typeof start != typeof end)
	{
		throw "Both 'start' and 'end' parameters must either both be Dates or both Strings";
	}
	else
	{
		var startTimeObj = extractTime(start);
		this.startHours = startTimeObj.hours;
		this.startMinutes = startTimeObj.minutes;
		this.startMeridian = startTimeObj.meridian;
		this.trueStartHours = startTimeObj.trueHours;
		this.startTime = startTimeObj.getTime();
		endTimeObj = extractTime(end);
		this.endHours = endTimeObj.hours;
		this.endMinutes = endTimeObj.minutes;
		this.endMeridian = endTimeObj.meridian;
		this.trueEndHours = endTimeObj.trueHours;
		this.endTime = endTimeObj.getTime();
	}
}