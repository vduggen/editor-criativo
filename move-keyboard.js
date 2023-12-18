document.addEventListener("DOMContentLoaded", function () {
  const STEP = 10;

  var Direction = {
    LEFT: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
  };

  function eventCallback(options) {
    var key = options.which || options.keyCode; // key detection
    if (key === 37) {
      // handle Left key
      moveSelected(Direction.LEFT);
    } else if (key === 38) {
      // handle Up key
      moveSelected(Direction.UP);
    } else if (key === 39) {
      // handle Right key
      moveSelected(Direction.RIGHT);
    } else if (key === 40) {
      // handle Down key
      moveSelected(Direction.DOWN);
    }
  }

  document.body.addEventListener("keypress", eventCallback);
  document.body.addEventListener("keydown", eventCallback);

  function moveSelected(direction) {
    var activeObject = window._canvas.getActiveObject();
    var activeGroup = window._canvas.getActiveObjects();
    if (activeObject) {
      switch (direction) {
        case Direction.LEFT:
          activeObject.left = activeObject.left - STEP;
          break;
        case Direction.UP:
          activeObject.top = activeObject.top - STEP;
          break;
        case Direction.RIGHT:
          activeObject.left = activeObject.left + STEP;
          break;
        case Direction.DOWN:
          activeObject.top = activeObject.top + STEP;
          break;
      }
      activeObject.setCoords();
      window._canvas.renderAll();
    } else if (activeGroup.length > 0) {
      switch (direction) {
        case Direction.LEFT:
          activeGroup.left = activeGroup.left - STEP;
          break;
        case Direction.UP:
          activeGroup.top = activeGroup.top - STEP;
          break;
        case Direction.RIGHT:
          activeGroup.left = activeGroup.left + STEP;
          break;
        case Direction.DOWN:
          activeGroup.top = activeGroup.top + STEP;
          break;
      }
      activeGroup.setCoords();
      window._canvas.renderAll();
    } else {
      console.log("no object selected");
    }
  }
});
