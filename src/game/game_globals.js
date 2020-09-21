/*************************/
/* Game global variables */
/*************************/
"use strict";

const DEBUG_MODE    = false;

const ENTITIES_DIR   = MEDIA_DIR + "entities/";

var game_canvas     = null;
var game_ctx        = null;

var game_last_update = null;
var game_next_update = null;

// Mouse position
// Will be used for menus
var mousepos            = {x: 0, y: 0};
var mousestartpos       = {x: 0, y: 0};

var mousedif            = {x: 0, y: 0};
var mousedragbox        = {x: 0, y: 0, width: 0, height: 0};

var mouseselectedentity = null; // for drag and drop

var mdownleft           = false;
var mdownright          = false;
var mlastdownleft       = false;
var mlastdownright      = false;
var mwheel              = false;
var mwheelup            = false;
var mwheeldown          = false;
var mlastwheel          = false;
var mlastwheelup        = false;
var mlastwheeldown      = false;
var MOUSE_DEBUG_MODE    = false;

var game_sky_color      = "skyblue";

var selected_entity_pos = null;                 // For saving the position of an entity before it gets dragged around by the mouse

const GRID_TIGHTNESS    = 64;                   // controls the tightness of the tile-placement grid

var layers              = []    ;               // array of Layer objects, used for parallelaxing, might not contain all entities
var player              = null  ;               // Player object
var playercamera        = null  ;               // player's Camera object
var entlist             = []    ;               // array of Entities, list of all entities
var pucks               = []    ;               // deprecated (used in a different project, this may be repurposed)
var level               = null  ;               // level object, will contain current level data
var background_wall     = null  ;               // Wall object, temporary object, used as background
var background_wall2    = null  ;               // Wall object, temporary object, used as background
var tileset_img         = null  ;               // image object of the tileset, this will be used to display different tiles



const GAME_MODE_ENUM = {                        // game mode enumerator
    EDIT_MODE: 0,                               // level editing mode
    PLAY_MODE: 1                                // normal playing mode
};

var gamecore = {
    fps             : 60                        ,   // framerate
    time            : null                      ,   // GameTime object, for keeping track of game's time/tickrate
    mode            : GAME_MODE_ENUM.PLAY_MODE  ,   // current game mode
    animation_timer : 35                        ,   // time in milliseconds between animation frame
    gravity         : {x:  0.0  , y:50.0}       ,   // default gravity for all entities
    friction        : {x:100.0  , y: 0.0}       ,   // default friction for all entities
    max_velocity    : {x: 20.0  , y:20.0}           // default max velocity for all entites
};

var scorebrd    = null;                          // may be repurposed
var keyhandler  = null;                          // key handling object, manages user input