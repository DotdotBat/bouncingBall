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
    end: Infinity,
    effect() {
      blobDog.pose.looking.horizontal = 2 * mouseX / width - 1;
      blobDog.pose.looking.vertical = -(2 * mouseY / height - 1);
    }
  },
  {
    name: 'head follow',
    start: 0,
    end: Infinity,
    estimatedDelay: 1,
    effect() {
      const pre = blobDog.pose.heading;
      const x = 2 * mouseX / width - 1;
      const y = -(2 * mouseY / height - 1);
      const jump =  (lp.step / this.estimatedDelay);
      pre.horizontal = lerp(pre.horizontal, x, jump);
      pre.vertical = lerp(pre.vertical, y, jump);
    }
  },
  {
    name: 'weightlifting loop',
    start: 0,
    end: Infinity,
    peak: 1,
    low: 0.8,
    period: 60/70,
    barbellAmplitude: 0.05,
    crouchingOffset: Math.PI,
    barbellSwingOffset: Math.PI/6,
    barbellEndsFollowupTime : 1,
    effect() {
      const angle = this.crouchingOffset + (2*Math.PI * lp.seconds / this.period);
      const progress = (1 - cos(angle)) / 2;
      const crouching = this.low + (this.peak-this.low) * progress;
      blobDog.squeeze = crouching;
      //keep the dog anchored
      blobDog.pos.y = 2*canvasSize.height/3 - (blobDog.body.d/2) * crouching *crouching;
      
      const barbellPath = cos(angle - Math.PI/6) * this.barbellAmplitude * width;

      //I chose the the top point to be the center of barbell's sinusoid
      const topOfDogHead = blobDog.pos.y - (blobDog.body.d / 2) * blobDog.squeeze*blobDog.squeeze;//because of how the squeeze is applied now
      barbell.holdsY = topOfDogHead + barbellPath;
      
      const jump =  (lp.step / this.barbellEndsFollowupTime);
      //barbell.endsY = lerp(barbell.endsY, barbell.holdsY, jump);
      const barbellEndsPath = cos(angle - Math.PI/6 -Math.PI/6) * this.barbellAmplitude * width/2;
      barbell.endsY = barbell.holdsY + barbellEndsPath;
    }
  },
  
];

