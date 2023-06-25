const barbell = {
    centerX:250,
    endsY: 100,
    holdsY:100,
    length : 450,
    holdSpacing: 150,
    draw(){
      const leftEndX = this.centerX-this.length/2;
      const rightEndX = this.centerX + this.length/2;
      const leftHoldX = this.centerX - this.holdSpacing/2;
      const rightHoldX = this.centerX + this.holdSpacing/2;
      push();
      //leftWeight
      translate(leftEndX, this.endsY);
      const yStep = this.endsY-this.holdsY;
      const xStep = (this.length-this.holdSpacing)/2;
      const weightsAngle = atan(yStep/xStep);
      rotate(-weightsAngle);
      ellipse(0,0,20,80);

      pop();
      push();
      noFill();
      beginShape();
      curveVertex(leftEndX, this.endsY);//the ends are repeated
      curveVertex(leftEndX, this.endsY);//for control points
      curveVertex(leftHoldX, this.holdsY);
      curveVertex(rightHoldX, this.holdsY);
      curveVertex(rightEndX, this.endsY);
      curveVertex(rightEndX, this.endsY);
      endShape();
      pop();

      //rightWeight
      push();
      translate(rightEndX, this.endsY);
      rotate(weightsAngle);
      ellipse(0,0,20,80);
      pop();
    },
  }