"use strict";
window.onkeydown = function(e)
{
    var key = e.keyCode ? e.keyCode : e.which;
    keyhandler.keydown(key);
}
 
window.onkeyup = function(e)
{
    var key = e.keyCode ? e.keyCode : e.which;    
    keyhandler.keyup(key);
}

// Canvas frame update handling
var vendors = ['webkit', 'moz'];
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) 
{
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}
//////////////////////////////////////////////////////////////////////////
// Initialize global variables to point to HTML Canvas for convenience. //
// Initialize player object.                                            //
// Initialize the camera object to follow the player.                   //
// Initialize the level object.                                         //
// Initialize the background image objects.                             //
// Initialize the key handler with basic movement keys.                 //
// Initialize tileset texture.                                          //
// Initialize and sort the 'layers' array.                              //
// Initialize user interface components.                                //
// Register mouse events.                                               //
//////////////////////////////////////////////////////////////////////////
$(document).ready(function () 
{
    // Get HTML Canvas elements
    game_canvas = $("#game_canvas")[0]                 ;
    game_ctx    = $("#game_canvas")[0].getContext("2d");
    ui_canvas   = $("#ui_canvas"  )[0]                 ;
    ui_ctx      = $("#ui_canvas"  )[0].getContext("2d");

    player = addPlayer(10, 10);

    // Set up player camera to follow player
    playercamera = new Camera(player);   
    playercamera.initialize(0, 0, game_canvas.width, game_canvas.height);
    playercamera.setZoom(2, 2); // setting 2x zoom

    // Set level boundaries
    level = new Level(/*MEDIA_DIR + "gray.png"*/);
    background_wall  = addWall(0, 0, null, null, MEDIA_DIR + "trees_fg.png"); // create background wall object
    background_wall2 = addWall(0, 0, null, null, MEDIA_DIR + "trees_bg.png"); // create background wall object
    
    // Load the tileset image.
    tileset_img = new Image();
    tileset_img.src = MEDIA_DIR + "surt_generic_platformer_tiles.png";

    // Register key bindings
    keyhandler = new KeyHandler();
    keyhandler.register("Up"    );
    keyhandler.register("Down"  );
    keyhandler.register("Left"  );
    keyhandler.register("Right" );
    keyhandler.register("Space" );
    keyhandler.register("Escape");

    // Tile:
    //     x, y,
    //     w, h,
    //     framelist,
    //     xoffset, yoffset,
    //     img
    var t = tileset["TOP_BRIGHT_CONCAVE_MIDDLE"];
    tile1 = addTile(500, 500, t.name); //new Tile(500, 500, t.w, t.h, [0], t.x, t.y, tileset_img);

    layers.push(new Layer(  1)); // 1 is the default speed multiplier
    layers.push(new Layer(0.5)); // move 0.5 times as fast as the foreground
    layers.push(new Layer(0.3)); // move 0.3 times as fast as the foreground

    // Put the objects in their desired layers
    layers[LAYER_ENUM.FOREGROUND1].push(player);
    layers[LAYER_ENUM.FOREGROUND1].push(tile1);
    layers[LAYER_ENUM.BACKGROUND1].push(background_wall);
    layers[LAYER_ENUM.BACKGROUND2].push(background_wall2);

    // slowest layers are drawn first so I sort in ascending order by layer speed
    layers.sort(function(a, b)
    {
        return a.speed - b.speed;
    });

    ui_fps_label = new UI_Label("test", 50, 50, 100, 100);
    ui_fps_label.update = function()
    {
        this.setText(round_to(player.pos.x, 2));
    }
    ui_component_list.push(ui_fps_label);

    ui_canvas.addEventListener('mousedown', function (event)
    {
        console.log('clickity clockity');
        mdown = true;
        mousestartpos = getMousePos(event);
        mousepos = mousestartpos;
    });
    ui_canvas.addEventListener('mousemove', function (event)
    {
        mousepos = getMousePos(event);
    });
    ui_canvas.addEventListener('mouseup', function (event)
    {
        mdown = false;
        mousepos = getMousePos(event);
    });

    CanvasPlatformer();
});
function CanvasPlatformer()
{
    window.requestAnimationFrame(CanvasPlatformer);

    game_ctx.clearRect(0,0,game_canvas.width,game_canvas.height);
    ui_ctx.clearRect  (0,0,  ui_canvas.width,  ui_canvas.height);

    game();
    ui();
}