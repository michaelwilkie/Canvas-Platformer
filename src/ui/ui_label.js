////////////////////////////////////////////////////////////
// ui_label.js                                            //
//     This class is for displaying basic text on the UI. //
//     Maybe include different shapes for boundaries to   //
//     be displayed.                                      //
////////////////////////////////////////////////////////////
"use strict";

class UI_Label
{
    constructor(text, x, y, width, height, 
    font             = ui_default_font, 
    fontsize         = ui_default_fontsize, 
    text_color       = ui_default_text_color, 
    background_color = ui_default_background_color)
    {
        this.text             = text            ;
        this.x                = x               ;
        this.y                = y               ;
        this.width            = width           ;
        this.height           = height          ;
        this.font             = font            ;
        this.fontsize         = fontsize        ;
        this.text_color       = text_color      ;
        this.background_color = background_color;
    }
    setText(text)
    {
        this.text = text;
    }
    draw(xoffset=0, yoffset=0)
    {
        fillBox
        (
            this.x + xoffset, 
            this.y + yoffset, 
            this.width, 
            this.height, 
            this.background_color
        );
        
        drawText
        (
            this.text, 
            (this.x + 50) + xoffset, 
            (this.y + 50) + yoffset, 
            this.text_color, 
            "center", 
            this.font, 
            this.fontsize
        );
    }
    update()
    {
        
    }
}