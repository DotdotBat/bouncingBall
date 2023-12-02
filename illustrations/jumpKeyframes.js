
function drawPicJumpKeyframeIllustration(t) {
    background(51);
    stroke(255);
    //the three points
    circle(width/2-jumpLength/2, floorHeight, 10);
    circle(width/2+jumpLength/2, floorHeight, 10);
    line(width/2-jumpLength/2, topHeight,
        width/2+jumpLength/2, topHeight)
    jumpKeyframeIllustration.keyFrames.forEach(kf => {
        circle(kf.X, kf.Y, 10);
    });

    let progress = t / jumpKeyframeIllustrationDuration;
    stroke("blue");
    for (let i = 0; i < 4; i++) {
        line(width * 2 * progress - width, 0, width * 2 * progress, 0);
        translate(width / 2, height / 2);
        rotate(-PI / 2);
        translate(-width / 2, -height / 2);
    }
    stroke(0);
    blobDog.pos.x = currentJumpX;
    blobDog.pos.y = currentJumpY;
    blobDog.draw();
}

const jumpKeyframeIllustrationDuration = 4;

const floorHeight = canvasSize.height*0.7;
const jumpLength = canvasSize.width/2;
const topHeight = canvasSize.height*0.25; 
const jumpKeyframeIllustration = {
    keyFrames: [
        {
            at: 0,
            X: canvasSize.width/2 - jumpLength/2,
            Y: floorHeight,
        },
        {
            after: 1.5,
            Y: topHeight,
            curve: (start, end, amt)=>{// parameter order is taken from the lerp function
                let p = 1-(1-amt)*(1-amt);//results in a parabolic slow out
                return lerp(start, end, p);
            }
        },
        {
            after:1.5,
            X: canvasSize.width/2 + jumpLength/2,
        },
        {
            after:0,
            Y: floorHeight,
            curve: (start, end, amt)=>{//just remember that the amount goes from 0 to 1.
                let p = amt*amt;//results in a parabolic slow in
                return lerp(start, end, p);
            }
        },
        {
            at: jumpKeyframeIllustrationDuration,
            X: canvasSize.width/2 - jumpLength/2,
            Y: floorHeight,
        }
    ]
};

let currentJumpX = 1;
let currentJumpY = 1;
lp.clearForces();
lp.setDuration(jumpKeyframeIllustrationDuration);
lp.createForce().afterLast().do(() => {
    blobDog.reset();
    blobDog.setSize(width/6);
    drawStage = () => {
        currentJumpX = getValueFromKeyFrames(lp.seconds, "X", jumpKeyframeIllustration.keyFrames);
        currentJumpY = getValueFromKeyFrames(lp.seconds, "Y", jumpKeyframeIllustration.keyFrames);
        drawPicJumpKeyframeIllustration(lp.seconds);
    }
});