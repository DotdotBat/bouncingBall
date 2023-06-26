const loopFrameWork = {
  _DURATION: 5,
  _currentLoopStart: 0,
  seconds: 0,
  step: 1,
  setDuration(sec) {
    this._DURATION = sec;
  },
  update() {
    this.updateStep();
    this.updateSecondsAndStart();
    if ((!this.notFirstCall) || this.isStart()) {
      this.forces.forEach(force => { force.virgin = true; });
      this.notFirstCall=true;
    }
    this.forces.forEach(force => {
      if (this.forceIsApplicable(force))
        force.effect();
    });
  },
  isStart() {
    return this.seconds < this.step;
  },
  restart() {
    this._currentLoopStart = millis() / 1000;
  },
  updateStep() {
    this.step = deltaTime / 1024;
  },
  /**
 * Updates the global variables loopSeconds and loopStep
 */
  updateSecondsAndStart() {
    const currentTime = millis() / 1000;//to seconds
    this.seconds = currentTime - this._currentLoopStart;
    if (this.seconds > this._DURATION) {
      this.seconds -= this._DURATION;
      this._currentLoopStart += this._DURATION;
    }
  },

  forces: [
    {
      name: 'default force',
      start: 2,
      end: 4,
      effect: () => {
        console.warn("didn't override lp.forces");
      }
    }
  ],
  forceIsApplicable(force) {//currently supports only forces with start and end values
    if (force.start == undefined && force.end == undefined)
      console.error('unhandled force type');
    
    //force type - range (has a start and a end value)
    const now = this.seconds;
    
    if (now < force.start) return false;
    if (force.virgin) {
      force.virgin = false;
      return true;
    }
    return now <= force.end;
  }
};


function addLoopUpdateToP5DrawFunction() {
  const p5Draw = draw;
  draw = function () {
    loopFrameWork.update();
    p5Draw();
  };
}
