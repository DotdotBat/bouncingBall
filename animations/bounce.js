const bounce = {
    duration: 3*1/song.bps,
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
      dotBat.reset();
      dotBat.wingsAreSpread = false;
      dotBat.rotation = PI/12;
      textAlign(CENTER, CENTER);
    },
    draw() {
      background(backgroundColor);
      text("FASTER", width / 2, height / 4);
      dotBat.draw();
      blobDog.draw();
    },
    moveDog() {
      blobDog.pos.x = blobDog.pos.x + blobDog.speed.x * lp.step;
      blobDog.pos.y = blobDog.pos.y + blobDog.speed.y * lp.step;

      //and dotBat is just sitting on the head
      dotBat.x = blobDog.pos.x; dotBat.y = blobDog.pos.y;
      const d = blobDog.body.d;
      dotBat.x += d*0.2;
      let jolt = blobDog._squeeze;
      if(isNaN(blobDog._squeeze))jolt = 1;
      const blobDogIsSqueezingAgainstWall = blobDog.squeezeRot > PI-0.1;
      if(blobDogIsSqueezingAgainstWall)jolt= 1/jolt;
      dotBat.y -= d*0.4*jolt*jolt;
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
  
  const bounceSetup = lp.createForce().afterLast().do(() => { bounce.setup(); });
  
  const bounceLoop = lp.createForce().after(bounceSetup).for(bounce.duration).do(() => { bounce.update(); });
  