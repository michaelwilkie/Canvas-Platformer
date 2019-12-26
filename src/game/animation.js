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
        this.animation_rate     = 2                 ; // the number of pseudoframes per actual frame
        this.updateframe        = 0                 ; // to help slow down the rate of an animation
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
        this.frame = this.framelist[0];
    }
    ////////////////////////////////////////////////////////////////////
    //                            update                              //
    // Function:                                                      //
    //     Advances the animation by 1 pseudoframe.                   //
    //     Pseudoframe is just the operations between an actual frame //
    //     advancement.                                               //
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
            this.updateframe++;
            if (this.framelist != null)
            {
                if (this.frame == this.framelist.length - 1)
                {
                    this.animfinished = true;
                }
            }
            if (this.updateframe > this.animationRate)
            {
                this.frame++;
                this.updateframe = 0;
            }
        }
        else
        {
            // restart the animation from the beginning
            this.rewind();
        }
    }
}