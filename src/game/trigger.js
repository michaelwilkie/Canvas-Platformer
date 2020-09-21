/////////////////////////////////////////////////////////////////////
// trigger.js                                                      //
//     Invisible wall that triggers things on collision detection. //
//     This class is inspired from Valve's Hammer Editor where     //
//     events are triggered based on the physical interaction      //
//     with these objects.                                         //
/////////////////////////////////////////////////////////////////////
"use strict";

class Trigger extends Entity
{
    constructor(x, y, w, h, layer=0)
    {
        super(x, y, w, h, ENTITIES_DIR + "trigger.png", null, layer);
        this.noCollide  = true; // Naturally triggers are not meant to be collided with
        this.bVisible   = true; // This will be visible since the code in this spot only occurs in editor mode
        this.alpha = 0.5;
    }
    update()
    {

    }
    draw(camera, layerspeed=1)
    {
        if(this.bVisible)
        {
            var old_global_alpha = game_ctx.globalAlpha;

            game_ctx.globalAlpha = this.alpha;
            game_drawTiledTexture
            (
                this.img,
                this.pos.x - (camera.x * layerspeed) + camera.screenpartitionx,
                this.pos.y - (camera.y * layerspeed) + camera.screenpartitiony,
                this.width,
                this.height
            );
            
            game_ctx.globalAlpha = old_global_alpha;
        }
    }
}