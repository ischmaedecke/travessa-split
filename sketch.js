// Travessa elastic split – p5.js (Georgia, sentence case)
// Mouse/touch X controls the split; a spring eases the gap.
// The line sits roughly where a Georgia hyphen would be.

let word = "Travessa";
let leftStr = "", rightStr = word;

// spring params
let gap = 0, gapV = 0, gapTarget = 0;
const k = 0.2, damp = 0.55;

// optional snapping
let snapToSyllables = false; // press 's' to toggle
const snapPoints = [1, 3, 6]; // T | Tra | Traves

// tune this to match Georgia's hyphen height
const HYPHEN_ASCENT_RATIO = 0.25;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Georgia');
  textAlign(LEFT, BASELINE);
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }

function draw() {
  background(255);

  // responsive type size
  const maxW = min(width * 0.86, 1200);
  const ts = maxW / 10;
  textSize(ts);
  textLeading(ts * 1.1);

  const wordW = textWidth(word);
  const px = pointerX();

  // map pointer to number of letters on the left
  let leftCount = round(map(px, (width - wordW) / 2, (width + wordW) / 2, 0, word.length));
  leftCount = constrain(leftCount, 0, word.length);

  if (snapToSyllables) leftCount = closestInArray(leftCount, snapPoints);

  leftStr = word.slice(0, leftCount);
  rightStr = word.slice(leftCount);

  const leftW = textWidth(leftStr);
  const rightW = textWidth(rightStr);

  // target gap based on pointer
  const maxGap = max(width * 0.6 - leftW - rightW, 0);
  gapTarget = constrain(map(px, 0, width, 0, maxGap), 0, maxGap);

  // spring physics
  const a = k * (gapTarget - gap);
  gapV = (gapV + a) * damp;
  gap += gapV;

  // layout
  const baseY = height * 0.55;
  const leftX = (width - (leftW + rightW + gap)) / 2;

  // hyphen alignment
  const asc = textAscent();
  const ruleY = baseY - asc * HYPHEN_ASCENT_RATIO;

  // draw left side
  fill(0);
  noStroke();
  text(leftStr, leftX, baseY);

  // draw connecting line only when both sides exist
  if (leftCount > 0 && leftCount < word.length) {
    const pad = ts * 0.10; // distance from letters
    const ruleStart = leftX + leftW + pad;
    const ruleEnd = ruleStart + max(0, gap - 2 * pad);

    stroke(0);
    strokeWeight(max(3, ts * 0.075));
    strokeCap(SQUARE); // straight ends (try PROJECT for overhang)
    line(ruleStart, ruleY, ruleEnd, ruleY);
  }

  // draw right side
  noStroke();
  const rightX = leftX + leftW + gap;
  text(rightStr, rightX, baseY);

  // optional pointer cue
  push();
  noFill();
  stroke(255, 0, 0, 0);
  strokeWeight(1.5);
  circle(px, baseY - ts * 0.9, ts * 0.22);
  pop();
}

function pointerX() {
  return (touches && touches.length) ? touches[0].x : (mouseX || width / 2);
}

function keyTyped() {
  if (key === 's' || key === 'S') snapToSyllables = !snapToSyllables;
}

function closestInArray(n, arr) {
  let best = arr[0], d = abs(n - arr[0]);
  for (let i = 1; i < arr.length; i++) {
    const di = abs(n - arr[i]);
    if (di < d) { d = di; best = arr[i]; }
  }
  return best;
}
