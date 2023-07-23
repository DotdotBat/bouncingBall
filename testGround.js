const testingMode = true;
if(testingMode){
    lp.clearForces();
}

const testSetup = lp.createForce().afterLast().do(
    ()=>{
        blobDog.reset();
        blobDog.pos.x = canvasSize.width*3/4;
        blobCat.reset();
        blobCat.x = canvasSize.width/4;
        drawStage = ()=>{
            background(0);
            blobDog.draw();
            blobCat.draw();
            drawCurl(100, 100, mouseX, mouseY, 20, 0.2);
            drawCurl(400, 400, mouseX, mouseY, 40, -0.3);
        }
    }
);

lp.setDuration(10);


const blobCat = {
    reset(){
        this.x = canvasSize.width/2;
        this.y = canvasSize.height/2;
        this.body.r = canvasSize.height/6;
        this.furColor = color(this.bodyColorString);
    },
    bodyColorString: 'purple',
    furColor: undefined,
    x: canvasSize.width/2, 
    y:canvasSize.height/2,
    body: {r: canvasSize.height/6},
    drawBody(){
        const r = this.body.r;
        circle(0, 0, r*2);
    },
    draw(){
        push();
        translate(this.x, this.y);
        //drawing order:
        //ears, body, hair, eye
        this.drawBody();
        pop();
    },
    drawEars(){

    },
}

function drawCurl(baseX, baseY, endX, endY, thickness, curvature, baseThickness){
    if(curvature == 0){
        curvature = 0.0001;
        //0 curvature results in a null offset vector,
        //It's better to approximate 0 with a very small value,
        //Instead of creating a separate logic for 0 curvature.
    }

    const middle = createVector(
        (baseX + endX)/2,
        (baseY + endY)/2
    );
    
    //A bit counterintuitive, but it works
    //the resulting vector always points perpendicularly left,
    //a is scaled by the curvature
    const perpendicular = createVector(
        endY - baseY,
        baseX - endX
    );
    const offsetCenter = perpendicular.copy().mult(curvature);
    const offsetDistance = offsetCenter.mag();
    const leftBorderOffset = offsetCenter.copy().setMag(offsetDistance+thickness/2);
    const rightBorderOffset = offsetCenter.copy().setMag(offsetDistance - thickness/2);
    const midLeft = middle.copy().add(leftBorderOffset);
    const midRight = middle.copy().add(rightBorderOffset);
    //as a result we have the x&y coordinates of the middle points of the left and right curl borders
    

    beginShape();
    vertex(baseX, baseY);
    curveVertex(baseX, baseY);
    curveVertex(midLeft.x, midLeft.y);
    curveVertex(endX, endY);
    curveVertex(endX, endY);
    curveVertex(midRight.x, midRight.y);
    curveVertex(baseX, baseY);
    curveVertex(baseX, baseY);
    endShape();
    
    
    //debug
    circle(baseX, baseY, 10);
    circle(endX, endY, 10);
    line(baseX, baseY, endX, endY);
    circle(middle.x + offsetCenter.x, middle.y + offsetCenter.y, thickness);
}