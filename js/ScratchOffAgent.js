/**
 * 
 */
function ScratchOffAgent() {
    this.canvas = document.createElement("canvas");
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
    this.canvas.addEventListener("mouseup", this.mouseUp.bind(this));
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
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
        && Math.abs(event.clientX - this.lastX) < 140
        && Math.abs(event.clientY - this.lastY) < 140
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