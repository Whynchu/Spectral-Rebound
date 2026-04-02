const JOY_DEADZONE = 3;
const JOY_MAX = 28;
// Anchor drifts when thumb is this many times past max radius
const JOY_DRIFT_THRESHOLD = 1.6;
// How fast the anchor lerps toward the drift target (exponential, per second)
const JOY_DRIFT_SPEED = 5;

function createJoystickState() {
  return { active:false, ax:0, ay:0, dx:0, dy:0, mag:0, max:JOY_MAX, rawX:0, rawY:0 };
}

function resetJoystickState(joy) {
  joy.active = false;
  joy.ax = 0;
  joy.ay = 0;
  joy.dx = 0;
  joy.dy = 0;
  joy.mag = 0;
  joy.rawX = 0;
  joy.rawY = 0;
}

// Called each frame from the game loop. Drifts the anchor toward the thumb
// when the thumb is well past max radius, keeping direction at full input.
function tickJoystick(joy, dt) {
  if(!joy.active) return;
  const dx = joy.rawX - joy.ax;
  const dy = joy.rawY - joy.ay;
  const dist = Math.hypot(dx, dy);
  const joyMax = joy.max || JOY_MAX;

  if(dist > joyMax * JOY_DRIFT_THRESHOLD) {
    const nx = dx / dist;
    const ny = dy / dist;
    // Target anchor: position where thumb sits exactly at joyMax from anchor
    const targetAx = joy.rawX - nx * joyMax;
    const targetAy = joy.rawY - ny * joyMax;
    const t = Math.min(1, JOY_DRIFT_SPEED * dt);
    joy.ax += (targetAx - joy.ax) * t;
    joy.ay += (targetAy - joy.ay) * t;
    // Recompute direction from updated anchor
    const ndx = joy.rawX - joy.ax;
    const ndy = joy.rawY - joy.ay;
    joy.mag = Math.hypot(ndx, ndy);
    if(joy.mag > JOY_DEADZONE) {
      joy.dx = ndx / joy.mag;
      joy.dy = ndy / joy.mag;
    } else {
      joy.dx = 0;
      joy.dy = 0;
    }
  }
}

function bindJoystickControls({ canvas, joy, getGameState }) {
  function getDynamicJoyMax() {
    const rect = canvas.getBoundingClientRect();
    const scaleDown = Math.min(1, 390 / Math.max(rect.width, rect.height));
    const cssRadius = Math.max(16, JOY_MAX * scaleDown);
    return cssRadius * (canvas.width / rect.width);
  }

  function canvasPos(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    joy.max = getDynamicJoyMax();
    return {
      x:(clientX - rect.left) * (canvas.width / rect.width),
      y:(clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function joyStart(clientX, clientY) {
    if(getGameState() !== 'playing' && getGameState() !== 'intro') return;
    const point = canvasPos(clientX, clientY);
    joy.active = true;
    joy.ax = point.x;
    joy.ay = point.y;
    joy.rawX = point.x;
    joy.rawY = point.y;
    joy.dx = 0;
    joy.dy = 0;
    joy.mag = 0;
  }

  function joyMove(clientX, clientY) {
    if(!joy.active) return;
    const point = canvasPos(clientX, clientY);
    joy.rawX = point.x;
    joy.rawY = point.y;
    const dx = point.x - joy.ax;
    const dy = point.y - joy.ay;
    joy.mag = Math.hypot(dx, dy);
    if(joy.mag > JOY_DEADZONE){
      joy.dx = dx / joy.mag;
      joy.dy = dy / joy.mag;
    } else {
      joy.dx = 0;
      joy.dy = 0;
    }
  }

  function joyEnd() {
    resetJoystickState(joy);
  }

  document.addEventListener('mousedown', (event) => { joyStart(event.clientX, event.clientY); });
  document.addEventListener('mousemove', (event) => { joyMove(event.clientX, event.clientY); });
  document.addEventListener('mouseup', joyEnd);

  document.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    joyStart(touch.clientX, touch.clientY);
  }, { passive:true });
  document.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    joyMove(touch.clientX, touch.clientY);
  }, { passive:true });
  document.addEventListener('touchend', joyEnd, { passive:true });
  document.addEventListener('touchcancel', joyEnd, { passive:true });
}

export { JOY_DEADZONE, JOY_MAX, createJoystickState, resetJoystickState, bindJoystickControls, tickJoystick };
