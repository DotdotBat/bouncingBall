const blobBin = {
    scaleFactor: 1,
    thickness: 30,
    pos: { x: 100, y: 100 },
    draw() {
      push();
      translate(this.pos.x, this.pos.y);
      scale(this.scaleFactor);
      circle(0, 0, this.thickness);
      pop();
    }
  };