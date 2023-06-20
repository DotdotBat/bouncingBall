const dumbbell = {
    x:250,
    y:100,
    length : 250,
    draw(){
      const x = this.x;
      const y = this.y;
      const half = this.length/2;
  
      line(x-half,y,x+half,y);
    }
  }