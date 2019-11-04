//////////////////////////////////////////////////////////
// ui_globals.js                                        //
//     Contains all the globals used for the UI Canvas. //
//////////////////////////////////////////////////////////


"use strict";
var ui_default_font             = "Arial"                    ;
var ui_default_fontsize         = 20                         ;
var ui_default_text_color       = "white"                    ;
var ui_default_background_color = "transparent"              ;

var ui_font                     = ui_default_font            ;
var ui_fontsize                 = ui_default_fontsize        ;
var ui_text_color               = ui_default_text_color      ;
var ui_background_color         = ui_default_background_color;

var ui_component_list = []; // should contain all the UI elements that are to be displayed

var ui_fps_label;

var ui_canvas;
var ui_ctx;