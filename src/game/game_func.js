////////////////////////////////////////////////////////////////
// platformer_func.js                                         //
//     Contains most of the functions used for game physics.  //
//     Called by CanvasPlatformer() function in initialize.js //
////////////////////////////////////////////////////////////////
"use strict";

function game()
{
    // Draw the sky
    game_drawBackgroundColor();
    
    // Wait for all images and sounds to be loaded in before attempting to play
    if(!image_all_loaded && !sound_all_loaded)
    {
        image_all_loaded = image_allImagesLoaded();
    }
    else
    {
        if (keyhandler.isPressed("`"))
        {
            if (DEBUG_MODE) console.log("Key: '~' pressed");
            game_transitionMode();
        }
        switch (gamecore.mode)
        {
            case GAME_MODE_ENUM.PLAY_MODE:
            {
                for (var i = 0; i < layers.length; i++)
                {
                    layers[i].draw(playercamera);
                    layers[i].update();
                }
                break;
            }
        
            case GAME_MODE_ENUM.EDIT_MODE:
            {
                handleEditModeControls();

                for (var i = 0; i < layers.length; i++)
                {
                    layers[i].draw(playercamera);
                }

                if (mouseselectedentity != null)
                {
                    mouseselectedentity.draw(playercamera, html_findLayerObjectFromSelectedLayer().speed); // selected layer id contains _span suffix
                }

                game_drawLevelBoundary();

                break;
            }
        }

        // Obtain a copy of previously pressed keys to detect any key-press changes for the next frame
        keyhandler.updateLastKeypress();

        // Adjust camera according to mode
        playercamera.update(gamecore.mode == GAME_MODE_ENUM.EDIT_MODE);
    }
}

////////////////////////////////////////////////////////////
//                  handleEditModeControls                //
// Function:                                              //
//     Contains the code that handles user input specific //
//     to the edit mode component                         //
// Return value:                                          //
//     None                                               //
////////////////////////////////////////////////////////////
function handleEditModeControls()
{
    if (keyhandler.isPressed("Escape"))
    {
        if (mouseselectedentity != null)
        {
            game_unselectObject();
        }
    }

    if (keyhandler.isDown("Up"    )) { playercamera.moveUp   (); }
    if (keyhandler.isDown("Down"  )) { playercamera.moveDown (); }
    if (keyhandler.isDown("Left"  )) { playercamera.moveLeft (); }
    if (keyhandler.isDown("Right" )) { playercamera.moveRight(); }
    if (keyhandler.isDown("Delete")) 
    {
        if (mouseselectedentity != null)
        {
            game_deleteSelectedObject();
        }
    }
}

//////////////////////////////////////////////
//           game_transitionMode            //
// Function:                                //
//     Toggles the gamecore mode            //
//     Calls html_transitionMode afterwards //
// Return value:                            //
//     None                                 //
//////////////////////////////////////////////
function game_transitionMode()
{
    switch (gamecore.mode)
    {
        case GAME_MODE_ENUM.PLAY_MODE:
        {
            if (DEBUG_MODE) console.log("Edit mode");
            gamecore.mode = GAME_MODE_ENUM.EDIT_MODE;
            break;
        }
        case GAME_MODE_ENUM.EDIT_MODE:
        {
            if (DEBUG_MODE) console.log("Play mode");
            gamecore.mode = GAME_MODE_ENUM.PLAY_MODE;
            break;
        }
    }
    html_setGameMode(gamecore.mode);
    game_unselectObject();
}

//////////////////////////////////////////////////////////
//                   game_setGameMode                   //
// Function:                                            //
//     Sets the game mode based on the 'mode' parameter //
// Return value:                                        //
//     None                                             //
//////////////////////////////////////////////////////////
function game_setGameMode(mode)
{
    switch (mode)
    {
        case GAME_MODE_ENUM.PLAY_MODE:
        {
            if (DEBUG_MODE) console.log("Play mode");
            gamecore.mode = GAME_MODE_ENUM.PLAY_MODE;
            break;
        }
        case GAME_MODE_ENUM.EDIT_MODE:
        {
            if (DEBUG_MODE) console.log("Edit mode");
            gamecore.mode = GAME_MODE_ENUM.EDIT_MODE;
            break;
        }
    }
    html_setGameMode(mode);
}

//////////////////////////////////////////////////////
//             game_drawBackgroundColor             //
// Function:                                        //
//     Draws background color to the game canvas    //
// Return value:                                    //
//     None                                         //
//////////////////////////////////////////////////////
function game_drawBackgroundColor()
{
    game_ctx.beginPath();
    game_ctx.rect(0, 0, game_canvas.width, game_canvas.height);
    game_ctx.fillStyle = game_sky_color;
    game_ctx.fill();
}

//////////////////////////////////////////
//        game_drawLevelBoundary        //
// Function:                            //
//     Draws a red box around the level //
// Return value:                        //
//     none                             //
//////////////////////////////////////////
function game_drawLevelBoundary()
{
    game_drawBox
    (
        -playercamera.x , // x
        -playercamera.y , // y
        level.width     , // width
        level.height    , // height
        "red"             // color
    );
}

///////////////////////////////////////////////////////////////////////
//                             drawBox                               //
// Function:                                                         //
//     Draws a box with a specified position, dimensions, and style. //
// Return value:                                                     //
//     none                                                          //
///////////////////////////////////////////////////////////////////////
function game_drawBox(x, y, w, h, style, line_width=2)
{
    var old_width       = game_ctx.lineWidth;
    var old_style       = game_ctx.strokeStyle;
    game_ctx.strokeStyle= style;
    game_ctx.lineWidth  = line_width;

    game_ctx.beginPath();
    game_ctx.rect(x, y, w, h);    
    game_ctx.stroke();
    game_ctx.closePath();

    game_ctx.lineWidth  = old_width;
    game_ctx.strokeStyle= old_style;

    return;
}

