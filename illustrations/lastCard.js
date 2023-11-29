function drawPicLookingAtLastCard(){
    background(51);
    //blobDog below and big. 
    blobDog.reset();
    blobDog.body.d = canvasSize.width*0.8;
    blobDog.pos.y = 1.1*height;
    blobDog.draw();
    //dotBat
    dotBat.reset();
    dotBat.y = blobDog.getYofHeadTop();
    dotBat.draw();
    //have I forgotten to implement a scale for dotBat?
    // No, it just defeats the purpose of drawing the little guy in pixel art style
    //and the gig of pixels in the pixel art corresponding to actual pixels would be lost.

    //the card
    push();
    translate(width/2, height/3);
    scale(3, 4);
    oneDrawingPaper(0,0, 0,4);
    pop();
    //two paws holding the card
    blobDog.takeHoldLeft(width*0.3, height*0.13);
    blobDog.takeHoldRight(width*0.7, height*0.13);
    blobDog.paws.thickness*=2;
    blobDog.drawPaws();
}


//composition options
//dotBat left Card center and blobDog right
//blobDog big below, dotBat standing on blobDog and card is lifted above. 

//yea, I like this one better. 

