const highHopSetup = lp.createForce().afterPrevious().do(
    () => {
      backgroundColor = color("indigo");
      blobDog.reset();
      blobDog.pos = createVector(0.2 * width, 1.1 * height);
      blobDog.body.d = canvasSize.height / 3;
      drawStage = function () {
        background(backgroundColor);
        text("BETTER", width / 2, height / 4);
        blobDog.draw();
      }
    }
  )
  
  const hopSettings = {
    lowPoint: 1.5 * canvasSize.height,
    duration: 3,
    highPoint: 0.4 * canvasSize.height,
    startX: canvasSize.width * 0.2,
    endX: canvasSize.width * 0.8
  };
  
  
  const highHopLoop = lp.createForce().after(highHopSetup).for(3).do(
    () => {
      blobDog.savePrePos();//will be used later to calculate speed
  
      const sT = highHopLoop._start;//start time
      const progress = 2 * ((lp.seconds - sT) % hopSettings.duration) / hopSettings.duration - 1;
      //so, progress starts at -1, becomes 0 at the middle and ends at 1
      const parabolaInterpolation = progress * progress;
      const s = hopSettings;
      blobDog.pos.y = s.highPoint + (s.lowPoint - s.highPoint) * parabolaInterpolation;
  
      blobDog.pos.x = lerp(s.startX, s.endX, 0.5 + progress / 2);//0 to 1
      //blobDog
      blobDog.speed.x = (s.endX - s.startX) / s.duration;
      blobDog.speed.y = (s.lowPoint - s.highPoint) * progress * 2;
      //derivative of x^2 is x*2
  
      blobDog.squeezeRot = blobDog.speed.heading();
      blobDog._squeeze = 1;
      if (abs(progress) > 0.3) {
        blobDog._squeeze = 1 + 0.1 * (abs(progress) - 0.3);
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