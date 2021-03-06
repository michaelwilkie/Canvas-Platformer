///////////////////////////////////////////////////////////////////////////////////////
//      class Entity                                                                 //
// Base class to all objects (I think so).                                           //
// Some classes may have their own drawing and collision functions.                  //
// Usually each class calls this class' (as a super class) update function.          //
//                                                                                   //
// Defaults:                                                                         //
// pos           :      x:  x, y:  y       position in the level                     //
// vel           :      x:  0, y:  0       velocity (units per frame)                //
// acc           :      x:  0, y:  0       acceleration (units per frame^2)          //
// gravity       :      x:  0, y:  0       gravity (units per frame^2)               //
// friction      :      x:  0, y:  0       friction (units per frame^2)              //
// maxvel        :      x: 10, y: 10       maximum velocity                          //
// angle         :      0                  angle (*deprecated*)                      //
// anglerate     :      0                  rate of change for angle (*deprecated*)   //
// scale         :      1                  size multiplier to be displayed on canvas //
// w             :      w                  width dimension                           //
// h             :      h                  height dimension                          //
// noCollide     :      false              entity permits collision detection        //
// xCollide      :      false              entity is colliding on the x axis         //
// yCollide      :      false              entity is colliding on the y axis         //
// isVisible     :      true               entity permits display on screen          //
// layer         :      0                  layer the entity is displayed on          //
// frame         :      0                  current animation frame                   //
// framerow      :      0                  current animation column in tile sheet    //
// framelist     :      framelist          array of frames                           //
// updateframe   :      0                  threshold counter to slow down framerate  //
// animfinished  :      false              boolean value to reset frame to 0         //
// framecooldown :      10                                                           //
///////////////////////////////////////////////////////////////////////////////////////
"use strict";

class Entity
{
    constructor(x, y, w, h, imgsrc, framelist, layer=0)
    {
        this.pos            = {x:  x, y:  y};
        this.vel            = {x:  0, y:  0};
        this.acc            = {x:  0, y:  0};
        this.gravity        = {x:  0, y:  0};
        this.friction       = {x:  0, y:  0};
        this.maxvel         = {x: 10, y: 10};
        this.angle          = 0             ;
        this.anglerate      = 0             ;
        this.scale          = 1             ;
        this.width          = w             ;
        this.height         = h             ;
        this.noCollide      = false         ;
        this.xCollide       = false         ;
        this.yCollide       = false         ;
        this.isVisible      = true          ;
        this.layer          = layer         ;

        this.img            = createImageObject(imgsrc); 
        
        var temp = this;
        if (this.img != null)
        {
            this.img.onload = function()
            {
                if (temp.width == null || temp.height == null)
                {
                    temp.width = this.width;
                    temp.height = this.height;
                }
            }
        }

        this.frame          = 0         ;
        this.framerow       = 0         ;
        this.framelist      = framelist ;
        this.updateframe    = 0         ;
        this.animfinished   = false     ;
        this.framecooldown  = 10        ;
    }
    setMaxVelocity(x, y) { this.maxvel.x   = x; this.maxvel.y   = y; }
    setVelocity   (x, y) { this.vel.x      = x; this.vel.y      = y; }
    setGravity    (x, y) { this.gravity.x  = x; this.gravity.y  = y; }
    setFriction   (x, y) { this.friction.x = x; this.friction.y = y; }
    setVisible    (    ) { this.isVisible  = true ;                  }
    setInvisible  (    ) { this.isVisible  = false;                  }
    
