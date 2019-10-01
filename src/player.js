"use strict";
class Player extends Entity
{
    constructor(x, y)
    {
        //    x, y, w  , h  , src                                 , framelist
        super(x, y, 125, 150, "materials/player/player_sheet.png", [0,1,2,3,4,5,6,7,8,9,10,11,12]);
        
        this.PlayerAnim = {
            running_right: 0,
            running_left : 1,
            idle_right   : 2,
            idle_left    : 3,
            jumping      : 2
        };
        this.currentAnimation = this.PlayerAnim.idle_right;
        this.animationRate = 2; // smaller means faster animation
        this.setGravity(0, 0.2);
        this.setFriction(1, 0);
        this.setMaxVelocity(10, 10);
        this.bJumping           = false;
    }
    jump()
    {
        if (!this.bJumping)
        {
            this.vel.y = -10;
            this.bJumping = true;
        }
    }
    // approach (goal, current, delta time (part of gameglobals variable))
    moveUp   () { this.vel.y = approach(-5, this.vel.y, gameglobals.dt) }
    moveDown () { this.vel.y = approach( 5, this.vel.y, gameglobals.dt) }
    moveLeft () { this.vel.x = approach(-5, this.vel.x, gameglobals.dt) }
    moveRight() { this.vel.x = approach( 5, this.vel.x, gameglobals.dt) }
    land()
    {
        this.vel.y = 0;
        this.bJumping = false;
    }
    update()
    {
        if (keyhandler.isPressed("Space")) { this.jump     (); }
        if (keyhandler.isDown   ("Up"   )) { this.moveUp   (); }
        if (keyhandler.isDown   ("Down" )) { this.moveDown (); }
        if (keyhandler.isDown   ("Left" )) { this.moveLeft (); this.framerow = this.PlayerAnim.running_left ; }
        if (keyhandler.isDown   ("Right")) { this.moveRight(); this.framerow = this.PlayerAnim.running_right; }

        this.updateAnimation();

        // If I'm not moving, I want to face the direction I was just running in
        if (this.vel.x == 0 && this.vel.y == 0)
        {
            if (this.currentAnimation == this.PlayerAnim.running_right)
            {
                this.frame = this.PlayerAnim.idle_right;
            }
            if (this.currentAnimation == this.PlayerAnim.running_left)
            {
                this.frame = this.PlayerAnim.idle_left;
            }
        }
        super.update();
        
        if (this.pos.y + this.h > level.height)
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