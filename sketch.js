let capturingOn = false;
const FPS = 30;
if (capturingOn) {
  var capturer = new CCapture({
    framerate: FPS,
    timeLimit: 60,
    format: "gif",//you have to define the gif worker
    verbose: true,
    workersPath: "./libraries/"
  });
}

const canvasSize = { width: 480, height: 480 };

const song = {
  name: 'harder better faster stronger',
  group: "Daft punk",
  remixBy: "mr. Pandemy",
  bpm: 144,
  get bps() { return this.bpm / 60; },
  length: 57 //I want to use only the first 57 seconds
}

const lp = loopFrameWork;

function setup() {
  const cs = canvasSize;
  createCanvas(cs.width, cs.height);
  if (!capturingOn) frameRate(FPS);//breaks capturing, so if capturing, don't set framerate
  textSize(height / 12);
  loadAssets();
}
let animationStartInMillis;

let backgroundColor = 0;
function draw() {
  const firstFrame = frameCount == 1;
  if (firstFrame) {
    if (capturingOn) initiateCapturer();
    animationStartInMillis = millis();
  }

  loopFrameWork.update();

  drawStage();

  if (capturingOn && checkIfAnimationHadCompleted()) endCapture();

  if (capturingOn) captureDrawnCanvas();

}

function drawStage() {
  //this function is modified by the forces
  console.error("didn't override drawStage");
}


function initiateCapturer() {
  capturer.start();
}

function captureDrawnCanvas() {
  capturer.capture(document.getElementById('defaultCanvas0'));
}

let theAnimationHasNeverCompleted = true;
function checkIfAnimationHadCompleted() {
  const firstFrame = frameCount == 1;
  if (firstFrame) return false;
  const theLoopJustRestarted = loopFrameWork.isStart;
  theAnimationHasNeverCompleted = theAnimationHasNeverCompleted && !theLoopJustRestarted;
  return !theAnimationHasNeverCompleted;
}

function endCapture() {
  capturingOn = false;
  capturer.stop();
  capturer.save();
  console.log("finished capturing, animation should continue normally");
}


let dummyImage;
let consoleCodeVideo;
function loadAssets() {
  dummyImage = loadImage("assets/dummy.jpg");
  loadDotBatImages();
}