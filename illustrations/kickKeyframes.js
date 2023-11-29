function drawPicMultipleKeyframes() {

}

const illustrationKeyframes = {
    keyFrames: [
        {
            posX: canvasSize.width / 3,
            posY: canvasSize.height / 2,
        },
        {
            posX: 2 * canvasSize.width / 3,
            skew: 0,
            bodyRot: 0,
        },
        {
            bodyRot: -Math.PI / 10,
            skew: -Math.PI / 12,
        }
    ]
};