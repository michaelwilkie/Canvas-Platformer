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
        5                   ,   /* x            */
        5                   ,   /* y            */
        SCREEN_WIDTH  / 2   ,   /* width        */
    4 * SCREEN_HEIGHT / 5   ,   /* height       */
        SCREEN_WIDTH        ,   /* innerwidth   */
        SCREEN_HEIGHT           /* innerheight  */
);

ui_edit_mode_component.addComponent
(
    ui_edit_mode_component.scroll_component
);

// Scroll is the first thing in the edit mode component.
// Adding a label on top of it.
var labelposx = 50;
var labelposy = 30;
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
    var every_other_n       =  0;
    var current_x           = 32;
    var current_y           =  0;
    var n = 10;
    
    for (var i = 0; i < tileset.length; i++)
    {
        if (DEBUG_MODE) console.log((every_other_n % 4 == 0) + " " + every_other_n)
        if (every_other_n % n == 0)
        {
            every_other_n   =  0;
            current_x       = 32;
            current_y      += 32;
        }

        var from_tileset = tileset[i];
        var tile = new Tile
        (
            current_x + ui_edit_mode_component.scroll_component.x, 
            current_y + ui_edit_mode_component.scroll_component.y, 
            from_tileset.width  , // width for the tileset image
            from_tileset.height , // height for the tileset image
            [0]                 , // framelist
            from_tileset.x      , // x coordinate into the tileset image
            from_tileset.y      , // y coordinate into the tileset image
            tileset_img         , // img object of the tileset
            tileset[i].name
        );

        ui_edit_mode_component.scroll_component.addComponent(tile);
        current_x += tile.width;
        every_other_n++;
    }
}
ui_edit_mode_component.update = function()
{
    this.draw_If_True(gameglobals.mode == GAME_MODE_ENUM.EDIT_MODE);
    this.component_list.forEach
    (
        function(elem)
        {
            elem.update();
        }
    );
}
ui_component_list.push(ui_edit_mode_component);