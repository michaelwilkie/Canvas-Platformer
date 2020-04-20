# Files
* All files will contain as a prefix their folder's name (excluding src/ and before)
* example:
```
        /src/ui/example.js  ->  /src/ui/ui_example.js
```
# Functions and variables
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
* All constants or variables whose values are not to be changed are to be in upper case
```
const screen_width -> const SCREEN_WIDTH
```

# Functions
* All functions will follow the Java-esque function naming convention:
```
    create_image_object ->  createImageObject
    CreateImageObject   ->  createImageObject
    CREATEIMAGEOBJECT   ->  createImageObject
```