function drawHeart(x, y, R, resolution) {
    const xh = angle => R / 15.0 * 16 * Math.pow(Math.sin(angle), 3);
    const yh = p => R / 15.0 * (-13 * Math.cos(p) + 5 * Math.cos(2 * p) + 2 * Math.cos(3 * p) + Math.cos(4 * p));
    push();
    stroke(255);
    beginShape();
    let n = Math.ceil(resolution);
    for (let i = 0; i < n; i++) {
        let xv = x + xh(TAU * i / n);
        let yv = y + yh(TAU * i / n);
        vertex(xv, yv);
    }
    endShape();
    pop();
}