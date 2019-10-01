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


var vendors = ['webkit', 'moz'];
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) 
{
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}
$(document).ready(function () 
{
    canvas = $("#myCanvas")[0];
    ctx = $("#myCanvas")[0].getContext("2d");

    player = addPlayer(10, 10);

    playercamera = new Camera(player);   
    playercamera.initialize(0, 0, canvas.width, canvas.height);
    playercamera.setZoom(2, 2); // setting 2x zoom

    level = new Level(/*MEDIA_DIR + "gray.png"*/);
    background_wall  = addWall(0, 0, null, null, MEDIA_DIR + "trees_fg.png");
    background_wall2 = addWall(0, 350, null, null, MEDIA_DIR + "trees_bg.png");
    
    tileset_img = new Image();
    tileset_img.src = MEDIA_DIR + "surt_generic_platformer_tiles.png";

    keyhandler = new KeyHandler();
    keyhandler.register("Up");
    keyhandler.register("Down");
    keyhandler.register("Left");
    keyhandler.register("Right");
    keyhandler.register("Space");
    keyhandler.register("Escape");

    // Tile:
    //     x, y,
    //     w, h,
    //     framelist,
    //     xoffset, yoffset,
    //     img
    tile1 = new Tile(500, 500, 32, 32, [0], 731, 32, tileset_img);

    layers.push(new Layer(  1)); // 1 is the default speed multiplier
    layers.push(new Layer(0.5)); // move 0.5 times as fast as the foreground
    layers.push(new Layer(0.3)); // move 0.3 times as fast as the foreground

    layers[LAYER_ENUM.FOREGROUND1].push(player);
    layers[LAYER_ENUM.FOREGROUND1].push(tile1);
    layers[LAYER_ENUM.BACKGROUND1].push(background_wall);
    layers[LAYER_ENUM.BACKGROUND2].push(background_wall2);

    // slowest layers are drawn first so I sort in ascending order by layer speed
    layers.sort(function(a, b)
    {
        return a.speed - b.speed;
    });

    game();
});
function game()
{
    window.requestAnimationFrame(game);
    ctx.clearRect(0,0,canvas.width,canvas.width);
    if(!imagesLoaded)
    {
        imagesLoaded = allImagesLoaded();
        // allImagesLoaded() sets the level object's height and width
        // I am setting it again here to override it with these other background images.
        level.setWidth (background_wall.w);
        level.setHeight(background_wall.h);
    }
    else
    {
        if (keyhandler.isPressed("Escape"))
        {
            if (DEBUG_MODE) console.log("Escape pressed");
            if (gameglobals.mode == GAME_MODE_ENUM.PLAY_MODE) { gameglobals.mode = GAME_MODE_ENUM.EDIT_MODE; if (DEBUG_MODE) console.log("Edit mode"); }
            else                                              { gameglobals.mode = GAME_MODE_ENUM.PLAY_MODE; if (DEBUG_MODE) console.log("Play mode"); }
        }
        if (gameglobals.mode == GAME_MODE_ENUM.PLAY_MODE)
        {
            for (var i = 0; i < layers.length; i++)
            {
            layers[i].draw(playercamera);
                layers[i].update();
            }
        }
        else if (gameglobals.mode == GAME_MODE_ENUM.EDIT_MODE)
        {
            if (keyhandler.isDown("Up"   )) { playercamera.moveUp   (); }
            if (keyhandler.isDown("Down" )) { playercamera.moveDown (); }
            if (keyhandler.isDown("Left" )) { playercamera.moveLeft (); }
            if (keyhandler.isDown("Right")) { playercamera.moveRight(); }
            for (var i = 0; i < layers.length; i++)
            {
                layers[i].draw(playercamera);
            }
        }
        keyhandler.updateLastKeypress();
        playercamera.update(gameglobals.mode == GAME_MODE_ENUM.EDIT_MODE);
        gameglobals.time++;
    }        
}
function getRandomNumber(lower, upper)
{
    return Math.floor((Math.random() * (upper - lower)) + lower);
}
function getMousePos(e) 
{
    var rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
}
// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) 
{
    var rect = canvasDom.getBoundingClientRect();
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
}
function copyCanvasData(srcx, srcy, w, h,
                        dstx, dsty)
{
    var c = document.getElementById("myCanvas");
    var ct = c.getContext("2d");
    var imgData = ct.getImageData(srcx, srcy, w, h);
    ct.putImageData(imgData, dstx, dsty);
}
function getUnitVector(vect)
{
    var sqrsum = vect.x * vect.x + vect.y * vect.y;
    return {x: vect.x/sqrsum, y: vect.y/sqrsum};    
}
function colorNameToHex(color)
{
    if (typeof colors[color.toLowerCase()] != 'undefined')
        return colors[color.toLowerCase()];

    return false;
}
function invertColor(hex, bw) 
{
    if (hex.indexOf('#') === 0) 
    {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) 
    {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) 
    {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) 
    {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}
function approach(flgoal, flcurrent, fldelta)
{
	var fldifference = flgoal - flcurrent;

	if (fldifference >  fldelta) return flcurrent + fldelta;
	if (fldifference < -fldelta) return flcurrent - fldelta;

	return flgoal;
}
function clamp(clmp, curr)
{
    if (clmp < 0)
        if (Math.abs(curr) > Math.abs(clmp))
            return clmp;
        else
            return curr;
    else 
        if (curr > clmp)
            return clmp;
        else
            return curr;
}
function getPlayer()
{
    for (var i = 0; i < entlist.length; i++)
        if(entlist[i] instanceof Player)
            return entlist[i];
    return null;
}
function getPuck()
{
    for (var i = 0; i < entlist.length; i++)
        if(entlist[i] instanceof Puck)
            return entlist[i];
    return null;
}
function getScoreBoard()
{
    return scorebrd;
}
function allImagesLoaded()
{
    if (level.bg_img != null)
        if (!level.bg_img.complete)
            return false;
    for (var i = 0; i < entlist.length; i++)
        if (entlist[i].img != null)
            if (!entlist[i].img.complete)
                return false;
    return true;
}
var SideEnum = {
    UP   : 0,
    DOWN : 1,
    RIGHT: 2,
    LEFT : 3,
    ERROR: 4
}
var SideString = [
    "up",
    "down",
    "right",
    "left",
    "error"
];
// checkSide(a,b) :  return what side entity A is to entity B
//
//   +-----+ 
//   |     |   +---+
//   |  a  |   | b |
//   |     |   +---+
//   +-----+ 
//
// In this illustration, a is to the left of b
// so, in this case, the function will return SideEnum.LEFT
//
function checkSide(a, b)
{
    if (!(a instanceof Entity))
        return SideEnum.ERROR;
    if (!(b instanceof Entity))
        return SideEnum.ERROR;
    
    if (a.pos.x + a.w > b.pos.x + b.w && a.pos.x > b.pos.x + b.w) return SideEnum.LEFT ;
    if (b.pos.x + b.w > a.pos.x + a.w && b.pos.x > a.pos.x + a.w) return SideEnum.RIGHT;
    if (a.pos.y + a.h > b.pos.y + b.h && a.pos.y > b.pos.y + b.h) return SideEnum.DOWN ;
    if (b.pos.y + b.h > a.pos.y + a.h && b.pos.y > a.pos.y + a.h) return SideEnum.UP   ;
    
    return SideEnum.ERROR;
}
function checkPointCollision(rectangle, point)
{
    if (rectangle == null) return false;
    if (point     == null) return false;
    
    return point.x > rectangle.x && point.x < rectangle.x + rectangle.w
        && point.y > rectangle.y && point.y < rectangle.y + rectangle.h;

}
function checkCollision(a, b)
{
    if (!(a instanceof Entity))
        return false;
    if (!(b instanceof Entity))
        return false;
 
    var rect1 = {x: a.pos.x, y: a.pos.y, width: a.w, height: a.h}
    var rect2 = {x: b.pos.x, y: b.pos.y, width: b.w, height: b.h}
 
    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y)
    {
        return true;
    }
    return false;   
}
//////////////////////////////////////////////////////////////////////////////////////
//                             checkCameraCollision                                 //
// Function:                                                                        //
//     Checks whether camera is inside rectangle                                    //
// Return value:                                                                    //
//     boolean                                                                      //
// Source:                                                                          //
// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection //
//////////////////////////////////////////////////////////////////////////////////////
function checkCameraCollision(a, b)
{
    if (!(a instanceof Camera))
    {
        throw Error("Invalid camera argument, checkCameraCollision recevied " + (typeof a));
    }
    var rect1 = {x: a.x, y: a.y, width: a.width, height: a.height}
    var rect2 = {x: b.pos.x, y: b.pos.y, width: b.w, height: b.h}
 
    if (rect1.x <= rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y <= rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y)
    {
        return true;
    }
    return false;   
}
function checkPuckCollision(a, b)
{
    if (!(a instanceof Puck)) return false;
    if (!(b instanceof Puck)) return false;

    var distance = Math.sqrt(
                        ((a.pos.x - b.pos.x) * (a.pos.x - b.pos.x))
                      + ((a.pos.y - b.pos.y) * (a.pos.y - b.pos.y))
                            );
    return distance < a.radius + b.radius;
}
function addPuckAtMouse(e)
{
    var x = mousepos.x;
    var y = mousepos.y;
    var vx = (mousestartpos.x - mousepos.x) / 10;
    var vy = (mousestartpos.y - mousepos.y) / 10;
    addPuck(x - 16, y - 16, vx, vy);
}
function addParticle(x, y, scale)
{
    var obj = new Particle(x, y, 64, 64, scale, "materials/star.png", [0]);
    entlist.push(obj);
    return obj;
}
function addPuck(x, y, vx, vy)
{
    var obj = new Puck(x, y, 32, 32, vx, vy, "materials/circles2.png", [2,3,4,5,4,3,2]);
    entlist.push(obj);
    return obj;
}

