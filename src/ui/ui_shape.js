///////////////////////////////////////////////
// ui_shape.js                               //
// For drawing basic shapes on the ui canvas //
///////////////////////////////////////////////
"use strict";

class UI_Shape
{
    constructor()
    {
        // Position
        this.x      = 0     ;
        this.y      = 0     ;

        // Line attributes
        this.x_end  = 0     ; // destination x position for lines
        this.y_end  = 0     ; // destination y position for lines

        // Circle attributes
        this.radius = 0     ;
        
        // Rounded rectangle attributes
        this.corner_radius = 5;

        // Rectangle attributes
        this.width  = 0     ; // width of rectangle types
        this.height = 0     ; // height of rectangle types

        // Common attributes
        this.line_width = ui_default_line_width;       
        this.bFill  = false ; // boolean whether to fill the shape
        this.color  = "black";
    }

} // end of class UI_Shape

class UI_Rectangle extends UI_Shape
{
    constructor(x, y, width, height, color, bFill)
    {
        super();
        this.x      = x     ;
        this.y      = y     ;
        this.width  = width ;
        this.height = height;
        this.bFill  = bFill ;
    }
    draw()
    {
        if (this.bFill)
        {
            ui_fillBox
            (
                this.x      , // x
                this.y      , // y
                this.width  , // w
                this.height , // h
                this.color  , // style
            );
        }
        else
        {
            ui_drawBox
            (
                this.x      , // x
                this.y      , // y
                this.width  , // w
                this.height , // h
                this.color  , // style
            );
        }
        
    } // end of draw()

} // end of class UI_Rectangle