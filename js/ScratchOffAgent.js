/**
 * 
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
 * 
 */
ScratchOffAgent.prototype.resetBlackCover = function () {
    this.context.globalCompositeOperation = "source-over";
    
    this.context.fillStyle = "#000000";
    this.context.fillRect(0, 0, innerWidth, innerHeight);
    
    this.context.globalCompositeOperation = "destination-out";
    this.context.lineCap = "round";
};

/**
 * 
 */
ScratchOffAgent.prototype.mouseDown = function (event) {
    this.active = true;
    this.context.beginPath();
    
    if(this.onMouseDown) {
        this.onMouseDown(event);
    }
};

/**
 * 
 */
ScratchOffAgent.prototype.mouseUp = function (event) {
    this.active = false;
    this.context.save();
    
    if(this.onMouseUp) {
        this.onMouseUp(event);
    }
};

/**
 * 
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
 * 
 */
ScratchOffAgent.prototype.touchMove = function (event) {
    this.mouseMove(event.touches[0]);
    
    event.preventDefault();
    event.stopPropagation();
};

/**
 * 
 */
ScratchOffAgent.prototype.setBrushSize = function (size) {
    this.context.lineWidth = size;
};

/**
 * 
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
 * 
 */
ScratchOffAgent.prototype.useUploadedImage = function (dataURL) {
    var image = new Image();
    image.onload = this.drawImage.bind(this, image);
    image.src = dataURL;
};

/**
 * 
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
        bytes[i + 3] = (sum / 4) | 0;
    }
    
    dummyData.data = bytes;
    this.context.putImageData(dummyData, 0, 0);
};