function addGoal(x, y, w, h)
{
    var obj = new Goal(x, y, w, h);
    entlist.push(obj);
    return obj;
}
function addWall(x, y, w, h, imgsrc)
{
    var obj = new Wall(x, y, w, h, imgsrc, [0])
    entlist.push(obj);
    return obj;
}
function addTile(x, y, tilename)
{
    var t = null;
    tileset.forEach(function(e)
    {
        if (e.name == tilename)
        {
            t = e;
        }
    });
    var obj = new Tile(x, y, 32, 32, [0], )
}
function addMovingWall(x, y, isVertical)
{
    var obj = new MovingWall(x, y, 64, 64, isVertical, "materials/spring-aa.png", [0,1,2,3,4]);
    entlist.push(obj);
    return obj;
}
function addPlayer(x, y)
{
    var obj = new Player(x, y);
    entlist.push(obj);
    return obj;
}
function sound(src) 
{
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}
function drawLine()
{
    ctx.beginPath();
    ctx.moveTo(mousestartpos.x, mousestartpos.y);
    ctx.lineTo(mousepos.x, mousepos.y);
    ctx.stroke();
}
function distance(p1, p2)
{
    var x = p2.x - p1.x;
    var y = p2.y - p1.y;
    return Math.sqrt(x*x + y*y);
}