function BackgroundAgent() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
    
    this.context = this.canvas.getContext("2d");
    
    document.body.appendChild(this.canvas);
}

BackgroundAgent.prototype.uploadImage = function () {
    
};

BackgroundAgent.prototype.launchImageChooser = function () {
    
};

BackgroundAgent.prototype.generateBackground = function () {
    
}