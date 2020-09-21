//////////////////////////////////////////////////////////////
// animation.js                                             //
//     Handle frame sequences and frames                    //
//     Each animation will be responsible for going through //
//     its animation sequence.                              //
//////////////////////////////////////////////////////////////
"use strict";

class Animation
{
    constructor(width, height, animation_index, framelist)
    {
        this.width              = width                     ; // [pixels ] width  of each animation in pixels (for a canvas with 1:1 zoom)
        this.height             = height                    ; // [pixels ] height of each animation in pixels (for a canvas with 1:1 zoom)
        this.framelist          = framelist                 ; // [array  ] sequences of frames (array) in an animation to be shown
        this.animation_index    = animation_index           ; // [integer] integer indicating which row (in a sprite table) will be animated
        this.frame              = 0                         ; // [integer] the current frame to be shown
        this.frame_on_last_tick = 0                         ; // [integer] what the frame value was on the previous tick
        this.sound_frame        = -1;                       ; // [integer] the frame to play a sound on
        this.sound_alias        = null                      ; // [string] the alias of the sound to be played
        this.animfinished       = false                     ; // [boolean] determines whether the animation has finished
        this.updatetimer        = gamecore.animation_timer  ; // [seconds] between each frame
        this.next_animation_time= gamecore.time.now         ; // [milliseconds] to help slow down the rate of an animation
        this.associated_action  = null                      ; // [string] Key associated with the animation, to be set by AnimationHandler
        this.priority           = null                      ; // [integer] Used to assist in ordering within an AnimationHandler
        this.nominal            = false                     ; // [boolean] Used to give custom animation actions that don't rely on key names, but rather strings
    }
    
    /////////////////////////////////////////////////
    //              setAnimationRate               //
    // Function:                                   //
    //     Sets the pace that a frame advances.    //
    //     Smaller number means faster animations. //
    //     This value must be 0 < x < infinity.    //
    // Return value:                               //
    //     None                                    //
    /////////////////////////////////////////////////
    setAnimationRate(animation_rate)
    {
        this.animation_rate = animation_rate;
    }

    //////////////////////////////////////////////////////////////////////////
    //                      associateFrameWithSound                         //
    // Function:                                                            //
    //     Tells the animation object to play a sound on a particular frame //
    // Return value:                                                        //
    //     None                                                             //
    //////////////////////////////////////////////////////////////////////////
    associateFrameWithSound(frame, sound_alias)
    {
        this.sound_frame = frame;
        this.sound_alias = sound_alias;
    }

    /////////////////////////////////////////////////////////////////
    //                      setSoundAlias                          //
    // Function:                                                   //
    //     In case you need to change the sound an animation plays //
    // Return value:                                               //
    //     None                                                    //
    /////////////////////////////////////////////////////////////////
    setSoundAlias(new_sound_alias)
    {
        this.sound_alias = new_sound_alias;
    }

    //////////////////////////////////////////////
    //             setActionNominal             //
    // Function:                                //
    //     Sets the this.nominal variable       //
    //     If an animation's action is nominal, //
    //     that means its 'action' is not the   //
    //     name of the key on your keyboard     //
    //     but rather just text for the sake    //
    //     of convenience.                      //
    //                                          //
    // Return value:                            //
    //     None                                 //
    //////////////////////////////////////////////
    setActionNominal(bNominal)
    {
        this.nominal = bNominal
    }

    /////////////////////////////////////////////////////////////////////
    //                            rewind                               //
    // Function:                                                       //
    //     Resets the current frame to the start of the frame sequence //
    //     (i.e. frame is now the first element of framelist)          //
    // Return value:                                                   //
    //     None                                                        //
    /////////////////////////////////////////////////////////////////////
    rewind()
    {
        this.animfinished = false;
        this.frame = 0;
    }

    ////////////////////////////////////////////////////////////////////
    //                            update                              //
    // Function:                                                      //
    //     Advances the animation by 1 frame per this.updatetimer     //
    //                                                                //
    //     If a frame reaches the last frame in the sequence then     //
    //     this.animfinished will be set to true and this.frame will  //
    //     be reset.                                                  //
    // Return value:                                                  //
    //     None                                                       //
    ////////////////////////////////////////////////////////////////////
    update()
    {
        this.frame_on_last_tick = this.frame;
        
        // Animation indeces are incremented by intervals specified by this.updatetimer
        // |-------------------TIME-------------------->
        // |         |                     |
        // |         |                     |
        // |         |--this.updatetimer-->|
        // |         |                     |
        // |         |                     |
        //  gamecore.time.now   this.next_animation_time
        if (gamecore.time.now > this.next_animation_time)
        {
            if (this.sound_frame != -1)
            {
                if (this.sound_frame == this.frame)
                {
                    createjs.Sound.play(this.sound_alias);
                }
            }
            this.frame++;
            this.next_animation_time = gamecore.time.now + this.updatetimer;
        }

        if (this.framelist != null)
        {
            // If the animation reached the last frame
            if (this.frame >= this.framelist.length)
            {
                this.animfinished = true;
            }
        }
        if (this.animfinished)
        {
            // restart the animation from the beginning
            this.rewind();
        }
    }
}