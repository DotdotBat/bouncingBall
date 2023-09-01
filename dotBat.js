function loadDotBatImages() {
    dotBat.bodyBaseLayer = loadImage("assets/dotBat/body.png");
    dotBat.eyeLayer = loadImage("assets/dotBat/eye.png");
    dotBat.mouthLayer = loadImage("assets/dotBat/mouth.png");
    dotBat.pantsLayer = loadImage("assets/dotBat/pants.png");
    dotBat.wingsLayer = loadImage("assets/dotBat/wings.png");
}

const dotBat = {
    inPants: true,
    bodyBaseLayer: null,
    wingsLayer: null,
    pantsLayer: null,
    mouthLayer: null,
    eyeLayer: null,
    get height() {
        return this.bodyBaseLayer.height;
    },
    get width() {
        return this.bodyBaseLayer.width;
    },
    drawStandingAt(x, y) {
        push();
        translate(x, y);
        rotate(this.rotation);
        translate(-this.width / 2, -this.height);
        noSmooth();
        //the images are layers, with the same size
        image(this.bodyBaseLayer, 0, 0);
        image(this.eyeLayer, 0, 0);
        if (this.wingsAreSpread) image(this.wingsLayer, 0, 0);
        image(this.mouthLayer, 0, 0);
        if (dotBat.inPants) image(this.pantsLayer, 0, 0);
        pop();
    },
    x: 0,
    y: 0,
    draw() {
        this.drawStandingAt(this.x, this.y);
    },
    setPos(x, y) {
        this.x = x;
        this.y = y;
    },
    wingsAreSpread: true,
    rotation: 0,
    reset() {
        this.wingsAreSpread = true;
        this.rotation = 0;
        this.x = width / 2;
        this.y = 0;
    },
}