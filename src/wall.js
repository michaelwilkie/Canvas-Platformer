"use strict";
class Wall extends Entity
{
    constructor(x, y, w, h, imgsrc, framelist)
    {
        super(x, y, w, h, imgsrc, framelist);
        this.AnimEnum = { IDLE: 0, UP: 1, DOWN: 2, LEFT: 3, RIGHT: 4 };
        this.frame = 0;
    }
    update()
    {
        if (this.framecooldown <= 0)
        {
            this.frame = this.AnimEnum.IDLE;
            this.framecooldown = 50;
        }
        else
            this.framecooldown--;
        
        super.update();
    }
}
class MovingWall extends Wall
{
    constructor(x, y, w, h, vertical, imgsrc, framelist)
    {
        super(x, y, w, h, imgsrc, framelist);
        this.AnimEnum = { IDLE: 0, UP: 1, DOWN: 2, LEFT: 3, RIGHT: 4 };
        this.framecooldown = 10;
        this.maxvel = 10;
        this.moveVertically = vertical;
        this.speed = 0.1;
        //this.acc = {x: 0.1, y: 0.1};
    }

    update()
    {
        if (this.moveVertically)
        {
            if (this.pos.y + this.h/2 < canvas.height/2)
            {
                this.vel.y += this.speed;
                this.vel.y = clamp(this.maxvel, this.vel.y);
            }
            else
            {
                this.vel.y -= this.speed;
                this.vel.y = clamp(-1*this.maxvel, this.vel.y);
            }
        }
        else
        {
            if (this.pos.x + this.w/2 < canvas.width/2)
            {
                this.vel.x += this.speed;
                this.vel.x = clamp(this.maxvel, this.vel.x);
            }
            else
            {
                this.vel.x -= this.speed;
                this.vel.x = clamp(-1*this.maxvel, this.vel.x);
            }
        }
        super.update();
    }
}