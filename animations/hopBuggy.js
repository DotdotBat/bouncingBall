const buggyHopSetup = lp.createForce().afterLast().do(
  () => {
    backgroundColor = color(51);
    blobDog.reset();
    blobDog.pos = createVector(0.2 * width, 1.1 * height);
    blobDog.body.d = canvasSize.height / 3;
    textAlign(CENTER, CENTER);
    drawStage = function () {
      background(backgroundColor);
      text("BETTER", width / 2, height / 4);
      blobDog.draw();
      dotBat.draw();
    };
    dotBat.reset();
    dotBat.wingsAreSpread = true;
  }
)

const buggyHopSettings = {
  lowPoint: 1.5 * canvasSize.height,
  duration: 3,
  highPoint: 0.4 * canvasSize.height,
  startX: canvasSize.width * 0.2,
  endX: canvasSize.width * 0.8
};


const buggyHopLoop = lp.createForce().after(buggyHopSetup).for(3).do(
  () => {
    blobDog.savePrePos();//blobdog needs to save imfo to calculate speed in the next frame. 

    const sT = buggyHopLoop._start;//start time
    const progress = 2 * ((lp.seconds - sT) % buggyHopSettings.duration) / buggyHopSettings.duration - 1;
    //so, progress starts at -1, becomes 0 at the middle and ends at 1
    const parabolaInterpolation = progress * progress;
    const s = buggyHopSettings;
    blobDog.pos.y = s.highPoint + (s.lowPoint - s.highPoint) * parabolaInterpolation;

    blobDog.pos.x = lerp(s.startX, s.endX, 0.5 + progress / 2);//0 to 1
    blobDog.calculateSpeed();
    const speed = createVector(blobDog.speed.x, blobDog.speed.y);
    blobDog.squeezeRot = speed.heading();
    blobDog._squeeze = 1;
    //O great ones, forgive me, for I recreate this bug for educational purposes only.
    if (abs(progress) < 0.7) {
      blobDog._squeeze = 1 + (speed.magSq());
    }
    blobDog.rot = -progress * Math.PI / 24;
    const turningPoint = 0.35;
    const lowEars = Math.PI / 3
    const highEars = -Math.PI / 12;
    if (progress < -turningPoint) {
      blobDog.ears.angle = lowEars;
    } else if (progress < turningPoint) {
      const linearInterpolation = (progress + turningPoint) / (2 * turningPoint);
      blobDog.ears.angle = lerp(lowEars, highEars, linearInterpolation);
    } else {
      blobDog.ears.angle = highEars;
    }

  }
)

const dotBatCopilotForBuggyHop = lp.createForce().along(buggyHopLoop).do(
  () => {
    const t = buggyHopLoop.getCompleteness();
    const flightRadius = 1.4 * blobDog.body.d / 2;
    const angle = lerp(PI - PI / 6, TAU + PI / 6, t);
    const x = blobDog.pos.x + flightRadius * cos(angle);
    const y = blobDog.pos.y - flightRadius * sin(angle);
    dotBat.setPos(x, y);

    dotBat.rotation = lerp(0, PI, t);

    dotBat.wingsAreSpread =
      (t > 0.1 && t < 0.2) || (t > 0.8);
  }
)

