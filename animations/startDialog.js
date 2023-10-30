// unfinished, abandoned. Maybe I will finish it when it will be needed. 


const floorPadding = canvasSize.height/10;
let wallPaperText = "STRONGER";
let bdFirstLine = "";
const startDialogSetup = lp.createForce().afterLast().do(
    () => {
        dotBat.reset();
        dotBat.wingsAreSpread = false;
        blobDog.reset();
        blobDog.pos.x = canvasSize.width / 4;
        blobDog.pos.y = height - blobDog.body.d/2 - floorPadding;
        backgroundColor = color("midnightBlue");
        
        drawStage = () => {
            background(backgroundColor);
            textAlign(CENTER, CENTER);
            text(wallPaperText, width / 2, height / 4);
            textAlign(LEFT, CENTER);
            text(bdFirstLine)
            blobDog.draw();
            dotBat.drawStandingAt(width*0.7, height-floorPadding);
        };
    }
);

const questionStart = "Bro, can ya help me get ";



