///////////////////////////////////////////////
// html_globals.js                           //
// Global variables related to html elements //
///////////////////////////////////////////////
"use strict";

var html_selected_object        = null      ; // The img element selected under the Tileset section
var html_div_tileset            = null      ; // Reference to the html tileset div
var html_div_entities           = null      ; // Reference to the html entities div
var html_div_edit_mode          = null      ; // Reference to the Edit Mode div
var html_div_layers_scrollarea  = null      ; // Reference to the layer scroll area div
var html_div_layer_info         = null      ; // Reference to the layer info div
var html_div_object_info        = null      ; // Reference to the object info div
var html_unique_id              = 0         ; // used for giving unique names to html elements
var html_selected_layer         = null      ; // Reference to the currently selected html layer
var html_level_width_input      = null      ; // Reference to the level width input element
var html_level_height_input     = null      ; // Reference to the level height input element
var html_sky_color_input        = null      ; // Reference to the background color input element

var html_default_border_size    = "2px"     ;
var html_default_border_style   = "solid"   ;
var html_default_border_color   = "black"   ;
var html_default_zIndex         = 1         ;