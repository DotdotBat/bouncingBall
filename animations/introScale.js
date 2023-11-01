
let cameraKeyframes = []
let cameraScale = 1;

const shotSetup = lp.createForce().afterLast().do(
    () => {
        dotBat.reset();
        dotBat.y = height * 0.69;

        blobDog.reset();
        blobDog.pos.x = 0; dotBat.x = 0;
        blobDog.pos.y -= dotBat.faceY;
        dotBat.y -= dotBat.faceY;

        cameraKeyframes = [
            {   
                at:0,
                scale:1,
            },
            {   
                at:1,
                scale:1,
            },
            {   
                after:3,
                scale:5,
            },
            {   
                after:0,
                scale:5,
            }
        ]
        
        drawStage = () => {
            translate(width/2, height/2);
            scale(cameraScale);
            // translate(dotBat.x, dotBat.faceY);
            draw
            background(illustrationBackgroundColor);
            blobDog.draw();
            dotBat.draw();
        };
    }
);

const testUpdate = lp.createForce().after(shotSetup).for(5).do(
    () => {
        const t = shotSetup.getTimeFromStart();
        cameraScale = getValueFromKeyFrames(t,"scale",cameraKeyframes);
    }
);


