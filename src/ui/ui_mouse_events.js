////////////////////////////////////////////////////////////////
// ui_mouse_events.js                                         //
//     Contains the functions used for mouse interaction with //
//     the ui canvas.                                         //
////////////////////////////////////////////////////////////////
"use strict";

var ui_mouse_events_previous_new_x = 0;
var ui_mouse_events_previous_new_y = 0;

function ui_mouse_wheel(event)
{
    mwheel = true;
    if (event.deltaY < 0)
    {
        mwheelup = true;
        mwheeldown = false;
    }
    else
    {
        mwheeldown = true;
        mwheelup = false;
    }
}

function ui_mouse_down(event)
{
    console.log('clickity clockity');

    switch(event.which)
    {
        case 1:
        {
            // left click
            mdownleft = true;
            console.log("leftity clickity");
            break;
        }
        case 2:
        {
            // middle click
            break;
        }
        case 3:
        {
            // right click
            mdownright = true;
            console.log("rightity clockity");
            break;
        }
    }
    mousestartpos = getMousePos(event);
    mousepos = mousestartpos;

    if (gameglobals.mode == GAME_MODE_ENUM.EDIT_MODE)
    {
        ///////////////////////////////////////////////////////////////////
        // Something from the Edit Mode component was previously clicked //
        ///////////////////////////////////////////////////////////////////
        if (html_selectedObject != null)
        {
            if (mdownleft)
            {
                pushToLayer
                (
                    mouseselectedentity,    // entity
                    "foreground1"           // layer name
                );
                mouseselectedentity = addTile(mouseselectedentity.pos.x, mouseselectedentity.pos.y, getTileByName(mouseselectedentity.name));
            }
            else
            {
                game_unselectObject();
            }
        }
        /////////////////////////////////////////
        // A tile from game canvas is selected //
        /////////////////////////////////////////
        else
        {
            var cursor_grid_multiples_x     = Math.floor(mousepos.x     / GRID_TIGHTNESS);
            var cursor_grid_multiples_y     = Math.floor(mousepos.y     / GRID_TIGHTNESS);

            var camera_grid_multiples_x     = Math.floor(playercamera.x / GRID_TIGHTNESS);
            var camera_grid_multiples_y     = Math.floor(playercamera.y / GRID_TIGHTNESS);
            
            var camera_scale_x              = playercamera.zoomx;
            var camera_scale_y              = playercamera.zoomy;

            var camera_relative_position_x  = (camera_grid_multiples_x * GRID_TIGHTNESS);
            var camera_relative_position_y  = (camera_grid_multiples_y * GRID_TIGHTNESS);

            var cursor_relative_position_x  = (cursor_grid_multiples_x * GRID_TIGHTNESS);
            var cursor_relative_position_y  = (cursor_grid_multiples_y * GRID_TIGHTNESS);

            var new_x = (cursor_relative_position_x / camera_scale_x) + camera_relative_position_x;
            var new_y = (cursor_relative_position_y / camera_scale_y) + camera_relative_position_y;

            ui_mouse_events_previous_new_x = new_x;
            ui_mouse_events_previous_new_y = new_y;

            var truncated_mousepos = {x: new_x, y: new_y};

            var scaled_mouse_position = {
                x: (mousepos.x / camera_scale_x) + playercamera.x, 
                y: (mousepos.y / camera_scale_y) + playercamera.y
            };

            if (mouseselectedentity == null)
            {
                for (var i = 0; i < entlist.length; i++)
                {
                    ////////////////////////////////////////////
                    // TO DO:                                 //
                    // Add per layer click drag functionality //
                    ////////////////////////////////////////////
                    if (entlist[i] instanceof Tile 
                    && checkPointCollision(entlist[i], scaled_mouse_position))
                    {
                        if (mdownleft)
                        {
                            mouseselectedentity = entlist[i];
                        }
                        else if (mdownright)
                        {
                            game_unselectObject();
                        }
                        break;
                    }
                }
            }
            ///////////////////////////////////////
            // Release a tile from being dragged //
            ///////////////////////////////////////
            else
            {
                if (mdownleft)
                {
                    mouseselectedentity.pos = truncated_mousepos;
                    mouseselectedentity = null;
                    html_applyDefaultStyleToImg(html_selectedObject);
                    html_selectedObject = null;
                }
                else if (mdownright)
                {
                    game_unselectObject();
                }

            }
        } // end if (html_selectedObject != null) else { }

    } // end if (gameglobals.mode == GAME_MODE_ENUM.EDIT_MODE)

}

function ui_mouse_move(event)
{
    mousepos = getMousePos(event);

    if (gameglobals.mode == GAME_MODE_ENUM.EDIT_MODE)
    {
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

        // mouseselectedentity is assigned in ui_scroll_component.js and html_func.js
        if (mouseselectedentity != null)
        {
            var cursor_grid_multiples_x     = Math.floor(mousepos.x     / GRID_TIGHTNESS);
            var cursor_grid_multiples_y     = Math.floor(mousepos.y     / GRID_TIGHTNESS);

            var camera_grid_multiples_x     = Math.floor(playercamera.x / GRID_TIGHTNESS);
            var camera_grid_multiples_y     = Math.floor(playercamera.y / GRID_TIGHTNESS);
            
            var camera_scale_x              = playercamera.zoomx;
            var camera_scale_y              = playercamera.zoomy;

            var camera_relative_position_x  = (camera_grid_multiples_x * GRID_TIGHTNESS);
            var camera_relative_position_y  = (camera_grid_multiples_y * GRID_TIGHTNESS);

            var cursor_relative_position_x  = (cursor_grid_multiples_x * GRID_TIGHTNESS);
            var cursor_relative_position_y  = (cursor_grid_multiples_y * GRID_TIGHTNESS);

            var new_x = (cursor_relative_position_x / camera_scale_x) + camera_relative_position_x;
            var new_y = (cursor_relative_position_y / camera_scale_y) + camera_relative_position_y;

            mouseselectedentity.pos.x = new_x;
            mouseselectedentity.pos.y = new_y;
            if (mdownleft)
            {
                if (new_x != ui_mouse_events_previous_new_x
                 || new_y != ui_mouse_events_previous_new_y)
                {
                    pushToLayer
                    (
                        mouseselectedentity,    // entity
                        "foreground1"           // layer name
                    );
                    mouseselectedentity = addTile(mouseselectedentity.pos.x, mouseselectedentity.pos.y, getTileByName(mouseselectedentity.name));
                }
            }

            ui_mouse_events_previous_new_x = new_x;
            ui_mouse_events_previous_new_y = new_y;
        } // end if (mouseselectedentity != null)
        else
        {
            mousedragbox = {x: mousestartpos.x -  playercamera.x , y: mousestartpos.y - playercamera.y,
                            w: mousepos.x      -  mousestartpos.x, h: mousepos.y      - mousestartpos.y};
        }
    } // end if (gameglobals.mode == GAME_MODE_ENUM.EDIT_MODE)
}

function ui_mouse_up(event)
{
    switch(event.which)
    {
        case 1:
        {
            // left click
            mdownleft = false;
            break;
        }
        case 2:
        {
            // middle click
            break;
        }
        case 3:
        {
            // right click
            mdownright = false;
            break;
        }
    }

    mousepos = getMousePos(event);
}