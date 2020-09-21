//////////////////////////////////////////////////////////////////////////////////////////
//      class Entity                                                                    //
// Base class to all objects (I think so).                                              //
// Some classes may have their own drawing and collision functions.                     //
// Usually each class calls this class' (as a super class) update function.             //
//                                                                                      //
// Defaults:                                                                            //
// pos          :   x:  x, y:  y        position in the level                           //
// vel          :   x:  0, y:  0        velocity (units per frame)                      //
// acc          :   x:  0, y:  0        acceleration (units per frame^2)                //
// gravity      :   x:  0, y:  0        gravity (units per frame^2)                     //
// friction     :   x:  0, y:  0        friction (units per frame^2)                    //
// max_velocity :   x: 10, y: 10        maximum velocity                                //
// angle        :   0                   angle (*deprecated*)                            //
// anglerate    :   0                   rate of change for angle (*deprecated*)         //
// scale        :   1                   size multiplier to be displayed on canvas       //
// width        :   w                   width dimension                                 //
// height       :   h                   height dimension                                //
// collider     :   x: 0, y: 0          collision detection/handling box                //
//                  width: w, height: h                                                 //
// collider_xoffset: 0                  offset to the x position of the collision box   //
// collider_yoffset: 0                  offset to the y position of the collision box   //
// noCollide    :   false               entity permits collision detection              //
// xCollide     :   false               entity is colliding on the x axis               //
// yCollide     :   false               entity is colliding on the y axis               //
// isVisible    :   true                entity permits display on screen                //
// layer        :   0                   layer the entity is displayed on                //
// frame        :   0                   current animation frame                         //
// framerow     :   0                   current animation column in tile sheet          //
// framelist    :   framelist           array of frames                                 //
// updateframe  :   0                   threshold counter to slow down framerate        //
// animfinished :   false               boolean value to reset frame to 0               //
// framecooldown:   10                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////
"use strict";

class Entity
{
    constructor(x, y, w, h, imgsrc, framelist, layer=0)
    {
        this.pos                = {x: x, y: y}              ;
        this.vel                = {x: 0, y: 0}              ;
        this.acc                = {x: 0, y: 0}              ;
        this.gravity            = {x: 0, y: 0}              ;
        this.friction           = {x: 0, y: 0}              ;
        this.max_velocity       = {x: gamecore.max_velocity.x, y: gamecore.max_velocity.y};
        this.angle              = 0.0                       ; // [Float  ] Angle from 0 radians
        this.anglerate          = 0.0                       ; // [Float  ] Rate of rotation for this object
        this.scale              = 1.0                       ; // [Float  ] Scale of the object with respect to the game canvas
        this.width              = w                         ; // [Number ] Width  in pixels (for a canvas with 1:1 zoom) of the object
        this.height             = h                         ; // [Number ] Height in pixels (for a canvas with 1:1 zoom) of the object
        this.collider           = {xoffset: 0, yoffset: 0,    // [Object ] Rectangle that deals with the entity's collision physics
                                   width  : w, height : h } ;
        this.collider_xoffset   = 0                         ; // [Number ] x position of rectangle that deals with collision physics
        this.collider_yoffset   = 0                         ; // [Number ] y position of rectangle that deals with collision physics
        this.noCollide          = false                     ; // [boolean] collision flag disabling all collision physics
        this.xCollide           = false                     ; // [boolean] x axis collision flag (true of x axis is colliding)
        this.yCollide           = false                     ; // [boolean] y axis collision flag (true of y axis is colliding)
        this.bVisible           = true                      ; // [boolean] visibility flag
        this.alpha              = 1.0                       ; // [percent] translucency
        this.layer              = layer                     ; // [Number ] current layer the entity is in
        this.layer_name         = null;//layers[layer].name        ; // [String ] Name of the layer the entity is in
        
        this.setImageObject(imgsrc)                         ;

        this.frame          = 0         ;
        this.framerow       = 0         ;
        this.framelist      = framelist ;
        this.updateframe    = 0         ;
        this.animfinished   = false     ;
        this.framecooldown  = 10        ;
    }
    setMaxVelocity(x, y) { this.max_velocity.x  = x     ; this.max_velocity.y   = y; }
    setVelocity   (x, y) { this.vel.x           = x     ; this.vel.y            = y; }
    setGravity    (x, y) { this.gravity.x       = x     ; this.gravity.y        = y; }
    setFriction   (x, y) { this.friction.x      = x     ; this.friction.y       = y; }
    setVisible    (    ) { this.bVisible        = true  ;}
    setInvisible  (    ) { this.bVisible        = false ;}
    setImageObject(imgsrc)
    {
        this.img = image_findObject(imgsrc);
    }
    //////////////////////////////////////////////////////////////////
    //                          setCollider                         //
    // Function:                                                    //
    //     Sets the collision rectangle used for collision handling //
    //     xoffset and yoffset are based on the entity's position   //
    //  +-------------entity------------+                           //
    //  |               |               |                           //
    //  |            yoffset            |                           //
    //  |               |               |                           //
    //  |----xoffset----+-collider--+   |                           //
    //  |               |           |   |                           //
    //  |               |           h   entity.height               //
    //  |               |           |   |                           //
    //  |               +-----w-----+   |                           //
    //  |                               |                           //
    //  +----------entity.width---------+                           //
    //                                                              //
    // Return value:                                                //
    //     None                                                     //
    //////////////////////////////////////////////////////////////////
    setCollider(xoffset, yoffset, w, h)
    {
        this.collider = {xoffset: xoffset,
                         yoffset: yoffset,
                         width  : w,
                         height : h};
    }

