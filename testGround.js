
lp.clearForces();
lp.setDuration(10);//I will most likely test something small, or even without duration

const testSetup = lp.createForce().at(1).do(
    () => {
        dotBat.reset();
        dotBat.y = height * 0.69;

        blobDog.reset();
        blobDog.pos.x = 0; dotBat.x = 0;
        blobDog.pos.y -= dotBat.faceY;
        dotBat.y -= dotBat.faceY;
        
        drawStage = () => {
            translate(width/2, height/2);
            scale(5);
            // translate(dotBat.x, dotBat.faceY);
            background(illustrationBackgroundColor);
            blobDog.draw();
            dotBat.draw();
            noLoop();
        };
        
    }
);


const testUpdate = lp.createForce().after(testSetup).for(5).do(
    () => {

    }
);



function printOnlyOnce(...thingsToSay) {
    if (alreadySaidOnce) return;
    alreadySaidOnce = true;
    print(...thingsToSay);
}
let alreadySaidOnce = false;










