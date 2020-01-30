//////////////////////////////////////////////////
// html_func.js                                 //
// Functions related to html modifying elements //
//////////////////////////////////////////////////
"use strict";

////////////////////////////////////////////////////////////////
//                    getDefaultBorderStyle                   //
// Function:                                                  //
//     Returns the string containing the default border style //
// Return value:                                              //
//     String                                                 //
////////////////////////////////////////////////////////////////
function html_getDefaultBorderStyle()
{
    // Avoiding any 'return statement ignores stuff after newline' shenanigans
    // by building the string in a variable first
    var return_value = html_default_border_size  + " " 
                     + html_default_border_style + " "
                     + html_default_border_color;
    return return_value;
}

//////////////////////////////////////////////////////////////////
//                      clickHandler                            //
// Function:                                                    //
//     For selecting the tile on the html instead of the canvas //
//     Sets the outline to be red and places it in front of all //
//     the other tiles surrounding it so you can see the red    //
//     border                                                   //
// Return value                                                 //
//     None                                                     //
//////////////////////////////////////////////////////////////////
function html_imgClickHandler(event)
{
    if (gameglobals.mode == GAME_MODE_ENUM.EDIT_MODE)
    {
        event = event || window.event;
        var target = event.target || event.srcElement;

        var html_tileset_element = document.getElementById("div_tileset");

        var children = html_tileset_element.children;
        for (var i = 0; i < children.length; i++)
        {
            children[i].style.border = html_getDefaultBorderStyle();
            children[i].style.zIndex = html_default_zIndex         ;
            children[i].wasClicked   = false                       ;
        }

        //////////////////////////////////////////
        // If the target wasn't already clicked //
        //////////////////////////////////////////
        if (!target.wasClicked)
        {
            html_selectedObject = target         ;
            target.style.border = "2px solid red";
            target.style.zIndex = 2              ;
            target.wasClicked   = true           ;
            mouseselectedentity = addTile(mousepos.x, mousepos.y, getTileByName(target.name));
            mousedif            = {x: mousepos.x - mouseselectedentity.pos.x, y: mousepos.y - mouseselectedentity.pos.y};
        }
        ////////////////////////////////////
        // The target was already clicked //
        ////////////////////////////////////
        else
        {
            html_selectedObject = null         ;
            mouseselectedentity = null         ;
            html_applyDefaultStyleToImg(target);
        }
    }
}

///////////////////////////////////////////////////
//         html_applyDefaultStyleToImg           //
// Function:                                     //
//     Sets the attributes of an <img> element   //
//     to the defaults found in the html_globals //
//     file                                      //
// Return value:                                 //
//     None                                      //
///////////////////////////////////////////////////
function html_applyDefaultStyleToImg(target)
{
    target.style.border = html_getDefaultBorderStyle();
    target.style.zIndex = html_default_zIndex         ;
    target.wasClicked   = false                       ;
}