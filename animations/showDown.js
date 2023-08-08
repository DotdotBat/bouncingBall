const showdown = {
  squishCoefficient: 0.75,
  fullSceneDuration() {
    return (this.beatNum + 0.5) * this.oneBeat;// this ia a placeholder until I figure out the length of the 8 beats segment
  },
  catY: canvasSize.height / 2,
  catX: canvasSize.width / 2,
  startX: canvasSize.width / 10,
  landX: 0.3 * canvasSize.width,
  wallX: canvasSize.width,
  floorY: canvasSize.height,
  jumpHight: canvasSize.height / 6,
  setup() {
    backgroundColor = color("Yellow");
    blobDog.reset();
    blobCat.reset();
    blobDog.setSize(this.blobR * 2);
    blobCat.r = this.blobR;
    blobDog.pos.x = this.startX;
    blobDog.pos.y = this.catY;
    blobCat.x = this.catX;
    blobCat.y = this.catY;
    drawStage = this.draw;
  },
  draw() {
    background(backgroundColor);
    blobDog.draw();
    blobCat.draw();
  },
  beatTime(num) {
    return num * this.oneBeat;
  },
  blobR: (canvasSize.height / 10),
  oneBeat: 0.75,
  beatNum: 8,
}
const showdownSetup = lp.createForce().afterPrevious().do(() => { showdown.setup(); });

const showdownTimeFrames = {
  start: 0,
  squish: showdown.beatTime(1),
  jumpTop: showdown.beatTime(3),
  wallSquish: showdown.beatTime(4),
  floorSquish: showdown.beatTime(5),
  landInFrontOfCat: showdown.beatTime(6),
  kiss: showdown.beatTime(7),
  settle: showdown.beatTime(8),
};
const anticipatorySquish = lp.createForce().after(showdownSetup).until(showdownSetup._start + showdownTimeFrames.squish).do(
  () => {
    const t = showdownSetup.getTimeFromStart();
    const s = getValueFromKeyFrames(t, "squish", showdownKeyframes);
    blobDog.setSquish(s);
    //the y value also updates to account for standing, but it is already updating on it's own
  }
);
const squishOnCrouch = lp.createForce().at(showdownSetup._start + showdownTimeFrames.squish).until(showdownSetup._start + showdownTimeFrames.wallSquish).do(
  () => {
    //at the start we use the squish to jump
    const isCrouching = blobDog.pos.y > showdown.catY;
    if (isCrouching) {
      const s = 1 - (blobDog.pos.y - showdown.catY) / showdown.blobR;
      blobDog.setSquish(s);
    }

    //actually I noticed a bug, on the last frame of crouching some squish is applied, but on the next frame it isn't updated to be 1. So blobDog flies off in a squished state.
    //to combat this, we will remember to set squish when isCrouching is no longer true.
    if (isCrouching && !this.rememberBlobDogWasCrouching) {
      this.rememberBlobDogWasCrouching = true;
    };
    if (this.rememberBlobDogWasCrouching && !isCrouching) {
      blobDog.setSquish(1);
      this.rememberBlobDogWasCrouching = false; //we do this once
    }
  }
);

const squishOnTouch = lp.createForce().after(anticipatorySquish).until(showdownSetup._start + showdownTimeFrames.landInFrontOfCat).do(
  () => {
    const pos = blobDog.pos;
    const r = blobDog.body.d / 2;
    const distanceFromBlobDogCenterToWallOrFloor = min(showdown.wallX - pos.x, showdown.floorY - pos.y);
    const isTouchingSomething = distanceFromBlobDogCenterToWallOrFloor < r;
    if (isTouchingSomething) {
      const squish = distanceFromBlobDogCenterToWallOrFloor / r;
      blobDog.setSquish(squish);
    }
    const isTouchingWall = pos.x + r > showdown.wallX;
    if (isTouchingWall) {
      blobDog.squeezeRot = 0;
    }
    const isTouchingFloor = pos.y + r > showdown.floorY;
    if (isTouchingFloor) {
      blobDog.squeezeRot = PI / 2;
    }

    //after touching something, we need to set squish to 1
    if (this.wasTouchingSomethingLastFrame && !isTouchingSomething) {
      blobDog.setSquish(1);
    }
    this.wasTouchingSomethingLastFrame = isTouchingSomething;
  }
);
const showdownPositionUpdate = lp.createForce().after(showdownSetup).for(showdown.fullSceneDuration()).do(
  () => {
    const t = showdownSetup.getTimeFromStart();
    blobDog.pos.x = getValueFromKeyFrames(t, "x", showdownKeyframes);
    blobDog.pos.y = getValueFromKeyFrames(t, "y", showdownKeyframes);
  }
);

