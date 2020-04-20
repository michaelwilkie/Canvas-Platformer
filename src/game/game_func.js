////////////////////////////////////////////////////////////////
// platformer_func.js                                         //
//     Contains most of the functions used for game physics.  //
//     Called by CanvasPlatformer() function in initialize.js //
////////////////////////////////////////////////////////////////
"use strict";

function game()
{    
    // Wait for all images to be loaded in before attempting to play
    if(!imagesLoaded)
    {
        imagesLoaded = allImagesLoaded();
        // allImagesLoaded() sets the level object's height and width
        // I am setting it again here to override it with these other background images.
        level.setWidth (background_wall.width);
        level.setHeight(background_wall.height);
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
                    mouseselectedentity.draw(playercamera, game_findLayer(html_getLayerNameFromID(html_selected_layer)).speed);
                }
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
        //mouseselectedentity.killSelf();
    }
    mouseselectedentity = null;
    html_selected_object = null;
    ui_edit_mode_component.scroll_component.selectedObject = null;
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
    ui_edit_mode_component.scroll_component.selectedObject = null;

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
        var temp = layers[index1];
        layers[index1] = layers[index2];
        layers[index2] = temp;
    }
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
    var layer_speed = game_findLayer(html_getLayerNameFromID(html_selected_layer)).speed;

    var cursor_grid_multiples_x     = Math.floor(mousepos.x     / GRID_TIGHTNESS / layer_speed);
    var cursor_grid_multiples_y     = Math.floor(mousepos.y     / GRID_TIGHTNESS / layer_speed);

    var camera_grid_multiples_x     = Math.floor(playercamera.x / GRID_TIGHTNESS / layer_speed);
    var camera_grid_multiples_y     = Math.floor(playercamera.y / GRID_TIGHTNESS / layer_speed);
    
    var camera_scale_x              = playercamera.zoomx;
    var camera_scale_y              = playercamera.zoomy;

    var camera_relative_position_x  = (camera_grid_multiples_x * GRID_TIGHTNESS * layer_speed);
    var camera_relative_position_y  = (camera_grid_multiples_y * GRID_TIGHTNESS * layer_speed);

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
//     the layers array.                         //
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
        layer_object.push(ent);
    }
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

/////////////////////////////////////////////
//               createImage               //
// Function:                               //
//     Creates an image object from imgsrc //
// Return value:                           //
//     Image object                        //
/////////////////////////////////////////////
function createImageObject(imgsrc)
{
    var img_object = null;

    // Images are used for visible entities
    if (imgsrc != null)
    {
        img_object = new Image();
        img_object.src = imgsrc;
    }

    return img_object;
}

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
        
        // Duplicate the tile in case user wants to place another of the same type
        mouseselectedentity = addTile(mouseselectedentity.pos.x, mouseselectedentity.pos.y, getTileByName(mouseselectedentity.name));

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

////////////////////////////////////////////////////////////////////
//                      allImagesLoaded                           //
// Function:                                                      //
//     Checks whether or not all game resources have been loaded. //
// Return value:                                                  //
//     boolean                                                    //
////////////////////////////////////////////////////////////////////
function allImagesLoaded()
{
    if (level.bg_img != null)
        if (!level.bg_img.complete)
            return false;
    for (var i = 0; i < entlist.length; i++)
        if (entlist[i].img != null)
            if (!entlist[i].img.complete)
                return false;
    return true;
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
    
    if (a.pos.y + a.height > b.pos.y + b.height && a.pos.y > b.pos.y + b.height) return SideEnum.DOWN ;
    if (b.pos.y + b.height > a.pos.y + a.height && b.pos.y > a.pos.y + a.height) return SideEnum.UP   ;
    if (a.pos.x + a.width  > b.pos.x + b.width  && a.pos.x > b.pos.x + b.width ) return SideEnum.RIGHT;
    if (b.pos.x + b.width  > a.pos.x + a.width  && b.pos.x > a.pos.x + a.width ) return SideEnum.LEFT ;
    
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
        throw (rectangle + " missing x or y property");
    }
    if (point.x == null || point.y == null) 
    {
        throw (point     + " missing x or y property");
    }

    if (rectangle.width == null || rectangle.height == null) throw (rectangle + " missing width or height property");
    
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
    if (!(a instanceof Entity))
        return false;
    if (!(b instanceof Entity))
        return false;
 
    var rect1 = {x: a.pos.x, y: a.pos.y, width: a.width, height: a.height}
    var rect2 = {x: b.pos.x, y: b.pos.y, width: b.width, height: b.height}
 
    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y)
    {
        return true;
    }

    return false;

    /*var xCollide = false;
    var yCollide = false;
    if (    (rect1.x > rect2.x && rect1.x < rect2.x + rect2.width)
     ||     (rect1.x + rect1.width > rect2.x && rect1.x + rect1.width < rect2.x + rect2.width))
    {
        xCollide = true;
    }

    if (    (rect1.y > rect2.y && rect1.y < rect2.y + rect2.height)
     ||     (rect1.y + rect1.height > rect2.y && rect1.y + rect1.height < rect2.y + rect2.height))
    {
        yCollide = true;
    }
    if (xCollide && yCollide)
    {
        console.log('collidin');
    }
    return xCollide && yCollide;*/
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

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                          round_to                                           //
// Function:                                                                                   //
//     Rounds a number to the specified number of decimal places.                              //
// Return value:                                                                               //
//     float                                                                                   //
// Source:                                                                                     //
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round //
/////////////////////////////////////////////////////////////////////////////////////////////////
function round_to(x, precision) 
{
    var y = +x + (precision === undefined ? 0.5 : precision/2);
    return y - (y % (precision === undefined ? 1 : +precision));
}