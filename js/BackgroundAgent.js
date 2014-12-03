/**
 * 
 */
function BackgroundAgent() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
    
    this.context = this.canvas.getContext("2d");
    
    this.rainbowColors = [
        "red", "orange", "yellow", "green", "blue", "purple"
    ];
    this.rainbowStops = [
        0, .2, .35, .5, .8, .9
    ];
    
    document.body.appendChild(this.canvas);
}

/**
 * 
 */
BackgroundAgent.prototype.useUploadedImage = function (dataURL) {
    var image = new Image();
    
    image.onload = (function () {
        this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    }).bind(this);
    
    image.src = dataURL;
};

/**
 * 
 */
BackgroundAgent.prototype.launchImageChooser = function () {
    
};

/**
 * 
 */
BackgroundAgent.prototype.generateBackground = function () {
    var gradient = this.getRandomLinearGradient(),
        i;
        // this.context.createLinearGradient(
            // 0, 0, this.canvas.width, this.canvas.height
        // ),
    
    for(i = 0; i < this.rainbowColors.length; i += 1) {
        gradient.addColorStop(this.rainbowStops[i], this.rainbowColors[i]);
    }
    
    this.context.fillStyle = gradient;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
};


/**
 * 
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