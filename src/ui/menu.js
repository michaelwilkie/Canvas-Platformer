/////////////////////////////////////////////////////////////////////////////
// menu.js                                                                 //
//     Base class for UI items.                                            //
//     This won't be as option-heavy as the base Entity class is for       //
//     interactive objects. Each menu may vary greatly in aesthetics. This //
//     should allow some flexibility in how menus are handled by requiring //
//     the subclasses to do more of the work and the super class to merely //
//     be an interface to adhere to.                                       //
//                                                                         //
// Related functions:                                                      //
//     ctx.fillText(text, x, y);                                           //
/////////////////////////////////////////////////////////////////////////////
"use strict";

class Menu
{
    constructor(title, x, y, w, h)
    {
        this.x      =     x;
        this.y      =     y;
        this.width  =     w;
        this.height =     h;
        this.title  = title;
        this.menuitems = [];
        this.font = "30px Arial";
    }
    addMenuItem(menuitem)
    {
        this.menuitems.push(menuitem);
    }
}