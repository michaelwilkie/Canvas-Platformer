# Files
* All files will contain as a prefix their folder's name (excluding src/ and before)
* example:
```
        /src/ui/example.js  ->  /src/ui/ui_example.js
```
# Function and variable prefixes
* All global variables and functions must have it's filename as a prefix
* example, `ui_globals.js`:
```
        var ui_font;    ->      var ui_globals_font;
```
* Exceptions to this may be made where redundancy arises
* example:
```
        /src/ui/ui_mouse_events.js:
            function: ui_mouse_up   ->  ui_mouse_events_mouse_up (this is dumb, just keep it as ui_mouse_up)
```
# Variables
* All variables are to be in snake case
```
    ui_scroll_bar   ->  ui_scroll_bar
    UiScrollBar     ->  ui_scroll_bar
    uiscrollbar     ->  ui_scroll_bar
```
* All constants or variables whose values are not to be changed are to be in upper case
```
const screen_width -> const SCREEN_WIDTH
```

# Functions
* All functions are to be in Caml case:
```
    create_image_object ->  createImageObject
    CreateImageObject   ->  createImageObject
    CREATEIMAGEOBJECT   ->  createImageObject
```