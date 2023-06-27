const canvasSize = { width: 720, height: 720 };

const anchorPoint = {
  x: canvasSize.width/2,
  y: canvasSize.height * 2/3,
}

const lp = loopFrameWork;

function setup() {
  const cs = canvasSize;
  createCanvas(cs.width, cs.height);
  frameRate(12);
  lp.setDuration(60);
  pixelDensity();
}
let backgroundColor;

function draw() {
  loopFrameWork.update();
  drawStage();
}

function drawStage(){
  //console.error("didn't override drawStage");
}