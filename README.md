# RainbowScratchPaper

Remember those black sheets of paper that let you scratch off to reveal the rainbow background? We do! This project is a single-page web app emulating those old rainbow scratch paper sheets. 


## General Structure

The page is split into three main components. In order from bottom to top:

1. **Background Canvas** - A  `<canvas>` element containing the page's background image, which defaults to a rainbow-color linear gradient.

2.  **Foreground Canvas** - A  `<canvas>` element containing only black pixels with varying alpha values. It starts as a complete sheet of black, and the users mouse and touch movements "scratch" away that black to reveal the background canvas via transparency.

3. **Menu** - A `<div id="menus">` containing three sub-menus. This changes based on page type (see **Responsiveness** below).

 1. **Brush Settings** - A `<div class="menu menu-left">` containing options for the current brush, mainly size and the eraser toggle. It generally sticks to the left side of the screen.

 2. **Picture Settings** - A `<div class="menu menu-right">` containing options for global picture settings, mainly canvas resetting and image uploading. It generally sticks to the right side of the screen.

 3. **Help** - A `<div class="menu menu-center">` containing the current help information. The info defaults to a summary of Rainbow Scratch Paper, but becomes info on buttons when a button is hovered over or touched.


## Controlling logic
*See js/RainbowScratchPaper.js and js/main.js for code*

The main program logic glueing the following pieces together is an instance of the RainbowScratchPaper class. It is created on startup in js/main.js and immediately instantiates MenuAgent, ScratchOffAgent, and BackgroundAgent member variables. After this it links them together via callback events: most importantly, each of MenuAgent's buttons calls functions from either other agent.


## Responsiveness
*See js/MenuAgent.js for code and css/menus.css for CSS*

`MenuAgent.checkMobile()` is called when the page is loaded and whenever the screen resizes. MenuAgent stores an isMobile boolean determined by a long RegExp filtering on the user agent. The body is given a .className based on this .isMobile as well as the screen resolution, which in turn triggers body.className-specific CSS rules in menus.css. The possible values are:

1. **Desktop** - The largest of the displays, this keeps all three menus stuck to the bottom of the screen with 33% width each. 

2. **Tablet** - The middle of the displays with text zoomed larger than in Desktop. This doesn't actually mean the screen is a tablet (tall desktop windows go to this). The settings menu takes up 100% width of the bottom and the other menus are stuck to their respective top corners (left for brush, right for picture).

3. **Mobile** - Specifically targeted to mobile devices. Brush, picture, and help menus are all display:block with no fancy positioning.


## Brushing
*See js/ScratchOffAgent.js for code*

The foreground canvas has touch and mouse events bound by the ScratchOffAgent. When a cursor or touch down happens on the canvas, the menus are hidden and the canvas' context starts drawing a path. Cursor and touch moving draw that path along the canvas, and cursor and touch up stop that path.

The path's type depends on the canvas' context.globalCompositeOperation. `"destination-out"` erases away the canvas (like scratching away the black substance) while `"source-over"` draws the fillStyle over the canvas (so it draws black onto it). 


## Image uploading
*See js/RainbowScratchPaper.js for code*

Image uploading requires a dummy `<input type="file">` to have .onchange bound to a function that creates a new FileReader to read the input's file. When that FileReader is done, some callback can then handle the image's dataURL. This is a rather generic procedure so RainbowScratchPaper provides the function for the other agents to use.

BackgroundAgent uses this simply to load the dataURL into an Image and draw that onto its canvas.

ScratchOffAgent uses this with a fancy algorithm. Once the image's dataURL is loaded, its given to a new Image and drawn onto a new canvas. A version of the canvas' imageData is then made and given to the main ScratchOffAgent canvas where each changed pixel is black and has an alpha transparency equal to its original brightness. Original brightness is the average of its r,g, and b values. In code,

    for(i = 0; i < length; i += 4) {
        data[i + 3] = ((data[i] + data[i + 1] + data[i + 2]) / 3) | 0;
        data[i] = data[i + 1] = data[i + 2] = 0;
    }


## Saving screenshots
*See js/RainbowScratchPaper.js for code*

The saveScreenshot code is actually rather simple. A new canvas is made and has the background and foreground canvases drawn onto it in that order. A dummy `<a>` is then made with an href attribute equal to the canvas' toDataURL("image/png") set as an "image/octet-stream", and clicked.
