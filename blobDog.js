const blobDog = {
  reset() {
    this._squeeze = 1;
    this.squeezeRot = Math.PI / 2;
    this.pos = createVector(width / 2, height / 2);
    this.speed = createVector(0, 0);
    this.rot = 0;
    this.ears.angle = 0;
    this.skew = 0;
    this.pose.heading.horizontal = 0;
    this.body.d = height / 3;
    this.visibleEffort = false;
  },
  pose: {
    heading: {
      horizontal: -0.25, //1 is right and -1 is left
      vertical: -0.1//1 is up, and -1 is down
    },
    looking: {
      horizontal: -0.25, //1 is right and -1 is left
      vertical: 0.1//1 is up, and -1 is down
    }
  },
  pos: { x: 250, y: 250 },
  prePos: { x: NaN, y: NaN },
  savePrePos() {
    this.prePos.x = this.pos.x;
    this.prePos.y = this.pos.y;
  },
  ///call only if saved the previous frame position in prePos (before changing the position)
  calculateSpeed() {
    const elapsedSeconds = lp.step;
    const dx = this.pos.x - this.prePos.x;
    const dy = this.pos.y - this.prePos.y;
    this.speed.x = dx / elapsedSeconds;
    this.speed.y = dy / elapsedSeconds;
  },
  speed: { x: 0, y: 0 },
  rot: 0,
  _squeeze: 1,
  setSquish(heightMultiplier) {
    this._squeeze = sqrt(heightMultiplier);
  },
  squeezeRot: 0,
  setSize(diameter) {
    this.body.d = diameter;
  },
  body: {
    d: 200,
    mainClr: 'beige',
    patternClr: 'lightSalmon'
  },
  defaultDiameter: 100,
  drawBody() {
    push();
    noStroke();
    const d = this.defaultDiameter;
    fill(this.body.mainClr);
    drawingContext.save();
    circle(0, 0, d);
    drawingContext.clip();
    fill(this.body.patternClr);
    const patternShift = this.pose.heading.horizontal / 2;
    circle(patternShift * d - d / 2, -d / 2, 3 * d / 4);
    drawingContext.restore();
    pop();
  },
  visibleEffort:true,
  drawFace() {
    const d = this.defaultDiameter;
    //eyes
    const eyeLevel = d / 12;
    let eyeDistance = d / 5;
    if(this.visibleEffort){
      strokeWeight(d/30);
      const l = d/20;//stroke length
      line(eyeDistance-l, -eyeLevel, eyeDistance+l, -eyeLevel-l);
      line(eyeDistance-l, -eyeLevel, eyeDistance+l, -eyeLevel+l);
      line(l-eyeDistance, -eyeLevel, -eyeDistance-l, -eyeLevel-l);
      line(l-eyeDistance, -eyeLevel, -eyeDistance-l, -eyeLevel+l);
    }else{
      fill(255);
      strokeWeight(d / 50);
      ellipse(eyeDistance, -eyeLevel, d / 9, d / 6);
      ellipse(-eyeDistance, -eyeLevel, d / 9, d / 6);
    }
    //mouth
    strokeWeight(d / 50);
    const w = d / 3;
    const mouthLevel = d / 8;
    fill('pink');
    strokeCap(SQUARE);
    arc(0, 1.2 * mouthLevel, w / 2, w / 2, 0, PI);
    fill(this.body.mainClr);
    arc(w / 4, mouthLevel, w / 2, w / 2, 0, PI);
    arc(-w / 4, mouthLevel, w / 2, w / 2, 0, PI);
    fill(0);
    ellipse(0, mouthLevel / 2, d / 8, d / 9);
  },
  ears: {
    innerClr: 'pink',
    length: 0.2,
    angle: 0,
    baseWidth: 0.3,
    basePosAngle: 3.14 / 4,
    rim: 0.05
  },
  drawEars() {
    const d = this.defaultDiameter;
    push();
    fill(this.ears.innerClr);
    strokeWeight(d * this.ears.rim);
    //right ear
    push();
    stroke(this.body.mainClr);
    rotate(-this.ears.basePosAngle);
    translate(d / 2, 0);
    shearY(this.ears.angle - 3.14 / 6);
    triangle(
      -d / 25, -d * this.ears.baseWidth / 2,
      -d / 25, +d * this.ears.baseWidth / 2,
      d * this.ears.length * cos(this.ears.angle - 3.14 / 6), 0
    );
    //can't I just flip the world around and arrive at the second ear?
    pop();
    //left ear
    stroke(this.body.patternClr);
    rotate(PI + this.ears.basePosAngle);
    translate(d / 2, 0);
    shearY(-this.ears.angle + 3.14 / 6);
    triangle(
      -d / 25, -d * this.ears.baseWidth / 2,
      -d / 25, +d * this.ears.baseWidth / 2,
      d * this.ears.length * cos(-this.ears.angle + 3.14 / 6), 0
    );
    pop();
  },
  drawDirectionalMock() {
    push();
    strokeWeight(1);
    stroke(100, 100);
    noFill();
    const d = this.defaultDiameter;
    const v = d * this.pose.heading.vertical;
    const h = d * this.pose.heading.horizontal;
    ellipse(0, 0, d, v);
    ellipse(0, 0, h, d);
    //eye
    translate(h / 2, -v / 2)
    const eyeR = d / 6;
    fill(255);
    circle(0, 0, eyeR);
    const lh = eyeR * this.pose.looking.horizontal;
    const lv = eyeR * this.pose.looking.vertical;
    fill(0);
    const pupilR = eyeR / 2;
    stroke('aqua'); strokeWeight(pupilR / 3);
    circle(lh / 2, -lv / 2, pupilR);
    pop();
  },
  skew: 0,
  getYofHeadTop() {
    //considers the squeeze but not the scale.
    const center = blobDog.pos.y;
    const dogR = (blobDog.body.d / 2);
    //with squeeze applied
    const squeezedR = dogR * blobDog._squeeze * blobDog._squeeze;
    return this.pos.y - squeezedR;
  },
  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    const scaleFactor = this.body.d / 100;
    scale(scaleFactor);
    rotate(this.squeezeRot);
    scale(this._squeeze * this._squeeze, 1 / this._squeeze);
    rotate(-this.squeezeRot);
    rotate(this.rot);
    translate(0, this.body.d / 3);
    shearX(this.skew);
    translate(0, -this.body.d / 3);
    this.drawEars();
    this.drawBody();
    translate(this.pose.heading.horizontal * this.body.d / 2, 0);
    this.drawFace();
    //this.drawDirectionalMock();
    pop();
  },
  takeHoldRight(x, y) {
    this.paws.right.x = x;
    this.paws.right.y = y;
  },
  takeHoldLeft(x, y) {
    this.paws.left.x = x;
    this.paws.left.y = y;
  },
  paws: {
    visible: true,
    thickness: 30,
    right: { x: 0, y: 0 },
    left: { x: 0, y: 0 }
  },
  drawPaws() {
    push();
    strokeCap(ROUND);
    fill(this.body.mainClr);
    circle(this.paws.left.x, this.paws.left.y, this.paws.thickness);
    fill(this.body.patternClr);
    circle(this.paws.right.x, this.paws.right.y, this.paws.thickness);
    //toes separation
    strokeWeight(1);
    line(this.paws.left.x - this.paws.thickness / 6, this.paws.left.y,
      this.paws.left.x - this.paws.thickness / 6, this.paws.left.y + 0.4 * this.paws.thickness);
    line(this.paws.left.x + this.paws.thickness / 6, this.paws.left.y,
      this.paws.left.x + this.paws.thickness / 6, this.paws.left.y + 0.4 * this.paws.thickness);
    line(this.paws.right.x - this.paws.thickness / 6, this.paws.right.y,
      this.paws.right.x - this.paws.thickness / 6, this.paws.right.y + 0.4 * this.paws.thickness);
    line(this.paws.right.x + this.paws.thickness / 6, this.paws.right.y,
      this.paws.right.x + this.paws.thickness / 6, this.paws.right.y + 0.4 * this.paws.thickness);
    pop();
  }
};