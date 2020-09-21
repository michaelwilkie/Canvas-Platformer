////////////////////////////////////////////////////////////////////////////////
// html_initialize.js                                                         //
// Why this file exists:                                                      //
//      Problem:                                                              //
//          Having the edit mode menu on top of the canvas as a level editor  //
//          is a stupid idea. Why have the tools you are using to build cover //
//          half the screen?                                                  //
//                                                                            //
//      Solution:                                                             //
//          Take the tileset, turn it into img html elements and put them     //
//          in a separate column on the html page.                            //
//                                                                            //
//          Now the tileset is off the page and I get more screenspace for    //
//          the canvas AND the level editor. Best of both worlds.             //
////////////////////////////////////////////////////////////////////////////////
"use strict";

/////////////////////////////////////////////////////
//             addElementToTilesetHTML             //
// Function:                                       //
//     Creates a canvas element to be painted on.  //
//     A portion of the tileset image will be      //
//     painted on this new canvas object and will  //
//     be transferred to an <img> element so it    //
//     can be displayed on the html instead of the //
//     ui_canvas.                                  //
// Return value:                                   //
//     None                                        //
/////////////////////////////////////////////////////
function html_addElementToTileset(x, y, tilename)
{
    var tile                 = getTileByName(tilename);

    if (tile == null)
    {
        throw "Invalid tile name: " + tilename;
        return;
    }

    var new_canvas           = document.createElement("canvas");
    var new_ctx              = new_canvas.getContext("2d");
    var imageObject          = new Image();

    // These offsets were tested manually
    var xoffset              = 0//1205;
    var yoffset              = 0//155;

    new_canvas.width         = tile.width;
    new_canvas.height        = tile.height;

    new_ctx.drawImage
    (
        tileset_img , // img object
        tile.x      , // source x
        tile.y      , // source y
        tile.width  , // source width
        tile.height , // source height
        0           , // destination x
        0           , // destination y
        tile.width  , // destination width
        tile.height   // destination height
    );

    imageObject.src             = new_canvas.toDataURL();
    imageObject.id              = tile.name + "_HTML"   ;
    imageObject.style.position  = "relative"            ;
    //imageObject.style.left      = (x + xoffset) + "px"  ;
    //imageObject.style.top       = (y + yoffset) + "px"  ;
    imageObject.name            = tilename              ;
    imageObject.xpos            = tile.x                ;
    imageObject.ypos            = tile.y                ;
    imageObject.onclick         = html_imgClickHandler  ;
    imageObject.wasClicked      = false                 ;
    imageObject.type            = 'tile'                ;

    html_div_tileset.appendChild(imageObject);

    // Add hover-text to help the user know what they are looking at
    $('#' + tile.name + "_HTML").prop('title', tile.name);
}

//////////////////////////////////////////////////////////////////////////////////////////
//                          html_addEntitiesToEntitiesTab                               //
// Function:                                                                            //
//     Populates the div_entities element with the game's logic entities/player/enemies //
// Return value:                                                                        //
//     None                                                                             //
//////////////////////////////////////////////////////////////////////////////////////////
function html_addEntitiesToEntitiesTab()
{
    html_addPlayerToEntitiesTab();
    html_addTriggerToEntitiesTab();
}

/////////////////////////////////////////////////////////////////////////////////////////
//                          html_initializePopupEventHandlers                          //
// Function:                                                                           //
//     Initializes event handlers for the save/load popup                              //
// Return value:                                                                       //
//     None                                                                            //
// Source:                                                                             //
// https://www.tutorialspoint.com/How-to-create-a-modal-popup-using-JavaScript-and-CSS //
/////////////////////////////////////////////////////////////////////////////////////////
function html_initializePopupEventHandlers()
{
    var popup                   = document.getElementById('div_level_saveload_popup'    );
    var saveload_button         = document.getElementById('div_level_saveload_button'   );
    var close_saveload_button   = document.getElementById('button_close_saveload_popup' );
    var load_level_button       = document.getElementById('button_load_level_popup'     );
    saveload_button.onclick = function() 
    {
        popup.style.display = "block";
        html_populateSaveDataTextArea();
    }
    close_saveload_button.onclick = function() 
    {
        popup.style.display = "none";
    }
    load_level_button.onclick = function()
    {
        html_parseLevelData();
    }
    window.onclick = function()
    {
        if (event.target == popup)
        {
            popup.style.display = "none"; 
        }
    }
}

