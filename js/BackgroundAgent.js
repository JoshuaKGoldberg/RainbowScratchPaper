function BackgroundAgent() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
    
    this.context = this.canvas.getContext("2d");
    
    document.body.appendChild(this.canvas);
}

BackgroundAgent.prototype.useUploadedImage = function (dataURL) {
    var image = new Image();
    
    image.onload = (function () {
        this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    }).bind(this);
    
    image.src = dataURL;
};

BackgroundAgent.prototype.launchImageChooser = function () {
    
};

BackgroundAgent.prototype.generateBackground = function () {
    
}