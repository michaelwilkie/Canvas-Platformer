"use strict";
class Trigger extends Entity
{
    constructor(x, y, w, h, color="darkred", imgsrc, framelist)
    {
        super(x, y, w, h, imgsrc, framelist);
        this.noCollide = true;
        this.invisible = false;
        this.color = color;
    }
    update() { }
    draw()
    {
        if(!this.invisible)
        {
            game_ctx.fillStyle = this.color;
            game_ctx.fillRect(this.pos.x, this.pos.y, this.w, this.h);
        }
        else
            super.draw();
    }
}