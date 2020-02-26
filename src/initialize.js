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

    SCREEN_WIDTH  = game_canvas.width ;
    SCREEN_HEIGHT = game_canvas.height;

    // Set up player camera to follow player
    playercamera = new Camera(player);   
    playercamera.initialize(0, 0, game_canvas.width, game_canvas.height);
    playercamera.setZoom(2, 2); // setting 2x zoom

    // Set level boundaries
    level = new Level();
    background_wall  = addWall(0, -70, null, null, MEDIA_DIR + "trees_fg.png"); // create background wall object
    background_wall2 = addWall(0, 150, null, null, MEDIA_DIR + "trees_bg.png"); // create background wall object
    
    // Load the tileset image.
    tileset_img = new Image();
    tileset_img.src = MEDIA_DIR + "surt_generic_platformer_tiles.png";

    // Register key bindings
    keyhandler = new KeyHandler();
    keyhandler.register("`"     );
    keyhandler.register("Up"    );
    keyhandler.register("Down"  );
    keyhandler.register("Left"  );
    keyhandler.register("Right" );
    keyhandler.register("Space" );
    keyhandler.register("Escape");
    keyhandler.register("Delete");

    createLayer(1  , "foreground1"); // 1 is the default speed multiplier
    createLayer(0.5, "background1"); // move 0.5 times as fast as the foreground
    createLayer(0.3, "background2"); // move 0.3 times as fast as the foreground

    // Put the objects in their desired layers
    pushToLayer(player          , "foreground1");
    pushToLayer(background_wall , "background1");    
    pushToLayer(background_wall2, "background2");

    // slowest layers are drawn first so I sort in ascending order by layer speed
    layers.sort(function(a, b)
    {
        return a.speed - b.speed;
    });

    html_initialize_globals();
    initialize_edit_mode_component();
    initialize_edit_mode_tiles();
    initialize_edit_mode_html();

    ui_canvas.addEventListener('wheel', function (event)
    {
        ui_mouse_wheel(event);
    
        // Returning false so you don't scroll the whole HTML page by accident
        return false;
    });

    ui_canvas.addEventListener('mousedown', function (event)
    {
        ui_mouse_down(event);
    });
    ui_canvas.addEventListener('mousemove', function (event)
    {
        ui_mouse_move(event);
    });
    ui_canvas.addEventListener('mouseup', function (event)
    {
        ui_mouse_up(event);
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