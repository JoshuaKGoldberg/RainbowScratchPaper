/**
 * Creates an instance of ScratchOffAgent. The agent creates for itself a 
 * <canvas> element sized at window.innerWidth and window.innerHeight, binds
 * the required set of mouse and touch movements to the canvas, and appends
 * that canvas to the body.
 * 
 * @constructor
 * @this {ScratchOffAgent}
 */
function ScratchOffAgent() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "ScratchOffCanvas";
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
    
    this.context = this.canvas.getContext("2d");
    this.resetBlackCover();
    
    this.lastX = -1;
    this.lastY = -1;
    
    this.erasing = false;
    this.active = false;
    this.onMouseDown = undefined;
    this.onMouseUp = undefined;
    
    this.setBrushSize(14);
    
    this.canvas.addEventListener("mousedown", this.mouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.mouseUp.bind(this));
    
    this.canvas.addEventListener("touchstart", this.mouseDown.bind(this));
    this.canvas.addEventListener("touchmove", this.touchMove.bind(this));
    this.canvas.addEventListener("touchend", this.mouseUp.bind(this));
    
    document.body.addEventListener("mouseout", this.mouseUp.bind(this));
    
    document.body.appendChild(this.canvas);
};

/**
 * Resets the canvas and context for a ScratchOffAgent by covering the canvas
 * in black and resetting the composite operation for the context.
 * 
 * @this {ScratchOffAgent}
 */
ScratchOffAgent.prototype.resetBlackCover = function () {
    this.context.globalCompositeOperation = "source-over";
    
    this.context.fillStyle = "#000000";
    this.context.fillRect(0, 0, innerWidth, innerHeight);
    
    this.context.globalCompositeOperation = "destination-out";
    this.context.lineCap = "round";
};

/**
 * Handles onMouseDown by starting a drawing path. If this.onMouseDown exists,
 * it is called.
 * 
 * @this {ScratchOffAgent}
 * @param {MouseEvent/TouchEvent} event
 */
ScratchOffAgent.prototype.mouseDown = function (event) {
    this.active = true;
    this.context.beginPath();
    
    if(this.onMouseDown) {
        this.onMouseDown(event);
    }
};

/**
 * Handles onMouseUp by clearing the drawing path. If this.onMouseUp exists,
 * it is called.
 * 
 * @this {ScratchOffAgent}
 * @param {MouseEvent/TouchEvent} event
 */
ScratchOffAgent.prototype.mouseUp = function (event) {
    this.active = false;
    
    if(this.onMouseUp) {
        this.onMouseUp(event);
    }
};

/**
 * Handles mouse movement by drawing a path from the most recently known point
 * to the newly hit point (assuming an old point exists), then storing the new
 * coordinates.
 * 
 * @this {ScratchOffAgent}
 * @param {MouseEvent/TouchEvent} event
 */
ScratchOffAgent.prototype.mouseMove = function (event) {
    if(
        this.active
        && this.lastX !== -1
        // && Math.abs(event.clientX - this.lastX) < 140
        // && Math.abs(event.clientY - this.lastY) < 140
    ) {
        this.context.moveTo(this.lastX, this.lastY);
        this.context.lineTo(event.clientX, event.clientY);
        this.context.stroke();
    }
    
    this.lastX = event.clientX;
    this.lastY = event.clientY;
};

/**
 * Custom handler for onTouchMove. The event stores the coordinates inside
 * a series of TouchEvents, so the first one is what's called. The event also
 * has preventDefault() called to stop window dragging, and stopPropagation()
 * for miscellaneous reasons.
 * 
 * @this {ScratchOffAgent}
 * @param {TouchEvent} event
 */
ScratchOffAgent.prototype.touchMove = function (event) {
    this.mouseMove(event.touches[0]);
    
    event.preventDefault();
    event.stopPropagation();
};

/**
 * Sets the brush size for context drawing paths.
 * 
 * @this {ScratchOffAgent}
 * @param {Number} size
 */
ScratchOffAgent.prototype.setBrushSize = function (size) {
    this.context.lineWidth = size;
};

/**
 * Toggles whether the Toggles whether the brush should 'erase' (add black 
 * back) or 'draw' (remove black).
 * 
 * @this {ScratchOffAgent}
 * @param {MouseEvent/TouchEvent} [event]
 */
ScratchOffAgent.prototype.toggleErasor = function (event) {
    if(this.erasing) {
        this.context.globalCompositeOperation = "destination-out";
        this.erasing = false;
        event.target.className = event.target.className.replace(" active", "");
    } else {
        this.context.globalCompositeOperation = "source-over";
        this.erasing = true;
    }
    
    if(event) {
        event.preventDefault();
        event.stopPropagation();
    }
};

/**
 * Starts the process of taking in an uploaded image by creating an Image
 * element, loading the dataURL as the element's src, and preparing the Image
 * to call this.drawImage when done.
 * 
 * @this {ScratchOffAgent}
 * @param {String} dataURL
 */
ScratchOffAgent.prototype.useUploadedImage = function (dataURL) {
    var image = new Image();
    image.onload = this.drawImage.bind(this, image);
    image.src = dataURL;
};

/**
 * Draws an Image onto the foreground canvas. This is calculated by taking the
 * image's ImageData, turning all the color bytes black, and converting all the
 * alpha bytes to the average brightness of those color bytes. For example, if
 * an [r,g,b] pair is [255,255,255] (white), the alpha will be 255, while if the
 * pair is [255,0,0], the alpha will be (255+0+0)/3 = 85.
 * 
 * @this {ScratchOffAgent}
 * @param {HTMLImageElement} image
 */
ScratchOffAgent.prototype.drawImage = function (image) {
    var dummy = document.createElement("canvas"),
        dummyContext = dummy.getContext("2d"),
        dummyData, bytes, length, sum, i;
    
    dummy.width = this.canvas.width;
    dummy.height = this.canvas.height;
    dummyContext.drawImage(image, 0, 0, dummy.width, dummy.height);
    dummyData = dummyContext.getImageData(0, 0, dummy.width, dummy.height);
    
    bytes = dummyData.data;
    length = dummyData.width * dummyData.height * 4;
    
    for(i = 0; i < length; i += 4) {
        sum = bytes[i] + bytes[i + 1] + bytes[i + 2];
        bytes[i] = bytes[i + 1] = bytes[i + 2] = 0;
        bytes[i + 3] = (sum / 3) | 0;
    }
    
    dummyData.data = bytes;
    this.context.putImageData(dummyData, 0, 0);
};