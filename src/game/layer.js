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
    constructor(speed=1)
    {
        this.speed = speed;
        this.entlist = [];
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
            if (this.entlist[i] == e)
            {
                removed = e;
                this.entlist.splice(i, 1);
                e.killSelf();
                return;
            }
        
    }
}