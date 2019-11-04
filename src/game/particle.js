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
            game_ctx.drawImage(this.img, this.framelist[this.frame] * this.w, 0, this.w / this.scale, this.h / this.scale, -this.w/2, -this.h/2, this.w, this.h);
            game_ctx.setTransform(1,0,0,1,0,0);

            game_ctx.globalAlpha = temp;
        }
    }
}