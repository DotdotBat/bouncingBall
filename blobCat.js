const blobCat = {
    reset() {
        this.x = canvasSize.width / 2;
        this.y = canvasSize.height / 2;
        this.r = canvasSize.height / 6;
        if (!this.colorInitialized) {
            //we turn the colors from strings to color objects because I feel that it is more performant and if I won't do it, it leaves an itch at the back of my head. I don't actually do it for the performance boost, but to stop thinking about it.
            this.colorInitialized = true;
            this.innerEarShadowColor = color(this.furColor);
            this.innerEarShadowColor.setAlpha(50);
            this.furColor = color(this.furColor);
            this.innerEarColor = color(this.innerEarColor);
            this.hairColor = color(this.hairColor);
            this.hairOutlineColor = color(this.hairOutlineColor);
        }
        this.ears.set(this.earExpressionPresets.neutral);

    },
    furColor: "purple",
    innerEarShadowColor: "black",
    x: canvasSize.width / 2,
    y: canvasSize.height / 2,
    r: canvasSize.height / 6,
    drawBody() {
        circle(0, 0, this.r * 2);
    },
    draw() {
        push();
        //so that for all drawing methods 0,0 is the center of body
        translate(this.x, this.y);
        fill(this.furColor);
        noStroke();
        //intended drawing order: 
        this.drawEars();
        this.drawBody();
        this.drawHair();
        this.drawEye();
        pop();
    },
    innerEarColor: "lightPink",
    earExpressionPresets:{
        down: {cover: 0.8, lift: 0},
        neutral: {cover: 0.3, lift:0.5},
        attention: {cover: 0.3, lift: 1},
    },
    ears: {
        r:{cover: 0.3, lift: 0.5},
        l:{cover: 0.4, lift: 0.8},
        set(expressionPreset){
            this.l.cover = expressionPreset.cover;
            this.r.cover = expressionPreset.cover;
            this.l.lift = expressionPreset.lift;
            this.r.lift = expressionPreset.lift;
        }
    },

    drawEars() {
        //r-right, l-left

        //input variables determining the shape of the ears
        const baseLowerPointAngle = -(PI / 2) * 1/4;
        const baseWidthAngle = -PI / 6
        const approximateEarLength = 0.5;//in r.
        const rOuterEarCoverFraction = this.ears.r.cover;
        const lOuterEarCoverFraction = this.ears.l.cover;
        const rEarExpressionCoefficient = this.ears.r.lift; 
        const lEarExpressionCoefficient = this.ears.l.lift;
        const rEarTipAngle = (PI / 2) * (rEarExpressionCoefficient - 0.5) * ((baseWidthAngle)/(PI/2));
        const lEarTipAngle = (PI / 2) * (lEarExpressionCoefficient - 0.5) * ((baseWidthAngle)/(PI/2));

        
        //calculating points that will be used in drawing
        const rLowerBasePoint = createVector(this.r, 0);
        rLowerBasePoint.rotate(baseLowerPointAngle);
        const rUpperBasePoint = rLowerBasePoint.copy().rotate(baseWidthAngle);
        
        const reflectionNormal = createVector(1, 0);//for the left ear
        const lLowerBasePoint = rLowerBasePoint.copy().reflect(reflectionNormal);
        const lUpperBasePoint = rUpperBasePoint.copy().reflect(reflectionNormal);

        const rEarTipPoint = createVector(this.r*(1 + approximateEarLength), 0);
        const lEarTipPoint = createVector(-this.r*(1 + approximateEarLength), 0);
        rEarTipPoint.rotate(baseLowerPointAngle + baseWidthAngle/2 + rEarTipAngle);
        lEarTipPoint.rotate(-(baseLowerPointAngle + baseWidthAngle/2 + lEarTipAngle));
        
        const rOuterEarBasePoint = rUpperBasePoint.copy().lerp(rLowerBasePoint, rOuterEarCoverFraction);
        const lOuterEarBasePoint = lUpperBasePoint.copy().lerp(lLowerBasePoint, lOuterEarCoverFraction);

        const rShadowBaseCoverage = constrain(1.8*rOuterEarCoverFraction, 0, 1);//1.8 because It feels about right 
        const lShadowBaseCoverage = constrain(1.8*lOuterEarCoverFraction, 0, 1); 
        const rShadowBasePoint = rUpperBasePoint.copy().lerp(rLowerBasePoint, rShadowBaseCoverage);
        const lShadowBasePoint = lUpperBasePoint.copy().lerp(lLowerBasePoint, lShadowBaseCoverage);
        
        drawInnerEar();
        drawInnerShadow();
        drawOuterEar();

        function drawInnerEar() {
            push();
            fill(blobCat.innerEarColor);
            bezierCurl(
                rLowerBasePoint.x, rLowerBasePoint.y,
                rUpperBasePoint.x, rUpperBasePoint.y,
                rEarTipPoint.x, rEarTipPoint.y
            );
            bezierCurl(
                lUpperBasePoint.x, lUpperBasePoint.y,
                lLowerBasePoint.x, lLowerBasePoint.y,
                lEarTipPoint.x, lEarTipPoint.y
            );
            pop();
        };
       
        function drawOuterEar() {
            push();
            fill(blobCat.furColor);
            bezierCurl(
                rOuterEarBasePoint.x, rOuterEarBasePoint.y,
                rUpperBasePoint.x, rUpperBasePoint.y,
                rEarTipPoint.x, rEarTipPoint.y
            );
            bezierCurl(
                lUpperBasePoint.x, lUpperBasePoint.y,
                lOuterEarBasePoint.x, lOuterEarBasePoint.y,
                lEarTipPoint.x, lEarTipPoint.y
            );
            pop();
        }

        function drawInnerShadow() {
            push();
            fill(blobCat.innerEarShadowColor);
            bezierCurl(
                rShadowBasePoint.x, rShadowBasePoint.y,
                rUpperBasePoint.x, rUpperBasePoint.y,
                rEarTipPoint.x, rEarTipPoint.y
            );
            bezierCurl(
                lUpperBasePoint.x, lUpperBasePoint.y,
                lShadowBasePoint.x, lShadowBasePoint.y,
                lEarTipPoint.x, lEarTipPoint.y
            );
            pop();
        }
    },
    hairColor: "black",
    hairOutlineColor: "red",
    drawHair() {
        push();
        stroke(this.hairOutlineColor);
        fill(this.hairColor);
        arc(0,0,this.r*2, this.r*2, 3*2*PI/8, 7*2*PI/8, CHORD);
        fill(this.furColor);
        arc(this.r/sqrt(2), this.r/sqrt(2), this.r*2*sqrt(2), this.r*2*sqrt(2), PI, 3*PI/2);
        fill(this.hairColor);
        bezierCurl(-this.r*0.7, -this.r*0.5, - this.r*0.3, -this.r*0.3, -this.r*0.5, this.r*0.9);
        bezierCurl(-this.r*0.7, -this.r*0.7, - this.r*0.3, -this.r*0.3, -this.r, this.r*0.8);
        bezierCurl(-this.r*0.7, -this.r*0.7, - this.r*0.3, -this.r*0.3, -this.r*0.8, this.r*0.8);
        bezierCurl(0, -this.r, 0.1*this.r, -0.57*this.r, -0.8*this.r, 0);

        pop();
    },
    eyePresets:{
        idle:{
            pupilFraction: 6,
            lineAngle: Math.PI/4,
            retinaTwist: Math.PI,
            linesNumber: 15,
        },
        squinting:{
            pupilFraction: 6,
            lineAngle: Math.PI/15,
            retinaTwist: 0,
            linesNumber: 10,
        },
        blank:{
            pupilFraction: 100,
            lineAngle: 0,
            retinaTwist: Math.PI,
            linesNumber: 20,
        },
        toxic:{
            pupilFraction: 100,
            lineAngle: -Math.PI/6,
            retinaTwist: 2* Math.PI/3,
            linesNumber: 30,
        },
        closedAperture:{
            pupilFraction: 100,
            lineAngle: -Math.PI/4,
            retinaTwist: Math.PI/2,
            linesNumber: 40,
        },
        catIris:{
            pupilFraction: 3,
            lineAngle: 2*Math.PI/5,
            retinaTwist: Math.PI,
            linesNumber: 13,
        },
        barPupil:{
            pupilFraction: 4,
            lineAngle: 0,
            retinaTwist: 0,
            linesNumber: 13,
        },
        confused:{
            pupilFraction: 10,
            lineAngle: -Math.PI/6,
            retinaTwist: Math.PI/3,
            linesNumber: 50,
        },
        sideGlance:{
            pupilFraction: -5,
            lineAngle: Math.PI/3,
            retinaTwist: 0,
            linesNumber: 15,
        },
        end:{
            pupilFraction: -0.04,
            lineAngle: Math.PI/2,
            retinaTwist: 0,
            linesNumber: 12,
        },

    },
    eye: {
        lineAngle: Math.PI/4,
        pupilColor: 0,//black
        get radius(){return blobCat.r*0.5},
        pupilFraction : 8,
        linesNumber: 15,
        retinaTwist: Math.PI,
        lookingDirection: 0,
        //import the eye.js algorithm
    },
    drawEye(){
        const bodyR = blobCat.r;
        const x = bodyR*0.3, y = 0;
        
        if(abs(this.eye.lineAngle % (Math.PI)) < 0.01){this.eye.lineAngle=0.01}
        push();
        translate(x, y);
        stroke(255);
        fill(this.eye.pupilColor);
        drawingContext.save();
        circle(0, 0, this.eye.radius*2);
        drawingContext.clip();
        rotate(this.eye.lookingDirection);
        const pupilRadius = this.eye.radius/this.eye.pupilFraction;
        const centerStartX = - pupilRadius/abs(sin(this.eye.lineAngle));
        const furthestPoint = - this.eye.radius/abs(sin(this.eye.lineAngle));
        const lineEndOffset = this.eye.radius /tan(this.eye.lineAngle);
        for(let i = 1; i<this.eye.linesNumber; i++){
          const x0 = lerp(centerStartX, furthestPoint,  ((i-1)/(this.eye.linesNumber-1)));
          const x1 = x0 + lineEndOffset;
          line(x0, 0, x1, this.eye.radius);
          line(x0, 0, x1, -this.eye.radius);
          rotate(this.eye.retinaTwist);
        }
        
        
        drawingContext.restore();
        pop();
      }
}

