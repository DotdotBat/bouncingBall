
function optionalVFXDraw() {
    const t = showdownSetup.getTimeFromStart();
    const maxResolution = 50;
    let p = getValueFromKeyFrames(t, "heartResolution",showdownKeyframes);
    push();
    fill(255,100,100);
    drawHeart(
        2 * width / 3, height / 3, blobCat.r/2, p
    );
    p/=2;
    drawHeart(
        width / 3, 2*height / 3, blobCat.r/2, p
    );
    pop();
}


