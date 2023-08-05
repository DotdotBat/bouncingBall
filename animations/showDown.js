const showdown = {
    squishCoefficient: 0.75,
    fullSceneDuration(){
      return (this.beatNum+0.5)*this.oneBeat;// should figure out the length of the 8 beats segment
    },
    catY: canvasSize.height/2,
    catX: canvasSize.width/2,
    startX: canvasSize.width/4,
    landX: canvasSize.width/3,
    wallX: 5 * canvasSize.width/6,
    floorY: 5* canvasSize.height/6,
    jumpHight: canvasSize.height/4,
    setup(){
      backgroundColor = color("Yellow");
      blobDog.reset();
      blobDog.body.d = this.bdR*2;
      blobDog.pos.x = this.startX;
      blobDog.pos.y = this.catY;
      drawStage = this.draw;
    },
    draw(){
      background(backgroundColor);
      blobDog.draw();
      push();
      fill("purple")
      circle(
        width/2,
        showdown.catY,
        showdown.bdR*2
      );
      pop();
      //blobCat.draw()
    },
    beatTime(num){
      return num*this.oneBeat;
    },
    bdR: (canvasSize.height/6)/2,
    oneBeat:0.75,
    beatNum:8,
  }
  const showdownTimeFrames = {
    start: 0,
    squish: showdown.beatTime(1),
    jumpTop: showdown.beatTime(3),
    wallSquish: showdown.beatTime(4),
    floorSquish: showdown.beatTime(5),
    landInFrontOfCat: showdown.beatTime(6),
    kiss: showdown.beatTime(7),
    settle: showdown.beatTime(8)
  };
  const showdownSetup = lp.createForce().afterPrevious().do(()=>{showdown.setup();});
  const anticipatorySquish = lp.createForce().after(showdownSetup).until(showdownTimeFrames.squish).do(
    ()=>{
      const t = showdownSetup.getTimeFromStart();
      const s = getValueFromKeyFrames(t, "squish", showdownKeyframes);
      blobDog.setSquish(s);
      //the y value also updates to account for standing, but it is already updating on it's own
    }
  );
  const squishOnCrouch = lp.createForce().at(showdownTimeFrames.squish).until(showdownTimeFrames.wallSquish).do(
    ()=>{
      //at the start we use the squish to jump
      const isCrouching = blobDog.pos.y > showdown.catY;
      if(isCrouching){
        const s = 1 - (blobDog.pos.y - showdown.catY)/showdown.bdR;
        blobDog.setSquish(s);
      }

      //actually I noticed a bug, on the last frame of crouching some squish is applied, but on the next frame it isn't updated to be 1. So blobDog flies off in a squished state.
      //to combat this, we will remember to set squish when isCrouching is no longer true.
      if(isCrouching&&!this.rememberBlobDogWasCrouching){
        this.rememberBlobDogWasCrouching = true;
      };
      if(this.rememberBlobDogWasCrouching&&!isCrouching){
        blobDog.setSquish(1);
        this.rememberBlobDogWasCrouching = false; //we do this once
      }
    }
  );
  
  const squishOnTouch = lp.createForce().after(anticipatorySquish).until(showdownTimeFrames.landInFrontOfCat).do(
    ()=>{
      const pos = blobDog.pos;
      const r = blobDog.body.d/2;
      const distanceFromBlobDogCenterToWallOrFloor = min(showdown.wallX-pos.x, showdown.floorY - pos.y);
      const isTouchingSomething = distanceFromBlobDogCenterToWallOrFloor < r;
      if(isTouchingSomething){
        const squish = distanceFromBlobDogCenterToWallOrFloor/r;
        blobDog.setSquish(squish);
      }
      const isTouchingWall = pos.x + r > showdown.wallX;
      if(isTouchingWall){
        blobDog.squeezeRot = 0;
      }
      const isTouchingFloor = pos.y + r > showdown.floorY;
      if(isTouchingFloor){
        blobDog.squeezeRot = PI/2;
      }

      //after touching something, we need to set squish to 1
      if(this.wasTouchingSomethingLastFrame&&!isTouchingSomething){
        blobDog.setSquish(1);
      }
      this.wasTouchingSomethingLastFrame = isTouchingSomething;
    }
  );
  const showdownPositionUpdate = lp.createForce().after(showdownSetup).for(showdown.fullSceneDuration()).do(
    ()=>{
      const t = showdownSetup.getTimeFromStart();
      blobDog.pos.x = getValueFromKeyFrames(t,"x", showdownKeyframes);
      blobDog.pos.y = getValueFromKeyFrames(t,"y", showdownKeyframes);
    }
  );
  
  const showdownFaceController = lp.createForce().after(showdownSetup).for(showdown.fullSceneDuration()).do(
    ()=>{
      const t = showdownSetup.getTimeFromStart();
      const maxFacing = 0.25;
      blobDog.pose.heading.horizontal = maxFacing * getValueFromKeyFrames(t,"faceLeft", showdownKeyframes);
      const upPeckMotion = getValueFromKeyFrames(t,"faceUp", showdownKeyframes);
      const bodyRotMax = -Math.PI / 10; //magic numbers
      const skewMax = -Math.PI / 12; //found by trial and error
      blobDog.rot = bodyRotMax * upPeckMotion;
      blobDog.skew = skewMax * upPeckMotion;
    }
  )
  const showdownKeyframes = [
    {
      name:"start",
      at: showdownTimeFrames.start,
      squish:1,
      y:showdown.catY,
      faceLeft:0,
    },
    {
      name:"anticipatory squish",
      at :showdownTimeFrames.squish,
      squish: showdown.squishCoefficient,
      y: showdown.catY + showdown.bdR*(1 - showdown.squishCoefficient),
      x: showdown.startX,
      faceLeft:1
    },
    {
      name: "high in the sky",
      at : showdownTimeFrames.jumpTop,
      y: showdown.jumpHight,
      faceLeft:1,
      curve(prev, curr, amt){
        //this should be a cubic, but I want to try a double lerp
        const temp=  lerp(prev, curr, amt);
        return lerp(temp, curr, amt);
      }
    },
    {
      name: "wall jump Y",
      at : showdownTimeFrames.wallSquish,
      y: (showdown.catY + showdown.jumpHight)/2,
      curve(prev, curr, amt){
        const temp = lerp(prev, curr, amt);
        return lerp(prev, temp, amt);
      }
    },
    {
      name: "wall jump X",
      at : showdownTimeFrames.wallSquish,
      x: showdown.wallX-showdown.bdR*showdown.squishCoefficient,
      faceLeft:-1,
    },
    {
      name: "floor Jump",
      at : showdownTimeFrames.floorSquish,
      x: showdown.catX,
      y: showdown.floorY - showdown.bdR*showdown.squishCoefficient,
    },
    {
      name: "Gotcha kitty-cat(landing near them)",
      at: showdownTimeFrames.landInFrontOfCat,
      x: showdown.landX,
      y: showdown.catY,
      faceLeft: 0,
    },
    {
      name: "deliver the hit",
      at: showdownTimeFrames.kiss,
      x:showdown.catX-showdown.bdR,
      faceUp:0,
      faceLeft: 1,
    },
    {
      name: "smug enjoyment",
      at: showdownTimeFrames.settle,
      faceUp:1//meaning nuzzle a bit
    }
  ]