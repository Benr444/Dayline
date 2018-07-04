#Class: Dayline
The frame logic and management that the Dayline class does should be completely independent of its rendering on the webpage.

**The Dayline class contains two subclasses, that should be understood before seeing the Dayline's own public properties**

##Subclass: dTime
Similar to a date, but specifies a time only on a 12 or 24 hour clock, down to minute

*dTime is short for Dayline-Time*

**Public Properties**

- setMinutes(number)

- getMinutes()

- setMinutes(number)

- getMinutes()

- setHours(number)

    - `Set the 12-hour clock hours. This updates the true (24h) hours as well.`

- getHours()

- setTrueHours(number)

- getTrueHours()

    - `Set the 24-hour clock hours. This updates the meridian and normal (12h) hours as well.`

- setMeridian(string)

    - `Set whether the time is "AM" or "PM".`

- getMeridian()

- setTime(input) & dTime(input)

    - `The setTime function is identical to the constructor.`

- getTime()

    - `Returns a readable time string like "3:25PM"`


##Subclass: Frame
A frame represents an event, booking, or appointment on the dayline.

**Public Properties**

- 

###Public Dayline Properties