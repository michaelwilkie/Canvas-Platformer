////////////////////////////////////////////////////////////
// particle.js                                            //
//     The particle effects class that generates a sprite //
//     that lasts a few seconds before it fades.          //
//     It is currently deprecated right now, I will       //
//     repurpose this later when I need to implement      //
//     particle effects.                                  //
////////////////////////////////////////////////////////////
"use strict";

class Particle extends Entity
{
    constructor(x, y, w, h, scale, imgsrc, framelist)
    {
        super(x, y, w*scale, h*scale, imgsrc, framelist);
        this.alpha = 1;
        this.scale = scale;
        this.angle = 0;
        this.clockwise = true;
        var v = getRandomNumber(1, 6);
        var v2= getRandomNumber(1, 4);

        if (getRandomNumber(0, 2) == 1)
            this.clockwise = false;

        this.anglerate = Math.random() + getRandomNumber(2, 4);

        if (this.clockwise)
            this.setVelocity(v,  -v2);
        else
            this.setVelocity(-1 * v, -v2);
        this.setGravity (0    , 0.1);
        this.noCollide = true;
    }
    update()
    {
        if (this.clockwise)
            this.angle+=this.anglerate;
        else
            this.angle-=this.anglerate;
        this.alpha -= 0.01;
        this.updateframe = 0;

        if (this.alpha <= 0)
            this.killSelf();

        super.update();
    }
    draw()
    {
        if (this.framelist != null && this.isVisible)
        {
            var temp = game_ctx.globalAlpha;
            game_ctx.globalAlpha = this.alpha;

            game_ctx.setTransform(this.scale, 0, 0, this.scale, this.pos.x, this.pos.y); // sets scale and origin
            game_ctx.rotate(this.angle * Math.PI / 180);
            game_ctx.drawImage
            (
                this.img, 
                this.framelist[this.frame] * this.width, 
                0, 
                this.width / this.scale, 
                this.height / this.scale, 
                -this.width/2, 
                -this.height/2, 
                this.width, 
                this.height
            );
            game_ctx.setTransform(1,0,0,1,0,0);

            game_ctx.globalAlpha = temp;
        }
    }
}