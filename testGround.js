const testingMode = false;
if (testingMode) {
    lp.clearForces();
    lp.setDuration(10);//I will most likely test something small, or even without duration

    const testSetup = lp.createForce().at(0).do(
        () => {
            blobDog.reset();
            blobDog.pos.x = canvasSize.width * 3 / 4;
            blobCat.reset();
            blobCat.x = canvasSize.width / 4;
            drawStage = () => {
                background(0);
                blobDog.draw();
                blobCat.draw();
            }
        }
    );
}