const barbell = {
    centerX:250,
    endsY: 100,
    holdsY:100,
    length : 400,
    holdSpacing: 160,
    setSize(l){
      this.holdSpacing = l*this.holdSpacing/this.length;
      this.length = l;
    },
    draw(){
      const leftEndX = this.centerX-this.length/2;
      const rightEndX = this.centerX + this.length/2;
      const leftHoldX = this.getLeftHoldX();
      const rightHoldX = this.getRightHoldX();
      push();
      //leftWeight
      translate(leftEndX, this.endsY);
      const yStep = this.endsY-this.holdsY;
      const xStep = (this.length-this.holdSpacing)/2;
      const weightsAngle = atan(yStep/xStep);
      rotate(-weightsAngle);
      ellipse(0,0,this.holdSpacing/5,this.holdSpacing/2);

      pop();
      push();
      strokeWeight(width/250);
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
      ellipse(0,0,this.holdSpacing/5,this.holdSpacing/2);
      pop();
    },
    getRightHoldX(){
      return this.centerX + this.holdSpacing/2;
    },
    getLeftHoldX(){
      return  this.centerX - this.holdSpacing/2;
    }
  }