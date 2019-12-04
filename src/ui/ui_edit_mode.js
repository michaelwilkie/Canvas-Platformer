/////////////////////////////////////////////////////////
// ui_edit_mode.js                                     //
//     Will be the user-interface for level editing    //
/////////////////////////////////////////////////////////
"use strict";

var ui_edit_mode_component = new UI_Component();

// Easier to reference scroll component like this
// rather than .getComponent(0)
ui_edit_mode_component.scroll_component = new UI_Scroll_Component
(
        5                   ,
        5                   ,
        SCREEN_WIDTH  / 2   ,
    4 * SCREEN_HEIGHT / 5   ,
        SCREEN_WIDTH        ,
        SCREEN_HEIGHT
);

ui_edit_mode_component.addComponent
(
    ui_edit_mode_component.scroll_component
);

// Scroll is the first thing in the edit mode component.
// Adding a label on top of it.
ui_edit_mode_component.scroll_component.addComponent
(
    new UI_Label
    (
        "Tiles"               ,     /* text   */
        SCREEN_WIDTH      / 10,     /* x      */
        SCREEN_HEIGHT     / 10,     /* y      */
        4 * SCREEN_WIDTH  / 5 ,     /* width  */
        4 * SCREEN_HEIGHT / 5       /* height */
    )
);

////////////////////////////////////////////////////////
//             initialize_edit_mode_tiles             //
// Function:                                          //
//     Goes through each element of the tileset array //
//     and organizes them into the scroll component.  //
// Return value:                                      //
//     None                                           //
////////////////////////////////////////////////////////
function initialize_edit_mode_tiles()
{
    // Inserting the tileset into the scroll component
    var every_other_n       = 0;
    var current_x           = 32;
    var current_y           = 0;
    var n = 10;
    
    for (var i = 0; i < tileset.length; i++)
    {
        if (DEBUG_MODE) console.log((every_other_n % 4 == 0) + " " + every_other_n)
        if (every_other_n % n == 0)
        {
            every_other_n   =   0;
            current_x       =   32;
            current_y       += 32;
        }

        var from_tileset = tileset[i];
        var tile = new Tile
        (
            current_x + ui_edit_mode_component.scroll_component.x, 
            current_y + ui_edit_mode_component.scroll_component.y, 
            from_tileset.w  , // width for the tileset image
            from_tileset.h  , // height for the tileset image
            [0]             , // framelist
            from_tileset.x  , // x coordinate into the tileset image
            from_tileset.y  , // y coordinate into the tileset image
            tileset_img
        );

        ui_edit_mode_component.scroll_component.addComponent(tile);
        current_x += tile.w;
        every_other_n++;
    }
}
ui_edit_mode_component.update = function()
{
    this.draw_If_True(gameglobals.mode == GAME_MODE_ENUM.EDIT_MODE);
    this.scroll_component.getComponent(0).setText("Edit Mode: " + player.vel.x.toFixed(2) + ", " + player.vel.y.toFixed(2));
    this.component_list.forEach
    (
        function(elem)
        {
            elem.update();
        }
    );
}
ui_component_list.push(ui_edit_mode_component);