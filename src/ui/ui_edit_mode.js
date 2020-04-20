/////////////////////////////////////////////////////////
// ui_edit_mode.js                                     //
//     Will be the user-interface for level editing    //
/////////////////////////////////////////////////////////
"use strict";

var ui_edit_mode_component;

function initialize_edit_mode_component()
{
    ui_edit_mode_component = new UI_Component();

    var labelposx    = 0;
    var labelposy    = 0;

    var buttonposx   = 0;
    var buttonposy   = 0;
    var buttonwidth  = 0;
    var buttonheight = 0;

    // Easier to reference scroll component like this
    // rather than .getComponent(0)
    ui_edit_mode_component.scroll_component = new UI_Scroll_Component
    (
            5                   ,   /* x            */
            5                   ,   /* y            */
            SCREEN_WIDTH  / 2   ,   /* width        */
        2 * SCREEN_HEIGHT / 5   ,   /* height       */
            SCREEN_WIDTH        ,   /* innerwidth   */
            SCREEN_HEIGHT           /* innerheight  */
    );

    // Push it inside edit mode list so its draw() function will call scroll_component's draw() function
    ui_edit_mode_component.addComponent
    (
        ui_edit_mode_component.scroll_component
    );

    labelposx = 50;
    labelposy = 30;
    ui_edit_mode_component.scroll_component.addComponent
    (
        new UI_Label
        (
            "Tiles"  ,  /* text   */
            labelposx,  /* x      */
            labelposy,  /* y      */
            150      ,  /* width  */
            30          /* height */
        )
    );

    labelposx = 50;
    labelposy = 400;
    ui_edit_mode_component.scroll_component.addComponent
    (
        new UI_Label
        (
            "Layers" ,  /* text   */
            labelposx,  /* x      */
            labelposy,  /* y      */
            150      ,  /* width  */
            30          /* height */
        )
    );

    buttonposx   = 50 ;
    buttonposy   = 450;
    buttonwidth  = 150;
    buttonheight = 30 ;
    ui_edit_mode_component.scroll_component.addComponent
    (
        new UI_Button
        (
            "Layer:"    , // text
            buttonposx  , // x
            buttonposy  , // y
            buttonwidth , // width
            buttonheight, // height
            null        , // imgsrc (null for now, don't want to load any image in particular)
            "black"       // button_background_color
        )
    );

    ui_edit_mode_component.update = function()
    {
        this.draw_If_True(gamecore.mode == GAME_MODE_ENUM.EDIT_MODE);
        this.component_list.forEach
        (
            function(elem)
            {
                elem.update();
            }
        );
    }

    ui_component_list.push(ui_edit_mode_component);
}
////////////////////////////////////////////////////////////////////////////
//                        initialize_edit_mode_tiles                      //
// Function:                                                              //
//     Hard coding the position of the tileset into the scroll component. //
//     Moving in units of tile_width and tile_height.                     //
//     I am hard coding current_x and current_y so each set of tiles      //
//     may have their relative position.                                  //
//     Any changes to an individual current_x, current_y line won't       //
//     affect the position of the rest of the tiles.                      //
// Return value:                                                          //
//     None                                                               //
////////////////////////////////////////////////////////////////////////////
function initialize_edit_mode_tiles()
{
    // Inserting the tileset into the scroll component
    var current_x   = 32;
    var current_y   = 32;
    var tile_width  = 32;
    var tile_height = 32;

    ////////////////////////////////////////////////////
    // Grass
    addToScrollComponent(current_x + (0 * tile_width), current_y + (0 * tile_height), "GRASS_TOP_LEFT_EDGE"             );
    addToScrollComponent(current_x + (1 * tile_width), current_y + (0 * tile_height), "GRASS_TOP"                       );
    addToScrollComponent(current_x + (2 * tile_width), current_y + (0 * tile_height), "GRASS_TOP_RIGHT_EDGE"            );

    ////////////////////////////////////////////////////
    // Flower
    current_y =  1 * 32;
    current_x =  5 * 32;
    addToScrollComponent(current_x + (0 * tile_width), current_y + (0 * tile_height), "PLANT_FLOWER"                    );
    
    ////////////////////////////////////////////////////
    // Mushrooms
    current_y =  1 * 32;
    current_x =  7 * 32;
    addToScrollComponent(current_x + (0 * tile_width), current_y + (0 * tile_height), "PLANT_MUSHROOM_SMALL"            );
    addToScrollComponent(current_x + (1 * tile_width), current_y + (0 * tile_height), "PLANT_MUSHROOM_LARGE"            );

    ////////////////////////////////////////////////////
    // Small Tree
    current_y =  1 * 32;
    current_x = 10 * 32;
    addToScrollComponent(current_x + (0 * tile_width), current_y + (1 * tile_height), "PLANT_TREE_BOTTOM_LEFT"          );
    addToScrollComponent(current_x + (1 * tile_width), current_y + (1 * tile_height), "PLANT_TREE_BOTTOM_RIGHT"         );
    addToScrollComponent(current_x + (0 * tile_width), current_y + (0 * tile_height), "PLANT_TREE_TOP_LEFT"             );
    addToScrollComponent(current_x + (1 * tile_width), current_y + (0 * tile_height), "PLANT_TREE_TOP_RIGHT"            );

    ////////////////////////////////////////////////////
    // Large Tree
    current_y = 1 * 32;
    current_x = 13 * 32;
    addToScrollComponent(current_x + (0 * tile_width), current_y + (2 * tile_height), "PLANT_TREE_LARGE_LEFT_TRUNK"     );
    addToScrollComponent(current_x + (0 * tile_width), current_y + (1 * tile_height), "PLANT_TREE_LARGE_LEFT_BRANCHES"  );
    addToScrollComponent(current_x + (0 * tile_width), current_y + (0 * tile_height), "PLANT_TREE_LARGE_LEFT_LEAVES"    );
    addToScrollComponent(current_x + (1 * tile_width), current_y + (2 * tile_height), "PLANT_TREE_LARGE_MIDDLE_TRUNK"   );
    addToScrollComponent(current_x + (1 * tile_width), current_y + (1 * tile_height), "PLANT_TREE_LARGE_MIDDLE_BRANCHES");
    addToScrollComponent(current_x + (1 * tile_width), current_y + (0 * tile_height), "PLANT_TREE_LARGE_MIDDLE_LEAVES"  );
    addToScrollComponent(current_x + (2 * tile_width), current_y + (2 * tile_height), "PLANT_TREE_LARGE_RIGHT_TRUNK"    );
    addToScrollComponent(current_x + (2 * tile_width), current_y + (1 * tile_height), "PLANT_TREE_LARGE_RIGHT_BRANCHES" );
    addToScrollComponent(current_x + (2 * tile_width), current_y + (0 * tile_height), "PLANT_TREE_LARGE_RIGHT_LEAVES"   );

    ////////////////////////////////////////////////////
    // Bright Pillar
    current_y = 3 * 32;
    current_x = 1 * 32;
    addToScrollComponent(current_x + (0 * tile_width), current_y + (0 * tile_height), "PILLAR_BRIGHT_TOP"               );
    addToScrollComponent(current_x + (0 * tile_width), current_y + (1 * tile_height), "PILLAR_BRIGHT_MIDDLE"            );
    addToScrollComponent(current_x + (0 * tile_width), current_y + (2 * tile_height), "PILLAR_BRIGHT_BOTTOM"            );

    ////////////////////////////////////////////////////
    // Bright Rock
    current_y = 3 * 32;
    current_x = 2 * 32;
    addToScrollComponent(current_x + (0 * tile_width), current_y + (0 * tile_height), "ROCK_BRIGHT_TOP_LEFT_EDGE"       );
    addToScrollComponent(current_x + (1 * tile_width), current_y + (1 * tile_height), "ROCK_BRIGHT_LEFT_EDGE"           );
    addToScrollComponent(current_x + (1 * tile_width), current_y + (2 * tile_height), "ROCK_BRIGHT_BOTTOM_LEFT_EDGE"    );
    addToScrollComponent(current_x + (1 * tile_width), current_y + (0 * tile_height), "ROCK_BRIGHT_TOP_LEFT_CONCAVE"    );  
    addToScrollComponent(current_x + (2 * tile_width), current_y + (2 * tile_height), "ROCK_BRIGHT_LEFT_CONCAVE"        );
    addToScrollComponent(current_x + (2 * tile_width), current_y + (3 * tile_height), "ROCK_BRIGHT_BOTTOM_LEFT_EDGE"    );

    addToScrollComponent(current_x + (2 * tile_width), current_y + (0 * tile_height), "ROCK_BRIGHT_TOP_MIDDLE"          );
    addToScrollComponent(current_x + (3 * tile_width), current_y + (0 * tile_height), "ROCK_BRIGHT_TOP_MIDDLE"          );
    addToScrollComponent(current_x + (4 * tile_width), current_y + (0 * tile_height), "ROCK_BRIGHT_TOP_MIDDLE"          );
    addToScrollComponent(current_x + (2 * tile_width), current_y + (1 * tile_height), "ROCK_BRIGHT_MIDDLE"              );
    addToScrollComponent(current_x + (3 * tile_width), current_y + (1 * tile_height), "ROCK_BRIGHT_MIDDLE"              );
    addToScrollComponent(current_x + (3 * tile_width), current_y + (2 * tile_height), "ROCK_BRIGHT_MIDDLE"              );
    addToScrollComponent(current_x + (4 * tile_width), current_y + (1 * tile_height), "ROCK_BRIGHT_MIDDLE"              );
    addToScrollComponent(current_x + (3 * tile_width), current_y + (3 * tile_height), "ROCK_BRIGHT_BOTTOM"              );

    addToScrollComponent(current_x + (6 * tile_width), current_y + (0 * tile_height), "ROCK_BRIGHT_TOP_RIGHT_EDGE"      );
    addToScrollComponent(current_x + (5 * tile_width), current_y + (0 * tile_height), "ROCK_BRIGHT_TOP_RIGHT_CONCAVE"   );
    addToScrollComponent(current_x + (5 * tile_width), current_y + (1 * tile_height), "ROCK_BRIGHT_RIGHT_EDGE"          );
    addToScrollComponent(current_x + (5 * tile_width), current_y + (2 * tile_height), "ROCK_BRIGHT_BOTTOM_RIGHT_EDGE"   );
    addToScrollComponent(current_x + (4 * tile_width), current_y + (2 * tile_height), "ROCK_BRIGHT_RIGHT_CONCAVE"       );
    addToScrollComponent(current_x + (4 * tile_width), current_y + (3 * tile_height), "ROCK_BRIGHT_BOTTOM_RIGHT_EDGE"   );

    ////////////////////////////////////////////////////
    // Dark Pillar
    current_y = 8 * 32;
    current_x = 1 * 32;
    addToScrollComponent(current_x + (0 * tile_width), current_y + (0 * tile_height), "PILLAR_DARK_TOP"                 );
    addToScrollComponent(current_x + (0 * tile_width), current_y + (1 * tile_height), "PILLAR_DARK_MIDDLE"              );
    addToScrollComponent(current_x + (0 * tile_width), current_y + (2 * tile_height), "PILLAR_DARK_BOTTOM"              );

    ////////////////////////////////////////////////////
    // Dark Rock
    current_y = 8 * 32;
    current_x = 2 * 32;
    addToScrollComponent(current_x + (0 * tile_width), current_y + (0 * tile_height), "ROCK_DARK_TOP_LEFT_EDGE"         );
    addToScrollComponent(current_x + (1 * tile_width), current_y + (1 * tile_height), "ROCK_DARK_LEFT_EDGE"             );
    addToScrollComponent(current_x + (1 * tile_width), current_y + (2 * tile_height), "ROCK_DARK_BOTTOM_LEFT_EDGE"      );
    addToScrollComponent(current_x + (1 * tile_width), current_y + (0 * tile_height), "ROCK_DARK_TOP_LEFT_CONCAVE"      );  
    addToScrollComponent(current_x + (2 * tile_width), current_y + (2 * tile_height), "ROCK_DARK_LEFT_CONCAVE"          );
    addToScrollComponent(current_x + (2 * tile_width), current_y + (3 * tile_height), "ROCK_DARK_BOTTOM_LEFT_EDGE"      );

    addToScrollComponent(current_x + (2 * tile_width), current_y + (0 * tile_height), "ROCK_DARK_TOP_MIDDLE"            );
    addToScrollComponent(current_x + (3 * tile_width), current_y + (0 * tile_height), "ROCK_DARK_TOP_MIDDLE"            );
    addToScrollComponent(current_x + (4 * tile_width), current_y + (0 * tile_height), "ROCK_DARK_TOP_MIDDLE"            );
    addToScrollComponent(current_x + (2 * tile_width), current_y + (1 * tile_height), "ROCK_DARK_MIDDLE"                );
    addToScrollComponent(current_x + (3 * tile_width), current_y + (1 * tile_height), "ROCK_DARK_MIDDLE"                );
    addToScrollComponent(current_x + (3 * tile_width), current_y + (2 * tile_height), "ROCK_DARK_MIDDLE"                );
    addToScrollComponent(current_x + (4 * tile_width), current_y + (1 * tile_height), "ROCK_DARK_MIDDLE"                );
    addToScrollComponent(current_x + (3 * tile_width), current_y + (3 * tile_height), "ROCK_DARK_BOTTOM"                );

    addToScrollComponent(current_x + (6 * tile_width), current_y + (0 * tile_height), "ROCK_DARK_TOP_RIGHT_EDGE"        );
    addToScrollComponent(current_x + (5 * tile_width), current_y + (0 * tile_height), "ROCK_DARK_TOP_RIGHT_CONCAVE"     );
    addToScrollComponent(current_x + (5 * tile_width), current_y + (1 * tile_height), "ROCK_DARK_RIGHT_EDGE"            );
    addToScrollComponent(current_x + (5 * tile_width), current_y + (2 * tile_height), "ROCK_DARK_BOTTOM_RIGHT_EDGE"     );
    addToScrollComponent(current_x + (4 * tile_width), current_y + (2 * tile_height), "ROCK_DARK_RIGHT_CONCAVE"         );
    addToScrollComponent(current_x + (4 * tile_width), current_y + (3 * tile_height), "ROCK_DARK_BOTTOM_RIGHT_EDGE"     );

    ////////////////////////////////////////////////////
    // Ladder
    current_y =  5 * 32;
    current_x = 16 * 32;
    addToScrollComponent(current_x + (0 * tile_width), current_y + (0 * tile_height), "LADDER"                          );

    ////////////////////////////////////////////////////
    // Water
    current_y =  5 * 32;
    current_x = 13 * 32;
    addToScrollComponent(current_x + (0 * tile_width), current_y + (0 * tile_height), "WATER"                           );
    addToScrollComponent(current_x + (1 * tile_width), current_y + (0 * tile_height), "WATER_SURFACE"                   );

    ////////////////////////////////////////////////////
    // Sky
    current_y =  5 * 32;
    current_x = 10 * 32;
    addToScrollComponent(current_x + (0 * tile_width), current_y + (0 * tile_height), "SKY"                             );

    ////////////////////////////////////////////////////
    // Bridge
    current_y =  7 * 32;
    current_x = 10 * 32;
    addToScrollComponent(current_x + (0 * tile_width), current_y + (0 * tile_height), "BRIDGE_LEFT_POST"                );
    addToScrollComponent(current_x + (1 * tile_width), current_y + (0 * tile_height), "BRIDGE_LEFT_A"                   );
    addToScrollComponent(current_x + (1 * tile_width), current_y + (1 * tile_height), "BRIDGE_LEFT_B"                   );
    addToScrollComponent(current_x + (1 * tile_width), current_y + (2 * tile_height), "BRIDGE_LEFT_C"                   );
    addToScrollComponent(current_x + (2 * tile_width), current_y + (1 * tile_height), "BRIDGE_LEFT_D"                   );
    addToScrollComponent(current_x + (2 * tile_width), current_y + (2 * tile_height), "BRIDGE_LEFT_E"                   );

    addToScrollComponent(current_x + (3 * tile_width), current_y + (1 * tile_height), "BRIDGE_MIDDLE_RAIL"              );
    addToScrollComponent(current_x + (3 * tile_width), current_y + (2 * tile_height), "BRIDGE_MIDDLE_WALKWAY"           );

    addToScrollComponent(current_x + (4 * tile_width), current_y + (2 * tile_height), "BRIDGE_RIGHT_E"                  );
    addToScrollComponent(current_x + (4 * tile_width), current_y + (1 * tile_height), "BRIDGE_RIGHT_D"                  );
    addToScrollComponent(current_x + (5 * tile_width), current_y + (2 * tile_height), "BRIDGE_RIGHT_C"                  );
    addToScrollComponent(current_x + (5 * tile_width), current_y + (1 * tile_height), "BRIDGE_RIGHT_B"                  );
    addToScrollComponent(current_x + (5 * tile_width), current_y + (0 * tile_height), "BRIDGE_RIGHT_A"                  );
    addToScrollComponent(current_x + (6 * tile_width), current_y + (0 * tile_height), "BRIDGE_RIGHT_POST"               );
}

///////////////////////////////////////////////////////
//                addToScrollComponent               //
// Function:                                         //
//     Helper function of initialize_edit_mode_tiles //
// Return value:                                     //
//     none                                          //
///////////////////////////////////////////////////////
function addToScrollComponent(x, y, tilename)
{
    var from_tileset = getTileByName(tilename);
    var tile = new Tile
    (
        x + ui_edit_mode_component.scroll_component.x, 
        y + ui_edit_mode_component.scroll_component.y, 
        from_tileset.width  , // width  for the tileset image
        from_tileset.height , // height for the tileset image
        [0]                 , // framelist
        from_tileset.x      , // x coordinate into the tileset image
        from_tileset.y      , // y coordinate into the tileset image
        tileset_img         , // img object of the tileset
        tilename
    );
    ui_edit_mode_component.scroll_component.addComponent(tile);
}
