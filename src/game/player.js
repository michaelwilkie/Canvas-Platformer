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
        super(x, y, 64, 64, "materials/player/stick_figure_sprite_sheet.png", [0,1,2,3,4,5,6]);

        this.SPRITE_SHEET_WIDTH     = 9;
        this.SPRITE_SHEET_HEIGHT    = 4;
        
        // The frame where the stick figure's foot is touching the ground
        this.PLAYER_STEP_FRAME      = 2;

        this.PlayerAnimation = {
            // name,            row in the sprite sheet
            "idle"          : 0,
            "running_left"  : 2,
            "running_right" : 1,
            "jumping_left"  : 2,
            "jumping_right" : 1
        };

        this.face_direction = "right";
        this.Animations = new AnimationHandler();

        // Animation.addAnimation(associated_action, priority, width, height, animation_index, framelist)
        this.Animations.addAnimation( null          , 0, this.width, this.height, this.PlayerAnimation["idle"         ] , [0]               );

        // "Space right" is not a real action, but I needed some way to get the correct jump animation + direction
        // Ex: this.currentAnimation = this.Animations.getAnimationByAction("Space" + " " + this.face_direction);
        // Since I'm not flipping the image horizontally, rather using another row in the sprite table to do this
        this.Animations.addAnimation("Space right"  , 2, this.width, this.height, this.PlayerAnimation["jumping_right"] , [0]               );
        this.Animations.addAnimation("Space left"   , 2, this.width, this.height, this.PlayerAnimation["jumping_left" ] , [0]               );
        this.Animations.addAnimation("Right"        , 1, this.width, this.height, this.PlayerAnimation["running_right"] , [6,5,4,3,2,1,0]   );
        this.Animations.addAnimation("Left"         , 1, this.width, this.height, this.PlayerAnimation["running_left" ] , [0,1,2,3,4,5,6]   );

        this.Animations.getAnimationByAction("Right").associateFrameWithSound(this.PLAYER_STEP_FRAME, "step1");
        this.Animations.getAnimationByAction("Left" ).associateFrameWithSound(this.PLAYER_STEP_FRAME, "step1");

        this.currentAnimation = this.Animations.getAnimationByAction(null);     // This will give the idle animation

        this.Animations.getAnimationByAction("Space right").setActionNominal(true);   // Space right is not a real action, just the name of one
        this.Animations.getAnimationByAction("Space left" ).setActionNominal(true);   // Space left is not a real action, just the name of one

        this.setGravity     (gamecore.gravity.x      , gamecore.gravity.y        );
        this.setFriction    (gamecore.friction.x     , gamecore.friction.y       );
        this.setMaxVelocity (gamecore.max_velocity.x , gamecore.max_velocity.y   );
        this.setCollider    (this.width / 4, 0, this.width / 2, this.height);
        this.jump_velocity  = 30    ; // arbitrary value
        this.move_delta     = 250   ; // used to help the player overcome the force of friction
        this.max_velocity   = {x: 8, y: 10};
        this.bJumping       = false ; // jumping flag
    }
    jump()
    {
        if (!this.bJumping)
        {
            this.vel.y = -1 * this.jump_velocity;
            this.bJumping = true;
            this.currentAnimation = this.Animations.getAnimationByAction("Space" + " " + this.face_direction);
        }
    }
    // approach (goal, current, delta time (part of gamecore variable))
    moveUp   () { this.vel.y = approach(-1 * this.max_velocity.y, this.vel.y, this.move_delta * gamecore.time.delta) }
    moveDown () { this.vel.y = approach(     this.max_velocity.y, this.vel.y, this.move_delta * gamecore.time.delta) }
    moveLeft ()
    { 
        this.face_direction = "left";
        this.vel.x          = approach(-1 * this.max_velocity.x, this.vel.x, this.move_delta * gamecore.time.delta);
    }
    moveRight()
    {
        this.face_direction = "right";
        this.vel.x          = approach(this.max_velocity.x, this.vel.x, this.move_delta * gamecore.time.delta);
    }
    land()
    {
        this.vel.y = 0;
        this.bJumping = false;
    }

    handleCollision()
    {
        var collided_with_something = false;
        
        // Is there a valid list of layers?
        if (layers != null)
        {
            // Have I initialized the player's layer index?
            if (this.layer != -1)
            {
                // Find out which entity the player is colliding with
                var layer = layers[this.layer];
                for (var i = 0; i < layer.entlist.length; i++)
                {
                    if (layer.entlist[i] != this)
                    {
                        var ent = layer.entlist[i];
                        if (checkCollision(this, ent))
                        {
                            // Don't reset xCollide yCollide flags
                            collided_with_something = true;

                            // Undo my last move to see what side I am colliding from
                            //while (checkCollision(this, ent))
                            //{
                            this.pos.x -= this.vel.x;
                            this.pos.y -= this.vel.y;
                            //}

                            var side = checkSide(this, ent);
                            switch (side)
                            {
                                case SideEnum.UP:
                                {
                                    this.land();
                                    this.yCollide = true;
                                    this.vel.y = 0; // stop vertical velocity
                                    this.pos.y = Math.trunc(ent.pos.y + ent.collider.yoffset - this.height);
                                    this.pos.x += this.vel.x; // restore the x position
                                    break;
                                }

                                case SideEnum.DOWN: 
                                {
                                    this.yCollide = true;
                                    this.vel.y = 0; // stop vertical velocity
                                    this.pos.y = (ent.pos.y + ent.collider.yoffset + ent.collider.height);
                                    break;
                                }

                                case SideEnum.RIGHT:
                                {
                                    this.xCollide = true;
                                    this.vel.x = 0; // stop horizontal velocity
                                    this.pos.x = ((ent.pos.x + ent.collider.xoffset) + ent.collider.width) - this.collider.xoffset;
                                    break;
                                }

                                case SideEnum.LEFT:
                                {
                                    this.xCollide = true;
                                    this.vel.x = 0; // stop horizontal velocity
                                    this.pos.x = (ent.pos.x + ent.collider.xoffset) - this.collider.width;
                                    break;
                                }

                                case SideEnum.ERROR:
                                default:
                                {
                                    // have the wall push the player out along the vector between them along the axis with smaller magnitude
                                    var vect = {x: (this.pos.x + this.width  / 2) - (ent.pos.x + ent.width  / 2), 
                                                y: (this.pos.y + this.height / 2) - (ent.pos.y + ent.height / 2) };
                                    if (Math.abs(vect.x) > Math.abs(vect.y))
                                    {
                                        this.pos.y += vect.y;
                                    }
                                    else
                                    {
                                        this.pos.x += vect.x;
                                    }
                                }
                                
                            } // end of switch (side)

                        } // end of if (checkCollision(this, ent))

                    } // end of if (layer.entlist[i] ...)

                } // end of for (...)

            } // end of if (this.layer_index ...)

            // Player's layer index is uninitialized
            else
            {
                // Find the index of the layer the player is in
                this.layer = 0;
                for (var i = 0; i < layers.length; i++)
                {
                    // Find the player entity in the layer's entlist
                    for (var e = 0; e < layers[i].entlist.length; e++)
                    {
                        if (layers[i].entlist[e] == this)
                        {
                            this.layer = i;
                        }

                    } // end of for (entlist)

                } // end of for (layers)

            } // end of else

        } // end of if (layers != null)

        if (!collided_with_something)
        {
            this.xCollide = false;
            this.yCollide = false;
        }

    } // end of handleCollision()

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
        // Consider:
        // Key combinations
        // should be simple: keyhandler.isPressed("Space") && keyhandler.isPressed("Right")
        // Not so simple: decouple keypresses to animations inside the KeyHandler
        if (keyhandler.isPressed("Space")) { this.jump     (); }
        if (keyhandler.isDown   ("Up"   )) { this.moveUp   (); }
        if (keyhandler.isDown   ("Down" )) { this.moveDown (); }
        if (keyhandler.isDown   ("Left" )) { this.moveLeft (); }
        if (keyhandler.isDown   ("Right")) { this.moveRight(); }

        // Don't try to do any walking animations or anything while I'm jumping
        if (!this.bJumping)
        {
            this.currentAnimation = this.Animations.getCurrentAnimation();
        }

        this.currentAnimation.update();

        // Alternating the footstep sounds:

        // If I gave this frame a special sound
        if (this.currentAnimation.sound_frame != -1)
        {
            // If it happens to be the running animation
            if (this.currentAnimation.animation_index == this.PlayerAnimation["running_left" ]
             || this.currentAnimation.animation_index == this.PlayerAnimation["running_right"])
            {
                // If it is on the correct frame, and it is a new frame
                if (this.currentAnimation.frame_on_last_tick != this.currentAnimation.frame
                 && this.currentAnimation.frame == this.PLAYER_STEP_FRAME)
                {
                    // swap the step sound
                    if (this.currentAnimation.sound_alias == "step1")
                    {
                        this.currentAnimation.setSoundAlias("step2");
                    }
                    else
                    {
                        this.currentAnimation.setSoundAlias("step1");
                    }
                }
            }
        }
        // Call superclass update before handling collisions so I don't sink into the ground
        // due to gravity after handleCollision() just pushed me out of it
        super.update();
        this.handleCollision();
    }
}