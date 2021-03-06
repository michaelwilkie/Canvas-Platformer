//////////////////////////////////////
// html_func.js                     //
// Functions that modify the html   //
//////////////////////////////////////
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
//                 html_setGameMode                    //
// Function:                                           //
//     Changes style attributes of edit mode div based //
//     on the game's current mode                      //
// Return value:                                       //
//     None                                            //
/////////////////////////////////////////////////////////
function html_setGameMode(mode)
{
    switch (mode)
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
    if (gamecore.mode == GAME_MODE_ENUM.EDIT_MODE)
    {
        if (html_selected_layer != null)
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

                html_selected_object = target   ;
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
        } // end if (html_selected_layer != null)
        else
        {
            html_layersErrorAnimation();
        }
    } // end if (gamecore.mode == GAME_MODE_ENUM.EDIT_MODE)
    else
    {
        html_playErrorAnimation();
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

///////////////////////////////////////////////////////////////////
//                    html_playErrorAnimation                    //
// Function:                                                     //
//     Plays red to green animation on the div_edit_mode element //
//     If it is already doing it, it just resets it              //
// Return value:                                                 //
//     None                                                      //
///////////////////////////////////////////////////////////////////
function html_playErrorAnimation()
{
    // Give a nice red to green animation
    $('#div_edit_mode').addClass('error-select');
    setTimeout(()=>{$('#div_edit_mode').removeClass('error-select')}, 1000)
}

///////////////////////////////////////////////////////////////////
//                    html_layersErrorAnimation                  //
// Function:                                                     //
//     Plays red to green animation on the div_layers_scrollarea //
//     element
//     If it is already doing it, it just resets it              //
// Return value:                                                 //
//     None                                                      //
///////////////////////////////////////////////////////////////////
function html_layersErrorAnimation()
{
    // Give a nice red to green animation
    $('#div_layers_scrollarea').addClass('error-select');
    setTimeout(()=>{$('#div_layers_scrollarea').removeClass('error-select')}, 1000)
}

//////////////////////////////////////////////////
//              html_applyRedBorder             //
// Function:                                    //
//     Adds 'redborder' class to an html object //
// Return value:                                //
//     None                                     //
//////////////////////////////////////////////////
function html_applyRedBorder(html_object)
{
    $('#' + html_object.id).addClass('redborder');
}

/////////////////////////////////////////////////////
//              html_removeRedBorder               //
// Function:                                       //
//     Removes 'redborder' class of an html object //
// Return value:                                   //
//     None                                        //
/////////////////////////////////////////////////////
function html_removeRedBorder(html_object)
{
    $('#' + html_object.id).removeClass('redborder');
}

////////////////////////////////////////////////////////////////////////
//                     html_applySelectedLayerStyle                   //
// Function:                                                          //
//     Applies the 'selected-layer' style to the selected html object //
// Return value:                                                      //
//     None                                                           //
////////////////////////////////////////////////////////////////////////
function html_applySelectedLayerStyle(html_object)
{
    $('#' + html_object.id).addClass('selected-layer');
}

//////////////////////////////////////////////////////////////////////////
//                     html_removeSelectedLayerStyle                    //
// Function:                                                            //
//     Removes the 'selected-layer' style from the selected html object //
// Return value:                                                        //
//     None                                                             //
//////////////////////////////////////////////////////////////////////////
function html_removeSelectedLayerStyle(html_object)
{
    $('#' + html_object.id).removeClass('selected-layer');
}

////////////////////////////////////////////////
//             html_printLayerList            //
// Function:                                  //
//     Prints the list of html layer elements //
// Return value:                              //
//     None                                   //
////////////////////////////////////////////////
function html_printLayerList()
{
    var html_layer_info_array = $('#div_layer_info').children();

    console.log(html_layer_info_array);
}

//////////////////////////////////////////////////////////////
//                  html_changeLayerName                    //
// Function:                                                //
//     When the enter key is pressed, the name of the       //
//     layer, represented by this html element, is changed  //
// Return value:                                            //
//     None                                                 //
//////////////////////////////////////////////////////////////
function html_changeLayerName(element)
{
    /////////////////////////////////
    // Only permitted in edit mode //
    /////////////////////////////////
    if (gamecore.mode != GAME_MODE_ENUM.EDIT_MODE)
    {
        html_playErrorAnimation();
        return;
    }

    var root_id = null;

    if (element != null)
    {
        if (element.id != null)
        {
            // This event came from an <input> element so I would have already appended _input to its ID
            //
            // <input id="test_box_input"></input>
            //            ^^^^^^^^
            //            I just want "text_box" in this case
            //            because all the elements of a single layer share the name "text_box"
            root_id = element.id.substring(0, element.id.length - "_input".length);

            if (DEBUG_MODE) console.log("root_id: " + root_id);
        }
    }

    /////////////////////
    // I pressed enter //
    /////////////////////
    // I have no idea where 'event' is coming from
    if (keyCodeToChar[event.keyCode] == 'Enter')
    {
        // Empty strings are considered false
        if (!element.value)
        {
            alert("Layers cannot have empty names");
            return;
        }

        // Now that I've hit the enter key, I can assign this new ID to the HTML elements

        // Give the layer's html components a new id
        var new_id = element.value;
        $('#' + root_id           ).prop('id', new_id           ); // <i>
        $('#' + root_id + '_span' ).prop('id', new_id + '_span' ); // <span>
        $('#' + root_id + '_input').prop('id', new_id + '_input'); // <input>

        // Give a nice orange to black transition animation
        $('#' + element.id).removeClass('inputting');
        $('#' + element.id).addClass('enter-select');
        setTimeout(function(){$('#' + element.id).removeClass('enter-select')}, 2000);

        // Apply new name to the game object
        game_findLayer(root_id).name = new_id;
    }
    /////////////////////////////////////////////
    // Some key other than 'enter' was pressed //
    /////////////////////////////////////////////
    else
    {
        // While the values aren't the same
        if (element.value != root_id)
        {
            // Show orange background to indicate the field being modified
            $('#' + element.id).addClass('inputting');
        }
        else
        {
            // The field name matches the original so go back to normal color
            $('#' + element.id).removeClass('inputting');
            $('#' + element.id).addClass('enter-select');
            setTimeout(function(){$('#' + element.id).removeClass('enter-select')}, 2000);
        }
    }
}

////////////////////////////////////////////////////////
//         html_generateLayerElementString            //
// Function:                                          //
//     Returns string to create an html layer element //
//     IDs of each element have their html type       //
//     appended as a suffix except for <i> elements   //
//                                                    //
//    p     -> id + _span                             //
//    input -> id + _input                            //
//    i     -> id                                     //
//                                                    //
// Return value:                                      //
//     String                                         //
////////////////////////////////////////////////////////
function html_generateLayerElementString(id)
{
    return  '<p onclick="html_selectLayerElement(this)" class="layer-element" id="' + id + '_span">' + '\n' + 
               '<i class="fa fa-minus-circle tooltip" id="' + id + '" onclick="html_removeLayerElement(this.id)" title="Delete layer"></i>' + '\n' + 
               '<input type="text" spellcheck="false" onkeyup="html_changeLayerName(this)" id="' + id + '_input" value="' + id + '"></input>' + '\n' +
               '<i class="fa fa-arrow-up" id="' + id + '_uparrow" title="Move layer frontwards" onclick="html_moveLayerUp(this)"></i>' + '\n' +
               '<i class="fa fa-arrow-down" id="' + id + '_downarrow" title="Move layer backwards" onclick="html_moveLayerDown(this)"></i>' + '\n' +
            '</p>';
}

//////////////////////////////////////////////////////////////////////
//                  html_generateObjectInfoString                   //
// Function:                                                        //
//     Creates 2 column layout string with entity name as the title //
// Return value:                                                    //
//     String                                                       //
//////////////////////////////////////////////////////////////////////
function html_generateObjectInfoString(html_tile_object)
{
    return '<div class="row" id="div_object_row">' + '\n' +
               '<div class="column" id="div_object_column_left"></div>' + '\n' +
               '<div class="column" id="div_object_column_right" style="font-size: 16px">' + html_tile_object.entity_reference.name + '</div>' + '\n' +
           '</div>';
}

/////////////////////////////////////////////////////////////
//                   html_moveLayerUp                      //
// Function:                                               //
//     Reorders layer html elements, move the element that //
//     called this function up one                         //
// Return value:                                           //
//     None                                                //
/////////////////////////////////////////////////////////////
function html_moveLayerUp(html_layer_object)
{
    var layer_name  = html_layer_object.id.substring(0, html_layer_object.id.length - "_uparrow".length);
    var layer_index = game_getLayerIndexByName(layer_name);
    if (DEBUG_MODE) console.log("layer index: " + layer_index);
    if (layer_index != null)
    {
        if (layer_index < layers.length - 1)
        {
            game_swapLayers(layers[layer_index], layers[layer_index + 1]);
            html_updateLayersScrollArea();
        }
    }
}

/////////////////////////////////////////////////////////////
//                   html_moveLayerDown                    //
// Function:                                               //
//     Reorders layer html elements, move the element that //
//     called this function down one                       //
// Return value:                                           //
//     None                                                //
/////////////////////////////////////////////////////////////
function html_moveLayerDown(html_layer_object)
{
    var layer_name  = html_layer_object.id.substring(0, html_layer_object.id.length - "_downarrow".length);
    var layer_index = game_getLayerIndexByName(layer_name);
    if (layer_index != null)
    {
        if (layer_index > 0)
        {
            game_swapLayers(layers[layer_index], layers[layer_index - 1]);
            html_updateLayersScrollArea();
        }
    }
}

////////////////////////////////////////////////////////
//           html_generateLayerInfoString             //
// Function:                                          //
//     Returns string to populate div_layer_info with //
//     information about the selected layer           //
// Return value:                                      //
//     String                                         //
////////////////////////////////////////////////////////
function html_generateLayerInfoString(html_layer_object)
{
    if (html_layer_object != null)
    {
        return '<p style="float: left ; margin: 5px;">' + html_layer_object.name  + '</p>' +
               '<p style="float: right; margin: 5px;">' + 'Scroll Speed: ' + html_layer_object.speed + '</p><br><br>';
    }
    return null;
}

//////////////////////////////////////////////////////////////////////
//                       html_objectOnClick                         //
// Function:                                                        //
//     Populates the div_object_info element with information about //
//     the entity clicked in the div_layer_info element             //
// Return value:                                                    //
//     None                                                         //
//////////////////////////////////////////////////////////////////////
function html_objectOnClick(selected_object)
{
    $('#div_object_info').empty();
    var html_object = selected_object.target;

    $('#div_object_info').append(html_generateObjectInfoString(html_object));
    console.log(html_object.id);
    var clone = $('#' + html_object.id).clone(false).prop('id', html_object.id + '_object_clone'); // clone(false) means don't clone event handlers

    $('#div_object_column_left').append(clone);
    
    playercamera.snapToEntity(selected_object.target.entity_reference); // for hovering the camera over the selected object
    html_selected_object = selected_object.target;                      // for populating html elements
    mouseselectedentity  = selected_object.target.entity_reference;     // for dragging the object around
    selected_entity_pos  = game_copyPosition(mouseselectedentity.pos);  // for saving the mouse position before moving it around
}

///////////////////////////////////////////////////////////////////////
//                      html_getLayerNameFromID                      //
// Function:                                                         //
//     Trims the suffix off an html element id to get the layer name //
// Return value:                                                     //
//     String                                                        //
///////////////////////////////////////////////////////////////////////
function html_getLayerNameFromID(html_object)
{
    return html_object.id.substring(0, html_object.id.length - "_span".length);
}

/////////////////////////////////////////////////////////////////////////////////////
//                          html_selectLayerElement                                //
// Function:                                                                       //
//     Populates the div_layer_info html with information about the selected layer //
//     If the layer is found, it will loop through all the layer's entities        //
//     and then clone their html counter parts to also put in the layer info div   //
// Return value:                                                                   //
//     None                                                                        //
/////////////////////////////////////////////////////////////////////////////////////
function html_selectLayerElement(html_selected_layer_param)
{
    $("#div_layer_info").empty();
    $('#div_object_info').empty();

    // Have I already selected a layer?
    if (html_selected_layer != null)
    {
        html_removeSelectedLayerStyle(html_selected_layer);
    }
    
    // Point global variable to this newly selected layer and give it a 'selected' style
    html_selected_layer = html_selected_layer_param;
    html_applySelectedLayerStyle(html_selected_layer);

    // <p> have default ids of: "LayerNameHere_span"
    // So I am cutting off the _span part to get the actual layer name
    var layer_name = html_getLayerNameFromID(html_selected_layer);

    // Find the corresponding layer object in the layers array
    var layer_object = game_findLayer(layer_name);
    if (layer_object != null)
    {
        // forgot why I am adding this property
        $('#div_layer_info').prop('selected_layer', layer_object);

        /////////////////////////
        // Populate layer info //
        /////////////////////////
        $("#div_layer_info").append
        (
            html_generateLayerInfoString
            (
                game_findLayer(layer_name)
            )
        );

        ///////////////////////////////////////////
        // Populate entity info inside the layer //
        ///////////////////////////////////////////
        layer_object.entlist.forEach
        (
            ////////////////////////////////////
            // Find entites inside this layer //
            ////////////////////////////////////
            (entity) =>
            {
                if (entity instanceof Tile)
                {
                    var html_tileset_array = html_div_tileset.children;
                    for (var i = 0; i < html_tileset_array.length; i++)
                    {
                        ///////////////////////////////////////////////////////////////
                        // We found one if their names match                         //
                        // The html img elements have '_HTML' appended to their id's //
                        ///////////////////////////////////////////////////////////////
                        if (html_tileset_array[i].id == entity.name + "_HTML")
                        {
                            ///////////////////////////////////////////////////////////////
                            // Now I'm going to duplicate the img html element           //
                            // to get a nice visual representation of the layer contents //
                            ///////////////////////////////////////////////////////////////
                            var clone = $('#' + html_tileset_array[i].id).clone(false).prop('id', html_tileset_array[i].id + '_clone'); // clone(false) means don't clone event handlers

                            ///////////////////////////////////////////////////////////////
                            // I will also attach another reference to the html object   //
                            // for easier ad-hoc functionality (such as clicking the     //
                            // html element and focussing on it in the canvas)           //
                            ///////////////////////////////////////////////////////////////
                            clone.prop('entity_reference', entity);
                            clone.click(html_objectOnClick);

                            $('#div_layer_info').append(clone);
                        }

                    } // end for(...)

                } // end if (entity instanceof Tile)

            } // end (entity) =>

        ) // end layer_object.entlist.forEach(...)

    } // end if (layer_object != null)

} // end of html_selectLayerElement(html_selected_layer_param)

////////////////////////////////////////////////////////////////////
//                 html_updateLayersScrollArea                    //
// Function:                                                      //
//     Loops through each layer object and populates the          //
//     div_layers_scrollarea element with a list in descending in //
//     the order specified by the user                            //
// Return value:                                                  //
//     None                                                       //
////////////////////////////////////////////////////////////////////
function html_updateLayersScrollArea()
{
    $('#div_layers_scrollarea').empty();
    // Looping backwards because the last elements are the top-most ones, so
    // they will get appended first
    for (var i = layers.length - 1; i >= 0; i--)
    {
        $('#div_layers_scrollarea').append(html_generateLayerElementString(layers[i].name));
    }
}

////////////////////////////////////////////////////////////////
//                  html_addLayerElement                      //
// Function:                                                  //
//     Adds a canvas layer element to the list of html layers //
// Return value:                                              //
//     None                                                   //
////////////////////////////////////////////////////////////////
function html_addLayerElement(speed=1, name=null)
{
    //////////////////////////////////////////////////
    // Layer manipulation only allowed in edit mode //
    //////////////////////////////////////////////////
    if (gamecore.mode == GAME_MODE_ENUM.EDIT_MODE)
    {
        var layer_speed = speed;
        var layer_id    = name || 'LayerName' + '_' + html_getUniqueID(); // Either 'name' if it is not null else LayerName + unique_id

        createLayer(layer_speed, layer_id);
        html_updateLayersScrollArea();
    }
    else
    {
        html_playErrorAnimation();
    }
}

//////////////////////////////////////////////
//          html_removeLayerElement         //
// Function:                                //
//     Remove a layer element from the html //
// Return value:                            //
//     None                                 //
//////////////////////////////////////////////
function html_removeLayerElement(id)
{
    if (gamecore.mode == GAME_MODE_ENUM.EDIT_MODE)
    {
        $('#' + id + '_span').remove();
    }
    else
    {
        $('#div_edit_mode').addClass('error-select');
        setTimeout(function(){$('#div_edit_mode').removeClass('error-select')}, 2000);
    }
}