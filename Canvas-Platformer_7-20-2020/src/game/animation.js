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
        this.width              = width             ; // width  of each animation in pixels (for a canvas with 1:1 zoom)
        this.height             = height            ; // height of each animation in pixels (for a canvas with 1:1 zoom)
        this.framelist          = framelist         ; // sequences of frames (array) in an animation to be shown
        this.animation_index    = animation_index   ; // integer indicating which row (in a sprite table) will be animated
        this.frame              = 0                 ; // the current frame to be shown
        this.animfinished       = false             ; // boolean determining whether the animation has finished
        this.updatetimer        = gamecore.animation_timer; // seconds between each frame
        this.next_animation_time= gamecore.time.now ; // to help slow down the rate of an animation
        this.associated_action  = null              ; // Key associated with the animation, to be set by AnimationHandler
        this.priority           = null              ; // Used to assist in ordering within an AnimationHandler
        this.nominal            = false             ; // Used to give custom animation actions that don't rely on key names
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

    //////////////////////////////////////////////
    //              setActionNominal            //
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
        if (!this.animfinished)
        {
            if (this.framelist != null)
            {
                if (this.frame == this.framelist.length - 1)
                {
                    this.animfinished = true;
                }
            }
            if (gamecore.time.now > this.next_animation_time + this.updatetimer)
            {
                this.frame++;
                this.next_animation_time = gamecore.time.now + this.updatetimer;
            }
        }
        else
        {
            // restart the animation from the beginning
            this.rewind();
        }
    }
}