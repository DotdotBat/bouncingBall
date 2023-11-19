const screensaverBounceSetup = lp.createForce().afterLast().do(
    () => {
        blobDog.reset();
        backgroundColor = 0;
        dotBat.reset();
        blobDogSpeedX = 300;
        blobDogSpeedY = blobDogSpeedX * 0.8;
        drawStage = () => {
            background(backgroundColor);
            dotBat.draw();
            blobDog.draw();
        };
    }
)
let blobDogSpeedX = 300;
let blobDogSpeedY = blobDogSpeedX * 0.8;

const screensaverBounceLoop = lp.createForce().after(screensaverBounceSetup).for(5).do(
    () => {
        blobDog.pos.x += lp.step * blobDogSpeedX;
        blobDog.pos.y += lp.step * blobDogSpeedY;
        const x = blobDog.pos.x; const y = blobDog.pos.y;
        const r = blobDog.body.d / 2;
        if (width < x + r || 0 > x - r) blobDogSpeedX *= -1;
        if (height < y + r || 0 > y - r) blobDogSpeedY *= -1;
        blobDog.visibleEffort = width < x + r || 0 > x - r || height < y + r || 0 > y - r;
        if(blobDog.visibleEffort){
            blobDog.body.mainClr = randomColor();
            blobDog.body.patternClr = randomColor();
        }
    }
)

function randomColor(){
    return color(random(255),random(255),random(255));
}
//Yea, blobDog can get stuck in a wall with such logic, but with a fixed FPS it is unlikely. 