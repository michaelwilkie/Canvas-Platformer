//////////////////////////////////////////////////////////////////////////////////////////
// tile.js                                                                              //
//     The purpose of the Tile class is to help with performance that the ordinary      //
//     Wall class doesn't provide.                                                      //
//     Each entity is dumb and creates a whole new image when given a source path.      //
//     The Tile class accepts an Image object to sidestep the whole src to img process, //                    
//     mainly to prevent a million copies of the tileset being created.                 //
//////////////////////////////////////////////////////////////////////////////////////////
"use strict";

class Tile extends Wall
{
    constructor(x, y, w, h, framelist, xoffset, yoffset, img)
    {
        super(x, y, w, h, null, framelist);
        this.xoffset = xoffset; // offset position for the tileset
        this.yoffset = yoffset; // offset position for the tileset
        this.img = img;
    }
    draw(camera, layerspeed=1)
    {
        game_ctx.drawImage
        (
            this.img,
            this.xoffset,//this.framelist[this.frame] * this.w, // animated Tiles are unsupported for now, will fix this later
            this.yoffset, 
            this.w, 
            this.h, 
            this.pos.x - (camera.x * layerspeed) + camera.screenpartitionx, 
            this.pos.y - (camera.y * layerspeed) + camera.screenpartitiony, 
            this.w, 
            this.h
        );
    }
    draw_on_UI(xoffset, yoffset)
    {
        ui_ctx.drawImage
        (
            this.img,
            this.xoffset,//this.framelist[this.frame] * this.w, // animated Tiles are unsupported for now, will fix this later
            this.yoffset, 
            this.w, 
            this.h, 
            this.pos.x + xoffset, 
            this.pos.y + yoffset, 
            this.w, 
            this.h
        );
    }
}