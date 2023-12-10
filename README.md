# bouncingBall
This is a js practice project. 
I built around p5.js a framework that displayes the animations in a loop. 

Try comment and uncomment different files in the index file to turn on and off different animations. 

I coded this framework with the following concept in mind:
Any callback can be registered to be fired once or every frame during some period of time. 
I call them forces because at first I thought that I will register callbacks that will affect data objects(i.e move them around), and the objects' state will be displayed every frame. 

```
lp.createForce().afterLast().do(() => {  //register callback to be fired once after all previous callbacks are done
    blobDog.reset();
    blobDog.setSize(width/6);
    drawStage = () => {
        currentJumpX = getValueFromKeyFrames(lp.seconds, "X", jumpKeyframeIllustration.keyFrames);
        currentJumpY = getValueFromKeyFrames(lp.seconds, "Y", jumpKeyframeIllustration.keyFrames);
        drawPicJumpKeyframeIllustration(lp.seconds);
    }
});
```
`drawStage` is a holder of the current draw callback. 
This way, at the start of every scene I can ask it to draw only the objects present in the scene. 
And do some calculations that I know should be done every frame. 
Unlike this one:

```
const dotBatCopilot = lp.createForce().along(highHopLoop).do(
    ()=>{
      const t = highHopLoop.getCompleteness();
      const flightRadius = 1.4*blobDog.body.d/2;
      const angle = lerp(PI - PI/6, TAU+PI/6, t);
      const x = blobDog.pos.x + flightRadius*cos(angle);
      const y = blobDog.pos.y - flightRadius*sin(angle);
      dotBat.setPos(x, y);

      dotBat.rotation = lerp(0, PI, t);

      //spread wings only during the climb and fall, so in the middle there is free falling of sorts.
      dotBat.wingsAreSpread = 
        (t>0.1&&t<0.2) || (t>0.8);
    }
  )
```
Which will start and end along with another force. 
I did not intend this framework to be used by other people, but hopefully, it's logic is clear. 
Let me know if something in my code is convoluted, and I will rewrite it to be readable, or add a comment. 
