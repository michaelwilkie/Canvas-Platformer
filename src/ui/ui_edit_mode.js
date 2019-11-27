/////////////////////////////////////////////////////////
// ui_edit_mode.js                                     //
//     Will be the user-interface for level editing    //
//     Need to implement:                              //
//       • window scrolling (to display lots of items) //
/////////////////////////////////////////////////////////
"use strict";

var ui_edit_mode_component = new UI_Component();

ui_edit_mode_component.addComponent
(
    new UI_Scroll_Component
    (
        10                  ,
        10                  ,
        SCREEN_WIDTH  / 2   ,
        SCREEN_HEIGHT / 2   ,
        SCREEN_WIDTH        ,
        SCREEN_HEIGHT
    )
);

// Scroll is the first thing in the edit mode component.
// Adding a label on top of it
ui_edit_mode_component.getComponent(0).addComponent
(
    new UI_Label
    (
        "Edit Mode"           ,     /* text   */
        SCREEN_WIDTH      / 10,     /* x      */
        SCREEN_HEIGHT     / 10,     /* y      */
        4 * SCREEN_WIDTH  / 5 ,     /* width  */
        4 * SCREEN_HEIGHT / 5       /* height */
    )
)

//
// GAME_MODE_ENUM                       // game mode enumerator
//    EDIT_MODE: 0                      // level editing mode
//    PLAY_MODE: 1                      // normal playing mode
//
// gameglobals
//    time: 0                           // game time
//    fps : 60                          // framerate
//    dt  : 0.15                        // delta time
//    mode: GAME_MODE_ENUM.PLAY_MODE    // current game mode
//

ui_edit_mode_component.update = function()
{
    this.draw_If_True(gameglobals.mode == GAME_MODE_ENUM.EDIT_MODE);
    this.getComponent(0).getComponent(0).setText("Edit Mode: " + player.vel.x.toFixed(2) + ", " + player.vel.y.toFixed(2));
    this.component_list.forEach(function(elem)
    {
        elem.update();
    });
}
ui_component_list.push(ui_edit_mode_component);