# Class: Dayline
The frame logic and management that the Dayline class does should be completely independent of its rendering on the webpage.

**The Dayline class contains two subclasses, that should be understood before seeing the Dayline's own public properties**

Other Concepts:

1. Timeline - This is the actual html element where it all plays out. The Timeline is entirely controlled by the actual Dayline code
2. Selector - This is a vertical bar that appears on the Timeline to represent a selected time
3. Events - Use addEventListener(string) to add a function to trigger on a number of possible events. Your complete hooking and customization system. Complete list of events available under "Dayline Public Properties"

## Public Dayline Properties

- Constructor(boolean)

    - `Creates a dayline.`
    - `Parameter: "allowConflicts" - determines if dFrames sharing a category and some time period are allowed to overlap`

- dTime(...)

    - 	`Constructor for the dTime subclass`
    
- getDisplay()

    - `Returns an HTML structure that serves as the GUI for the dayline`
    
- addFrame(...)

    - `The paramters for this function are the same as the dFrame constructor above, without identifier`
    
- setSelectorTime(input)

    - `Puts the selector at the time specified by the input`
    - `The second input must be a valid input for the dTime constructor`
    - `The timeline will scroll until the selector is in view`

- getSelectorTime()

    - `Returns a dTime object that contains the time-position of the selector`
    
- setScroll(input)

    - `Sets the scroll position in terms of a dTime construction input`
    - `The passed time is centered at the new position`

- getScroll()

    - `Returns the time-value at the center of the current scroll position`
    - `A dTime object is returned`

- **addEventListener(string, function)**

    - `Serves as the complete hooking system`
    - `The string determines what event is being listened to. Possible values are:`
    
        `1. addFrame        - dFrame added to internal register`
        
             event = {
                 addedEvent: the dFrame that was just added to the dFrame register
             }
        
        `2. removeFrame     - dFrame removed from internal register`
        
             event = {
                 removedEvent: the dFrame that was just removed from the dFrame register
             }
        
        `3. hideFrame       - dFrame removed from Timeline`
        
             event = {
                 hiddenFrame: dFrame that is no longer visible
             }
        
        `4. showFrame       - dFrame added to Timeline`
        
             event = {
                 shownFrame: dFrame that is now visible
             }
        
        `5. inspectFrame    - dFrame HTML inspected/expanded`
        
             event = {
                 inspectedFrame: dFrame that was inspected
             }
        
        `6. frameChange     - dFrame data changed`
        
             event = {
                 changedFrame: dFrame that had data changed
             }
        
        `7. frameConflict   - dFrame violates a Dayline rule`
        
             event = {
                 existingFrames: dFrames that previously existed and conflict
                 newFrame: the dFrame that is attempting to be added
             }
        
        `8. selectorChange  - Timeline selector changes position or initialized`
        
             event = {
                 oldTime: dTime that describes the selector's position before the movement
                 newTime: dTime that describes the selector's position after the movement
                 selector: the selector html
             }
        
        `9. timelineClick   - Timeline element has been clicked. Gives click location as a time as well as relative pixel values`
        
             event = {
                 time: dTime representing where on the timeline that was clicked
                 xPos: screen-relative x-coord for the click
                 yPos: screen-relative y-coord for the click
             }
        
    - `The passed function is executed when the event happens (psst, this how ALL event listening schemes work)`

## *Class-Level and/or Private Dayline Properties*

These are here to help explain some underlying structure. They are not accessible outside the source code of the Dayline class

- *triggerEvent(string)*

     - `Triggers the event linked the passed string. See addEventListener function for guide`

- *increaseInstance()*

    - `Calling this function returns a number unique to this Dayline instance on this webpage`
    - `Ensures that multiple Dayline functions don't interfere on a page`
    
- *updateDisplay()*

    - `Updates the visual display of the Dayline for recent changes`

## Subclass: dTime
Similar to a date, but specifies a time only on a 12 or 24 hour clock, down to minute

*dTime is short for Dayline-Time*

