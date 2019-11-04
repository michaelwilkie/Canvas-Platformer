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
    console.log(getFont(font, fontsize));
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