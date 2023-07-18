const loopFrameWork = {
  _DURATION: 5,
  _currentLoopStart: 0,
  seconds: 0,
  step: 1,
  setDuration(sec) {
    this._DURATION = sec;
    this._durationWasSetManually = true;
  },
  update() {
    this.updateStep();
    this.updateSecondsAndStart();
    if ((!this._notFirstCall) || this.isStart) {
      this.forces.forEach(force => { force._virgin = true; });
      this._notFirstCall=true;
    }
    this.forces.forEach(force => {
      if (this.forceIsApplicable(force))
        force._effect();
    });
  },
  isStart:true,
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
      this.isStart = true;
    }else{this.isStart = false;}
  },

  forces: [],
  forceIsApplicable(force) {//currently supports only forces with start and end values
    if (force._start == undefined || force._end == undefined){
      console.error('unhandled force type', force);
    }
     
    //force type - range (has a start and a end value)
    const now = this.seconds;
    
    if (now < force._start) return false;
    if (force._virgin) {
      force._virgin = false;
      return true;
    }
    return now <= force._end;
  },
  recalculateDuration(){
    let longestDuration = 0;
    this.forces.forEach(force => {
      console.assert(force._end!=undefined, "there is a force, with undefined end value", force);
      longestDuration = force._end>longestDuration?force._end:longestDuration;
    });
    this._DURATION = longestDuration;
    //I am not using the setter method, because it is meant for the user, and will flag that duration was manually set
  },
  createForce(){
    const newForce = {
      _start: undefined,
      _end: undefined,
      _virgin:true,
      _effect(){print('did not define behavior for a force');},
      from(s){
        this._start=s;
        return this;
      },
      after(anotherForce){
        this._start = anotherForce._end;
        this._end = this._start;
        return this;
      },
      for(s){
        this._end = this._start + s;
        return this;
      },
      at(s){
        this._start = s;
        this._end = s;
        return this;
      },
      afterPrevious(){
        //we are working with the assumption that this method is called on a freshly created force
        const thisForceIndex = loopFrameWork.forces.length-1;
        const previousForceIndex = thisForceIndex - 1;
        const noPreviousForces = previousForceIndex<0;
        if(noPreviousForces){
          return this.at(0);//so this becomes the first force
        }
        const previousForce = loopFrameWork.forces[previousForceIndex];
        return this.after(previousForce);
      },
      do(f){
        this._effect = f;
        //this method is always called at the end of any force creation, so it's safe to assume if duration has to be changed, we will change it
        if(!loopFrameWork._durationWasSetManually){
          loopFrameWork.recalculateDuration();
        }
        return this;
      },
      duration(){return this._end-this._start},
      timeFromStart(){return loopFrameWork.seconds - this._start},
      completeness(){
        if(loopFrameWork.seconds<this._start)return 0;
        if(loopFrameWork.seconds>this._end)return 1;
        return this.timeFromStart()/this.duration();
      }
    }
    loopFrameWork.forces.push(newForce);
    return newForce;
  }
};


function addLoopUpdateToP5DrawFunction() {
  const p5Draw = draw;
  draw = function () {
    loopFrameWork.update();
    p5Draw();
  };
}
