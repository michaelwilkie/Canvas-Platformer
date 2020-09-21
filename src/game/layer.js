///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// layer.js                                                                                                  //
//     This class is used for dividing entities up into layers for parallelaxing.                            //
//     Parallelaxing is the 'pretend 3d' effect of distant backgrounds scrolling slower than the foreground. //
//     And foregrounds moving faster than backgrounds.                                                       //
//     Different layers will have different scrolling speeds.                                                //
//                                                                                                           //
//     Layers are expected to be put inside a list of Layers.                                                //
//     This list will be sorted by ascending Layer.speed                                                     //
//     This means fasting scrolling entities (the closest ones) will be drawn last                           //
//     (so they are at the front of the picture)                                                             //
//                                                                                                           //
//     Entities in a Layer will be shown on camera by a multiple of Layer.speed                              //
//     Meaning, instead of draw(camera.x + ent.pos.x, camera.y + ent.pos.y)                                  //
//     you will see:       draw(camera.x * Layer.speed + ent.pos.x, camera.y * Layer.speed + ent.pos.y)      //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
"use strict";

class Layer
{
    // speed defaults to 1
    constructor(speed=1, name=null)
    {
        this.speed = speed;
        this.entlist = [];
        this.name = name;
    }
    push(e)
    {
        this.entlist.push(e);
    }
    draw(camera)
    {
        var speed = this.speed;
        this.entlist.forEach(function(e)
        {
            e.draw(camera, speed)
        });
    }
    update()
    {
        this.entlist.forEach(function(e)
        {
            e.update();
        });
    }
    /////////////////////////////////////////////////////////////////////////////////////////
    // *WARNING: Does not just remove from this.entlist, but also global variable: entlist //
    /////////////////////////////////////////////////////////////////////////////////////////
    remove(e)
    {
        for (var i = 0; i < this.entlist.length; i++)
        {
            if (this.entlist[i] == e)
            {
                this.entlist.splice(i, 1);
                e.killSelf();
                return;
            }
        }
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
        // I won't save the individual entities in its entlist since the global entlist will already
        // be taken care of
        var str_result = "";

        str_result += "name"  + " " + this.name  + "\n";
        str_result += "speed" + " " + this.speed + "\n";

        return str_result;
    }
}