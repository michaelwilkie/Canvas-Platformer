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
// Initialize game timer object.                                        //
// Initialize player object.                                            //
// Initialize sound library.                                            //
// Initialize screen size.                                              //
// Initialize the camera object to follow the player.                   //
// Initialize the level object.                                         //
// Initialize the background image objects.                             //
// Initialize tileset texture.                                          //
// Initialize the key handler with basic movement keys.                 //
// Initialize the global variables to point to HTML elements.           //
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

    // Initialize game-time-keeping pbject
    gamecore.time = new GameTime();
    gamecore.time.tick();

    game_last_update = gamecore.time.now;
    game_next_update = 1000 / gamecore.fps;

    // Initializing image files
    image_initialize();

    // Initializing sound files
    sound_initialize();

    // As far as I know right now, the HTML Canvas is not easily resizable
    // so I will have them be constants for now
    SCREEN_WIDTH  = game_canvas.width ; // SCREEN_WIDTH  = game_canvas.width  = game_canvas.width * SCREEN_WIDTH_PERCENTAGE;
    SCREEN_HEIGHT = game_canvas.height; // SCREEN_HEIGHT = game_canvas.height = game_canvas.width * SCREEN_ASPECT_RATIO;

    // Creating an example player at location (10, 10)
    player = addPlayer(10, 10);

    // Set up player camera to follow player
    playercamera = new Camera(player);   
    playercamera.initialize(0, 0, game_canvas.width, game_canvas.height);
    playercamera.setZoom(2, 2); // setting 2x zoom

    // Create level
    level = new Level();
    // background_wall  = addWall(0, -70, null, null, MEDIA_DIR + "trees_fg.png"); // create background wall object
    // background_wall2 = addWall(0, 150, null, null, MEDIA_DIR + "trees_bg.png"); // create background wall object
    
    // Set level boundaries
    // level.setDimensions(1200, 500);

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

    // Collect the references to the html objects for the global variables
    html_initialize_globals();

    // Attach event handler to background changer
    html_initializeColorPickerEventHandler();

    // Update level boundaries in html
    html_updateLevelDivs();

    // This is for the popup that saves and loads levels
    html_initializePopupEventHandlers();

    // A sad day I have to comment these 2 lines out, a LOT of work went into them, but putting
    // the edit mode UI on top of the canvas was a bad idea
    //initialize_edit_mode_component();
    //initialize_edit_mode_tiles();
    
    initialize_edit_mode_html();

    // Setting the default game mode
    game_setGameMode(GAME_MODE_ENUM.EDIT_MODE);

    // Creating template layers so the user has an example to go from
    html_addLayerElement(0.25, "background2");
    html_addLayerElement(0.5 , "background1");
    html_addLayerElement(1   , "foreground1");

    // Put the objects in their desired layers
    pushToLayer(player          , "foreground1");
    //pushToLayer(background_wall , "background1");
    //pushToLayer(background_wall2, "background2");
    $.ajax(
    {
        url : "/levels/start_level.txt",
        dataType: "text",
        success : function (data) 
        {
            game_parseLevelString(data.split("\n"));
        }
    });

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

    gamecore.time.tick();

    // Only update the game on a time-basis, not frame rate basis
    if (gamecore.time.now - game_last_update > game_next_update)
    {
        game_last_update = gamecore.time.now + game_next_update;

        game_ctx.clearRect(0,0,game_canvas.width,game_canvas.height);
        ui_ctx.clearRect  (0,0,  ui_canvas.width,  ui_canvas.height);

        game();
        ui();
    }
}