/////////////////////////////////////////////////////////////////////////////
//                        game_isEntityInSelectedLayer                     //
// Function:                                                               //
//     Determines if the parameter is in the currently selected html layer //
// Return value:                                                           //
//     boolean                                                             //
/////////////////////////////////////////////////////////////////////////////
function game_isEntityInSelectedLayer(entity)
{
    if (html_selected_layer == null)
    {
        return false;
    }
    else
    {
        ////////////////////////////////////////////////////////////////
        // 1. Find the layer the entity is in                         //
        // 2. Compare if that layer is the same as the selected layer //
        ////////////////////////////////////////////////////////////////
        var layer_object = null;
        var found_layer = false;

        for (var index_layers = 0; index_layers < layers.length; index_layers++)
        {
            var layer = layers[index_layers];
            for (var index_entlist = 0; index_entlist < layer.entlist.length; index_entlist++)
            {
                if (entity == layer.entlist[index_entlist])
                {
                    layer_object = layer;
                    found_layer = true;
                    break;
                }
            }

            if (found_layer)
            {
                break;
            }
        }

        // The entity was not found in any layer
        if (null == layer_object)
        {
            return false;
        }
        else
        {
            return layer_object == html_findLayerObjectFromSelectedLayer();
        }

    } // end of else (of if (html_selected_layer == null) )

} // end of game_isEntityInSelectedLayer(entity)

//////////////////////////////////////////////////////
//              game_unselectObject                 //
// Function:                                        //
//     Releases any object being held by mouse      //
//     Resets html attributes of any selected tile  //
// Return value:                                    //
//     None                                         //
//////////////////////////////////////////////////////
function game_unselectObject()
{
    html_applyDefaultStyleToImg(html_selected_object);
    if (mouseselectedentity != null)
    {
        // Don't want the entity to remove itself from the entlist if I'm just unselecting it
        // mouseselectedentity.killSelf();
    }
    mouseselectedentity = null;
    html_selected_object = null;

    // Edit mode component on the UI canvas has been disabled, so this line is commented out
    // ui_edit_mode_component.scroll_component.selectedObject = null;
}

//////////////////////////////////////////////////
//           game_deleteSelectObject            //
// Function:                                    //
//     Deletes any object being held by mouse   //
//     Deletes all html elements related to it  //
//     Removes it from the layer associated     //
// Return value:                                //
//     None                                     //
//////////////////////////////////////////////////
function game_deleteSelectedObject()
{
    html_applyDefaultStyleToImg(html_selected_object);
    if (mouseselectedentity != null)
    {
        // Delete the object
        mouseselectedentity.killSelf();
    }

    // Let go of the reference of the used-to-be object
    mouseselectedentity = null;
    html_selected_object = null;
    
    // Edit mode component on the UI canvas has been disabled, so this line is commented out
    // ui_edit_mode_component.scroll_component.selectedObject = null;

    // Show this object has been removed by refreshing the html layer object
    html_selectLayerElement(html_selected_layer);
}

//////////////////////////////////////////////////////////////
//                 game_getLayerIndexByName                 //
// Function:                                                //
//     Returns the index a layer is inside the layers array //
// Return value:                                            //
//     Number of null                                       //
//////////////////////////////////////////////////////////////
function game_getLayerIndexByName(name)
{
    // Calling game_findLayer is unnecessary for the functionality of this function
    // but it does help with error checking
    var layer = game_findLayer(name);
    for (var i = 0; i < layers.length; i++)
    {
        if (layer.name == layers[i].name)
        {
            return i;
        }
    }
    
    return null;
}

//////////////////////////////////////////////////////////////////////////////////////////
//                              game_parseLevelString                                   //
// Function:                                                                            //
//     Creates a level based on the string attained from the save level textarea popup  //
// Return value:                                                                        //
//     None                                                                             //
//////////////////////////////////////////////////////////////////////////////////////////
function game_parseLevelString(strLevelList)
{
    var line = null;

    // Empty the global variable lists
    // so we can load a brand new level
    game_emptyGlobalLists();

    for (var i = 0; i < strLevelList.length; i++)
    {
        line = strLevelList[i];

        // All classnames will start with upper case
        // This makes it easier to add new classes and not come back here to accommodate
        if (line[0] == line[0].toUpperCase())
        {
            i = game_createClassByString(strLevelList, i);
        }
        else
        {
            console.log("Error (line " + (i + 1) + "): property without associated classname found");
        }
    }

    // Update the Layers area in the HTML
    html_updateLayersScrollArea();
}

