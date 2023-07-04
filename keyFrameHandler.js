/**
 * A function to perform a linear interpolation of a keyName's value at a given time based on an array of keyFrames.
 * 
 * Each keyFrame is an object with a mandatory time property and values. 
 * The keyFrames in the given array must be time sorted
 * @param {number} time - The point in time where we want to compute the interpolated value.
 * @param {string} keyName - The key we wish to calculate an interpolated value for ('posX' or 'posY').
 * @param {object[]} keyFrames - The array of keyFrames whereby each frame is an object with a 'time' property
 * 
 * @returns {number} - The interpolated value for the provided keyName at the given time.
 *
 * @example
 * 
 * let keyFrames = [
 *    {
 *      at:0,//exact time
 *      posX: canvasSize.width/2,
 *      posY: canvasSize.height/3
 *    },
 *     {
 *      after: 3,//after previous keyframe
 *      posX: canvasSize.width,
 *      posY: canvasSize.height,
 *    }
 * ];
 * 
 * let interpolatedValue = getValueFromKeyFrames(1.5, 'posX', keyFrames);
 */
function getValueFromKeyFrames(time, keyName, keyFramesArray) {
  if(keyFramesArray._wasInitialized===undefined){
    initializeKeyFramesArray(keyFramesArray);
    keyFramesArray._wasInitialized = true;
  }
  let previousFrame = null;
  let nextFrame = null;
  for (const frame of keyFramesArray) {
    if (frame[keyName] === undefined) {
      continue;//skip the frames without this value
    }
    
    if (time <= frame.time) {
      nextFrame = frame;
      break;
    }
    previousFrame = frame;
  }
  if (previousFrame === null && nextFrame === null) {
    console.error('keyName was not found in keyFrames', keyName, keyFramesArray);
  }
  if (previousFrame === null) {
    //so only next frame was found
    return nextFrame[keyName];
  }
  if (nextFrame === null) {
    //so only previous frame was found
    return previousFrame[keyName];
  }
  //found previous and next frame
  const t = (time - previousFrame.time) / (nextFrame.time - previousFrame.time)
  const value = lerp(previousFrame[keyName], nextFrame[keyName], t);
  return value;
}


function initializeKeyFramesArray(arr){
  //calculate the time for each frame and assign it as a "time property"
  let previousFrameTime = 0;
  for(frame of arr){
    frame.time = frame.at !== undefined ? frame.at : previousFrameTime + frame.after;
    previousFrameTime = frame.time;
    console.assert(frame.time !== undefined, "can't get keyFrameTime for keyFrame:", frame);
  }
  //sort the keyframes based on the time
  arr.sort((a,b)=>{a.time-b.time});
}