# Class: Dayline
The frame logic and management that the Dayline class does should be completely independent of its rendering on the webpage.

**The Dayline class contains two subclasses, that should be understood before seeing the Dayline's own public properties**

## Subclass: dTime
Similar to a date, but specifies a time only on a 12 or 24 hour clock, down to minute

*dTime is short for Dayline-Time*

**Public Properties**

- setMinutes(number)

    - `The number will be edited to be within proper values (0-59) (without warning)`

- getMinutes()

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

## Subclass: Frame
A frame represents an event, booking, or appointment on the Dayline.

**Public Properties**

- Constructor(startInput, endInput, title, description)

    - `Creates a frame with the bare minimum of properties for display`
    - `startInput and endInput must be valid values for the setTime(input) function of the dTime class`

- setStartDTime(input)

    - `Setting the start time will change the frame on the GUI`
    - 	`The input must be valid with respect to the dTime class`
    - `This function can throw an error if the Dayline will not allow the new start time`

- getStartDTime()

    - 	`Returns a dTime object representing the starting time for this frame`
    
- setEndDTime(input)

    - `Setting the end time will change the frame on the GUI`
    - `The input must be valid with respect to the dTime class`
    - `This function can throw an error if the Dayline will not allow the new start time`

- getEndDTime()

    - `Returns a dTime object representing the ending time for this frame`
    
- setTitle(string)

- getTitle()

- setDescription(string)

- getDescription()

- getIdentifier()

    - `Each frame inside a Dayline has a unique identifier number that can be used to call it up from the main Dayline object its associateed with`
    - `Calling this function returns that number`

### Public Dayline Properties

**Event-Related Dayline Properties** *(Hooking System)*