//////////////////////////////////////////////////////////////////////////////////////////
//                              game_createClassByString                                //
// Function:                                                                            //
//     Creates an object based on the strLevelList[0]                                   //
//     It returns the number of attributes modified before reaching the end of the list //
//     or if it sees another class name                                                 //
// Return value:                                                                        //
//     Number                                                                           //
//////////////////////////////////////////////////////////////////////////////////////////
function game_createClassByString(strLevelList, strLevelList_index_param)
{
    var strLevelList_index  = strLevelList_index_param;
    var class_name          = strLevelList[strLevelList_index];
    var argument_list       = [];
    var game_object         = {};
    var i                   = strLevelList_index + 1;
    console.log(class_name);
    for (; i < strLevelList.length; i++)
    {
        var line = strLevelList[i];
        if (line == "")
        {
            continue;
        }
        if (line[0] != line[0].toUpperCase())
        {
            argument_list = line.split(" ");

            if (argument_list.length > 1)
            {
                game_object[argument_list[0]] = game_convertData(argument_list[1]);
            }
            else
            {
                // Since there's only 1 element in this line, it's the name of another object
                var sub_object = argument_list[0];

                // Create the object
                game_object[sub_object] = {};

                // Apply the two properites one at a time

                // First property:
                // Go to the next line
                i++;
                line = strLevelList[i];
                argument_list = line.split(" ");

                // ex: xpos 5
                // arg[0] = xoffset
                // arg[1] = 5
                // game_object.collider.xoffset = 5
                game_object[sub_object][argument_list[0]] = game_convertData(argument_list[1]);
                
                // Second property:
                // Go to the next line
                i++;
                line = strLevelList[i];
                argument_list = line.split(" ");

                game_object[sub_object][argument_list[0]] = game_convertData(argument_list[1]);

                // the collider object has 4 properties
                if (sub_object == "collider")
                {
                    // Third property:
                    // Go to the next line
                    i++;
                    line = strLevelList[i];
                    argument_list = line.split(" ");

                    game_object[sub_object][argument_list[0]] = game_convertData(argument_list[1]);

                    // Fourth property:
                    // Go to the next line
                    i++;
                    line = strLevelList[i];
                    argument_list = line.split(" ");

                    game_object[sub_object][argument_list[0]] = game_convertData(argument_list[1]);

                } // end of if (sub_object == "collider")

            } // end of else (of if (argument_list.length > 1))

        } // end of if (line[0] != line[0].toUpperCase())
        else
        {
            // A new object was found
            break;
        }
    } // end of for (...)
    
    var new_game_object = game_createObjectFromAnotherObject(class_name, game_object);

    // Pushing the objects in their configured layers
    if (new_game_object instanceof Entity)
    {
        new_game_object.setLayerByIndex(game_object.layer);
        pushToLayer(new_game_object, new_game_object.layer_name);

        // Special case for player object
        if (new_game_object instanceof Player)
        {
            player = new_game_object;
            playercamera.followEntity(new_game_object);
        }
    }
    else if (new_game_object instanceof Layer)
    {
        // Layers are added to the layers list upon creation
    }
    else if (new_game_object instanceof Level)
    {
        level = new_game_object;
        level.setWidth(game_object.width);
        level.setHeight(game_object.height);
    }

    // returning the index so the calling function knows where to proceed in the text file
    // subtracting 1 because the caller of this function has yet to increment its for loop counter
    return i - 1;
}

///////////////////////////////////////////
//          game_emptyGlobalLists        //
// Function:                             //
//     Empties the global variable lists //
// Return value:                         //
//     None                              //
///////////////////////////////////////////
function game_emptyGlobalLists()
{
    layers = [];
    entlist = [];
}

