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
        this.followme = followme;
        this.width            = 0  ;
        this.height           = 0  ;
        this.x                = 0  ;
        this.y                = 0  ;
        this.screenpartitionx = 0  ;
        this.screenpartitiony = 0  ;
        this.dx               = 5.5;
        this.dy               = 5.5;
        this.zoomx            = 1  ;
        this.zoomy            = 1  ;
    }
    setZoom(zoomx, zoomy)
    {
        ctx.scale(zoomx, zoomy);
        this.zoomx = zoomx;
        this.zoomy = zoomy;
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
    update(bEditMode=false)
    {
        // Center the camera around the followme object
        // +---------------------canvas.width----------------------+    
        // | camera.x, camera.y                x zoom factor: zoomx|
        // |                                   y zoom factor: zoomy|
        // |   +-----canvas.w / zoomx--------+                     |
        // |   |                             |                     |
        // |   |                             |                     |
        // |   |      player.x,player.y      |canvas.height / zoomy|   canvas.height
        // |   |                             |                     |
        // |   |                             |                     |
        // |   +-----------------------------+                     |
        // |                                                       |
        // +-------------------------------------------------------+
        this.width  = canvas.width  / this.zoomx;
        this.height = canvas.height / this.zoomx;

        if (!bEditMode)
        {
            this.x = (this.followme.pos.x + this.followme.w / 2) - this.width  / 2;
            this.y = (this.followme.pos.y + this.followme.h / 2) - this.height / 2;
        }

        // Keep the camera within bounds
        if (this.x < 0)                          this.x = 0;
        if (this.y < 0)                          this.y = 0;
        if (this.x > level.width  - this.width ) this.x = level.width  - this.width ;
        if (this.y > level.height - this.height) this.y = level.height - this.height;
    }
}