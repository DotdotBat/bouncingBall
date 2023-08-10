const canvasSize = { width: 480, height: 480 };

const song = {
  name: 'harder better faster stronger',
  bpm: 71,
  length: 57
}

const lp = loopFrameWork;

function setup() {
  const cs = canvasSize;
  createCanvas(cs.width, cs.height);
  //frameRate(30);
  pixelDensity();
  textSize(height/12);
}

let backgroundColor;

function draw() {
  loopFrameWork.update();
  drawStage();
}

function drawStage(){
  //this function is modified by the forces
  console.error("didn't override drawStage");
}