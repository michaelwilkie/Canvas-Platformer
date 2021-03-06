//////////////////////////////////////////////////////////
// goal.js                                              //
//     An extension of the Trigger class where any puck //
//     that collides with it will score a goal.         //
//     This is deprecated for now, I may repurpose this //
//     when I need some sort of goal entity.            //
//////////////////////////////////////////////////////////
"use strict";

class Goal extends Trigger
{
    constructor(x, y, w, h, color)
    {
        super(x, y, w, h, color, "materials/basket.png", [0]);
        this.leftRim  = addWall(x, y);
        this.scorelimit = 5;
        this.rightRim = addWall(x + this.width - 4, y);
        this.isColliding = false;
        this.invisible = true;
    }
    update()
    {
        for (var i = 0; i < pucks.length; i++)
        {
            if (checkCollision(this, pucks[i]))
            {
                pucks[i].pos.x-=pucks[i].vel.x;
                pucks[i].pos.y-=pucks[i].vel.y;
                if (checkSide(pucks[i], this) == SideEnum.UP && !this.isColliding)
                {
                    sound_goal.play();
                    var scrbrd = getScoreBoard();
                    var p = pucks[i];
                    for (var x = 0; x < 10; x++)
                    {
                        addParticle(this.pos.x + this.width/2, this.pos.y + this.height/2, Math.random());
                    }
                    var myself = this;
                    setTimeout(function()
                    {
                        myself.randomizePosition();
                        p.killSelf();
                    }, 125);
                    if (scrbrd != null)
                    {
                        scrbrd.playerScored();
                    }
                    this.isColliding = true;
                }                
                pucks[i].pos.x+=pucks[i].vel.x;
                pucks[i].pos.y+=pucks[i].vel.y;
            }
            else
            {
                this.isColliding = false;
            }
        }
    }
    setScoreLimit(limit)
    {
        this.scorelimit = limit;
    }
    randomizePosition()
    {
        var xp = getRandomNumber(game_canvas.width/2 + this.width * 2, game_canvas.width  - 2 * this.width);
        var yp = getRandomNumber(this.height * 2, game_canvas.height - 2 * this.height);
        this.pos          = {x: xp             , y: yp};
        this.leftRim.pos  = {x: xp             , y: yp};
        this.rightRim.pos = {x: xp + this.width - 4, y: yp};
    }
}