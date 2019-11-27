////////////////////////////////////////////////////////////////////
// player.js                                                      //
//     The player class that the user will interact with directly //
////////////////////////////////////////////////////////////////////
"use strict";

// This correlates to the current sprite sheet being used.
// If there is a different sheet, then these values should be changed accordingly.
// sprite_sheet_width is the number of columns in a sprite sheet
// sprite_sheet_height is the number of rows in a sprite sheet
var sprite_sheet_width = 9;
var sprite_sheet_height = 4;

class Player extends Entity
{
    constructor(x, y)
    {
        //    x, y, w  , h, src                                , framelist
        super(x, y, 32, 60, "materials/player/sprite_sheet.png", [0,1,2,3,4,5,6,7,8,9,10,11,12]);

        this.PlayerAnimation = {
            "idle"            : 0,
            "running_forward" : 0,
            "walk_forward"    : 1,
            "running_left"    : 1,
            "running_right"   : 2,
            "jumping"         : 2
        };

        this.Animations = new AnimationHandler();
        this.Animations.addAnimation( null  , 2, this.w, this.h, this.PlayerAnimation["idle"         ] , [0]              );
        this.Animations.addAnimation("Space", 0, this.w, this.h, this.PlayerAnimation["jumping"      ] , [1,2,3,4,5,6,7,8]);
        this.Animations.addAnimation("Right", 1, this.w, this.h, this.PlayerAnimation["running_right"] , [1,2,3,4,5,6,7,8]);
        this.Animations.addAnimation("Left" , 1, this.w, this.h, this.PlayerAnimation["running_left" ] , [8,7,6,5,4,3,2,1]);

        this.currentAnimation = this.Animations.getAnimationByAction(null);  // This will give the idle animation

        this.setGravity    (0  , 0.2);
        this.setFriction   (0.1, 0  );
        this.setMaxVelocity(5  , 5  );
        
        this.bJumping           = false;
    }
    jump()
    {
        if (!this.bJumping)
        {
            this.vel.y = -10;
            this.bJumping = true;
            this.currentAnimation = this.Animations.getAnimationByAction("Space");
        }
    }
    // approach (goal, current, delta time (part of gameglobals variable))
    moveUp   () { this.vel.y = approach(-5, this.vel.y, gameglobals.dt) }
    moveDown () { this.vel.y = approach( 5, this.vel.y, gameglobals.dt) }
    moveLeft () { this.vel.x = approach(-5, this.vel.x, gameglobals.dt); this.currentAnimation = this.Animations.getAnimationByAction("Left" );}
    moveRight() { this.vel.x = approach( 5, this.vel.x, gameglobals.dt); this.currentAnimation = this.Animations.getAnimationByAction("Right");}
    land()
    {
        this.vel.y = 0;
        this.bJumping = false;
    }
    // The interface between player's draw function and entity's draw function
    draw(camera, layerspeed=1)
    {
        if (this.currentAnimation != null)
        {
            this.framelist = this.currentAnimation.framelist;
            this.frame     = this.currentAnimation.frame;
            this.framerow  = this.currentAnimation.animation_index;
            super.draw(camera, layerspeed, this.currentAnimation.width, this.currentAnimation.height);
        }
    }
    update()
    {
        if (keyhandler.isPressed("Space")) { this.jump     (); }
        if (keyhandler.isDown   ("Up"   )) { this.moveUp   (); }
        if (keyhandler.isDown   ("Down" )) { this.moveDown (); }
        if (keyhandler.isDown   ("Left" )) { this.moveLeft (); }
        if (keyhandler.isDown   ("Right")) { this.moveRight(); }

        this.currentAnimation.update();
        if (DEBUG_MODE) console.log("Frame: " + this.currentAnimation.frame);

        // If I'm not moving, I want to face the direction I was just running in
        if (Math.abs(this.vel.x) < 1 && this.yCollide)
        {
            /*
            if (this.currentAnimation == this.PlayerAnim.running_right)
            {
                this.framerow = this.PlayerAnim.idle_right;
                this.currentAnimation = this.framerow;
            }
            if (this.currentAnimation == this.PlayerAnim.running_left)
            {
                this.framerow = this.PlayerAnim.idle_left;
                this.currentAnimation = this.framerow;
            }*/
        }
        super.update();
        
        if (this.yCollide)
        {
            this.pos.y = level.height - this.h;
            this.land();
        }
    }
    updateAnimation()
    {
        if (!this.animfinished)
        {
            this.updateframe++;
            if (this.framelist != null)
            {
                if (this.frame == this.framelist.length - 1)
                    this.animfinished = true;
            }
            if (this.updateframe > this.animationRate)
            {
                this.frame++;
                this.updateframe = 0;
            }
        }
        else
        {
            this.frame = 0; 
            this.animfinished = false;
        }
    }
}