//////////////////////////////////////////////
//             game_swapLayers              //
// Function:                                //
//     Switches 2 layers in the layers list //
// Return value:                            //
//     None                                 //
//////////////////////////////////////////////
function game_swapLayers(layer1, layer2)
{
    if (DEBUG_MODE) console.log("Attempting to swap");
    var index1 = null;
    var index2 = null;
    for (var i = 0; i < layers.length; i++)
    {
        if (layer1 == layers[i])
        {
            index1 = i;
            break;
        }
    }
    for (var i = 0; i < layers.length; i++)
    {
        if (layer2 == layers[i])
        {
            index2 = i;
            break;
        }
    }
    if (index1 != null && index2 != null)
    {
        // Tell all entities their index to the layers list has changed
        layers[index1].entlist.forEach((ent) => ent.layer = index2);
        layers[index2].entlist.forEach((ent) => ent.layer = index1);

        var temp = layers[index1];
        layers[index1] = layers[index2];
        layers[index2] = temp;
    }

    entlist.forEach((ent)=>ent.updateLayerIndex());

    return;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      Snapping a selected tile to the grid lines represented by the '+' symbols:                           //
//                                                                                                           //
//      1.  Calculate how many + symbols I am from the origin (0,0)                                          //
//          Distance between + symbols is GRID_TIGHTNESS                                                     //
//          The number of + symbols from x axis is (mousepos.x / GRID_TIGHTNESS)                             //
//          The number of + symbols from y axis is (mousepos.y / GRID_TIGHTNESS)                             //
//                                                                                                           //
//      2.  Calculate how many + symbols the camera is from the origin (0,0)                                 //
//          Distance between + symbols is GRID_TIGHTNESS                                                     //
//          The number of + symbols from x axis is (playercamera.x / GRID_TIGHTNESS)                         //
//          The number of + symbols from y axis is (playercamera.y / GRID_TIGHTNESS)                         //
//                                                                                                           //
//      3.  Calculate relative position of cursor                                                            //
//          Cursor's relative x position: cursor_grid_multiples_x * GRID_TIGHTNESS                           //
//          Cursor's relative y position: cursor_grid_multiples_y * GRID_TIGHTNESS                           //
//                                                                                                           //
//      4.  Calculate relative position of camera                                                            //
//          Camera's relative x position: camera_grid_multiples_x * GRID_TIGHTNESS                           //
//          Camera's relative y position: camera_grid_multiples_y * GRID_TIGHTNESS                           //
//                                                                                                           //
//      5.  Add relative position of camera and the scaled position of cursor                                //
//          Resulting x position: (cursor_relative_position_x / camera_scale_x) + camera_relative_position_x //
//          Resulting y position: (cursor_relative_position_y / camera_scale_y) + camera_relative_position_y //
//      +-----------------------level---------------------------+                                            //
//      |   +   +   +   +   +   +   +   +   +   +   +   +   +   |                                            //
//      |   +   +   +   +   +   +   +   +   +   +   +   +   +   |                                            //
//      |   +   +   +---camera---+  +   +   +   +   +   +   +   |                                            //
//      |   +   +   |  o    +   +|  +   +   +   +   +   +   +   |                                            //
//      |   +   +   | cursor+   +|  +   +   +   +   +   +   +   |                                            //
//      |   +   +   |   +   +   +|  +   +   +   +   +   +   +   |                                            //
//      |   +   +   +------------+  +   +   +   +   +   +   +   |                                            //
//      |   +   +   +   +   +   +   +   +   +   +   +   +   +   |                                            //
//      |   +   +   +   +   +   +   +   +   +   +   +   +   +   |                                            //
//      |   +   +   +   +   +   +   +   +   +   +   +   +   +   |                                            //
//      |   +   +   +   +   +   +   +   +   +   +   +   +   +   |                                            //
//      |   +   +   +   +   +   +   +   +   +   +   +   +   +   |                                            //
//      +-------------------------------------------------------+                                            //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function game_calculateRelativeMousePosition()
{
    var layer_speed = html_findLayerObjectFromSelectedLayer().speed;

    var cursor_grid_multiples_x     = Math.floor(mousepos.x     / GRID_TIGHTNESS / layer_speed);
    var cursor_grid_multiples_y     = Math.floor(mousepos.y     / GRID_TIGHTNESS / layer_speed);

    var camera_grid_multiples_x     = Math.floor(playercamera.x / GRID_TIGHTNESS / layer_speed);
    var camera_grid_multiples_y     = Math.floor(playercamera.y / GRID_TIGHTNESS / layer_speed);
    
    var camera_scale_x              = playercamera.zoomx;
    var camera_scale_y              = playercamera.zoomy;

    var camera_relative_position_x  = (camera_grid_multiples_x * GRID_TIGHTNESS * layer_speed * layer_speed); // I don't know why I need to square layer_speed
    var camera_relative_position_y  = (camera_grid_multiples_y * GRID_TIGHTNESS * layer_speed * layer_speed); // I don't know why I need to square layer_speed

    var cursor_relative_position_x  = (cursor_grid_multiples_x * GRID_TIGHTNESS * layer_speed);
    var cursor_relative_position_y  = (cursor_grid_multiples_y * GRID_TIGHTNESS * layer_speed);

    var new_x                       = (cursor_relative_position_x / camera_scale_x) + camera_relative_position_x;
    var new_y                       = (cursor_relative_position_y / camera_scale_y) + camera_relative_position_y;

    return {x: new_x, y: new_y};
}

///////////////////////////////////////////////////
//                  createLayer                  //
// Function:                                     //
//     Creates a Layer object and pushes it onto //
//     the layers array                          //
// Return value:                                 //
//     Layer object                              //
///////////////////////////////////////////////////
function createLayer(layerspeed, layername)
{
    var obj = new Layer(layerspeed, layername);
    layers.push(obj);
    return obj;
}

/////////////////////////////////////////////////////
//                  pushToLayer                    //
// Function:                                       //
//     Searches the layers array for a layer whose //
//     .name property matches 'layername'          //
// Return value:                                   //
//     None                                        //
/////////////////////////////////////////////////////
function pushToLayer(ent, layer_name)
{
    var layer_object = game_findLayer(layer_name);
    if (layer_object != null)
    {
        ent.layer_name = layer_object.name;
        layer_object.push(ent);
    }

    ent.updateLayerIndex();

    return;
}

////////////////////////////////////////////////////////
//                  game_findLayer                    //
// Function:                                          //
//     Returns layer given a layer name, if it exists //
//     Null is returned otherwise                     //
// Return value:                                      //
//     Layer object or null                           //
// Throws:                                            //
//     "Could not find 'layername'"                   //
////////////////////////////////////////////////////////
function game_findLayer(layer_name)
{
    var return_value = null;
    var found_layer = false;
    
    layers.forEach
    (
        (layer_object) =>
        {
            if (layer_object.name == layer_name)
            {
                found_layer = true;
                return_value = layer_object;

                // using 'return' here to break out of the lambda function, not the game_findLayer function
                return;
            }
        }
    );
    if (!found_layer)
    {
        throw "Could not find layer '" + layer_name + "'";
    }

    return return_value;
}

/////////////////////////////////////////
//        game_findLayerByObject       //
// Function:                           //
//     Finds the layer an entity is in //
// Return value:                       //
//     Entity object or null           //
/////////////////////////////////////////
function game_findLayerByObject(entity_object_param)
{
    for (var layer_object_index = 0; layer_object_index < layers.length; layer_object_index++)
    {
        var layer_object = layers[layer_object_index];
        for (var i = 0; i < layer_object.entlist.length; i++)
        {
            var entity_object = layer_object.entlist[i];
            if (entity_object == entity_object_param)
            {
                return layer_object;
            }
        }
    }
    return null;
}

//////////////////////////////////////////////////
//               game_copyPosition              //
// Function:                                    //
//     Copies position from sourceVector        //
//     Deliberately avoiding copying references //
//                                              //
//     Requires sourceVector have members:      //
//     {x: Number, y: Number}                   //
// Return value:                                //
//     None                                     //
//////////////////////////////////////////////////
function game_copyPosition(sourceVector)
{
    return {x: sourceVector.x, y: sourceVector.y};
}

///////////////////////////////////////////////////////////////
//                   game_restorePosition                    //
// Function:                                                 //
//     Restores the position of an entity moved by the mouse //
// Return value:                                             //
//     None                                                  //
///////////////////////////////////////////////////////////////
function game_restoreSelectedEntityPosition(ent)
{
    // Restore the position if we don't move it to a new spot
    if (selected_entity_pos != null)
    {
        ent.pos = game_copyPosition(selected_entity_pos);
    }
    
    selected_entity_pos = null;
}

///////////////////////////////////////////////////////////////
//              game_saveSelectedEntityPosition              //
// Function:                                                 //
//     Restores the position of an entity moved by the mouse //
// Return value:                                             //
//     None                                                  //
///////////////////////////////////////////////////////////////
function game_saveSelectedEntityPosition(ent)
{
    // Save the position before we move it
    if (selected_entity_pos == null)
    {
        selected_entity_pos = game_copyPosition(ent.pos);
    }
}

///////////////////////////////////////////////////////////
//              game_createObjectFromType                //
// Function:                                             //
//     Given a type, it creates the corresponding object //
// Return value:                                         //
//     One of the following: Tile, Wall, Player,         //
//     Goal, Particle, Puck, Entity, Enemy               //
///////////////////////////////////////////////////////////
function game_createObjectFromType(string_type, x=0, y=0, tilename=null, bCreateOrphan=false)
{
    var return_object = null;

    if (typeof string_type != 'string')
    {
        throw "Invalid string: " + string_type + ", it's a type: " + typeof string_type;
    }
    switch(string_type.toLowerCase())
    {
        case 'level':
        {
            return_object = addLevel();
            break;
        }
        case 'layer':
        {
            return_object = createLayer();
            break;
        }
        case 'player':
        {
            return_object = addPlayer(x, y);
            break;
        }
        case 'entity':
        {
            return_object = addEntity(x, y);
            break;
        }
        case 'tile':
        {
            return_object = addTile(x, y, getTileByName(tilename));
            break;
        }
        case 'wall':
        {
            return_object = addWall(x, y, null , null, null);
            break;
        }
        case 'trigger':
        {
            return_object = addTrigger(x, y);
            break;
        }
        case 'goal':
        {
            console.log("Goal creation not currently implemented");
            break;
        }
        case 'enemy':
        {
            console.log("Enemy creation not currently implemented");
            break;
        }
    } // end of switch()

    return return_object;
} // end of game_createObjectFromType()

///////////////////////////////////////////////////////////
//          game_createObjectFromAnotherObject           //
// Function:                                             //
//     Given a type, it creates the corresponding object //
// Return value:                                         //
//     One of the following: Tile, Wall, Player,         //
//     Goal, Particle, Puck, Entity, Enemy               //
///////////////////////////////////////////////////////////
function game_createObjectFromAnotherObject(string_type, game_object)
{
    var return_object = null;

    if (typeof string_type != 'string')
    {
        throw "Invalid string: " + string_type + ", it's a type: " + typeof string_type;
    }
    switch(string_type.toLowerCase())
    {
        case 'level':
        {
            return_object = addLevel();
            break;
        }
        case 'layer':
        {
            return_object = createLayer(game_object.speed, game_object.name);
            break;
        }
        case 'player':
        {
            return_object = addPlayer(game_object.pos.x, game_object.pos.y);
            break;
        }
        case 'entity':
        {
            return_object = addEntity(game_object.pos.x, game_object.pos.y);
            break;
        }
        case 'tile':
        {
            return_object = addTile(game_object.pos.x, game_object.pos.y, getTileByName(game_object.name));
            break;
        }
        case 'wall':
        {
            return_object = addWall(game_object.pos.x, game_object.pos.y, game_object.width , game_object.height, game_object.imgsrc);
            break;
        }
        case 'trigger':
        {
            return_object = addTrigger(game_object.pos.x, game_object.pos.y);
            break;
        }
        case 'goal':
        {
            console.log("Goal creation not currently implemented");
            break;
        }
        case 'enemy':
        {
            console.log("Enemy creation not currently implemented");
            break;
        }
    } // end of switch()

    return return_object;
} // end of game_createObjectFromAnotherObject()

//////////////////////////////////////////////////
//                getTileByName                 //
// Function:                                    //
//     Searches tileset array and returns the   //
//     element with the matching .name property //
//                                              //
//     null is returned otherwise               //
// Return value:                                //
//     Tileset element                          //
//     {name: x: y: w: h:}                      //
//////////////////////////////////////////////////
function getTileByName(name)
{
    var return_value = null;
    for (var i = 0; i < tileset.length; i++)
    {
        if (tileset[i].name == name)
        {
            return_value = tileset[i];
            break;
        }
    }
    return return_value;
}

////////////////////////////////////////////////////////////
//                game_insertSelectedObject               //
// Function:                                              //
//     Adds selected object from html to a selected layer //
// Return value:                                          //
//     None                                               //
////////////////////////////////////////////////////////////
function game_insertSelectedObject()
{
    //////////////////////////////////////////////////////////////////////
    // I clicked a tile but I forgot to select which layer to put it in //
    //////////////////////////////////////////////////////////////////////
    if (html_selected_layer == null)
    {
        html_layersErrorAnimation();
    }
    //////////////////////////////////
    // I clicked a tile and a layer //
    //////////////////////////////////
    else
    {
        // Remove the _span portion of the string from the html element id
        var layer_name = html_selected_layer.id.substring(0, html_selected_layer.id.length - '_span'.length);

        pushToLayer(mouseselectedentity, layer_name);
        
        // If a tile on the html was clicked
        if (html_selected_object != null)
        {
            // Duplicate the tile in case user wants to place another of the same type
            mouseselectedentity = game_createObjectFromType
                                    (
                                        html_selected_object.type,
                                        mouseselectedentity.pos.x,
                                        mouseselectedentity.pos.y,
                                        mouseselectedentity.name
                                    );
        }

        // If a tile on the canvas was clicked
        else
        {
            // Using typeof since mouseselectedentity is not a html object with a 'type' property
            // Duplicate the tile in case user wants to place another of the same type
            mouseselectedentity = game_createObjectFromType
                                    (
                                        typeof mouseselectedentity,
                                        mouseselectedentity.pos.x,
                                        mouseselectedentity.pos.y,
                                        mouseselectedentity.name
                                    );
        }

        // Update the html layer info section
        html_selectLayerElement(html_selected_layer);
    }
}

/////////////////////////////////////////////////
//               getRandomNumber               //
// Function:                                   //
//     Returns a number between [lower, upper) //
//     Lower is inclusive, upper is exclusive. //
// Return value:                               //
//     Number                                  //
/////////////////////////////////////////////////
function getRandomNumber(lower, upper)
{
    return Math.floor((Math.random() * (upper - lower)) + lower);
}

////////////////////////////////////////////////////////
//                  getMousePos                       //
// Function:                                          //
//     Called by an event handler that passes it the  //
//     event object and returns the relative position //
//     of the cursor to the canvas window.            //
// Return value:                                      //
//     Object with the properties:                    //
//         x: Number, y: Number                       //
////////////////////////////////////////////////////////
function getMousePos(e) 
{
    var rect = game_canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

////////////////////////////////////////////////////////
//                  getTouchPos                       //
// Function:                                          //
//     Called by an event handler that passes it the  //
//     event object and returns the relative position //
//     of the touch to the canvas window.             //
// Return value:                                      //
//     Object with the properties:                    //
//         x: Number, y: Number                       //
////////////////////////////////////////////////////////
function getTouchPos(canvasDom, touchEvent) 
{
    var rect = canvasDom.getBoundingClientRect();
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
}

/////////////////////////////////////////////////////////////////////
//                        copyCanvasData                           //
// Function:                                                       //
//     Copies pixel data from canvas element whose ID is           //
//     'game_canvas' from particular coordinates: srcx, srcy       //
//     to dstx, dsty with width w and height h on the same canvas. //
// Return value:                                                   //
//     None                                                        //
/////////////////////////////////////////////////////////////////////
function copyCanvasData(srcx, srcy, w, h,
                        dstx, dsty)
{
    var c = document.getElementById("game_canvas");
    var ct = c.getContext("2d");
    var imgData = ct.getImageData(srcx, srcy, w, h);
    ct.putImageData(imgData, dstx, dsty);
}

////////////////////////////////////////////////////
//                 getUnitVector                  //
// Function:                                      //
//     Computes and returns the unit vector given //
//     a vector with the given components:        //
//         x: Number, y: Number                   //
// Return value:                                  //
//     Object with the following components:      //
//         x: Number, y: Number                   //
////////////////////////////////////////////////////
function getUnitVector(vect)
{
    var sqrsum = vect.x * vect.x + vect.y * vect.y;
    return {x: vect.x/sqrsum, y: vect.y/sqrsum};
}

////////////////////////////////////////////////////////////
//                    colorNameToHex                      //
// Function:                                              //
//     Uses the color parameter to index the colors table //
//     to return a hex string of a color.                 //
// Return value:                                          //
//     string                                             //
////////////////////////////////////////////////////////////
function colorNameToHex(color)
{
    if (typeof colors[color.toLowerCase()] != 'undefined')
        return colors[color.toLowerCase()];

    return null;
}

///////////////////////////////////////////
//               invertColor             //
// Function:                             //
//     Converts a color to its opposite. //
//     If bw is true, then it will turn  //
//     the color to be black or white.   //
// Return value:                         //
//     string                            //
// Source:                               /////////////////////////////////////////////////////////////////////////
// https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function invertColor(hex, bw) 
{
    if (hex.indexOf('#') === 0) 
    {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) 
    {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) 
    {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) 
    {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}
function padZero(str, len) 
{
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

////////////////////////////////////////////////////////
//              game_drawTiledTexture                 //
// Function:                                          //
//     Creates a repeating pattern with the given img //
// Return value:                                      //
//     None                                           //
////////////////////////////////////////////////////////
function game_drawTiledTexture(img, x, y, width, height)
{
    var old_style = game_ctx.fillStyle;
    var pattern = game_ctx.createPattern(img, "repeat");
    game_ctx.closePath();

    game_ctx.beginPath();
    game_ctx.rect(x, y, width, height);
    game_ctx.fillStyle = pattern;
    game_ctx.fill();

    game_ctx.fillStyle = old_style;
}

//////////////////////////////////////////////////////////
//                      approach                        //
// Function:                                            //
//     A basic linear interpolation function.           //
//     Approaches flgoal in fldelta steps.              //
//     If flcurrent is within +- fldelta of the flgoal, //
//     then the flgoal is returned                      //
//     else it approaches flgoal another step.          //
// Return value:                                        //
//     Float                                            //
// Source:                                              //
// This function was on youtube, but I don't remember   //
// the title.                                           //
//////////////////////////////////////////////////////////
function approach(flgoal, flcurrent, fldelta)
{
	var fldifference = flgoal - flcurrent;

	if (fldifference >  fldelta) return flcurrent + fldelta;
	if (fldifference < -fldelta) return flcurrent - fldelta;

	return flgoal;
}

//////////////////////////////////////////////////
//                    clamp                     //
// Function:                                    //
//     Keeps curr within the number segment:    //
//     [-clmp, clmp]                            //
// Return value:                                //
//     Number                                   //
//////////////////////////////////////////////////
function clamp(clmp, curr)
{
    return Math.min(Math.max(curr, -1 * clmp), clmp);
}

/////////////////////////////////////////////////////
//                  getPlayer                      //
// Function:                                       //
//     Finds the player object inside the entlist. //
//     Returns null if no player object is found.  //
// Return value:                                   //
//     Null or Player object                       //
/////////////////////////////////////////////////////
function getPlayer()
{
    for (var i = 0; i < entlist.length; i++)
        if(entlist[i] instanceof Player)
            return entlist[i];
    return null;
}

/////////////////////////////////////////////////////
//             getPlayer (*deprecated*)            //
// Function:                                       //
//     Finds the player object inside the entlist. //
//     Returns null if no player object is found.  //
// Return value:                                   //
//     Null or Player object                       //
/////////////////////////////////////////////////////
function getPuck()
{
    for (var i = 0; i < entlist.length; i++)
        if(entlist[i] instanceof Puck)
            return entlist[i];
    return null;
}

////////////////////////////////////
// getScoreBoard (*deprecated*)   //
// Function:                      //
//     Returns scoreboard object. //
// Return value:                  //
//     Scoreboard object          //
////////////////////////////////////
function getScoreBoard()
{
    return scorebrd;
}

//////////////////////////////////////////////////
//                  SideEnum                    //
// Enumerator:                                  //
//     Used in collision code to tell what side //
//     an object collides with another.         //
// Types:                                       //
//     Number                                   //
//////////////////////////////////////////////////
var SideEnum = {
    UP   : 0,
    DOWN : 1,
    RIGHT: 2,
    LEFT : 3,
    ERROR: 4
}

///////////////////////////////////////////
//              SideString               //
// String array:                         //
//     Converts SideEnum to string       //
//     Used mainly for logging purposes. //
// Types:                                //
//     string                            //
///////////////////////////////////////////
var SideString = [
    "up",
    "down",
    "right",
    "left",
    "error"
];

////////////////////////////////////////////////////////////////
// checkSide(a,b) :  return what side entity A is to entity B //
//                                                            //
//   +-----+                                                  //
//   |     |   +---+                                          //
//   |  a  |   | b |                                          //
//   |     |   +---+                                          //
//   +-----+                                                  //
//                                                            //
// In this illustration, a is to the left of b                //
// so, in this case, the function will return SideEnum.LEFT   //
//                                                            //
// Return value:                                              //
//     Enumerator                                             //
////////////////////////////////////////////////////////////////
function checkSide(a, b)
{
    if (!(a instanceof Entity))
        return SideEnum.ERROR;
    if (!(b instanceof Entity))
        return SideEnum.ERROR;
    
    var rect1 = {x: a.pos.x + a.collider.xoffset, y: a.pos.y + a.collider.yoffset, width: a.collider.width, height: a.collider.height};
    var rect2 = {x: b.pos.x + b.collider.xoffset, y: b.pos.y + b.collider.yoffset, width: b.collider.width, height: b.collider.height};

    if (rect1.y + rect1.height >=rect2.y + rect2.height && rect1.y >=rect2.y + rect2.height) return SideEnum.DOWN ;
    if (rect2.y + rect2.height >=rect1.y + rect1.height && rect2.y >=rect1.y + rect1.height) return SideEnum.UP   ;
    if (rect1.x + rect1.width  >=rect2.x + rect2.width  && rect1.x >=rect2.x + rect2.width ) return SideEnum.RIGHT;
    if (rect2.x + rect2.width  >=rect1.x + rect1.width  && rect2.x >=rect1.x + rect1.width ) return SideEnum.LEFT ;
    
    return SideEnum.ERROR;
}

////////////////////////////////////////////////
//             checkPointCollision            //
// Function:                                  //
//     Returns a boolean value whether or not //
//     a point is within a rectangle.         //
//                                            //
//     Returns false if either parameter is   //
//     null.                                  //
//                                            //
//     Throws exception if either parameters  //
//     are missing x,y,w or h properties      //
// Return value:                              //
//     boolean                                //
////////////////////////////////////////////////
function checkPointCollision(rectangle, point)
{
    if (rectangle instanceof Entity)
    {
        rectangle.x = rectangle.pos.x;
        rectangle.y = rectangle.pos.y;
    }
    if (rectangle == null) return false;
    if (point     == null) return false;

    if (rectangle.x == null || rectangle.y == null) 
    {
        console.log(rectangle + " missing x or y property");
        return false;
    }
    if (point.x == null || point.y == null) 
    {
        console.log(point     + " missing x or y property");
        return false;
    }

    if (rectangle.width == null || rectangle.height == null)
    {
        console.log(rectangle + " missing width or height property")
        return false;
    }
    
    return point.x > rectangle.x && point.x < rectangle.x + rectangle.width
        && point.y > rectangle.y && point.y < rectangle.y + rectangle.height;
}

////////////////////////////////////////////////
//             checkCollision                 //
// Function:                                  //
//     Returns a boolean value whether or not //
//     a rectangle is within a rectangle.     //
// Return value:                              //
//     boolean                                //
////////////////////////////////////////////////
function checkCollision(a, b)
{
    if (a.noCollide || b.noCollide)
    {
        return false;
    }
    
    var rect1 = {x: a.pos.x + a.collider.xoffset, y: a.pos.y + a.collider.yoffset, width: a.collider.width, height: a.collider.height};
    var rect2 = {x: b.pos.x + b.collider.xoffset, y: b.pos.y + b.collider.yoffset, width: b.collider.width, height: b.collider.height};
 
    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y)
    {
        return true;
    }

    return false;
}

//////////////////////////////////////////////////////////////////////////////////////
//                             checkCameraCollision                                 //
// Function:                                                                        //
//     Checks whether camera is inside rectangle.                                   //
// Return value:                                                                    //
//     boolean                                                                      //
// Source:                                                                          //
// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection //
//////////////////////////////////////////////////////////////////////////////////////
function checkCameraCollision(a, b)
{
    if (!(a instanceof Camera))
    {
        throw Error("Invalid camera argument, checkCameraCollision recevied " + (typeof a));
    }
    var rect1 = {x: a.x, y: a.y, width: a.width, height: a.height}
    var rect2 = {x: b.pos.x, y: b.pos.y, width: b.width, height: b.height}

    if (rect1.x                 <= rect2.x + rect2.width    &&
        rect1.x + rect1.width   >  rect2.x                  &&
        rect1.y                 <= rect2.y + rect2.height   &&
        rect1.y + rect1.height  >  rect2.y)
    {
        return true;
    }
    return false;   
}

////////////////////////////////////////////////
//      checkPuckCollision (*deprecated*)     //
// Function:                                  //
//     Returns a boolean value whether or not //
//     a puck collides with another using     //
//     radius and distance formula.           //
// Return value:                              //
//     boolean                                //
////////////////////////////////////////////////
function checkPuckCollision(a, b)
{
    if (!(a instanceof Puck)) return false;
    if (!(b instanceof Puck)) return false;

    var distance = Math.sqrt(
                        ((a.pos.x - b.pos.x) * (a.pos.x - b.pos.x))
                      + ((a.pos.y - b.pos.y) * (a.pos.y - b.pos.y))
                            );
    return distance < a.radius + b.radius;
}

//////////////////////////////////
//          addLevel            //
// Function:                    //
//     Creates a level object   //
// Return value:                //
//     Level object             //    
//////////////////////////////////
function addLevel()
{
    return new Level();
}

////////////////////////////////////////////////////
//          addPuckAtMouse (*deprecated*)         //
// Function:                                      //
//     Creates a puck object where the cursor is. //
// Return value:                                  //
//     None                                       //
////////////////////////////////////////////////////
function addPuckAtMouse(e)
{
    var x   = mousepos.x;
    var y   = mousepos.y;
    var vx  = (mousestartpos.x - mousepos.x) / 10;
    var vy  = (mousestartpos.y - mousepos.y) / 10;
    addPuck(x - 16, y - 16, vx, vy);
}

/////////////////////////////////////////////////////////
//                     addParticle                     //
// Function:                                           //
//     Creates a particle at the given coordinates x,y //
//     with a scale multiplier.                        //
// Return value:                                       //
//     Particle object                                 //
/////////////////////////////////////////////////////////
function addParticle(x, y, scale)
{
    var obj = new Particle(x, y, 64, 64, scale, "materials/star.png", [0]);
    entlist.push(obj);
    return obj;
}

/////////////////////////////////////////////////////
//             addParticle (*deprecated*)          //
// Function:                                       //
//     Creates a puck at the given coordinates x,y //
//     with initial velocity vx, vy.               //
// Return value:                                   //
//     Puck object                                 //
/////////////////////////////////////////////////////
function addPuck(x, y, vx, vy)
{
    var obj = new Puck(x, y, 32, 32, vx, vy, "materials/circles2.png", [2,3,4,5,4,3,2]);
    entlist.push(obj);
    return obj;
}

////////////////////////////////////////////////////////////
//                 addGoal (*deprecated*)                 //
// Function:                                              //
//     Creates a goal object at the given coordinates x,y //
//     with dimensions w, h.                              //
// Return value:                                          //
//     Goal object                                        //
////////////////////////////////////////////////////////////
function addGoal(x, y, w, h)
{
    var obj = new Goal(x, y, w, h);
    entlist.push(obj);
    return obj;
}

////////////////////////////////////////////////////////////
//                       addWall                          //
// Function:                                              //
//     Creates a wall object at the given coordinates x,y //
//     with dimensions w, h and image source.             //
// Return value:                                          //
//     Wall object                                        //
////////////////////////////////////////////////////////////
function addWall(x, y, w, h, imgsrc)
{
    var obj = new Wall(x, y, w, h, imgsrc, [0])
    entlist.push(obj);
    return obj;
}

//////////////////////////////////////////
//              addTile                 //
// Function:                            //
//     Finds a tile with the given name //
//     and returns a new Tile object.   //
// Return value:                        //
//     Tile object                      //
//////////////////////////////////////////
function addTile(x, y, tileset_elem)
{
    var obj = new Tile
    (
        x,                      // x
        y,                      // y
        tileset_elem.width  ,   // width
        tileset_elem.height ,   // height
        [0],                    // framelist
        tileset_elem.x,         // offsetx
        tileset_elem.y,         // offsety
        tileset_img,            // img
        tileset_elem.name       // name
    );
    entlist.push(obj);
    return obj;
}

/////////////////////////////////////////////////////////////
//               addMovingWall (*deprecated*)              //
// Function:                                               //
//     Creates a moving wall at particular coordinates x,y //
//     Will move either horizontally or vertically based   //
//     on the isVertical parameter                         //
// Return value:                                           //
//     MovingWall object                                   //
/////////////////////////////////////////////////////////////
function addMovingWall(x, y, isVertical)
{
    var obj = new MovingWall(x, y, 64, 64, isVertical, "materials/spring-aa.png", [0,1,2,3,4]);
    entlist.push(obj);
    return obj;
}

//////////////////////////////////////////////////
//                  addTrigger                  //
// Function:                                    //
//     Creates a trigger object at particular   //
//     coordinates x,y                          //
// Return value:                                //
//     Player object                            //
//////////////////////////////////////////////////
function addTrigger(x, y)
{
    var obj = new Trigger(x, y, 32, 32);
    entlist.push(obj);
    return obj;
}

/////////////////////////////////////////////////////////////
//                       addEntity                         //
// Function:                                               //
//     Creates entity object at particular coordinates x,y //
// Return value:                                           //
//     Player object                                       //
/////////////////////////////////////////////////////////////
function addEntity(x, y, w, h)
{
    var obj = new Entity(x, y, w, h)
    entlist.push(obj);
    return obj;
}

/////////////////////////////////////////////////////////////
//                       addPlayer                         //
// Function:                                               //
//     Creates player object at particular coordinates x,y //
// Return value:                                           //
//     Player object                                       //
/////////////////////////////////////////////////////////////
function addPlayer(x, y)
{
    var obj = new Player(x, y);
    entlist.push(obj);
    return obj;
}

///////////////////////////////////////////////////////////
//                sound (*deprecated*)                   //
// Function:                                             //
//     Creates a sound object and attaches it to the DOM //
// Return value:                                         //
//     None                                              //
///////////////////////////////////////////////////////////
function sound(src) 
{
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}

//////////////////////////////////////////////
//                drawLine                  //
// Function:                                //
//     Draws a line using mouse coordinates //
// Return value:                            //
//     None                                 //
//////////////////////////////////////////////
function drawLine()
{
    game_ctx.beginPath();
    game_ctx.moveTo(mousestartpos.x, mousestartpos.y);
    game_ctx.lineTo(mousepos.x, mousepos.y);
    game_ctx.stroke();
}

///////////////////////////////////////////////////////
//                    distance                       //
// Function:                                         //
//     Calculates distance between p1 and p2         //
//     p1 and p2 must have the following properties: //
//         x: Number, y: Number                      //
// Return value:                                     //
//     Float                                         //
///////////////////////////////////////////////////////
function distance(p1, p2)
{
    var x = p2.x - p1.x;
    var y = p2.y - p1.y;
    return Math.sqrt(x*x + y*y);
}

//////////////////////////////////////////////////////
//                  game_convertData                //
// Function:                                        //
//     Converts the parameter to string or number   //
//     depending on the contents of the string      //
// Return value:                                    //
//     Object, Number, or String                    //
//////////////////////////////////////////////////////
function game_convertData(data)
{
    if (isNaN(Number(data)))
    {
        // Probably a string or object
        if (data === "true" || data === "false")
        {
            return data === "true";
        }
        else
        {
            return data;
        }
    }
    else
    {
        // This is a valid number
        return Number(data);
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                          round_to                                           //
// Function:                                                                                   //
//     Rounds a number to the specified number of decimal places.                              //
// Return value:                                                                               //
//     Float                                                                                   //
// Source:                                                                                     //
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round //
/////////////////////////////////////////////////////////////////////////////////////////////////
function round_to(x, precision) 
{
    var y = +x + (precision === undefined ? 0.5 : precision/2);
    return y - (y % (precision === undefined ? 1 : +precision));
}