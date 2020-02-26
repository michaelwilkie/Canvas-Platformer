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

/////////////////////////////////////////////////////////
//                 html_transitionMode                 //
// Function:                                           //
//     Changes style attributes of edit mode div based //
//     on the game's current mode                      //
// Return value:                                       //
//     None                                            //
/////////////////////////////////////////////////////////
function html_transitionMode()
{
    switch (gameglobals.mode)
    {
        case GAME_MODE_ENUM.PLAY_MODE:
        {
            html_div_edit_mode.innerHTML = "Play Mode";
            html_div_edit_mode.style.background = "green";
            break;
        }
        case GAME_MODE_ENUM.EDIT_MODE:
        {
            html_div_edit_mode.innerHTML = "Edit Mode";
            html_div_edit_mode.style.background = "dodgerblue";
            break;
        }
    }
}

//////////////////////////////////////////////////////////////////
//                      html_imgClickHandler                    //
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

        //////////////////////////////////////////
        // If the target wasn't already clicked //
        //////////////////////////////////////////
        if (!target.wasClicked)
        {
            var children = html_div_tileset.children;
            for (var i = 0; i < children.length; i++)
            {
                children[i].classList.remove("selected");
                children[i].wasClicked = false;
            }

            html_selectedObject = target    ;
            target.classList.add("selected");
            target.wasClicked   = true      ;
            mouseselectedentity = addTile(mousepos.x, mousepos.y, getTileByName(target.name));
            mousedif            = {x: mousepos.x - mouseselectedentity.pos.x, y: mousepos.y - mouseselectedentity.pos.y};
        }
        ////////////////////////////////////
        // The target was already clicked //
        ////////////////////////////////////
        else
        {
            game_unselectObject();
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
    if (target == null)
    {
        return;
    }
    target.style.border = html_getDefaultBorderStyle();
    target.style.zIndex = html_default_zIndex         ;
    target.wasClicked   = false                       ;
}

/////////////////////////////////////////////////////////////////
//                      html_getUniqueID                       //
// Function:                                                   //
//     Returns a unique number, increments html_unique_id by 1 //
// Return value:                                               //
//     Number                                                  //
/////////////////////////////////////////////////////////////////
function html_getUniqueID()
{
    var current_id = html_unique_id;
    html_unique_id++;
    return current_id;
}

////////////////////////////////////////////////////////
//       html_generateLayerElementString              //
// Function:                                          //
//     Returns string to create an html layer element //
// Return value:                                      //
//     String                                         //
////////////////////////////////////////////////////////
function html_generateLayerElementString(name, id)
{
    return  '<span class="layer-element">'                                 + '\n' + 
               '<i class="fa fa-minus-circle" id=' + id     + '></i>'      + '\n' + 
               '<input type="text" value="'        + name   + '"></input>' + '\n' + 
            '</span>' + '<br>';
}

////////////////////////////////////////////////////////////////
//                  html_addLayerElement                      //
// Function:                                                  //
//     Adds a canvas layer element to the list of html layers //
// Return value:                                              //
//     None                                                   //
////////////////////////////////////////////////////////////////
function html_addLayerElement()
{
    if (gameglobals.mode == GAME_MODE_ENUM.EDIT_MODE)
    {
        var layer_name  = 'layer' + layers.length;
        var layer_speed = 1;
        var layer_id    = layer_name + '_' + html_getUniqueID();

        $('#div_layers_scrollarea').append(html_generateLayerElementString(layer_name, layer_id));
        createLayer(layer_speed, layer_name);
    }
    else
    {
        $('#html_edit_mode_button').addClass('error-select');
    }
}
