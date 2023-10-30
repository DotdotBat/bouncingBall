

function drawPicPlanningPlans() {
    background(51);
    const pDrawingsCenter = { x: 0.75 * width, y: 0.75 * height };//about

    //blobDog looking at drawing
    blobDog.reset();
    blobDog.setSize(width * 0.4);
    blobDog.pos.x = width * 0.4;
    blobDog.pos.y = height / 2;

    blobDog.pose.heading.horizontal = 0.25;
    blobDog.draw();
    //tree drawings. 
    const maxOffset = 40;
    for (let scatteredDrawing = 0; scatteredDrawing < 3; scatteredDrawing++) {
        const offsetX = random(-maxOffset, maxOffset);
        const offsetY = random(-maxOffset, maxOffset) / 2;//cause isometric
        const x = pDrawingsCenter.x + offsetX;
        const y = pDrawingsCenter.y + offsetY;
        oneDrawingPaper(x, y, random(PI));
    }
    //one drawing, the top one, should be oriented so that blobDog can draw on it
    oneDrawingPaper(pDrawingsCenter.x, pDrawingsCenter.y, 0.65 * PI);


    //pencil above the drawing

    /**
     * @param {*} shaftAngle where 0 is straight up
     */

    drawPencil(pDrawingsCenter.x - 25, pDrawingsCenter.y, PI / 6, 100, 15, 100);
    drawPencil(pDrawingsCenter.x + 25, pDrawingsCenter.y, -PI / 6, 100, 15, 50);
    drawPencil(pDrawingsCenter.x - 10, pDrawingsCenter.y + 5, PI / 18, 100, 15);

    // circle(pDrawingsCenter.x, pDrawingsCenter.y, 10);
    //afterimage of the same pencil
    //motion lines?
}

function oneDrawingPaper(x, y, rotation, drawingNumber = 0) {
    push();
    translate(x, y);
    scale(1, 0.5);//isometric distortion
    rotate(rotation);
    rectMode(CENTER);
    rect(0, 0, 70, 100);
    
    //dimensions x[-30 to +30], y[-40, 40]
    strokeWeight(3);
    noFill();
    if (drawingNumber==1) {//weightLifting
        ellipse(25,0,10,20);
        ellipse(-25,0,10,20);
        line(-25,0,25,0);
    }
    if(drawingNumber==2){//hop
        arc(0,50,70,130,PI, 0);
        fill(255);
        circle(-10, -12, 20);
    }
    if(drawingNumber==3){//bounce
        line(0, -40, 35, 0);
        line(35, 0, 0, 40);
        line(0, 40, -35, 0);
        fill(255);
        ellipse(0, 40, 20, 15);
    }
    if(drawingNumber==4){//move to her.
        circle(-20,0,20);
        circle(20, 0, 20);
        line(-20, -30, 20, -30);
        line(20, -30, 15, -25);
        line(20, -30, 15, -35);
    }
    pop();
}

function drawPencil(tipX, tipY, shaftAngle, length, girth, alpha = 255) {
    push();
    stroke(0, alpha);
    const g2 = girth / 2;
    translate(tipX, tipY);
    rotate(shaftAngle);//todo: check if it should be reversed;
    scale(1, -1); //flipping  the world, making height along length positive for readability
    //tip
    const coneHeight = girth * 1.5;
    fill(170, 118, 65, alpha);//wood
    triangle(
        0, 0,
        g2, coneHeight,
        -g2, coneHeight
    );
    //translate(-g2, 0);
    rectMode(CORNERS);
    const eraserLength = girth;
    const eraserHeight = length - eraserLength;
    //shaft
    let cl = color("yellow");
    cl.setAlpha(alpha);
    fill(cl);
    rect(-g2, eraserHeight, g2, coneHeight);
    //edge lines on the shaft
    noFill();
    rect(-g2 / 2, eraserHeight, g2 / 2, coneHeight);
    //eraser
    cl = color("pink");
    cl.setAlpha(alpha);
    fill(cl);
    const eraserThicknessOffset = 1;
    rect(
        g2 - eraserThicknessOffset, eraserHeight,
        eraserThicknessOffset - g2, length,
        0, 0, 4, 4,
    );
    pop();
}

function drawPicPresentingPlans() {
    background(51);
    //4 drawings are spread in an arc
    push();
    translate(width / 2, height / 2);
    for (let i = 1; i <= 4; i++) {
        const angle = map(i, 0, 5, 0, PI);
        oneDrawingPaper(
            cos(angle) * width * 0.3,
            sin(angle) * height / 4,
            angle + PI / 2,
            i//the number of the drawing, goes from 1 to 4
        );
    }
    pop();
    //blobDog looking at us 
    blobDog.reset();
    blobDog.draw();
    //a pencil lying on the fourth drawing
    drawPencil(width / 5, height * 0.6, PI * 0.66, 100, 15);
    noLoop();
}