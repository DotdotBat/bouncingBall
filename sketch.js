const canvasSize = { width: 500, height: 500 };

const blobDog = {
  pose: {
    heading: {
      horizontal: -0.25, //1 is right and -1 is left
      vertical: -0.1//1 is up, and -1 is down
    },
    looking:{
      horizontal: -0.25, //1 is right and -1 is left
      vertical: 0.1//1 is up, and -1 is down
    }
  },
  pos: { x: 250, y: 250 },
  rot: 0,
  squeeze: 1,
  squeezeRot: 0,
  body: {
    d: 200,
    mainClr: 'beige',
    patternClr: 'lightSalmon'
  },
  defaultDiameter: 100,
  bodyDraw() {
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
  drawFace() {
    const d = this.defaultDiameter;
    //eyes
    const eyeLevel = d / 12;
    const eyeDistance = d / 5;
    fill(255);
    strokeWeight(d / 50);
    ellipse(eyeDistance, -eyeLevel, d / 9, d / 6);
    ellipse(-eyeDistance, -eyeLevel, d / 9, d / 6);
    //mouth
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
    angle: -3.14 / 6,
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
    shearY(this.ears.angle);
    triangle(
      -d / 25, -d * this.ears.baseWidth / 2,
      -d / 25, +d * this.ears.baseWidth / 2,
      d * this.ears.length * cos(this.ears.angle), 0
    );
    //can't I just flip the world around and arrive at the second ear?
    pop();
    //left ear
    stroke(this.body.patternClr);
    rotate(PI + this.ears.basePosAngle);
    translate(d / 2, 0);
    shearY(-this.ears.angle);
    triangle(
      -d / 25, -d * this.ears.baseWidth / 2,
      -d / 25, +d * this.ears.baseWidth / 2,
      d * this.ears.length * cos(-this.ears.angle), 0
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
    const h = d* this.pose.heading.horizontal;
    ellipse(0, 0, d, v);
    ellipse(0, 0, h, d);
    //eye
    translate(h/2,-v/2)
    const eyeR = d/6;
    fill(255);
    circle(0, 0, eyeR);
    const lh = eyeR * this.pose.looking.horizontal;
    const lv = eyeR * this.pose.looking.vertical;
    fill(0);
    const pupilR = eyeR/2;
    stroke('aqua');strokeWeight(pupilR/3);
    circle(lh/2, -lv/2, pupilR);
    pop();
  },
  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    const scaleFactor = this.body.d/100;
    scale(scaleFactor);
    rotate(this.squeezeRot);
    scale(1 / this.squeeze, this.squeeze * this.squeeze);
    rotate(-this.squeezeRot);
    rotate(this.rot);

    this.drawEars();
    this.bodyDraw();
    //this.drawFace();//currently stares into the my soul
    this.drawDirectionalMock();
    pop();
  }
};
const dumbbell = {
  x:canvasSize.width/2,
  y:canvasSize.height/3,
  length : canvasSize.width/2,
  draw(){
    const x = this.x;
    const y = this.y;
    const half = this.length/2;

    line(x-half,y,x+half,y);
  }
}

const anchorPoint = {
  x: canvasSize.width/2,
  y: canvasSize.height * 2/3,
}

const blobBin = {
  scaleFactor: 1,
  thickness: 30,
  pos: { x: canvasSize.width *0.8, y: canvasSize.height / 5 },
  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    scale(this.scaleFactor);
    circle(0, 0, this.thickness);
    pop();
  }
};

const lp = loopFrameWork;
lp.forces = [
  {
    name: 'the thickening',
    start: 2,
    end: 4,
    effect: () => {
      blobBin.thickness++;
    }
  },
  {
    name: 'eye follow',
    start: 0,
    end: 10,
    effect(){
      blobDog.pose.looking.horizontal = 2*mouseX/width -1;
      blobDog.pose.looking.vertical = -(2*mouseY/height -1);
    }
  },
  {
    name:'head follow',
    start:0,
    end:10,
    estimatedDelay: 5,
    effect(){
      const pre = blobDog.pose.heading;
      const x = 2*mouseX/width -1;
      const y = -(2*mouseY/height -1);
      const jump = 0.5*(lp.step / this.estimatedDelay);
      pre.horizontal = lerp(pre.horizontal, x, jump);
      pre.vertical = lerp(pre.vertical, y, jump);
    }
  },
  {
    name:'dumbbellHolder',
    start:0,
    end:Infinity,
    effect(){
      const topOfDogHead = blobDog.pos.y - (blobDog.body.d/2) * blobDog.squeeze;
      dumbbell.y = topOfDogHead;
    }
  }
];

function setup() {
  const cs = canvasSize;
  createCanvas(cs.width, cs.height);
  frameRate(12);
  lp.setDuration(5);
  frameworksRegistrationAfterSetup();
  backgroundColor = color("midnightBlue")
}
let backgroundColor;
lp.repeatSetup = function () {
  blobBin.thickness = 50;
}

function draw() {
  background(backgroundColor);
  blobBin.draw();
  blobDog.draw();
  dumbbell.draw();
}