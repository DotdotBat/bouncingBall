
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
                const p = lerp(start, end, amt);
                return lerp(p, end, amt);
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
                let p = amt*amt;//that is the same as using lerp twice, I just wanted to check if it works. 
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
const jumpKeyframeIllustrationSetup = lp.createForce().afterLast().do(() => {
    blobDog.reset();
    blobDog.setSize(width/6);
    drawStage = () => {
        const t = jumpKeyframeIllustrationSetup.getTimeFromStart();
        currentJumpX = getValueFromKeyFrames(t, "X", jumpKeyframeIllustration.keyFrames);
        currentJumpY = getValueFromKeyFrames(t, "Y", jumpKeyframeIllustration.keyFrames);
        drawPicJumpKeyframeIllustration(t);
    }
});
lp.createForce().afterLast().for(jumpKeyframeIllustrationDuration).do(()=>{});//it is here just to set the duration of the animation