
const weightliftingSetup = lp.createForce().afterPrevious().do(() => {
    backgroundColor = color("midnightBlue");
    blobDog.reset();
    blobDog.pos.x = canvasSize.width / 2;
    barbell.centerX = blobDog.pos.x;
    blobDog.body.d = canvasSize.height / 3;
    barbell.setSize(blobDog.body.d * 2);
    drawStage = function () {
      background(backgroundColor);
      text("HARDER", width / 2, height / 4);
      blobDog.draw();
      barbell.draw();
      blobDog.drawPaws();//they are on the barbell, so they have to be drawn on after it
    }
  });
  
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
  
  const weightLiftingLoop = lp.createForce().after(weightliftingSetup).for(3).do(
    () => {
      const wlLoop = weightLiftingLoop;
      const wl = weightliftingSettings;
      const angle = wlLoop._start + (2 * Math.PI * lp.seconds / wl.period);
      const progress = (1 - cos(angle)) / 2;
      const crouching = wl.lowPoint + (wl.highPoint - wl.lowPoint) * progress;
      blobDog._squeeze = crouching;
      //keep the dog anchored
      blobDog.pos.y = wl.blobDogStandsOnPoint.y - (blobDog.body.d / 2) * crouching * crouching;
  
      const barbellPath = cos(angle - Math.PI / 6) * wl.barbellAmplitude * width;
  
      //I chose the the top point to be the center of barbell's sinusoid
      const topOfDogHead = blobDog.getYofHeadTop();
      //double squeeze because of how the squeeze is applied now, consider creating a 
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