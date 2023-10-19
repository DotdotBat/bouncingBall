/** from 0 to Math.PI/2, but better to Math.PI/3*/
let dummyFallAngle = 0;



function drawDummy(){
    //anchor point
    const x = width*0.75;
    const y= 2*height/3;
    const leeway = 0.2;
    push();
    translate(x, y);
    shearY(Math.PI/6);
    shearX(-dummyFallAngle);
    scale(cos(Math.PI/6),cos(dummyFallAngle-Math.PI/6));
    //scale(0, );
    const r = blobDog.body.d/2;
    
    image(dummyImage, -r, -2*r, 2*r, 2*r, 770, 70, 190, 190);
    pop();
}

