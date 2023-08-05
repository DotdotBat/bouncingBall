/**Takes in three points as input
 * the left and right points of a curl base
 * and the end point of the curl
 * 
 * @param {Number} leftX 
 * @param {Number} leftY 
 * @param {Number} rightX 
 * @param {Number} rightY 
 * @param {Number} endX 
 * @param {Number} endY 
 */
function bezierCurl(leftX, leftY, rightX, rightY, endX, endY) {
    const leftBase = createVector(leftX, leftY);
    const rightBase = createVector(rightX, rightY);
    const endPoint = createVector(endX, endY);
    const perpendicularToBase = createVector(
        leftY - rightY,
        rightX - leftX
    );//if left and right are set, than this vector will always point down
    const baseMiddle = createVector((leftX + rightX) / 2, (leftY + rightY) / 2);
    const controlStrength = baseMiddle.dist(endPoint) / 2;
    perpendicularToBase.setMag(controlStrength);
    const leftControl = leftBase.copy().add(perpendicularToBase);
    const rightControl = rightBase.copy().add(perpendicularToBase);
    function vAnchor(vec) { vertex(vec.x, vec.y); };
    function vBezier(control2, control3, anchor4) {
        bezierVertex(
            control2.x, control2.y,
            control3.x, control3.y,
            anchor4.x, anchor4.y
        )
    };
    beginShape();
    vAnchor(leftBase);
    vBezier(leftControl, endPoint, endPoint);
    vBezier(endPoint, rightControl, rightBase);
    endShape();
}