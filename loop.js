const loopFrameWork = {
  _DURATION: 0,
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
  //** sets a new duration based on the current forces. */
  recalculateDuration(){
    let longestDuration = 0;
    this.forces.forEach(force => {
      console.assert(force._end!=undefined, "there is a force, with undefined end time value", force);
      longestDuration = force._end>longestDuration?force._end:longestDuration;
    });
    this._DURATION = longestDuration;
    return longestDuration;
    //I am not using the setter method, because it is meant for the user, and will flag that duration was manually set
  },
  createForce(){
    const newForce = {
      _start: undefined,
      _end: undefined,
      _virgin:true,
      _effect(){print('did not define behavior for a force');},
      after(anotherForce, delay=0){//todo:check if optional parameters work this way
        this._start = this._end = anotherForce._end+delay;
        if(delay!=0){
          print("after ", delay, " at ", this._end);
        }
        return this;
      },
      for(s){
        this._end = this._start + s;
        if(!loopFrameWork._durationWasSetManually){
          loopFrameWork.recalculateDuration();
        }
        return this;
      },
      at(s){
        this._start = this._end = s;
        if(!loopFrameWork._durationWasSetManually){
          loopFrameWork.recalculateDuration();
        }
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
        return this;
      },
      until(seconds){
        this._end = seconds;
        if(!loopFrameWork._durationWasSetManually){
          loopFrameWork.recalculateDuration();
        }
        return this;
      },
      getDuration(){return this._end-this._start},
      getTimeFromStart(){return loopFrameWork.seconds - this._start},
      getCompleteness(){
        if(loopFrameWork.seconds<this._start)return 0;
        if(loopFrameWork.seconds>this._end)return 1;
        return this.getTimeFromStart()/this.getDuration();
      },
      afterLast(){
        return this.at(loopFrameWork._DURATION);
      }
    }
    loopFrameWork.forces.push(newForce);
    return newForce;
  },
  clearForces(){
    this.forces = [];
    this.recalculateDuration();
  },
};


function addLoopUpdateToP5DrawFunction() {
  const p5Draw = draw;
  draw = function () {
    loopFrameWork.update();
    p5Draw();
  };
}
