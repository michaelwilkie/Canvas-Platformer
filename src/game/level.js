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
        this.width  = 0     ; // [pixels] width  of the level (for a camera with 1:1 zoom)
        this.height = 0     ; // [pixels] height of the level (for a camera with 1:1 zoom)
        this.bg_img = null  ; // [image ] background image object
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
            game_ctx.drawImage
            (
                this.bg_img,
                camera.x               , camera.y               ,
                camera.width           , camera.height          ,
                camera.screenpartitionx, camera.screenpartitiony,
                camera.width           , camera.height
            );
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

        str_result += "width"  + " " + this.width       + "\n";
        str_result += "height" + " " + this.height      + "\n";

        // Saving the source since that's all that's needed to load the image
        if (this.bg_img != null)
        {
            str_result += "bg_img" + " " + this.bg_img.src  + "\n";
        }

        return str_result;
    }
}