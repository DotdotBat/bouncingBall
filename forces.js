lp.forces = [
  {
    name:"restart",
    start: 0,
    end: -Infinity,
    effect(){
      blobBin.thickness = 50;
    }
  },
  {
    name: 'the thickening',
    start: 2,
    end: 4,
    effect: () => {
      blobBin.thickness++;
    }
  },
  {
    name: 'eye follow',
    start: 0,
    end: 10,
    effect(){
      blobDog.pose.looking.horizontal = 2*mouseX/width -1;
      blobDog.pose.looking.vertical = -(2*mouseY/height -1);
    }
  },
  {
    name:'head follow',
    start:0,
    end:10,
    estimatedDelay: 5,
    effect(){
      const pre = blobDog.pose.heading;
      const x = 2*mouseX/width -1;
      const y = -(2*mouseY/height -1);
      const jump = 0.5*(lp.step / this.estimatedDelay);
      pre.horizontal = lerp(pre.horizontal, x, jump);
      pre.vertical = lerp(pre.vertical, y, jump);
    }
  },
  {
    name:'dumbbellHolder',
    start:0,
    end:Infinity,
    effect(){
      const topOfDogHead = blobDog.pos.y - (blobDog.body.d/2) * blobDog.squeeze;
      dumbbell.y = topOfDogHead;
    }
  }
];