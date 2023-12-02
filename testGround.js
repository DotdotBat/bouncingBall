
lp.clearForces();
lp.setDuration(10);//I will most likely test something small, or even without duration


const testSetup = lp.createForce().at(0.3).do(
    () => {
        drawPicKeyframeIllustration();
        noLoop();
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










