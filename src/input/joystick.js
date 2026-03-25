const JOY_DEADZONE = 3;
const JOY_MAX = 40;

function createJoystickState() {
  return { active:false, ax:0, ay:0, dx:0, dy:0, mag:0 };
}

function resetJoystickState(joy) {
  joy.active = false;
  joy.ax = 0;
  joy.ay = 0;
  joy.dx = 0;
  joy.dy = 0;
  joy.mag = 0;
}

function bindJoystickControls({ canvas, joy, getGameState }) {
  function canvasPos(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x:(clientX - rect.left) * (canvas.width / rect.width),
      y:(clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function joyStart(clientX, clientY) {
    if(getGameState() !== 'playing') return;
    const point = canvasPos(clientX, clientY);
    joy.active = true;
    joy.ax = point.x;
    joy.ay = point.y;
    joy.dx = 0;
    joy.dy = 0;
    joy.mag = 0;
  }

  function joyMove(clientX, clientY) {
    if(!joy.active) return;
    const point = canvasPos(clientX, clientY);
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

export { JOY_DEADZONE, JOY_MAX, createJoystickState, resetJoystickState, bindJoystickControls };