////////////////////////////////////////////////
//         html_addPlayerToEntitiesTab        //
// Function:                                  //
//     Adds player object to the entities tab //
// Return value:                              //
//     None                                   //
////////////////////////////////////////////////
function html_addPlayerToEntitiesTab()
{
    var player_object   = new Player(0, 0);
    var new_canvas      = document.createElement("canvas");
    var new_ctx         = new_canvas.getContext("2d");
    var imageObject     = new Image();

    new_canvas.width    = player.width;
    new_canvas.height   = player.height;

    new_ctx.drawImage
    (
        player.img      , // img object
        0               , // source x (should be 0 in this case)
        0               , // source y (should be 0 in this case)
        player.width    , // source width
        player.height   , // source height
        0               , // destination x
        0               , // destination y
        player.width    , // destination width
        player.height     // destination height
    );

    imageObject.src             = new_canvas.toDataURL();
    imageObject.id              = 'player_HTML'         ;
    imageObject.style.position  = "relative"            ;
    imageObject.name            = 'player'              ;
    imageObject.xpos            = player.pos.x          ;
    imageObject.ypos            = player.pos.y          ;
    imageObject.onclick         = html_imgClickHandler  ;
    imageObject.wasClicked      = false                 ;
    imageObject.type            = 'player'              ;

    html_div_entities.appendChild(imageObject);

    // Adding an element ruins the 'display' property of div_entities which should be, at this time, 'none'
    $('#div_entities').css('display', 'none');

    // Reference to the entity that should be copied when this html element is clicked
    $('#player_HTML').prop('entity_reference', player_object);

    // Add hover-text to help the user know what they are looking at
    $('#player_HTML').prop('title', 'Player Object');

} // end of html_addPlayerToEntitiesTab()

////////////////////////////////////////////////
//        html_addTriggerToEntitiesTab        //
// Function:                                  //
//     Adds player object to the entities tab //
// Return value:                              //
//     None                                   //
////////////////////////////////////////////////
function html_addTriggerToEntitiesTab()
{
    var trigger_object   = new Trigger(0, 0, 32, 32);
    var new_canvas      = document.createElement("canvas");
    var new_ctx         = new_canvas.getContext("2d");
    var imageObject     = new Image();

    new_canvas.width    = player.width;
    new_canvas.height   = player.height;

    new_ctx.drawImage
    (
        trigger_object.img      , // img object
        0               , // source x (should be 0 in this case)
        0               , // source y (should be 0 in this case)
        trigger_object.width    , // source width
        trigger_object.height   , // source height
        0               , // destination x
        0               , // destination y
        trigger_object.width    , // destination width
        trigger_object.height     // destination height
    );

    imageObject.src             = new_canvas.toDataURL();
    imageObject.id              = 'trigger_HTML'        ;
    imageObject.style.position  = "relative"            ;
    imageObject.name            = 'trigger'             ;
    imageObject.xpos            = trigger_object.pos.x  ;
    imageObject.ypos            = trigger_object.pos.y  ;
    imageObject.onclick         = html_imgClickHandler  ;
    imageObject.wasClicked      = false                 ;
    imageObject.type            = 'trigger'             ;

    html_div_entities.appendChild(imageObject);

    // Adding an element ruins the 'display' property of div_entities which should be, at this time, 'none'
    $('#div_entities').css('display', 'none');

    // Reference to the entity that should be copied when this html element is clicked
    $('#trigger_HTML').prop('entity_reference', trigger_object);

    // Add hover-text to help the user know what they are looking at
    $('#trigger_HTML').prop('title', 'Trigger Object');

} // end of html_addTriggerToEntitiesTab()

//////////////////////////////////////
//      html_initialize_globals     //
// Function:                        //
//     Initializes global variables //
// Return value:                    //
//     None                         //
//////////////////////////////////////
function html_initialize_globals()
{
    html_div_tileset            = document.getElementById("div_tileset"          );
    html_div_entities           = document.getElementById("div_entities"         );
    html_div_edit_mode          = document.getElementById("div_edit_mode"        );
    html_div_layers_scrollarea  = document.getElementById("div_layers_scrollarea");
    html_div_layer_info         = document.getElementById("div_layer_info"       );
    html_div_object_info        = document.getElementById("div_object_info"      );
    html_sky_color_input        = document.getElementById("html_sky_color_input" );
}

//////////////////////////////////////////////////////////
//       html_initializeColorPickerEventHandler         //
// Function:                                            //
//     Changes the color of the background of the game  //
// Return value:                                        //
//     None                                             //
//////////////////////////////////////////////////////////
function html_initializeColorPickerEventHandler()
{
    html_sky_color_input.addEventListener
    (
        "change",
        (event) => {
            game_sky_color = event.target.value;
        }
    );
}

