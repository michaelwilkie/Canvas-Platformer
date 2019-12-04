////////////////////////////////////////////////////////
// ui_func.js                                         //
//     Functions for interacting with the UI that the //
//     UI classes will use.                           //
////////////////////////////////////////////////////////
"use strict";

/////////////////////////////////////////////////////////
//                        ui                           //
// Function:                                           //
//     Main loop that draws all the canvas elements.   //
//     It is called repeatedly from CanvasPlatformer() //
//     in the initialize.js file.                      //
// Return value:                                       //
//     none                                            //
/////////////////////////////////////////////////////////
function ui()
{
    for (var i = 0; i < ui_component_list.length; i++)
    {
        ui_component_list[i].draw();
        ui_component_list[i].update();
    }

    mlastdown = mdown; // putting this here in case I have the game paused so I can still register 'press' vs 'unpress' mouse events
}
////////////////////////////////////////////////////////////
//                       getFont                          //
// Function:                                              //
//     Formats the given parameters in the following way: //
//         "XXpx WWWWW"                                   //
//     Where XX is a number representing font size        //
//     and WWWW is text representing font style           //
// Return value:                                          //
//     string                                             //
////////////////////////////////////////////////////////////
function getFont(font, fontsize)
{
    var base_10 = 10;
    return fontsize.toString(base_10) + "px" + " " + font;
}
////////////////////////////////////////////////////////////////
//                      prepareContext                        //
// Function:                                                  //
//     Replaces the default UI variables with the parameters. //
// Return value:                                              //
//     none                                                   //
////////////////////////////////////////////////////////////////
function prepareContext(font, fontsize, text_color, background_color)
{
    ui_font             = font            ;
    ui_fontsize         = fontsize        ;
    ui_text_color       = text_color      ;
    ui_background_color = background_color;

    return;
}
///////////////////////////////////////////////////////////////////////
//                           setFillColor                            //
// Function:                                                         //
//     Updates the ui_ctx with a new fill style specified by 'color' //
// Return value:                                                     //
//     none                                                          //
///////////////////////////////////////////////////////////////////////
function setFillColor(color)
{
    ui_ctx.fillStyle = color;
    return;
}

//////////////////////////////////////////////////////////////////////////////////////////
//                                     drawText                                         //
// Function:                                                                            //
//     Draws text at an absolute position (not relative position like in game objects). //
// Return value:                                                                        //
//     none                                                                             //
//////////////////////////////////////////////////////////////////////////////////////////
function drawText(text, x, y, color, alignment="center", font, fontsize)
{
    if (DEBUG_MODE)  console.log(getFont(font, fontsize));
    ui_ctx.font = getFont(font, fontsize);
    ui_ctx.fillStyle = color;
    ui_ctx.textAlign = alignment;
    ui_ctx.fillText(text, x, y);

    return;
}

///////////////////////////////////////////////////////////////////////
//                             drawBox                               //
// Function:                                                         //
//     Draws a box with a specified position, dimensions, and style. //
// Return value:                                                     //
//     none                                                          //
///////////////////////////////////////////////////////////////////////
function drawBox(x, y, w, h, style)
{
    ui_ctx.strokeStyle = style;
    ui_ctx.beginPath();
    ui_ctx.rect(x, y, w, h);
    ui_ctx.stroke();

    return;
}

////////////////////////////////////////////////////////////////////
//                       invertedClearRect                        //
// Function:                                                      //
//     Clears everything outside of a given rectangle.            //
//     +---------------------------------+                        //
//     |                1                |                        //
//     |                                 |                        //
//     |------#============#-------------|                        //
//     |   3  || rectangle||      4      |                        //
//     |      ||          ||             |                        //
//     |------#============#-------------|                        //
//     |                                 |                        //
//     |                                 |                        //
//     |                2                |                        //
//     |                                 |                        //
//     |                                 |                        //
//     +---------------------------------+                        //
//                                                                //
// Box 1 is only disqualified if rect.y <= 0                      //
// Box 2 is only disqualified if rect.y + rect.h >= SCREEN_HEIGHT //
// Box 3 is only disqualified if rect.x <= 0                      //
// Box 4 is only disqualified if rect.x + rect.w >= SCREEN_WIDTH  //
//     Parts 1, 2, 3, 4 will be cleared                           //
// Return value:                                                  //
//     none                                                       //
////////////////////////////////////////////////////////////////////
function invertedClearRect(x, y, w, h)
{
    var rect1 = {x: 0    , y: 0    , w: SCREEN_WIDTH          , h: y                       };
    var rect2 = {x: 0    , y: y + h, w: SCREEN_WIDTH          , h: SCREEN_HEIGHT - (y + h) };
    var rect3 = {x: 0    , y: y    , w: x                     , h: h                       };
    var rect4 = {x: x + w, y: y    , w: SCREEN_WIDTH - (x + w), h: h                       };

    if (y > 0)                  { ui_ctx.clearRect(rect1.x, rect1.y, rect1.w, rect1.h); }
    if (y + h < SCREEN_HEIGHT)  { ui_ctx.clearRect(rect2.x, rect2.y, rect2.w, rect2.h); }
    if (x > 0)                  { ui_ctx.clearRect(rect3.x, rect3.y, rect3.w, rect3.h); }
    if (x + w < SCREEN_WIDTH)   { ui_ctx.clearRect(rect4.x, rect4.y, rect4.w, rect4.h); }
}

///////////////////////////////////////////////////////////////////////////////////////
//                                   fillBox                                         //
// Function:                                                                         //
//     Fills the contents of a box with a specified position, dimensions, and style. //
// Return value:                                                                     //
//     none                                                                          //
///////////////////////////////////////////////////////////////////////////////////////
function fillBox(x, y, w, h, style)
{
    ui_ctx.fillStyle = style;
    ui_ctx.fillRect(x, y, w, h);

    return;
}