**Public Properties**

- setMinutes(number)

    - `The number will be edited to be within proper values (0-59) (without warning)`

- getMinutes()

- setTotalMinutes(number)

    - `Sets the total minutes since midnight, and updates all other values to reflect it`
    - `The number will be edited to be within proper values (0-1440) (without warning)`

- getTotalMinutes()

    - `Returns the total minutes since midnight as a number`
    - `Notably useful for`

- setHours(number)

    - `Set the 12-hour clock hours. This updates the true (24h) hours as well`
    - `The number will be edited to be within proper values (1-12) (without warning)`

- getHours()

- setTrueHours(number)

    - `The number will be edited to be within proper values (0-23) (without warning)`

- getTrueHours()

    - `Set the 24-hour clock hours. This updates the meridian and normal (12h) hours as well`

- setMeridian(string)

    - `Set whether the time is "AM" or "PM"`
    - `Case insensitive`
    - `Throws a string when the input is not "AM" or "PM"`

- getMeridian()

- setTime(input) & Constructor(input)

    - `The setTime function is identical to the constructor`
    - `"input": This can be one of the following`
        `1. A timestring formatted like this: "11:47PM" for 12h clocks`
        `2. A timestring formatted like this: "22:47" for 24h clocks`
        `3. A javascript Date object whose hour and minute values will be extracted`
        `4. A number of minutes past midnight which will be translated into a readable time`
        `5. A dTime object`

- getTime()

    - `Returns a readable time string like "3:25PM" for 12h clocks`

- getTrueTime()
   
    - `Returns a readable time string like "14:32" for 24h clocks`

## Subclass: dFrame
A frame represents an event, booking, or appointment on the Dayline.

Note: dFrames can't be instantiated normally. Normally, only the main Dayline class will instantiate dFrame. To add a dFrame, call the addFrame(...) function of Dayline

*dFrame is short for Dayline-timeframe*

**Public Properties**

- Constructor(startInput, endInput, title, description)

    - `Creates a dFrame with the bare minimum of properties for display`
    - `startInput and endInput must be valid values for the setTime(input) function of the dTime class`
    
- getDisplay()

    - `Returns the HTML element for this dFrame`
    
- setSpacing(number)

    - `Sets the spacing (pixels between 15 minute segments)`
    - `Helps the dFrames resize and display`
    
- setPopState(boolean)
    - `Allows setting the dFrame to display its data or not`
    - `TRUE -> Displayed, FALSE -> Hidden`
    
- getPopState()
    - `Returns the state of the pop info`
        
- setStart(input)

    - `Setting the start time will change the frame on the GUI`
    - `The input must be valid with respect to the dTime class`
    - `The frame will disapear from the Dayline if it is no longer allowed under the Dayline's rules`
    - `The object is COPIED, and cannot be used to directly edit time values for this frame`

- getStart()

    - `Returns a dTime object representing the starting time for this frame`
    - `The object is a COPY, and cannot be used to directly edit time values for this frame`
    
- setEnd(input)

    - `Setting the end time will change the dFrame on the GUI`
    - `The input must be valid with respect to the dTime class`
    - `The frame will disapear from the Dayline if it is no longer allowed under the Dayline's rules`
    - `The object is COPIED, and cannot be used to directly edit time values for this frame`

- getEnd()

    - `Returns a dTime object representing the ending time for this dFrame`
    - `The object is a COPY, and cannot be used to directly edit time values for this frame`
    
- setTitle(string)

    - `The string supports HTML`

- getTitle()

    - `Be prepared to handle HTML inside this string`

- setDescription(string)

    - `The string supports HTML`

- getDescription()

    - `Be prepared to handle HTML inside this string`
    
- getIdentifier()

    - `Each dFrame on a webpage has a unique number associated with it`
    - `Calling this function returns that number`

- getCategory()

    - `Returns a string that represents the category this dFrame belongs in` 
    - `Categories are determined by the Dayline this dFrame belongs to`