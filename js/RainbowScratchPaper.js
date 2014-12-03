/**
 * 
 */
function RainbowScratchPaper() {
    this.MenuAgent = new MenuAgent();
    this.ScratchOffAgent = new ScratchOffAgent();
    this.BackgroundAgent = new BackgroundAgent();
    
    this.setButtonCallbacks();
    this.setMenuScratchHiding();
}

/**
 * 
 */
RainbowScratchPaper.prototype.setButtonCallbacks = function () {
    this.MenuAgent.setButtonCallbacks({
        "brush-1": this.ScratchOffAgent.setBrushSize.bind(this.ScratchOffAgent, 1),
        "brush-2": this.ScratchOffAgent.setBrushSize.bind(this.ScratchOffAgent, 3),
        "brush-3": this.ScratchOffAgent.setBrushSize.bind(this.ScratchOffAgent, 7),
        "brush-4": this.ScratchOffAgent.setBrushSize.bind(this.ScratchOffAgent, 14),
    });
    this.MenuAgent.buttons[0].click();
};

/**
 * 
 */
RainbowScratchPaper.prototype.setMenuScratchHiding = function () {
    this.ScratchOffAgent.onMouseDown = this.MenuAgent.toggleMenuClasses.bind(
        this.MenuAgent, "menu-expanded", "menu-contracted"
    );
};