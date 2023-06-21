lp.forces = [
  {
    name: "restart",
    start: 0,
    end: -Infinity,
    effect() {
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
    effect() {
      blobDog.pose.looking.horizontal = 2 * mouseX / width - 1;
      blobDog.pose.looking.vertical = -(2 * mouseY / height - 1);
    }
  },
  {
    name: 'head follow',
    start: 0,
    end: 10,
    estimatedDelay: 5,
    effect() {
      const pre = blobDog.pose.heading;
      const x = 2 * mouseX / width - 1;
      const y = -(2 * mouseY / height - 1);
      const jump = 0.5 * (lp.step / this.estimatedDelay);
      pre.horizontal = lerp(pre.horizontal, x, jump);
      pre.vertical = lerp(pre.vertical, y, jump);
    }
  },
  {
    name: 'weightlifting loop',
    start: 0,
    end: 0,
    peak: 1,
    low: 0.8,
    period: 5/3,
    startOffset: Math.PI,//at the start of the loop, what value
    effect() {
      const angle = this.startOffset + (2*Math.PI * lp.seconds / this.period);
      const progress = (1 - cos(angle)) / 2;
      const weightlifting = this.low + (this.peak-this.low) * progress;
      //squeeze the dog according to weightlifting
      blobDog.squeeze = weightlifting;
      //and keep the dog on the ground
      blobDog.pos.y = 2*canvasSize.height/3 - (blobDog.body.d/2) * weightlifting *weightlifting;
      //dumbbell should be on the top of the head
      const topOfDogHead = blobDog.pos.y - (blobDog.body.d / 2) * blobDog.squeeze*blobDog.squeeze;//because of how the squeeze is applied now
      dumbbell.y = topOfDogHead;
    }
  },
  
];

let weightlifting = 0.99;