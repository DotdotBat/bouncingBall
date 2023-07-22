//time for the final animation
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
const showdownCollisions = lp.createForce().at(showdownTimeFrames.squish).until(showdownTimeFrames.wallSquish).do(
  ()=>{
    //at the start we use the squish to jump
    const isCrouching = blobDog.pos.y > showdown.catY;
    if(isCrouching){
      const s = 1 - (blobDog.pos.y - showdown.catY)/showdown.bdR;
      blobDog.setSquish(s);
    }
  }
);

const squishOnTouch = lp.createForce().after(anticipatorySquish).until(showdownTimeFrames.landInFrontOfCat).do(
  ()=>{
    const pos = blobDog.pos;
    const r = blobDog.body.d/2;
    const distanceFromBlobDogCenterToWallOrFloor = min(showdown.wallX-pos.x, showdown.floorY - pos.y);
    if(distanceFromBlobDogCenterToWallOrFloor < r){
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




const bounce = {
  duration: 1,
  slowdownOnContact: 1,// > 1
  restDuration: 0,
  startPoint: { x: 2 * canvasSize.width / 3, y: canvasSize.height / 3 },
  endPoint: { x: canvasSize.width / 3, y: 2 * canvasSize.height / 3 },
  wallX: canvasSize.width,
  floorY: canvasSize.height,
  RBlobDog: canvasSize.height / 8,
  blobDogSquishedRCoefficient: 0.7,
  blobDogFullySquishedR: undefined,
  startSpeed: { x: 1, y: 1 },//will be calculated at setup
  isAirborne: true,
  setup() {
    backgroundColor = 'green';
    blobDog.reset();
    blobDog.body.d = 2 * this.RBlobDog;
    blobDog.pos.x = this.startPoint.x;
    blobDog.pos.y = this.startPoint.y;
    this.startSpeed = precalculateAirborneSpeedForBounce();
    blobDog.speed.x = this.startSpeed.x;
    blobDog.speed.y = this.startSpeed.y;
    drawStage = bounce.draw;
    this.blobDogFullySquishedR = this.RBlobDog * this.blobDogSquishedRCoefficient;
  },
  draw() {
    background(backgroundColor);
    text("FASTER", width / 2, height / 4);
    blobDog.draw();
  },
  moveDog() {
    blobDog.pos.x = blobDog.pos.x + blobDog.speed.x * lp.step;
    blobDog.pos.y = blobDog.pos.y + blobDog.speed.y * lp.step;
  },
  restingUntil: null,
  update() {
    const isTouchingWall = blobDog.pos.x + this.RBlobDog > this.wallX;
    const isTouchingFloor = blobDog.pos.y + this.RBlobDog > this.floorY;

    if (this.isAirborne) {
      const startingBounce = isTouchingWall || isTouchingFloor
      if (startingBounce) {
        this.isAirborne = false;

        blobDog.speed.x = blobDog.speed.x / this.slowdownOnContact;
        blobDog.speed.y = blobDog.speed.y / this.slowdownOnContact;

        let contactAngle;
        if (isTouchingWall) contactAngle = 0;
        if (isTouchingFloor) contactAngle = -Math.PI / 2;
        const squishUpAngle = Math.PI + contactAngle;
        blobDog.squeezeRot = squishUpAngle;
      }
    }

    const isMidBounce = !this.isAirborne;
    if (isMidBounce) {
      const isResting = this.restingUntil !== null;
      const isFullySquishedToTheWall = blobDog.pos.x + this.blobDogFullySquishedR > this.wallX;
      const isFullySquishedToTheFloor = blobDog.pos.y + this.blobDogFullySquishedR > this.floorY;
      const shouldStartResting = !isResting && (isFullySquishedToTheWall || isFullySquishedToTheFloor);
      if (shouldStartResting) {
        this.restingUntil = lp.seconds + this.restDuration;
      }

      const shouldStopResting = isResting && (this.restingUntil < lp.seconds);
      if (shouldStopResting) {
        this.restingUntil = null;
        if (isFullySquishedToTheFloor) { blobDog.speed.y = - this.startSpeed.y / this.slowdownOnContact }
        if (isFullySquishedToTheWall) { blobDog.speed.x = - this.startSpeed.x / this.slowdownOnContact }
      }

      const shouldBecomeAirborne = !(isTouchingFloor || isTouchingWall);
      if (shouldBecomeAirborne) {
        this.isAirborne = true;
        blobDog.speed.x = blobDog.speed.x * this.slowdownOnContact;
        blobDog.speed.y = blobDog.speed.y * this.slowdownOnContact;

      }

      //update squish
      let distanceFromBlobDogCenterToWallOrFloor;
      if(isTouchingFloor){
        distanceFromBlobDogCenterToWallOrFloor = this.floorY - blobDog.pos.y;
      }
      if(isTouchingWall){
        distanceFromBlobDogCenterToWallOrFloor = this.wallX - blobDog.pos.x;
      }
      const heightMultiplier = distanceFromBlobDogCenterToWallOrFloor/this.RBlobDog;
      blobDog.setSquish(heightMultiplier);

    }

    const notResting = this.restingUntil === null;
    if (notResting) { this.moveDog(); };
  }
}


/** |     start  |the preview is broken. Better right-click the function and go to definition
 *  |         \  |the path of the bounces is depicted.
 *  |          \ |this is a primitive physics simulation.
 *  |           \|
 *  |    end    /|It returns an object with x and y values. Both are positive.
 *  |       \  / |
 *  |        \/  |
 */
function precalculateAirborneSpeedForBounce() {
  const time = bounce.duration;//the whole time getting from start to end will take
  const restTime = bounce.restDuration; //in the middle of the bounce
  const bounceNum = 2; //how many bounces happen
  const startX = bounce.startPoint.x;
  const startY = bounce.startPoint.y;
  const endX = bounce.endPoint.x;
  const endY = bounce.endPoint.y;
  const wallX = bounce.wallX;
  const floorY = bounce.floorY;
  const slowdown = bounce.slowdownOnContact; // > 1


  const movingTime = time - restTime * bounceNum;
  const blobDogSquishedR = bounce.RBlobDog * bounce.blobDogSquishedRCoefficient;
  const padding = blobDogSquishedR;
  const distanceX = (wallX - startX) - padding + (wallX - endX) - padding;
  const distanceY = (floorY - startY) - padding + (floorY - endY) - padding;
  //the number 2 is here because we account for touchdown as well as takeoff
  const slowDistance = bounceNum * (bounce.RBlobDog - blobDogSquishedR) * 2;
  //let's pretend that the whole distance will be crossed at the airborne speed,
  //but the time is unchanged, so the distance stretches.
  const normalizedDistance = {
    x: distanceX - slowDistance + slowDistance * slowdown,
    y: distanceY - slowDistance + slowDistance * slowdown
  }
  const airborneSpeed = {
    x: normalizedDistance.x / movingTime,
    y: normalizedDistance.y / movingTime
  }
  return airborneSpeed;
}

const bounceSetup = lp.createForce().afterPrevious().do(() => { bounce.setup(); });

const bounceLoop = lp.createForce().after(bounceSetup).for(bounce.duration).do(() => { bounce.update(); });



const kickSetup = lp.createForce().afterPrevious().do(() => {
  backgroundColor = color('maroon');
  blobDog.reset();
  textAlign(CENTER, CENTER);
  textSize(40);
  drawStage = function () {
    background(backgroundColor);
    text("STRONGER", width / 2, height / 4);
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
  }
);

//hop
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

//weightlifting
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