    killSelf()
    {
        // remove from global entlist
        for (var i = 0; i < entlist.length; i++)
        {
            if (entlist[i] == this)
            {
                entlist.splice(i, 1);
            }
        }

        // remove from layer list
        for (var i = 0; i < layers.length; i++)
        {
            var layerobject = layers[i];
            for (var j = 0; j < layerobject.entlist.length; j++)
            {
                var elem = layerobject.entlist[j];
                if (elem == this)
                {
                    layerobject.entlist.splice(j, 1);
                }
            }
        }
    }
    draw(camera, layerspeed=1, width=null, height=null)
    {        
        /*if (this.framelist != null && this.isVisible)
        {
            game_ctx.setTransform(this.scale, 0, 0, this.scale, this.pos.x, this.pos.y); // sets scale and origin
            game_ctx.rotate(this.angle * Math.PI / 180);        
            game_ctx.drawImage(this.img, this.framelist[this.frame] * this.width, 0, this.width, this.height, 0, 0, this.width, this.height);
            game_ctx.setTransform(1,0,0,1,0,0);
        }*/
        if (this.img != null)
        {
            if (checkCameraCollision(camera, this))
            {
                if (width == null && height == null)
                {
                    
                    game_ctx.drawImage
                    (
                        this.img,                                                       /* img object                            */
                        this.framelist[this.frame] * this.width,                        /* source x                              */
                        this.framerow * this.height,                                    /* source y                              */
                        this.width, this.height,                                        /* source width, source height           */
                        this.pos.x - (camera.x * layerspeed) + camera.screenpartitionx, /* destination x                         */
                        this.pos.y - (camera.y * layerspeed) + camera.screenpartitiony, /* destination y                         */
                        this.width, this.height                                         /* destination width, destination height */
                    );
                }
                else
                {
                    game_ctx.drawImage
                    (
                        this.img,                                                       /* img object                            */
                        this.framelist[this.frame] * width,                             /* source x                              */
                        this.framerow * height,                                         /* source y                              */
                        width, height,                                                  /* source width, source height           */
                        this.pos.x - (camera.x * layerspeed) + camera.screenpartitionx, /* destination x                         */
                        this.pos.y - (camera.y * layerspeed) + camera.screenpartitiony, /* destination y                         */
                        width, height                                                   /* destination width, destination height */
                    );
                }
            }
        }
    }
    update()
    {
        //////////////////////////////////////////////////////////////////////////////
        // Friction handling:                                                       //
        // Friction values that are too high will cause the entity to get stuck on  //
        // the ground.                                                              //
        // The approach function helps with not overshooting in its approach to 0.  //
        // Other methods I've tried made the velocity oscillate on either side of 0 //
        // (resulting in jittery side to side motion).                              //
        //////////////////////////////////////////////////////////////////////////////
        if (this.yCollide)
        {
            this.vel.x = approach(0, this.vel.x, this.friction.x * gamecore.time.delta);
        }
        else
        {
            this.vel.y+=this.gravity.y * gamecore.time.delta;
            this.vel.y+=this.acc.y * gamecore.time.delta;
            this.vel.y = clamp(this.maxvel.y, this.vel.y);
            this.pos.y+=this.vel.y;
        }
        if (this.xCollide)
        {
            this.vel.y = approach(0, this.vel.y, this.friction.y * gamecore.time.delta);
        }
        else
        {
            this.vel.x+=this.gravity.x * gamecore.time.delta;
            this.vel.x+=this.acc.x * gamecore.time.delta;
            this.vel.x = clamp(this.maxvel.x, this.vel.x);
            this.pos.x+=this.vel.x;
        }

        this.keepInBounds();
    }

    ///////////////////////////////////////////////////////
    //                  keepInBounds                     //
    // Function:                                         //
    //     Keeps an object in bounds unless it is a Wall //
    //     It was probably put out of bounds on purpose  //
    //     since it can't move by itself                 //
    // Return value:                                     //
    //     None                                          //
    ///////////////////////////////////////////////////////
    keepInBounds()
    {
        if (this instanceof Wall)
        {
            return;
        }
        if (this.pos.x + this.width > level.width)  
        {
            this.xCollide = true;
            this.pos.x = level.width - this.width;
        }
        else if (this.pos.x < 0)
        {
            this.xCollide = true;
            this.pos.x = 0;
        }
        if (this.pos.y + this.height > level.height) 
        {
            this.yCollide = true;
            this.pos.y = level.height - this.height;
        }
        else if (this.pos.y < 0) 
        {
            this.yCollide = true;
            this.pos.y = 0;
        }
    }
    resetAnim()
    {
        this.frame = 0;
    }
}
