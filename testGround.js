const testingMode = true;
if(testingMode){
    lp.clearForces();
}

const testSetup = lp.createForce().afterLast().do(
    ()=>{
        print('r');
        blobDog.reset();
        blobDog.pos.x = canvasSize.width/3;
        drawStage = ()=>{
            background(255);
            blobDog.draw();
        }
    }
);

lp.setDuration(10);