///////////////////////////////////////////////////////////
//              initialize_edit_mode_html                //
// Function:                                             //
//     Adds tiles from tileset as <img> elements to html //
// Return value:                                         //
//     None                                              //
///////////////////////////////////////////////////////////
function initialize_edit_mode_html()
{
    // Inserting the tileset into the html element
    var current_x   = 32;
    var current_y   = 32;
    var tile_width  = 32;
    var tile_height = 32;

    ////////////////////////////////////////////////////
    // Grass
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (0 * tile_height), "GRASS_TOP_LEFT_EDGE"             );

    html_addElementToTileset(current_x + (1 * tile_width), current_y + (0 * tile_height), "GRASS_TOP"                       );
    html_addElementToTileset(current_x + (2 * tile_width), current_y + (0 * tile_height), "GRASS_TOP_RIGHT_EDGE"            );

    ////////////////////////////////////////////////////
    // Flower
    current_y =  1 * 32;
    current_x =  5 * 32;
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (0 * tile_height), "PLANT_FLOWER"                    );
    
    ////////////////////////////////////////////////////
    // Mushrooms
    current_y =  1 * 32;
    current_x =  7 * 32;
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (0 * tile_height), "PLANT_MUSHROOM_SMALL"            );
    html_addElementToTileset(current_x + (1 * tile_width), current_y + (0 * tile_height), "PLANT_MUSHROOM_LARGE"            );

    ////////////////////////////////////////////////////
    // Small Tree
    current_y =  1 * 32;
    current_x = 10 * 32;
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (1 * tile_height), "PLANT_TREE_BOTTOM_LEFT"          );
    html_addElementToTileset(current_x + (1 * tile_width), current_y + (1 * tile_height), "PLANT_TREE_BOTTOM_RIGHT"         );
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (0 * tile_height), "PLANT_TREE_TOP_LEFT"             );
    html_addElementToTileset(current_x + (1 * tile_width), current_y + (0 * tile_height), "PLANT_TREE_TOP_RIGHT"            );

    ////////////////////////////////////////////////////
    // Large Tree
    current_y = 1 * 32;
    current_x = 13 * 32;
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (2 * tile_height), "PLANT_TREE_LARGE_LEFT_TRUNK"     );
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (1 * tile_height), "PLANT_TREE_LARGE_LEFT_BRANCHES"  );
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (0 * tile_height), "PLANT_TREE_LARGE_LEFT_LEAVES"    );
    html_addElementToTileset(current_x + (1 * tile_width), current_y + (2 * tile_height), "PLANT_TREE_LARGE_MIDDLE_TRUNK"   );
    html_addElementToTileset(current_x + (1 * tile_width), current_y + (1 * tile_height), "PLANT_TREE_LARGE_MIDDLE_BRANCHES");
    html_addElementToTileset(current_x + (1 * tile_width), current_y + (0 * tile_height), "PLANT_TREE_LARGE_MIDDLE_LEAVES"  );
    html_addElementToTileset(current_x + (2 * tile_width), current_y + (2 * tile_height), "PLANT_TREE_LARGE_RIGHT_TRUNK"    );
    html_addElementToTileset(current_x + (2 * tile_width), current_y + (1 * tile_height), "PLANT_TREE_LARGE_RIGHT_BRANCHES" );
    html_addElementToTileset(current_x + (2 * tile_width), current_y + (0 * tile_height), "PLANT_TREE_LARGE_RIGHT_LEAVES"   );

    ////////////////////////////////////////////////////
    // Bright Pillar
    current_y = 3 * 32;
    current_x = 1 * 32;
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (0 * tile_height), "PILLAR_BRIGHT_TOP"               );
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (1 * tile_height), "PILLAR_BRIGHT_MIDDLE"            );
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (2 * tile_height), "PILLAR_BRIGHT_BOTTOM"            );

    ////////////////////////////////////////////////////
    // Bright Rock
    current_y = 3 * 32;
    current_x = 2 * 32;
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (0 * tile_height), "ROCK_BRIGHT_TOP_LEFT_EDGE"       );
    html_addElementToTileset(current_x + (3 * tile_width), current_y + (3 * tile_height), "ROCK_BRIGHT_TOP_LEFT_EDGE2"      );
    html_addElementToTileset(current_x + (1 * tile_width), current_y + (1 * tile_height), "ROCK_BRIGHT_LEFT_EDGE"           );
    html_addElementToTileset(current_x + (1 * tile_width), current_y + (2 * tile_height), "ROCK_BRIGHT_BOTTOM_LEFT_EDGE"    );
    html_addElementToTileset(current_x + (1 * tile_width), current_y + (0 * tile_height), "ROCK_BRIGHT_TOP_LEFT_CONCAVE"    );  
    html_addElementToTileset(current_x + (2 * tile_width), current_y + (2 * tile_height), "ROCK_BRIGHT_LEFT_CONCAVE"        );
    html_addElementToTileset(current_x + (2 * tile_width), current_y + (3 * tile_height), "ROCK_BRIGHT_BOTTOM_LEFT_EDGE"    );

    html_addElementToTileset(current_x + (2 * tile_width), current_y + (0 * tile_height), "ROCK_BRIGHT_TOP_MIDDLE"          );
    //html_addElementToTileset(current_x + (3 * tile_width), current_y + (0 * tile_height), "ROCK_BRIGHT_TOP_MIDDLE"          );
    //html_addElementToTileset(current_x + (4 * tile_width), current_y + (0 * tile_height), "ROCK_BRIGHT_TOP_MIDDLE"          );
    //html_addElementToTileset(current_x + (2 * tile_width), current_y + (1 * tile_height), "ROCK_BRIGHT_MIDDLE"              );
    html_addElementToTileset(current_x + (3 * tile_width), current_y + (1 * tile_height), "ROCK_BRIGHT_MIDDLE"              );
    //html_addElementToTileset(current_x + (3 * tile_width), current_y + (2 * tile_height), "ROCK_BRIGHT_MIDDLE"              );
    //html_addElementToTileset(current_x + (4 * tile_width), current_y + (1 * tile_height), "ROCK_BRIGHT_MIDDLE"              );
    html_addElementToTileset(current_x + (3 * tile_width), current_y + (3 * tile_height), "ROCK_BRIGHT_BOTTOM"              );

    html_addElementToTileset(current_x + (6 * tile_width), current_y + (0 * tile_height), "ROCK_BRIGHT_TOP_RIGHT_EDGE"      );
    html_addElementToTileset(current_x + (6 * tile_width), current_y + (1 * tile_height), "ROCK_BRIGHT_TOP_RIGHT_EDGE2"     );
    html_addElementToTileset(current_x + (5 * tile_width), current_y + (0 * tile_height), "ROCK_BRIGHT_TOP_RIGHT_CONCAVE"   );
    html_addElementToTileset(current_x + (5 * tile_width), current_y + (1 * tile_height), "ROCK_BRIGHT_RIGHT_EDGE"          );
    html_addElementToTileset(current_x + (5 * tile_width), current_y + (2 * tile_height), "ROCK_BRIGHT_BOTTOM_RIGHT_EDGE"   );
    html_addElementToTileset(current_x + (4 * tile_width), current_y + (2 * tile_height), "ROCK_BRIGHT_RIGHT_CONCAVE"       );
    html_addElementToTileset(current_x + (4 * tile_width), current_y + (3 * tile_height), "ROCK_BRIGHT_BOTTOM_RIGHT_EDGE"   );

    ////////////////////////////////////////////////////
    // Dark Pillar
    current_y = 8 * 32;
    current_x = 1 * 32;
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (0 * tile_height), "PILLAR_DARK_TOP"                 );
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (1 * tile_height), "PILLAR_DARK_MIDDLE"              );
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (2 * tile_height), "PILLAR_DARK_BOTTOM"              );

    ////////////////////////////////////////////////////
    // Dark Rock
    current_y = 8 * 32;
    current_x = 2 * 32;
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (0 * tile_height), "ROCK_DARK_TOP_LEFT_EDGE"         );
    html_addElementToTileset(current_x + (1 * tile_width), current_y + (1 * tile_height), "ROCK_DARK_LEFT_EDGE"             );
    html_addElementToTileset(current_x + (1 * tile_width), current_y + (2 * tile_height), "ROCK_DARK_BOTTOM_LEFT_EDGE"      );
    html_addElementToTileset(current_x + (1 * tile_width), current_y + (0 * tile_height), "ROCK_DARK_TOP_LEFT_CONCAVE"      );  
    html_addElementToTileset(current_x + (2 * tile_width), current_y + (2 * tile_height), "ROCK_DARK_LEFT_CONCAVE"          );
    html_addElementToTileset(current_x + (2 * tile_width), current_y + (3 * tile_height), "ROCK_DARK_BOTTOM_LEFT_EDGE"      );

    html_addElementToTileset(current_x + (2 * tile_width), current_y + (0 * tile_height), "ROCK_DARK_TOP_MIDDLE"            );
    //html_addElementToTileset(current_x + (3 * tile_width), current_y + (0 * tile_height), "ROCK_DARK_TOP_MIDDLE"            );
    //html_addElementToTileset(current_x + (4 * tile_width), current_y + (0 * tile_height), "ROCK_DARK_TOP_MIDDLE"            );
    html_addElementToTileset(current_x + (2 * tile_width), current_y + (1 * tile_height), "ROCK_DARK_MIDDLE"                );
    //html_addElementToTileset(current_x + (3 * tile_width), current_y + (1 * tile_height), "ROCK_DARK_MIDDLE"                );
    //html_addElementToTileset(current_x + (3 * tile_width), current_y + (2 * tile_height), "ROCK_DARK_MIDDLE"                );
    //html_addElementToTileset(current_x + (4 * tile_width), current_y + (1 * tile_height), "ROCK_DARK_MIDDLE"                );
    html_addElementToTileset(current_x + (3 * tile_width), current_y + (3 * tile_height), "ROCK_DARK_BOTTOM"                );

    html_addElementToTileset(current_x + (6 * tile_width), current_y + (0 * tile_height), "ROCK_DARK_TOP_RIGHT_EDGE"        );
    html_addElementToTileset(current_x + (5 * tile_width), current_y + (0 * tile_height), "ROCK_DARK_TOP_RIGHT_CONCAVE"     );
    html_addElementToTileset(current_x + (5 * tile_width), current_y + (1 * tile_height), "ROCK_DARK_RIGHT_EDGE"            );
    html_addElementToTileset(current_x + (5 * tile_width), current_y + (2 * tile_height), "ROCK_DARK_BOTTOM_RIGHT_EDGE"     );
    html_addElementToTileset(current_x + (4 * tile_width), current_y + (2 * tile_height), "ROCK_DARK_RIGHT_CONCAVE"         );
    html_addElementToTileset(current_x + (4 * tile_width), current_y + (3 * tile_height), "ROCK_DARK_BOTTOM_RIGHT_EDGE"     );

    ////////////////////////////////////////////////////
    // Ladder
    current_y =  5 * 32;
    current_x = 14 * 32;
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (0 * tile_height), "LADDER"                          );

    ////////////////////////////////////////////////////
    // Water
    current_y =  5 * 32;
    current_x = 11 * 32;
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (0 * tile_height), "WATER"                           );
    html_addElementToTileset(current_x + (1 * tile_width), current_y + (0 * tile_height), "WATER_SURFACE"                   );

    ////////////////////////////////////////////////////
    // Sky
    current_y = 5 * 32;
    current_x = 9 * 32;
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (0 * tile_height), "SKY"                             );

    ////////////////////////////////////////////////////
    // Bridge
    current_y = 13 * 32;
    current_x =  1 * 32;
    html_addElementToTileset(current_x + (0 * tile_width), current_y + (0 * tile_height), "BRIDGE_LEFT_POST"                );
    html_addElementToTileset(current_x + (1 * tile_width), current_y + (0 * tile_height), "BRIDGE_LEFT_A"                   );
    html_addElementToTileset(current_x + (1 * tile_width), current_y + (1 * tile_height), "BRIDGE_LEFT_B"                   );
    html_addElementToTileset(current_x + (1 * tile_width), current_y + (2 * tile_height), "BRIDGE_LEFT_C"                   );
    html_addElementToTileset(current_x + (2 * tile_width), current_y + (1 * tile_height), "BRIDGE_LEFT_D"                   );
    html_addElementToTileset(current_x + (2 * tile_width), current_y + (2 * tile_height), "BRIDGE_LEFT_E"                   );

    html_addElementToTileset(current_x + (3 * tile_width), current_y + (1 * tile_height), "BRIDGE_MIDDLE_RAIL"              );
    html_addElementToTileset(current_x + (3 * tile_width), current_y + (2 * tile_height), "BRIDGE_MIDDLE_WALKWAY"           );

    html_addElementToTileset(current_x + (4 * tile_width), current_y + (2 * tile_height), "BRIDGE_RIGHT_E"                  );
    html_addElementToTileset(current_x + (4 * tile_width), current_y + (1 * tile_height), "BRIDGE_RIGHT_D"                  );
    html_addElementToTileset(current_x + (5 * tile_width), current_y + (2 * tile_height), "BRIDGE_RIGHT_C"                  );
    html_addElementToTileset(current_x + (5 * tile_width), current_y + (1 * tile_height), "BRIDGE_RIGHT_B"                  );
    html_addElementToTileset(current_x + (5 * tile_width), current_y + (0 * tile_height), "BRIDGE_RIGHT_A"                  );
    html_addElementToTileset(current_x + (6 * tile_width), current_y + (0 * tile_height), "BRIDGE_RIGHT_POST"               );

    // Populate entities tab
    html_addEntitiesToEntitiesTab();
}