const showdownExpressions = lp.createForce().after(showdownSetup).for(showdown.fullSceneDuration()).do(
  () => {
    const t = showdownSetup.getTimeFromStart();
    const maxFacing = 0.25;
    blobDog.pose.heading.horizontal = maxFacing * getValueFromKeyFrames(t, "faceLeft", showdownKeyframes);
    const upPeckMotion = getValueFromKeyFrames(t, "faceUp", showdownKeyframes);
    const bodyRotMax = -Math.PI / 10; //magic numbers
    const skewMax = -Math.PI / 12; //found by trial and error
    blobDog.rot = bodyRotMax * upPeckMotion;
    blobDog.skew = skewMax * upPeckMotion;
    blobDog.ears.angle = getValueFromKeyFrames(t, "blobDogEarAngle", showdownKeyframes);
    //cat
    blobCat.ears.l.lift = getValueFromKeyFrames(t, "leftEarLift", showdownKeyframes);
    blobCat.ears.l.cover = getValueFromKeyFrames(t, "leftEarCover", showdownKeyframes);
    blobCat.ears.r.lift = getValueFromKeyFrames(t, "rightEarLift", showdownKeyframes);
    blobCat.ears.r.cover = getValueFromKeyFrames(t, "rightEarCover", showdownKeyframes);
    //print(getValueFromKeyFrames(t, "leftEarLift", showdownKeyframes));
  }
)
const showdownKeyframes = [
  {
    name: "start",
    at: showdownTimeFrames.start,
    squish: 1,
    y: showdown.catY,
    faceLeft: 0,
    blobDogEarAngle: 0,
    //cat
    leftEarLift: blobCat.earExpressionPresets.down.lift,
    leftEarCover: blobCat.earExpressionPresets.down.cover,
    rightEarLift: blobCat.earExpressionPresets.down.lift,
    rightEarCover: blobCat.earExpressionPresets.down.cover,
  },
  {
    name:"reactionStart",
    at: showdownTimeFrames.start + 0.2,
    //cat
    leftEarLift: blobCat.earExpressionPresets.attention.lift,
    leftEarCover: blobCat.earExpressionPresets.attention.cover,
    rightEarLift: blobCat.earExpressionPresets.down.lift,
    rightEarCover: blobCat.earExpressionPresets.down.cover,
  },
  {
    name: "anticipatory squish",
    at: showdownTimeFrames.squish,
    squish: showdown.squishCoefficient,
    y: showdown.catY + showdown.blobR * (1 - showdown.squishCoefficient),
    x: showdown.startX,
    faceLeft: 1,
    blobDogEarAngle: Math.PI / 4,
    //cat
    leftEarLift: blobCat.earExpressionPresets.neutral.lift,
    leftEarCover: blobCat.earExpressionPresets.neutral.cover,
    rightEarLift: blobCat.earExpressionPresets.neutral.lift,
    rightEarCover: blobCat.earExpressionPresets.neutral.cover,
  },
  {
    name: "jump started",
    after: 0.2,
    //todo: check why the lack of time in this keyframe was not reported!
    //cat
    leftEarLift: blobCat.earExpressionPresets.attention.lift,
    leftEarCover: blobCat.earExpressionPresets.attention.cover,
    rightEarLift: blobCat.earExpressionPresets.attention.lift,
    rightEarCover: blobCat.earExpressionPresets.attention.cover,
  },
  {
    name: "high in the sky",
    at: showdownTimeFrames.jumpTop,
    y: showdown.jumpHight,
    faceLeft: 1,
    curve(prev, curr, amt) {
      //this should be a cubic, but I want to try a double lerp
      const temp = lerp(prev, curr, amt);
      return lerp(temp, curr, amt);
    },
    blobDogEarAngle: 0,
  },
  {
    name: "wall jump Y",
    at: showdownTimeFrames.wallSquish,
    y: (showdown.catY + showdown.jumpHight) / 2,
    curve(prev, curr, amt) {
      const temp = lerp(prev, curr, amt);
      return lerp(prev, temp, amt);
    }
  },
  {
    name: "wall jump linear",
    at: showdownTimeFrames.wallSquish,
    x: showdown.wallX - showdown.blobR * showdown.squishCoefficient,
    faceLeft: -1,
    faceUp: 0,
    faceLeft: 0,
    //cat
    leftEarLift: blobCat.earExpressionPresets.neutral.lift,
    leftEarCover: blobCat.earExpressionPresets.neutral.cover,
    rightEarLift: blobCat.earExpressionPresets.neutral.lift,
    rightEarCover: blobCat.earExpressionPresets.neutral.cover,
  },
  {
    name: "bounce anticipation",
    //x and y are the same as in the previous keyframes
    x: showdown.wallX - showdown.blobR * showdown.squishCoefficient,
    y: (showdown.catY + showdown.jumpHight) / 2,
    //what is important is when it happens.
    at: showdownTimeFrames.floorSquish - 0.2,
    faceUp: 1,
    faceLeft: -1,
    blobDogEarAngle: 0,
  },
  {
    name: "floor Jump",
    at: showdownTimeFrames.floorSquish,
    x: showdown.catX,
    y: showdown.floorY - showdown.blobR * showdown.squishCoefficient,
    blobDogEarAngle: Math.PI / 4,
    //cat
    leftEarLift: blobCat.earExpressionPresets.neutral.lift,
    leftEarCover: blobCat.earExpressionPresets.neutral.cover,
    rightEarLift: blobCat.earExpressionPresets.neutral.lift,
    rightEarCover: blobCat.earExpressionPresets.neutral.cover,
  },
  {
    name: "I am here kitty-cat",
    at: showdownTimeFrames.floorSquish + 0.2,
    x: showdown.landX,
    y: showdown.catY,
    faceLeft: 0,
    blobDogEarAngle: 0,
    faceUp: 0,
    curve(prev, curr, amt) {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      const cubicBezierOutInAmt = 1 + c3 * Math.pow(amt - 1, 3) + c1 * Math.pow(amt - 1, 2);
      return lerp(prev, curr, cubicBezierOutInAmt);
    },
    //cat
    leftEarLift: blobCat.earExpressionPresets.attention.lift,
    leftEarCover: blobCat.earExpressionPresets.attention.cover,
    rightEarLift: blobCat.earExpressionPresets.attention.lift,
    rightEarCover: blobCat.earExpressionPresets.attention.cover,
  },
  {
    name: "anticipation before the hit",
    at: showdownTimeFrames.landInFrontOfCat,
    x: showdown.landX,
    y: showdown.catY,
    blobDogEarAngle: 0,
    //cat
    leftEarLift: blobCat.earExpressionPresets.neutral.lift,
    leftEarCover: blobCat.earExpressionPresets.neutral.cover,
    rightEarLift: blobCat.earExpressionPresets.neutral.lift,
    rightEarCover: blobCat.earExpressionPresets.neutral.cover,
  },
  {
    name: "start hit",
    at: showdownTimeFrames.kiss - 0.1,
    x: showdown.landX,
    //cat
    leftEarLift: blobCat.earExpressionPresets.neutral.lift,
    leftEarCover: blobCat.earExpressionPresets.neutral.cover,
    rightEarLift: blobCat.earExpressionPresets.neutral.lift,
    rightEarCover: blobCat.earExpressionPresets.neutral.cover,
  },
  {
    name: "deliver the hit",
    at: showdownTimeFrames.kiss,
    x: showdown.catX - showdown.blobR,
    faceUp: 0,
    faceLeft: 1,
    blobDogEarAngle: Math.PI / 3,    
    //cat
    leftEarLift: blobCat.earExpressionPresets.attention.lift,
    leftEarCover: blobCat.earExpressionPresets.attention.cover,
    rightEarLift: blobCat.earExpressionPresets.attention.lift,
    rightEarCover: blobCat.earExpressionPresets.attention.cover,
  },
  {
    name: "smug enjoyment",
    at: showdownTimeFrames.settle,
    faceUp: 1,//meaning nuzzle a bit
    blobDogEarAngle: Math.PI / 6,
    //cat
    leftEarLift: blobCat.earExpressionPresets.down.lift,
    leftEarCover: blobCat.earExpressionPresets.down.cover,
    rightEarLift: blobCat.earExpressionPresets.down.lift,
    rightEarCover: blobCat.earExpressionPresets.down.cover,
  }
]

