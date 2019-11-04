// For handling a list of Animations.
// This will decide which animation will be shown.
// There will be one AnimationHandler per Entity.
// So far it is being fitted to the player.
class AnimationHandler
{
    constructor()
    {
        this.animations = [];
    }
    /////////////////////////////////////////////////////////////////////////////////////////
    //                                  addAnimation                                       //
    // Function:                                                                           //
    //     Interface for the Animation class. Adds an animation but includes a priority so //
    //     that animations can be ordered.                                                 //
    // Return value:                                                                       //
    //     None                                                                            //
    /////////////////////////////////////////////////////////////////////////////////////////
    addAnimation(associated_action, priority, width, height, animation_index, framelist)
    {
        this.animations.push (new Animation(width, height, animation_index, framelist));

        // Add these 2 properties to the newly added element.
        this.animations[this.animations.length - 1].associated_action  = associated_action; 
        this.animations[this.animations.length - 1].priority           = priority         ;
    }
    //////////////////////////////////////////////////////
    //                  sortByPriority                  //
    // Function:                                        //
    //     Sorts all animations by their priority.      //
    //     Zero is highest priority so you can keep     //
    //     adding more animations with lesser priority. //
    // Return value:                                    //
    //     None                                         //
    //////////////////////////////////////////////////////
    sortByPriority()
    {
        this.animations.sort(function(a, b)
        {
            return a.priority - b.priority;
        });
        if (DEBUG_MODE) console.log(this.animations);
    }
    /////////////////////////////////////////////////////////////////
    //                       getAnimation                          //
    // Function:                                                   //
    //     Returns the first animation with the associated action. //
    //     Null is returned if no animation can be found with the  //
    //     associated action.                                      //
    // Return value                                                //
    //     Animation or null                                       //
    /////////////////////////////////////////////////////////////////
    getAnimationByAction(associated_action)
    {
        var returnval = null;
        this.animations.forEach(function(anim)
        {
            if (anim.associated_action == associated_action)
            {
                returnval = anim;
            }
        });
        return returnval;
    }
    /////////////////////////////////////////////////////////////////
    //                       getAnimation                          //
    // Function:                                                   //
    //     Returns the first animation with the associated action. //
    //     Null is returned if no animation can be found with the  //
    //     associated action.                                      //
    // Return value                                                //
    //     Animation or null                                       //
    /////////////////////////////////////////////////////////////////
    getAnimationByName(animation_index)
    {
        var returnval = null;
        this.animations.forEach(function(anim)
        {
            if (anim.animation_index == animation_index)
            {
                returnval = anim;
            }
        });
        return returnval;
    }
    /////////////////////////////////////////////////////////////////////////////////////
    //                              getCurrentAnimation                                //
    // Function:                                                                       //
    //     Returns the animation with the highest priority whose key is being pressed. //
    //     There may be an animation associated with no action such as idling.         //
    //     The list must be checked first for any input, then check again for any      //
    //     animation that did not have any actions listed, as they will always be      //
    //     returned as a default.                                                      //
    //                                                                                 //
    //     There SHOULD NOT be multiple animations with null actions.                  //
    //     If there is, and no other keys are pressed, then the first animation with   //
    //     a null action will be returned. No guarantees on the order if they have the //
    //     same priority.                                                              //
    //                                                                                 //
    //     If there is no animation with a null action, null is returned.              //
    // Return value:                                                                   //
    //     Animation object or null                                                    //
    /////////////////////////////////////////////////////////////////////////////////////
    getCurrentAnimation()
    {
        var bFoundNullAction = false;
        for (var i = 0; i < this.animations.length; i++)
        {
            a = this.animations[i];
            action = a.associated_action;
            if (action != null)
            {
                if (keyhandler.isPressed(a.associated_action))
                {
                    return a;
                }   
            }
            else
            {
                bFoundNullAction = true;
            }
        }
        // If I get this far, then an animation with a null associated action was found
        // Now we go through the list again to find it.
        for (var i = 0; i < this.animations.length; i++)
        {
            a = this.animations[i];
            action = a.associated_action;
            if (action == null)
            {
                return a;
            }
        }
        // I got nothin jack
        return null;
    }
}