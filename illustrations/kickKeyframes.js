
function drawPicKeyframeIllustration(t) {
    background(51);
    stroke(255);
    //the three points
    keyframeIllustration.keyFrames.forEach(kf => {
        circle(kf.X, kf.Y, 10);
    });

    let progress = t / keyframeIllustrationDuration;
    stroke("blue");
    for (let i = 0; i < 4; i++) {
        line(width * 2 * progress - width, 0, width * 2 * progress, 0);
        translate(width / 2, height / 2);
        rotate(PI / 2);
        translate(-width / 2, -height / 2);
    }
    stroke(0);
    blobDog.pos.x = currentX;
    blobDog.pos.y = currentY;
    blobDog.draw();
}

const keyframeIllustrationDuration = 4;

const keyframeIllustration = {
    keyFrames: [
        {
            at: 0,
            X: canvasSize.width / 5,
            Y: canvasSize.height / 2,
        },
        {
            at: 1.5,
            X: 2 * canvasSize.width / 3,
            Y: canvasSize.height * 0.75
        },
        {
            after:2,
            X: canvasSize.width * 0.75,
            Y: canvasSize.height * 0.3
        },
        {
            at: keyframeIllustrationDuration,
            X: canvasSize.width / 5,
            Y: canvasSize.height / 2,
        }
    ]
};

let currentX = 1;
let currentY = 1;
const keyframeIllustrationSetup = lp.createForce().afterLast().do(() => {
    blobDog.reset();
    blobDog.setSize(width/6);
    drawStage = () => {
        const t = keyframeIllustrationSetup.getTimeFromStart()
        currentX = getValueFromKeyFrames(t, "X", keyframeIllustration.keyFrames);
        currentY = getValueFromKeyFrames(t, "Y", keyframeIllustration.keyFrames);
        drawPicKeyframeIllustration(t);
    }
});
lp.createForce().afterLast().for(keyframeIllustrationDuration).do(()=>{});//it is here just to set the duration of the animation