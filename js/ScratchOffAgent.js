/**
 * 
 */
function ScratchOffAgent() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
    
    this.context = this.canvas.getContext("2d");
    this.context.fillStyle = "#000000";
    this.context.fillRect(0, 0, innerWidth, innerHeight);
    this.context.globalCompositeOperation = "destination-out";
    
    this.lastX = -1;
    this.lastY = -1;
    
    this.active = false;
    
    this.setBrushSize(14);
    
    document.addEventListener("mousedown", this.mouseDown.bind(this));
    document.addEventListener("mouseup", this.mouseUp.bind(this));
    document.addEventListener("mousemove", this.mouseMove.bind(this));
    document.body.appendChild(this.canvas);
};

/**
 * 
 */
ScratchOffAgent.prototype.mouseDown = function (event) {
    this.active = true;
};

/**
 * 
 */
ScratchOffAgent.prototype.mouseUp = function (event) {
    this.active = false;
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