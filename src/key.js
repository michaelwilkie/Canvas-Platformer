"use strict";
class Key
{
    constructor(keycode)
    {
        if (typeof keycode == "number")
        {
            this.key = keycode;
            this.name = keyCodeToChar[this.key];
            this.isPressed = false;
            this.lastPressed = false;
        }
        else
        {
            this.key = keyCharToCode[keycode];
            this.name = this.key;
            this.isPressed = false;
            this.lastPressed = false;
        }
    }    
    getName()
    {
        return this.name;
    }
}