lp.setDuration(6);

const highHopSetup = lp.Force().at(0).do(
  () => {
    backgroundColor = color("indigo");
    blobDog.reset();
    blobDog.pos = createVector(0.2 * width, 1.1 * height);
    blobDog.body.d = canvasSize.height/3;
    drawStage = function () {
      background(backgroundColor);
      blobDog.draw();
    }
  }
)

const hopSettings = {
  lowPoint : 1.5 * canvasSize.height,
  duration: 3,
  highPoint : 0.4 * canvasSize.height,
  startX : canvasSize.width * 0.2,
  endX : canvasSize.width * 0.8
};


const highHopLoop = lp.Force().after(highHopSetup).for(3).do(
  () => {
    blobDog.savePrePos();//will be used later to calculate speed

    const sT = highHopLoop._start;//start time
    const progress = 2 * ((lp.seconds-sT) % hopSettings.duration)/hopSettings.duration -1;
    //so, progress starts at -1, becomes 0 at the middle and ends at 1
    const parabolaInterpolation = progress*progress;
    const s = hopSettings;
    blobDog.pos.y = s.highPoint + (s.lowPoint - s.highPoint) * parabolaInterpolation; 

    blobDog.pos.x = lerp(s.startX, s.endX, 0.5 + progress/2);//0 to 1
    //blobDog
    blobDog.speed.x = (s.endX - s.startX)/s.duration;
    blobDog.speed.y = (s.lowPoint - s.highPoint)*progress*2; 
    //derivative of x^2 is x*2
    
    blobDog.squeezeRot = blobDog.speed.heading();
    blobDog.squeeze = 1;
    if(abs(progress)>0.3){
      blobDog.squeeze = 1+ 0.1*(abs(progress)-0.3);
    }

  }
)
const weightliftingSetup = lp.Force().afterPrevious().do(() => {
  backgroundColor = color("midnightBlue");
  blobDog.reset();
  blobDog.pos.x = canvasSize.width / 2;
  barbell.centerX = blobDog.pos.x;
  blobDog.body.d = canvasSize.height / 3;
  barbell.setSize(blobDog.body.d * 2);
  drawStage = function () {
    background(backgroundColor);
    blobDog.draw();
    barbell.draw();
    blobDog.drawPaws();//they are on the barbell, so they have to be drawn on after it
  }
});

const standingPoint = { x: canvasSize.width / 2, y: 2 * canvasSize.height / 3 };
const weightliftingSettings = {
  highPoint: 1,//all length values are in relation to blobDog size
  lowPoint: 0.8,
  period: 60 / song.bpm,
  barbellAmplitude: 0.05,
  crouchingOffset: Math.PI,
  barbellSwingOffset: Math.PI / 6,
  barbellEndsFollowupTime: 1,
  blobDogStandsOnPoint: { x: canvasSize.width / 2, y: 2 * canvasSize.height / 3 },
}

const weightLiftingLoop = lp.Force().after(weightliftingSetup).for(3).do(
  () => {
    const wlLoop = weightLiftingLoop;
    const wl = weightliftingSettings;
    const angle = wlLoop._start + (2 * Math.PI * lp.seconds / wl.period);
    const progress = (1 - cos(angle)) / 2;
    const crouching = wl.lowPoint + (wl.highPoint - wl.lowPoint) * progress;
    blobDog.squeeze = crouching;
    //keep the dog anchored
    blobDog.pos.y = standingPoint.y - (blobDog.body.d / 2) * crouching * crouching;

    const barbellPath = cos(angle - Math.PI / 6) * wl.barbellAmplitude * width;

    //I chose the the top point to be the center of barbell's sinusoid
    const topOfDogHead = blobDog.pos.y - (blobDog.body.d / 2) * blobDog.squeeze * blobDog.squeeze;//because of how the squeeze is applied now
    barbell.holdsY = topOfDogHead + barbellPath;

    const barbellEndsPath = cos(angle - Math.PI / 6 - Math.PI / 6) * wl.barbellAmplitude * width / 2;
    barbell.endsY = barbell.holdsY + barbellEndsPath;

    //take hold of the bar
    const rightHoldX = barbell.getRightHoldX();
    const leftHoldX = barbell.getLeftHoldX();
    blobDog.takeHoldLeft(leftHoldX, barbell.holdsY);
    blobDog.takeHoldRight(rightHoldX, barbell.holdsY);
  }
);




