////////////////////////////////////////////////////////////////////////////////////
// level.js                                                                       //
//     Establishes boundaries that all entities (that move) should remain inside. //
//     Background images are optional.                                            //
//                                                                                //
//     If a background image is specified, then the level boundaries will be      //
//     the same as the dimensions of the image.                                   //
//     If a background image is not specified, then the level boundaries will be  //
//     1000 by 1000.                                                              //
////////////////////////////////////////////////////////////////////////////////////
"use strict";

class Level
{
    constructor(src)
    {
        this.width = 0;
        this.height = 0;
        this.bg_img = null;
        if (src != null)
        {
            this.bg_img = new Image();
            this.bg_img.src = src;
            
            var temp = this;
            this.bg_img.onload = function()
            {
                // 'this' now refers to bg_img in these 
                // inner brackets, not a reference to Level
                // not to be confused with Level.width/height
                temp.setDimensions(this.width, this.height);
            };
        }
        else
        {
            this.width  = 10000;
            this.height = 10000;
        }
    }
    setWidth(width)
    {
        this.width = width;
    }
    setHeight(height)
    {
        this.height = height;
    }
    setDimensions(width, height)
    {
        this.setWidth(width);
        this.setHeight(height);
    }
    draw(camera)
    {
        if (this.bg_img != null)
        {
            game_ctx.drawImage(this.bg_img,
                          camera.x               , camera.y               ,
                          camera.width           , camera.height          ,
                          camera.screenpartitionx, camera.screenpartitiony,
                          camera.width           , camera.height
                         );
        }
    }
}