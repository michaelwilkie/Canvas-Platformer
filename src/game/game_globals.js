/****************************************************/
/* Game global variables (most of them anyway)      */
/****************************************************/
"use strict";

const DEBUG_MODE = false;

const MEDIA_DIR = "materials/"
const SOUND_DIR = "sound/"
var game_canvas;
var game_ctx;

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

const GRID_TIGHTNESS    = 64;       // tightens the grid

// Enumerator for parallelaxing
const LAYER_ENUM = {
    "FOREGROUND1": 0,
    "BACKGROUND1": 1,
    "BACKGROUND2": 2
};

var layers          = [];                       // used for parallelaxing, might not contain all entities
var player              ;                       // Player object
var playercamera        ;                       // player's Camera object
var entlist         = [];                       // list of all entities
var pucks           = [];                       // deprecated (used in a different project, this may be repurposed)
var level               ;                       // level object, will contain current level data
var background_wall     ;                       // temporary object, used as background
var background_wall2    ;                       // temporary object, used as background
var tileset_img         ;                       // image object of the tileset, this will be used to display different tiles

const GAME_MODE_ENUM = {                        // game mode enumerator
    EDIT_MODE: 0,                               // level editing mode
    PLAY_MODE: 1                                // normal playing mode
};
var gameglobals = { 
    time: 0        ,                            // game time
    fps : 60       ,                            // framerate
    dt  : 0.15     ,                            // delta time
    mode: GAME_MODE_ENUM.PLAY_MODE              // current gamde mode
};

var imagesLoaded = false;                       // used to check if all images are loaded so no 404 errors are thrown

var sound_bump = new sound("sound/bump.mp3");   // may be repurposed
var sound_ping = new sound("sound/ping.mp3");   // may be repurposed
var sound_goal = new sound("sound/goal.mp3");   // may be repurposed
var scorebrd   = null;                          // may be repurposed

var keyhandler;                                 // key handling object, manages user input