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
    } // end if (gameglobals.mode == GAME_MODE_ENUM.EDIT_MODE)
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
    if (gameglobals.mode != GAME_MODE_ENUM.EDIT_MODE)
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

        // Now that I've hit the enter key, now I can assign this new ID to the HTML elements

        // Give the layer's html components a new id
        var new_id = element.value;
        $('#' + root_id           ).prop('id', new_id           ); // <i>
        $('#' + root_id + '_span' ).prop('id', new_id + '_span' ); // <span>
        $('#' + root_id + '_input').prop('id', new_id + '_input'); // <input>

        // Give a nice orange to black transition animation
        $('#' + element.id).removeClass('inputting');
        $('#' + element.id).addClass('enter-select');
        setTimeout(function(){$('#' + element.id).removeClass('enter-select')}, 2000);
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
//    p -> id + _span                                 //
//    input -> id + _input                            //
//    i-> id                                          //
//                                                    //
// Return value:                                      //
//     String                                         //
////////////////////////////////////////////////////////
function html_generateLayerElementString(id)
{
    return  '<p onclick="html_selectLayerElement(this)" class="layer-element" id="' + id + '_span">' + '\n' + 
               '<i class="fa fa-minus-circle tooltip" id=' + id + ' onclick="html_removeLayerElement(this.id)" title="Delete layer"></i>' + '\n' + 
               '<input type="text" spellcheck="false" onkeyup="html_changeLayerName(this)" id="' + id + '_input" value="' + id + '"></input>' + '\n' +
            '</p>';
}

////////////////////////////////////////////////////////
//           html_generateLayerInfoString             //
// Function:                                          //
//     Returns string to populate div_layer_info with //
//     information about the selected layer           //
// Return value:                                      //
//     String                                         //
////////////////////////////////////////////////////////
function html_generateLayerInfoString(layer_object)
{
    if (layer_object != null)
    {
        return '<p>' + layer_object.name + '</p>';
    }
    return null;
}

function html_objectOnClick(selected_object)
{
    playercamera.snapToEntity(selected_object.target.entity_reference);
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
function html_selectLayerElement(html_selected_layer)
{
    $("#div_layer_info").empty();
    
    // <p> have default ids of: "LayerNameHere_span"
    // So I am cutting off the _span part to get the actual layer name
    var layer_name = html_selected_layer.id.substring(0, html_selected_layer.id.length - "_span".length);

    if (DEBUG_MODE) console.log(layer_name);

    var layer_object = game_findLayer(layer_name);
    if (layer_object != null)
    {
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
    if (gameglobals.mode == GAME_MODE_ENUM.EDIT_MODE)
    {
        var layer_speed = speed;
        var layer_id    = name || 'LayerName' + '_' + html_getUniqueID(); // Either 'name' if it is not null else LayerName + unique_id

        $('#div_layers_scrollarea').append(html_generateLayerElementString(layer_id));
        createLayer(layer_speed, layer_id);
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
    if (gameglobals.mode == GAME_MODE_ENUM.EDIT_MODE)
    {
        $('#' + id + '_span').remove();
    }
    else
    {
        $('#div_edit_mode').addClass('error-select');
        setTimeout(function(){$('#div_edit_mode').removeClass('error-select')}, 2000);
    }
}