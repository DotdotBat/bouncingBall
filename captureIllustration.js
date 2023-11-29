//to think that I have actually forgotten about the "save()" function
//well, I will just leave it here. 

function captureIllustration(drawIllustrationCallback){
    drawIllustrationCallback();
    const illustrationCapturer = new CCapture({
        timeLimit: 60,
        format: "png",//you have to define the gif worker
        verbose: true,
      });
    illustrationCapturer.start();
    illustrationCapturer.capture();
    illustrationCapturer.save();
    illustrationCapturer.stop();;

}

