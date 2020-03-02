////////////////////////////////////////////////////////////////
// scoreboard.js                                              //
//     Old scoreboard class used in previous Canvas projects. //
//     Used to display the score of something on the screen.  //
//     I may repurpose eventually when it's time to display   //
//     some sort of scoring mechanism on the screen.          //
////////////////////////////////////////////////////////////////
"use strict";

class ScoreBoard
{
    constructor()
    {
        this.scoreplayer = 0;
    }
    display()
    {
        var playr = getPlayer();
        var score = this.scoreplayer;
       
        if (debug_enabled)
        {
            if (playr.shotsTaken == 0 || score == 0)
                game_ctx.fillText(" Score/shot ratio: " + score, 0, 100);
            else
                game_ctx.fillText(" Score/shot ratio: " + (score/playr.shotsTaken).toFixed(2), 0, 100);    
            game_ctx.font = "30px Arial";
            game_ctx.fillStyle = "white";
            game_ctx.fillText(" Shots: "+ playr.getShotsTaken(), 0, 50);
            game_ctx.fillText(" Entities: "+ entlist.length, 0, 150);
        }
        game_ctx.fillText(score, canvas.width/2 - game_ctx.measureText(score).width/2, 50);
    }
    playerScored()
    {
        this.scoreplayer++;
    }
    computerScored()
    {
        this.scorecomputer++;
    }
}