/**
 * Creates an instance of BackgroundAgent. The agent creates for itself a
 * <canvas> element sized at window.innerWidth and window.innerHeight and 
 * appends that canvas to the body. It also has some functionality to generate
 * or upload an image for that background
 * 
 * @constructor
 * @this {BackgroundAgent}
 */
function BackgroundAgent() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "BackgroundCanvas";
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
    
    this.context = this.canvas.getContext("2d");
    
    this.rainbowColors = [
        "darkorange", "yellow", "green", "blue", "purple", "red"
    ];
    this.rainbowStops = [
        .15, .25, .4, .6, .75, .9
    ];
    
    document.body.appendChild(this.canvas);
}

/**
 * Starts the process of taking in an uploaded iamge by creating an Image
 * element, loading the dataURL as the element's src, and preparing the Image
 * to call this.context.drawImage when done.
 * 
 * @this {BackgroundAgent}
 * @param {String} dataURL
 */
BackgroundAgent.prototype.useUploadedImage = function (dataURL) {
    var image = new Image();
    
    image.onload = (function () {
        this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    }).bind(this);
    
    image.src = dataURL;
};

/**
 * Randomly generates a rainbow background. The rainbow colors and color stop
 * locations are already set (by the constructor), but the actual angle is
 * randomly set by this.getRandomLinearGradient(). It's then drawn onto
 * the canvas.
 * 
 * @this {BackgroundAgent}
 */
BackgroundAgent.prototype.generateBackground = function () {
    var gradient = this.getRandomLinearGradient(),
        i;
    
    for(i = 0; i < this.rainbowColors.length; i += 1) {
        gradient.addColorStop(this.rainbowStops[i], this.rainbowColors[i]);
    }
    
    this.context.fillStyle = gradient;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
};


/**
 * Creates one of four possible createLinearGradient angles. Each is a 
 * different source corner, and all are sized to this.canvas.
 * 
 * @this {BackgroundAgent}
 * @return {CanvasGradient}
 */
BackgroundAgent.prototype.getRandomLinearGradient = function () {
    switch(Math.floor(Math.random() * 4)) {
        // Source: top right
        case 0:
            return this.context.createLinearGradient(
                this.canvas.width, 0, 0, this.canvas.height
            );
        // Source: bottom right
        case 1:
            return this.context.createLinearGradient(
                this.canvas.width, this.canvas.height, 0, 0
            );
        // Source: bottom left
        case 2:
            return this.context.createLinearGradient(
                0, this.canvas.height, this.canvas.width, 0
            );
        // Source: top left
        case 3:
            return this.context.createLinearGradient(
                0, 0, this.canvas.width, this.canvas.height
            );
    }
};