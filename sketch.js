const canvasSize = { width: 500, height: 500 };

const anchorPoint = {
  x: canvasSize.width/2,
  y: canvasSize.height * 2/3,
}



const lp = loopFrameWork;

function setup() {
  const cs = canvasSize;
  createCanvas(cs.width, cs.height);
  frameRate(12);
  lp.setDuration(5);
  addLoopUpdateToP5DrawFunction();
  backgroundColor = color("midnightBlue")
}
let backgroundColor;


function draw() {
  background(backgroundColor);
  blobBin.draw();
  blobDog.draw();
  dumbbell.draw();
}