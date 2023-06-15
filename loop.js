const loopFrameWork = {
  _DURATION: 5,
  _currentLoopStart: 0,
  seconds: 0,
  step: 1,
  setDuration(sec) {
    this._DURATION = sec;
  },
  update() {
    this.updateStep;
    this.updateSecondsAndStart();
    if (this.isStart()) {
      this.forces.forEach(force => { force.virgin = true; });
      this.repeatSetup();
    }
  },
  isStart() {
    return this.seconds < this.step;
  },
  restart() {
    this._currentLoopStart = millis() / 1000;
  },
  updateStep() {
    this.step = deltaTime / 1000;
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
  repeatSetup() {
    //subject to override
  },

  /**best put at the end of the p5 setup*/
  p5Setup() {
    this.repeatSetup();
  },
  /**put this at the start of p5 draw */
  p5Draw() {
    this.update();
    this.forces.forEach(force => {
      if (this.forceIsApplicable(force))
        force.effect();
    });
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


function frameworksRegistrationAfterSetup() {
  loopFrameWork.p5Setup();
  const p5Draw = draw;
  draw = function () {
    loopFrameWork.p5Draw();
    p5Draw();
  };
}
