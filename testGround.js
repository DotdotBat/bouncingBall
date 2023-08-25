
lp.clearForces();
lp.setDuration(10);//I will most likely test something small, or even without duration

const testSetup = lp.createForce().at(0).do(
    () => {
        blobDog.reset();
        blobDog.pos.x = canvasSize.width / 4;
        blobDog.visibleEffort = true;
        drawStage = () => {
            background(200,0,0);
            blobDog.draw();
        }
    }
);
const testUpdate = lp.createForce().after(testSetup, 5).do(
    ()=>{
        blobDog.visibleEffort = false;
    }
);





/** no matter how many times this function will be called, it will print it's arguments only once*/
function printOnce(...thingsToSay) {
    if (alreadySaidOnce) return;
    alreadySaidOnce = true;
    print(...thingsToSay);
}
let alreadySaidOnce = false;