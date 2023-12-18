function getCanvasObj() {
  let _config = {
    canvasState: [],
    currentStateIndex: -1,
    undoStatus: false,
    redoStatus: false,
    undoFinishedStatus: 1,
    redoFinishedStatus: 1,
    undoButton: document.getElementById("undo"),
    redoButton: document.getElementById("redo"),
  };
  window._canvas.on("object:modified", function () {
    updateCanvasState();
  });

  window._canvas.on("object:added", function () {
    updateCanvasState();
  });

  let updateCanvasState = function () {
    if (_config.undoStatus == false && _config.redoStatus == false) {
      let jsonData = window._canvas.toJSON();
      let canvasAsJson = JSON.stringify(jsonData);
      if (_config.currentStateIndex < _config.canvasState.length - 1) {
        let indexToBeInserted = _config.currentStateIndex + 1;
        _config.canvasState[indexToBeInserted] = canvasAsJson;
        let numberOfElementsToRetain = indexToBeInserted + 1;
        _config.canvasState = _config.canvasState.splice(
          0,
          numberOfElementsToRetain
        );
      } else {
        _config.canvasState.push(canvasAsJson);
      }
      _config.currentStateIndex = _config.canvasState.length - 1;
      if (
        _config.currentStateIndex == _config.canvasState.length - 1 &&
        _config.currentStateIndex != -1
      ) {
        _config.redoButton.disabled = "disabled";
      }
    }
  };

  let undo = function () {
    if (_config.undoFinishedStatus) {
      if (_config.currentStateIndex == -1) {
        _config.undoStatus = false;
      } else {
        if (_config.canvasState.length >= 1) {
          _config.undoFinishedStatus = 0;
          if (_config.currentStateIndex != 0) {
            _config.undoStatus = true;
            window._canvas.loadFromJSON(
              _config.canvasState[_config.currentStateIndex - 1],
              function () {
                let jsonData = JSON.parse(
                  _config.canvasState[_config.currentStateIndex - 1]
                );
                window._canvas.renderAll();
                _config.undoStatus = false;
                _config.currentStateIndex -= 1;
                _config.undoButton.removeAttribute("disabled");
                if (
                  _config.currentStateIndex !==
                  _config.canvasState.length - 1
                ) {
                  _config.redoButton.removeAttribute("disabled");
                }
                _config.undoFinishedStatus = 1;
              }
            );
          } else if (_config.currentStateIndex == 0) {
            window._canvas.clear();
            _config.undoFinishedStatus = 1;
            _config.undoButton.disabled = "disabled";
            _config.redoButton.removeAttribute("disabled");
            _config.currentStateIndex -= 1;
          }
        }
      }
    }
  };

  let redo = function () {
    if (_config.redoFinishedStatus) {
      if (
        _config.currentStateIndex == _config.canvasState.length - 1 &&
        _config.currentStateIndex != -1
      ) {
        _config.redoButton.disabled = "disabled";
      } else {
        if (
          _config.canvasState.length > _config.currentStateIndex &&
          _config.canvasState.length != 0
        ) {
          _config.redoFinishedStatus = 0;
          _config.redoStatus = true;
          window._canvas.loadFromJSON(
            _config.canvasState[_config.currentStateIndex + 1],
            function () {
              let jsonData = JSON.parse(
                _config.canvasState[_config.currentStateIndex + 1]
              );
              window._canvas.renderAll();
              _config.redoStatus = false;
              _config.currentStateIndex += 1;
              if (_config.currentStateIndex != -1) {
                _config.undoButton.removeAttribute("disabled");
              }
              _config.redoFinishedStatus = 1;
              if (
                _config.currentStateIndex == _config.canvasState.length - 1 &&
                _config.currentStateIndex != -1
              ) {
                _config.redoButton.disabled = "disabled";
              }
            }
          );
        }
      }
    }
  };

  return {
    undoButton: _config.undoButton,
    redoButton: _config.redoButton,
    undo: undo,
    redo: redo,
  };
}

function startUndoRedo() {
  const canvasDemo = getCanvasObj();
  canvasDemo.undoButton.addEventListener("click", function () {
    canvasDemo.undo();
  });
  canvasDemo.redoButton.addEventListener("click", function () {
    canvasDemo.redo();
  });
  document.addEventListener("keyup", ({ keyCode, ctrlKey } = event) => {
    // Check Ctrl key is pressed.
    if (!ctrlKey) {
      return;
    }
    // Check pressed button is Z - Ctrl+Z.
    if (keyCode === 90) {
      canvasDemo.undo();
    }
    // Check pressed button is Y - Ctrl+Y.
    if (keyCode === 89) {
      canvasDemo.redo();
    }
  });
}
