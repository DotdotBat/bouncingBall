const kickSetup = lp.createForce().afterPrevious().do(() => {
    backgroundColor = color('maroon');
    blobDog.reset();
    textAlign(CENTER, CENTER);
    textSize(40);
    dotBat.reset();
    dotBat.wingsAreSpread = false;
    dotBat.setPos(width*0.6, height*0.57);
    drawStage = function () {
      background(backgroundColor);
      text("STRONGER", width / 2, height / 4);
      dotBat.draw();
      drawDummy();
      blobDog.draw();
    }
  });
  
  const kick = {
    //face her
    //get close
    //  (but a little lower then her)
    //smooch (lift your face)
    keyFrames: [
      {
        name: "start Pos",
        at: 0,
        posX: canvasSize.width / 3,
        posY: canvasSize.height / 2,
        bodRot: 0,
        leftHeading: 0//so not looking left
      },
      {
        name: "face your opponent",
        after: 0.2,
        leftHeading: 0.2,
        posX: canvasSize.width / 3,
        skew: 0,
      },
      {
        name: "Move to her",
        after: 0.3,
        posX: 2 * canvasSize.width / 3,
        skew: 0,
        curve(start, end, amt) {
          
          return lerp(start, end, amt);
        },
      },
      {
        name: "make her wait for it",
        after: 0.2,
        posX: 2 * canvasSize.width / 3,
        bodRot: 0,
        skew: 0
      },
      {
        name: "peck",
        after: 0.1,
        bodRot: -Math.PI / 10,
        skew: -Math.PI / 12,
        dummyFall: 0,
      },
      {
        name: "savor",
        after: 0.15,
        bodRot: -Math.PI / 10,
        skew: -Math.PI / 12,
      },
      {
        name: "unPeck",
        after: 0.1,
        bodRot: 0,
        posX: 2 * canvasSize.width / 3,
        skew: 0,
      },
      {
        name: "return",
        after: 0.2,
        posX: canvasSize.width / 3,
        bodRot: 0,
        dummyFall:1,
      }
    ]
  }
  
  const kickSceneDuration = durationFromKeyFrames(kick.keyFrames);
  const kickLoop = lp.createForce().after(kickSetup).for(kickSceneDuration).do(
    () => {
      let now = lp.seconds - kickLoop._start;
      blobDog.pos.x = getValueFromKeyFrames(now, 'posX', kick.keyFrames);
      blobDog.pos.y = getValueFromKeyFrames(now, 'posY', kick.keyFrames);
      blobDog.skew = getValueFromKeyFrames(now, "skew", kick.keyFrames);
      blobDog.pose.heading.horizontal =
        getValueFromKeyFrames(now, "leftHeading", kick.keyFrames);
      blobDog.rot = getValueFromKeyFrames(now, "bodRot", kick.keyFrames);
      let p =getValueFromKeyFrames(now, "dummyFall", kick.keyFrames);
      p = lerp(0, p, p);
      p = lerp(0, p, p);
      dummyFallAngle = lerp(0, Math.PI/4, p);
    }
  );