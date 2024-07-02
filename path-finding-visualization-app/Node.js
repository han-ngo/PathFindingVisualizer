let u = 105; // upper mouth
let l = 11; // lower mouth
let speed = 1;
let speed2 = 0;

class Node {
  constructor({
    p,
    row,
    col,
    isStart,
    isTarget,
    isVisited = false,
    isWall = false,
    isPath = false,
    canvasSize,
    gridSize,
  }) {
    this.p = p;
    this.row = row;
    this.col = col;
    this.width = canvasSize[0] / gridSize[0];
    this.height = canvasSize[1] / gridSize[1];
    this.isStart = isStart;
    this.isTarget = isTarget;
    this.isVisited = isVisited;
    this.isWall = isWall;
    this.isPath = this.isPath;
  }

  show(color, duration = 500) {
    this.p.noStroke();
    this.p.rect(
      this.col * this.width + 1,
      this.row * this.height + 1,
      this.width - 2,
      this.height - 2
    );

    let currentColor = this.p.color("#09090B");
    if (this.isTarget) {
      this.drawGhost(
        this.p,
        this.col * this.width + 1,
        this.row * this.height + 1,
        this.width - 2,
        this.height - 2
      );
    } else if (this.isStart) {
      this.drawPacMan(
        this.p,
        this.col * this.width + 1,
        this.row * this.height + 1,
        this.width - 2,
        this.height - 2
      );
    }

    if (this.isPath) {
      this.animateColor(currentColor, this.p.color("#FEFBA2"), duration);
    } else if (this.isVisited) {
      this.animateColor(currentColor, this.p.color("#A0D2EB"), duration);
    } else {
      this.animateColor(currentColor, this.p.color(color), duration);
    }
  }

  animateColor(startColor, endColor, duration) {
    const startTime = this.p.millis();
    const endTime = startTime + duration;

    const animate = () => {
      const now = this.p.millis();
      const progress = this.p.constrain((now - startTime) / duration, 0, 1);

      const lerpedColor = this.p.lerpColor(startColor, endColor, progress);
      this.p.fill(lerpedColor);

      if (progress < 1) {
        this.p.requestAnimationFrame(animate);
      }
    };

    animate();
  }

  show(color = "#09090B") {
    this.p.noStroke();

    // if (!this.isStart && !this.isTarget && this.isVisited) {
    //   this.p.fill("blue");
    // if (!this.isStart && !this.isTarget && this.isPath) {
    //   this.p.fill("pink");
    // } else {
    //   this.p.fill("#09090B");
    // }
    // this.p.rect(
    //   this.col * this.width + 1,
    //   this.row * this.height + 1,
    //   this.width - 2,
    //   this.height - 2
    // );

    if (this.isTarget) {
      this.p.rect(
        this.col * this.width + 1,
        this.row * this.height + 1,
        this.width - 2,
        this.height - 2
      );
      this.drawGhost(
        this.p,
        this.col * this.width + 1,
        this.row * this.height + 1,
        this.width - 2,
        this.height - 2
      );
    } else if (this.isStart) {
      this.p.rect(
        this.col * this.width + 1,
        this.row * this.height + 1,
        this.width - 2,
        this.height - 2
      );
      this.drawPacMan(
        this.p,
        this.col * this.width + 1,
        this.row * this.height + 1,
        this.width - 2,
        this.height - 2
      );
    } else {
      this.p.fill(color);
      this.p.rect(
        this.col * this.width + 1,
        this.row * this.height + 1,
        this.width - 2,
        this.height - 2
      );
    }
  }

  animatePath(color, size = 52) {
    const x = this.col * this.width + 1,
      y = this.row * this.height + 1,
      w = this.width - 2,
      h = this.height - 2;

    this.p.push();
    this.p.translate(x + w / 2, y + h / 2); // Translate to the center of the node
    let scaleSize = this.p.min(w / 52, h / 52); // Scale factor based on node size

    this.p.scale(scaleSize + 0.15); // Scale to fit the node size
    this.p.fill(color); // Example color
    this.p.ellipse(0, 0, size, size);
    this.p.pop();
  }

  drawPacMan(p, x, y, w, h) {
    p.push();
    p.translate(x + w / 2, y + h / 2);
    p.scale(w / 52, h / 52); // Scale to fit the node size

    // PacMan body
    p.fill("#FFFF54");
    p.arc(0, 0, 52, 52, p.radians(30), p.radians(330), p.PIE);

    // Mouth cutouts
    p.fill(p.color(128, 0));
    p.triangle(0, 0, 26, 15, 26, -15);

    // Eye
    p.fill("#ffffff");
    p.circle(0, -15, 10);

    p.pop();
  }

  drawGhost(p, x, y, w, h) {
    p.push();
    p.translate(x + w / 2, y + h / 2); // Translate to the center of the node
    let scaleSize = p.min(w / 52, h / 52); // Scale factor based on node size

    p.scale(scaleSize); // Scale to fit the node size

    // Orange Ghost
    p.fill(255, 165, 0);
    p.noStroke();

    // Body
    p.arc(0, 0, 50, 50, p.radians(10), p.radians(360)); // Adjusted to center (0, 0) and scale factor
    p.rect(-25, -5, 50, 30); // Adjusted to center (0, 0) and scale factor

    // Legs
    p.beginShape();
    p.vertex(-25, 20);
    p.vertex(-25, 35);
    p.vertex(-17, 25);
    p.vertex(-9, 35);
    p.vertex(-1, 25);
    p.vertex(7, 35);
    p.vertex(15, 25);
    p.vertex(25, 35);
    p.vertex(25, 25);
    p.endShape();

    // Eyes
    p.fill(255);
    p.ellipse(-15, 0, 20, 20); // Adjusted to center (0, 0) and scale factor
    p.ellipse(10, 0, 20, 20); // Adjusted to center (0, 0) and scale factor

    // Pupils
    p.fill(0);
    p.ellipse(-19, 0, 10, 10); // Adjusted to center (0, 0) and scale factor
    p.ellipse(5, 0, 10, 10); // Adjusted to center (0, 0) and scale factor

    p.pop();
  }
}

export default Node;
