function ScratchOffAgent = function (settings) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = settings.width;
    this.canvas.height = settings.height;
    
    this.context = this.canvas.getContext("2d");
    this.context.fillStyle = "#000000";
    this.context.fillRect(0, 0, innerWidth, innerHeight);
    this.context.globalCompositionOperation = "destination-out";
    
    this.lastX = -1;
    this.lastY = -1;
};

ScratchOffAgent.prototype.moveMouse = function (event) {
    if(this.lastX !== -1) {
        this.context.moveTo(this.lastX, this.lastY);
        this.context.lineTo(event.clientX, event.clientY);
        this.context.stroke();
    }
    
    this.lastX = event.clientX;
    this.lastY = event.clientY;
};