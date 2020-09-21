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

    if (gamecore.mode == GAME_MODE_ENUM.EDIT_MODE)
    {
        ///////////////////////////////////////////////////////////////////
        // Something from the Edit Mode component was previously clicked //
        ///////////////////////////////////////////////////////////////////
        if (html_selected_object != null)
        {
            if (mdownleft)
            {
                //////////////////////////////////////////////////////////////////////////////
                // Only create a new object if it's an object selected from the tileset div //
                //////////////////////////////////////////////////////////////////////////////
                if (html_selected_object.parentElement == html_div_tileset)
                {
                    game_insertSelectedObject();
                }
                else
                {
                    html_selected_object.entity_reference.pos = game_calculateRelativeMousePosition();

                    game_unselectObject();
                }
            }
            else
            {
                // Restore the position if we don't move it to a new spot
                game_restoreSelectedEntityPosition(mouseselectedentity);

                game_unselectObject();
            }
        }
        /////////////////////////////////////////
        // A tile from game canvas is selected //
        /////////////////////////////////////////
        else
        {
            if (html_selected_layer != null)
            {
                var camera_scale_x  = playercamera.zoomx;
                var camera_scale_y  = playercamera.zoomy;

                var new_position    = game_calculateRelativeMousePosition();

                ui_mouse_events_previous_new_x = new_position.x;
                ui_mouse_events_previous_new_y = new_position.y;

                var scaled_mouse_position = {
                    x: (mousepos.x / camera_scale_x) + playercamera.x, 
                    y: (mousepos.y / camera_scale_y) + playercamera.y
                };

                if (mouseselectedentity == null)
                {
                    for (var i = 0; i < entlist.length; i++)
                    {
                        if (entlist[i] instanceof Tile 
                        && checkPointCollision(entlist[i], scaled_mouse_position))
                        {
                            if (mdownleft)
                            {
                                // Save the position before we move it
                                game_saveSelectedEntityPosition(entlist[i]);

                                mouseselectedentity = entlist[i];
                            }
                            else if (mdownright)
                            {
                                // Restore the position if we don't move it to a new spot
                                game_restoreSelectedEntityPosition(entlist[i]);

                                game_unselectObject();
                            }
                            break;
                        } // end of if (entlist[i]...&& checkPointCollision...)

                    } // end of for (entlist)

                } // end of if (mouseselectedentity == null)

                ///////////////////////////////////////
                // Release a tile from being dragged //
                ///////////////////////////////////////
                else
                {
                    if (mdownleft)
                    {
                        mouseselectedentity.pos = new_position;
                        mouseselectedentity = null;
                        html_applyDefaultStyleToImg(html_selected_object);
                        html_selected_object = null;
                        selected_entity_pos = null;
                    }
                    else if (mdownright)
                    {
                        // Restore the position if we don't move it to a new spot
                        game_restoreSelectedEntityPosition(mouseselectedentity);

                        game_unselectObject();
                    }

                }

            } // end of if (html_selected_layer != null)

            ////////////////////////////////
            // I forgot to select a layer //
            ////////////////////////////////
            else
            {
                html_layersErrorAnimation();
            }
            
        } // end if (html_selected_object != null) else { }

    } // end if (gamecore.mode == GAME_MODE_ENUM.EDIT_MODE)

}

function ui_mouse_move(event)
{
    mousepos = getMousePos(event);

    if (gamecore.mode == GAME_MODE_ENUM.EDIT_MODE)
    {
        // mouseselectedentity is assigned in ui_scroll_component.js and html_func.js
        if (mouseselectedentity != null)
        {
            var new_position = game_calculateRelativeMousePosition();
            
            mouseselectedentity.pos.x = new_position.x;
            mouseselectedentity.pos.y = new_position.y;

            if (mdownleft)
            {
                if (new_position.x != ui_mouse_events_previous_new_x
                 || new_position.y != ui_mouse_events_previous_new_y)
                {
                    game_insertSelectedObject();
                }
            }

            ui_mouse_events_previous_new_x = new_position.x;
            ui_mouse_events_previous_new_y = new_position.y;
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