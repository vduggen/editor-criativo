/**
 * fabric.js template
 * This templates uses the latest dev verison of fabric.js.
 * Visit the Resources tab to change it to something in the form of:
 * "https://cdn.jsdelivr.net/gh/{github_user}/fabric.js@v{branch_name}/dist/fabric.js"
 * Make sure the file you point to is up to date.
 */


initAligningGuidelines();
/**
 *
 * Draw smart guides
 */
const aligningLineOffset = 5;
const aligningLineMargin = 4;
const aligningLineWidth = 1;
const aligningLineColor = "rgb(255,0,0)";
const aligningDash = [5, 5];

function initAligningGuidelines() {
  let ctx = window._canvas.getSelectionContext();
  let viewportTransform;
  let zoom = 1;
  let verticalLines = [];
  let horizontalLines = [];

  window._canvas.on("mouse:down", function () {
    viewportTransform = window._canvas.viewportTransform;
    zoom = window._canvas.getZoom();
  });

  function resize(e) {
    if (!window._canvas._currentTransform) return;
    let activeObject = e.target;
    let activeObjectCenter = activeObject.getCenterPoint();
    let activeObjectBoundingRect = activeObject.getBoundingRect();
    let activeObjectHalfHeight =
      activeObjectBoundingRect.height / (2 * viewportTransform[3]);
    let activeObjectHalfWidth =
      activeObjectBoundingRect.width / (2 * viewportTransform[0]);

    window._canvas
      .getObjects()
      .filter((object) => object !== activeObject && object.visible)
      .forEach((object) => {
        let objectCenter = object.getCenterPoint();
        let objectBoundingRect = object.getBoundingRect();
        let objectHalfHeight =
          objectBoundingRect.height / (2 * viewportTransform[3]);
        let objectHalfWidth =
          objectBoundingRect.width / (2 * viewportTransform[0]);

        // snap by the horizontal center line
        snapVertical(objectCenter.x, activeObjectCenter.x, objectCenter.x);
        // snap by the left object edge matching left active edge
        snapVertical(
          objectCenter.x - objectHalfWidth,
          activeObjectCenter.x - activeObjectHalfWidth,
          objectCenter.x - objectHalfWidth + activeObjectHalfWidth
        );
        // snap by the left object edge matching right active edge
        snapVertical(
          objectCenter.x - objectHalfWidth,
          activeObjectCenter.x + activeObjectHalfWidth,
          objectCenter.x - objectHalfWidth - activeObjectHalfWidth
        );
        // snap by the right object edge matching right active edge
        snapVertical(
          objectCenter.x + objectHalfWidth,
          activeObjectCenter.x + activeObjectHalfWidth,
          objectCenter.x + objectHalfWidth - activeObjectHalfWidth
        );
        // snap by the right object edge matching left active edge
        snapVertical(
          objectCenter.x + objectHalfWidth,
          activeObjectCenter.x - activeObjectHalfWidth,
          objectCenter.x + objectHalfWidth + activeObjectHalfWidth
        );

        function snapVertical(objEdge, activeEdge, snapCenter) {
          if (isInRange(objEdge, activeEdge)) {
            verticalLines.push({
              x: objEdge,
              y1:
                objectCenter.y < activeObjectCenter.y
                  ? objectCenter.y - objectHalfHeight - aligningLineOffset
                  : objectCenter.y + objectHalfHeight + aligningLineOffset,
              y2:
                activeObjectCenter.y > objectCenter.y
                  ? activeObjectCenter.y +
                    activeObjectHalfHeight +
                    aligningLineOffset
                  : activeObjectCenter.y -
                    activeObjectHalfHeight -
                    aligningLineOffset,
            });
            activeObject.setPositionByOrigin(
              new fabric.Point(snapCenter, activeObjectCenter.y),
              "center",
              "center"
            );
          }
        }

        // snap by the vertical center line
        snapHorizontal(objectCenter.y, activeObjectCenter.y, objectCenter.y);
        // snap by the top object edge matching the top active edge
        snapHorizontal(
          objectCenter.y - objectHalfHeight,
          activeObjectCenter.y - activeObjectHalfHeight,
          objectCenter.y - objectHalfHeight + activeObjectHalfHeight
        );
        // snap by the top object edge matching the bottom active edge
        snapHorizontal(
          objectCenter.y - objectHalfHeight,
          activeObjectCenter.y + activeObjectHalfHeight,
          objectCenter.y - objectHalfHeight - activeObjectHalfHeight
        );
        // snap by the bottom object edge matching the bottom active edge
        snapHorizontal(
          objectCenter.y + objectHalfHeight,
          activeObjectCenter.y + activeObjectHalfHeight,
          objectCenter.y + objectHalfHeight - activeObjectHalfHeight
        );
        // snap by the bottom object edge matching the top active edge
        snapHorizontal(
          objectCenter.y + objectHalfHeight,
          activeObjectCenter.y - activeObjectHalfHeight,
          objectCenter.y + objectHalfHeight + activeObjectHalfHeight
        );

        function snapHorizontal(objEdge, activeObjEdge, snapCenter) {
          if (isInRange(objEdge, activeObjEdge)) {
            horizontalLines.push({
              y: objEdge,
              x1:
                objectCenter.x < activeObjectCenter.x
                  ? objectCenter.x - objectHalfWidth - aligningLineOffset
                  : objectCenter.x + objectHalfWidth + aligningLineOffset,
              x2:
                activeObjectCenter.x > objectCenter.x
                  ? activeObjectCenter.x +
                    activeObjectHalfWidth +
                    aligningLineOffset
                  : activeObjectCenter.x -
                    activeObjectHalfWidth -
                    aligningLineOffset,
            });
            activeObject.setPositionByOrigin(
              new fabric.Point(activeObjectCenter.x, snapCenter),
              "center",
              "center"
            );
          }
        }
      });
  }

  window._canvas.on('object:scaling', function (e) {
    resize(e);
  });

  window._canvas.on("object:moving", function (e) {
    resize(e);
    console.log('oi');
  });

  window._canvas.on("before:render", () => {
    window._canvas.clearContext(window._canvas.contextTop);
  });

  window._canvas.on("after:render", function () {
    verticalLines.forEach((line) => drawVerticalLine(line));
    horizontalLines.forEach((line) => drawHorizontalLine(line));

    verticalLines = [];
    horizontalLines = [];
  });

  window._canvas.on("mouse:up", function () {
    window._canvas.renderAll();
  });

  function drawVerticalLine(coords) {
    drawLine(
      coords.x + 0.5,
      coords.y1 > coords.y2 ? coords.y2 : coords.y1,
      coords.x + 0.5,
      coords.y2 > coords.y1 ? coords.y2 : coords.y1
    );
  }

  function drawHorizontalLine(coords) {
    drawLine(
      coords.x1 > coords.x2 ? coords.x2 : coords.x1,
      coords.y + 0.5,
      coords.x2 > coords.x1 ? coords.x2 : coords.x1,
      coords.y + 0.5
    );
  }

  function drawLine(x1, y1, x2, y2) {
    ctx.save();
    ctx.lineWidth = aligningLineWidth;
    ctx.strokeStyle = aligningLineColor;
    ctx.setLineDash(aligningDash);
    ctx.beginPath();
    ctx.moveTo(
      x1 * zoom + viewportTransform[4],
      y1 * zoom + viewportTransform[5]
    );
    ctx.lineTo(
      x2 * zoom + viewportTransform[4],
      y2 * zoom + viewportTransform[5]
    );
    ctx.stroke();
    ctx.restore();
  }
  /**
   * return true if value2 is within value1 +/- aligningLineMargin
   * @param {number} value1
   * @param {number} value2
   * @returns Boolean
   */
  function isInRange(value1, value2) {
    return (
      value2 > value1 - aligningLineMargin &&
      value2 < value1 + aligningLineMargin
    );
  }
}
