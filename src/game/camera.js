//////////////////////////////////////////////////////////////////////
// camera.js                                                        //
//     Formats the game canvas to follow the player or free roam in //
//     edit mode.                                                   //
//                                                                  //
//     Zoom settings can be applied to center closer on the player. //
//////////////////////////////////////////////////////////////////////
"use strict";

class Camera
{
    // followme must have:
    // pos:
    //     x, y
    // and:
    //     width, height
    // fields defined for Camera to work properly
    constructor(followme=null)
    {
        this.followme         = followme; // [object ] object the camera follows in its update function
        this.width            = 0       ; // [pixels ] width  of camera in pixels (for a canvas with 1:1 zoom)
        this.height           = 0       ; // [pixels ] height of camera in pixels (for a canvas with 1:1 zoom)
        this.x                = 0       ; // [integer] x position of the camera
        this.y                = 0       ; // [integer] y position of the camera
        this.screenpartitionx = 0       ; // [integer] artifact from the MusicBox
        this.screenpartitiony = 0       ; // [integer] artifact from the MusicBox
        this.dx               = 15.5    ; // [float  ] speed gradient for the camera in the x axis
        this.dy               = 15.5    ; // [float  ] speed gradient for the camera in the y axis
        this.zoomx            = 1       ; // [integer] zoom factor for the x axis
        this.zoomy            = 1       ; // [integer] zoom factor for the y axis
    }
    setZoom(zoomx, zoomy)
    {
        game_ctx.scale(zoomx, zoomy);
        this.zoomx *= zoomx;
        this.zoomy *= zoomy;
    }
    followEntity(entity)
    {
        this.followme = entity;
    }
    moveUp   () { this.y -= this.dy; }
    moveDown () { this.y += this.dy; }
    moveRight() { this.x += this.dx; }
    moveLeft () { this.x -= this.dx; }
    initialize(x, y, width, height)
    {
        this.screenpartitionx = x;
        this.screenpartitiony = y;
        this.width  = width ;
        this.height = height;
    }
    //////////////////////////////////////////////////////
    //                  snapToEntity                    //
    // Function:                                        //
    //     Following objects that are not the player    //
    // Return value:                                    //
    //     None                                         //
    //////////////////////////////////////////////////////
    snapToEntity(entity)
    {
        this.width  = game_canvas.width  / this.zoomx;
        this.height = game_canvas.height / this.zoomx;

        if (entity != null)
        {
            this.x = (entity.pos.x + entity.width  / 2) - this.width  / 2;
            this.y = (entity.pos.y + entity.height / 2) - this.height / 2;
        }

        // Experimenting with unbounded camera to make editing a little easier
        this.keepInBounds(false);
    }
    update(bEditMode=false)
    {
        // Center the camera around the followme object
        // +---------------------canvas.width----------------------+    
        // | camera.x, camera.y                x zoom factor: zoomx|
        // |                                   y zoom factor: zoomy|
        // |   +----canvas.width / zoomx-----+                     |
        // |   |                             |                     |
        // |   |                             |                     |
        // |   |      player.x,player.y      |canvas.height / zoomy|   canvas.height
        // |   |                             |                     |
        // |   |                             |                     |
        // |   +-----------------------------+                     |
        // |                                                       |
        // +-------------------------------------------------------+
        this.width  = game_canvas.width  / this.zoomx;
        this.height = game_canvas.height / this.zoomx;

        // Follow the player only if it's not in Edit mode
        if (!bEditMode && this.followme != null)
        {
            this.x = (this.followme.pos.x + this.followme.width  / 2) - this.width  / 2;
            this.y = (this.followme.pos.y + this.followme.height / 2) - this.height / 2;
        }

        // Experimenting with unbounded camera to make editing a little easier
        this.keepInBounds(!bEditMode);
    }
    keepInBounds(bKeepInBounds)
    {
        if (bKeepInBounds)
        {
            if (this.x < 0)                          this.x = 0;
            if (this.y < 0)                          this.y = 0;
            if (this.x > level.width  - this.width ) this.x = level.width  - this.width ;
            if (this.y > level.height - this.height) this.y = level.height - this.height;
        }
    }
}