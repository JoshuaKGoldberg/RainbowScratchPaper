/**
 * 
 */
function RainbowScratchPaper() {
    this.MenuAgent = new MenuAgent();
    this.ScratchOffAgent = new ScratchOffAgent();
    this.BackgroundAgent = new BackgroundAgent();
    
    this.setButtonCallbacks();
    this.setMenuScratchHiding();
    
    this.MenuAgent.buttonsKeyed["back-generate"].click();
}

/**
 * 
 */
RainbowScratchPaper.prototype.setButtonCallbacks = function () {
    this.MenuAgent.setButtonStatusCallbacks({
        "brush-1": this.ScratchOffAgent.setBrushSize.bind(this.ScratchOffAgent, 1),
        "brush-2": this.ScratchOffAgent.setBrushSize.bind(this.ScratchOffAgent, 3),
        "brush-3": this.ScratchOffAgent.setBrushSize.bind(this.ScratchOffAgent, 7),
        "brush-4": this.ScratchOffAgent.setBrushSize.bind(this.ScratchOffAgent, 14),
        "brush-5": this.ScratchOffAgent.setBrushSize.bind(this.ScratchOffAgent, 28),
        "erasor": this.ScratchOffAgent.toggleErasor.bind(this.ScratchOffAgent)
    });
    
    this.MenuAgent.setButtonActionCallbacks({
        "front-refresh": this.ScratchOffAgent.resetBlackCover.bind(this.ScratchOffAgent),
        "front-upload": this.uploadImage.bind(
            this, this.ScratchOffAgent.useUploadedImage.bind(this.ScratchOffAgent)
        ),
        "back-upload": this.uploadImage.bind(
            this, this.BackgroundAgent.useUploadedImage.bind(this.BackgroundAgent)
        ),
        "back-generate": this.BackgroundAgent.generateBackground.bind(this.BackgroundAgent),
        "save": this.saveScreenshot.bind(this)
    });
    
    this.MenuAgent.buttons[1].click();
};

/**
 * 
 */
RainbowScratchPaper.prototype.setMenuScratchHiding = function () {
    this.ScratchOffAgent.onMouseDown = this.MenuAgent.hide.bind(this.MenuAgent);
    this.ScratchOffAgent.onMouseUp = this.MenuAgent.show.bind(this.MenuAgent);
};

/**
 * 
 */
RainbowScratchPaper.prototype.saveScreenshot = function () {
    var canvas = document.createElement("canvas"),
        context = canvas.getContext("2d"),
        format = "image/png",
        link = document.createElement("a");
    
    canvas.width = this.ScratchOffAgent.canvas.width;
    canvas.height = this.ScratchOffAgent.canvas.height;
    
    context.drawImage(this.BackgroundAgent.canvas, 0, 0);
    context.drawImage(this.ScratchOffAgent.canvas, 0, 0);
    
    link.download = "RainbowScratchPaper Screenshot.png";
    link.href = canvas.toDataURL(format).replace(format, "image/octet-stream");
    link.click();
};

/**
 * 
 */
RainbowScratchPaper.prototype.uploadImage = function (callback) {
    var dummy = document.createElement("input");
    
    dummy.type = "file";
    dummy.onchange = this.handleImageUpload.bind(this, dummy, callback);
    
    dummy.click();
};

/**
 * 
 */
RainbowScratchPaper.prototype.handleImageUpload = function (dummy, callback, event) {
    var file = dummy.files[0],
        type = file.type.split("/")[1],
        reader = new FileReader();
    
    reader.onloadend = function () {
        callback(reader.result);
    };
    reader.readAsDataURL(file);
    
    event.preventDefault();
    event.stopPropagation();
};