    ///////////////////////////////////////////////////////////////////////////
    //                       moveEntityByColliderX                           //
    // Function:                                                             //
    //     Moving the position of an entity based on the collider's movement //
    //     in the x axis. Signed values should be taken into consideration.  //
    // Return value:                                                         //
    //     None                                                              //
    ///////////////////////////////////////////////////////////////////////////
    moveEntityByColliderX(new_position)
    {
        this.pos.x = new_position - this.collider_xoffset;
    }
    
    ///////////////////////////////////////////////////////////////////////////
    //                       moveEntityByColliderY                           //
    // Function:                                                             //
    //     Moving the position of an entity based on the collider's movement //
    //     in the y axis. Signed values should be taken into consideration.  //
    // Return value:                                                         //
    //     None                                                              //
    ///////////////////////////////////////////////////////////////////////////
    moveEntityByColliderY(new_position)
    {
        this.pos.y = new_position - this.collider_yoffset;
    }

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

    //
    // legacy draw code, saved for probable later use
    /*if (this.framelist != null && this.isVisible)
        {
            game_ctx.setTransform(this.scale, 0, 0, this.scale, this.pos.x, this.pos.y); // sets scale and origin
            game_ctx.rotate(this.angle * Math.PI / 180);        
            game_ctx.drawImage(this.img, this.framelist[this.frame] * this.width, 0, this.width, this.height, 0, 0, this.width, this.height);
            game_ctx.setTransform(1,0,0,1,0,0);
        }*/
    //
    //
    draw(camera, layerspeed=1, width=null, height=null)
    {
        if (this.img != null)
        {
            // This is an artifact of the MusicBox project, was needed to support multiple cameras
            // It is disabled until it is needed again
            // if (checkCameraCollision(camera, this))
            
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
            } // end of else (of if (width == null && height == null) )

        } // end of if (this.img != null)

    } // end of draw()

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
            this.vel.y+=this.acc.y     * gamecore.time.delta;
            this.vel.y = clamp(this.max_velocity.y, this.vel.y);
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
            this.vel.x = clamp(this.max_velocity.x, this.vel.x);
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
    } // end of keepInBounds()

    updateLayerIndex()
    {
        for (var iLayersIndex = 0; iLayersIndex < layers.length; iLayersIndex++)
        {
            for (var iEntlistIndex = 0; iEntlistIndex < layers[iLayersIndex].entlist.length; iEntlistIndex++)
            {
                if (this == layers[iLayersIndex].entlist[iEntlistIndex])
                {
                    this.layer = iLayersIndex;
                    this.layer_name = layers[this.layer].name;
                    return;
                }
            }
        }
        return;
    }

    setLayerByName(layer_name)
    {
        var layer = game_findLayer(layer_name);
        for (var iLayerIndex = 0; iLayerIndex < layers.length; iLayerIndex++)
        {
            if (layers[iLayerIndex] == layer)
            {
                this.layer = iLayerIndex;
            }
        }
        return;
    }

    setLayerByIndex(layer_index)
    {
        this.layer = layer_index;
        this.layer_name = layers[layer_index].name;
    }

    ////////////////////////////////////////////////////////////////////////////
    //                              toString                                  //
    // Function:                                                              //
    //     Converts the object to a string format to help with saving/loading //
    // Return value:                                                          //
    //     String                                                             //
    ////////////////////////////////////////////////////////////////////////////
    toString()
    {
        var str_result = "";
        
        str_result += "width"       + " " + this.width              + "\n";
        str_result += "height"      + " " + this.height             + "\n";

        // Saving the source since that's all that's needed to load the image
        if (this.img != null)
        {
            str_result += "imgsrc"     + " " + this.img.src         + "\n";
        }

        str_result += "pos"                                         + "\n";
        str_result += "x"           + " " + this.pos.x              + "\n";
        str_result += "y"           + " " + this.pos.y              + "\n";

        str_result += "width"       + " " + this.width              + "\n";
        str_result += "height"      + " " + this.height             + "\n";
        
        // Not saving velocity since it's intended to change and saving it would be useless
        // Not saving acceleration since I haven't made a good use for it yet

        str_result += "gravity"                                     + "\n";
        str_result += "x"           + " " + this.gravity.x          + "\n";
        str_result += "y"           + " " + this.gravity.y          + "\n";

        str_result += "friction"                                    + "\n";
        str_result += "x"           + " " + this.friction.x         + "\n";
        str_result += "y"           + " " + this.friction.y         + "\n";

        str_result += "max_velocity"                                + "\n";
        str_result += "x"           + " " + this.max_velocity.x     + "\n";
        str_result += "y"           + " " + this.max_velocity.y     + "\n";

        str_result += "angle"       + " " + this.angle              + "\n";

        str_result += "anglerate"   + " " + this.anglerate          + "\n";

        str_result += "scale"       + " " + this.scale              + "\n";

        str_result += "layer"       + " " + this.layer              + "\n";
        str_result += "layer_name"  + " " + this.layer_name         + "\n";
        str_result += "collider"                                    + "\n";
        str_result += "xoffset"     + " " + this.collider.xoffset   + "\n";
        str_result += "yoffset"     + " " + this.collider.yoffset   + "\n";
        str_result += "width"       + " " + this.collider.width     + "\n";
        str_result += "height"      + " " + this.collider.height    + "\n";

        // Not saving collider_xoffset since I'm not sure why I have it
        // Not saving collider_yoffset since I'm not sure why I have it

        str_result += "noCollide"   + " " + this.noCollide          + "\n";
        
        // Not saving xCollide since it's intended to change and saving it would be useless
        // Not saving yCollide since it's intended to change and saving it would be useless
        
        str_result += "bVisible"    + " " + this.bVisible           + "\n";

        str_result += "alpha"       + " " + this.alpha              + "\n";

        str_result += "frame"       + " " + this.frame              + "\n";
        str_result += "framerow"    + " " + this.framerow           + "\n";
        str_result += "framelist"   + " " + this.framelist          + "\n";

        // Not saving animfinished since it's intended to change and saving it would be useless

        return str_result;
    }

} // end of Class Entity
