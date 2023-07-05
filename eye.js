  const eye = {
    radius : 200, 
    x:200,
    y: 200,
    pupilColor:0,
    irisColor: 100,//placeholder for the future
    whitesColor: 255,
    linesNumber:30,
    lineAngle: Math.PI/4,//should never be 0
    twist: Math.PI,
    pupilRadius: 50,
    lookAt: Math.PI*2,
    draw(){
      if(abs(this.lineAngle % Math.PI) < Math.PI/8){this.lineAngle=Math.PI/6}
      push();
      translate(this.x, this.y)
      stroke(255);
      fill(this.pupilColor);
      ellipse(0, 0, this.radius*2, this.radius*2);
      drawingContext.save();
      drawingContext.clip();
      const centerStartX = - this.pupilRadius;
      const lineEndOffset = this.radius * tan(this.lineAngle);
      
      for(let i = 1; i<(this.linesNumber/cos(this.lineAngle)); i++){
        const x0 = lerp(centerStartX, -this.radius,  ((i-1)/(this.linesNumber-1)));
        const x1 = x0 + lineEndOffset;
        line(x0, 0, x1, this.radius);
        line(x0, 0, x1, -this.radius);
        rotate(this.twist);
      }
      
      circle(0,0,10);//somehow with this circle that I have added for debug purposed, the eye is more recognizable, so I will leave it here.
      //In the future, it should follow the center of the pupil
      
      drawingContext.restore();
      pop();
    }
  }