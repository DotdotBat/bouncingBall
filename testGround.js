
lp.clearForces();
lp.setDuration(10);//I will most likely test something small, or even without duration

const testSetup = lp.createForce().at(0).do(
    () => {
        backgroundColor = color("midnightBlue");
        drawStage = () => {
            drawPicPresentingPlans();
            noLoop();
        };
    }
);

const beatDuration = 1 / song.bps;
const testUpdate = lp.createForce().after(testSetup, 3).for(4 * beatDuration).do(
    () => {

    }
);




function printOnlyOnce(...thingsToSay) {
    if (alreadySaidOnce) return;
    alreadySaidOnce = true;
    print(...thingsToSay);
}
let alreadySaidOnce = false;


