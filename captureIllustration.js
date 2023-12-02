//Yea, I forgot that the "save()" method exists. Sue me. 

function captureIllustration(drawIllustrationCallback) {
  drawIllustrationCallback();
  const illustrationCapturer = new CCapture({
    format: "png",
    verbose: true,
  });
  illustrationCapturer.start();
  illustrationCapturer.capture();
  illustrationCapturer.save();
  illustrationCapturer.stop();
}

