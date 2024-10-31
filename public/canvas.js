let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let mousedown = false;

let pencilColors = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let downloadIcon = document.querySelector(".download");

let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penColor = "black";
let eraserColor = "white";
let pencilWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

let tool = canvas.getContext("2d");
tool.strokeStyle = penColor;
tool.lineWidth = pencilWidth;

//undoredo
let undoRedoTracker = [];
let track = -1; //represent all the action
// mousedown ->start path mousemove ->path end
canvas.addEventListener("mousedown", (e) => {
  mousedown = true;
  // beginPath({
  //   x: e.clientX,
  //   y: e.clientY,
  // });
  let data ={
    x: e.clientX,
    y: e.clientY
  }

  socket.emit("beginPath ",data)

   beginPath(data);
});
socket.on("beginPath" ,(data)=>{
  //data from server 
  beginPath(data);
})
canvas.addEventListener("mousemove", (e) => {
  if (mousedown) {
    let data = {
      x: e.clientX,
      y: e.clientY,
      color: eraserFlag ? eraserColor : penColor,
      width: eraserFlag ? eraserWidth : pencilWidth,
    };
    socket.emit("drawStroke", data);
    drawStroke(data);
  }
  //if (mousedown) {
  //   drawStroke({
  //     x: e.clientX,
  //     y: e.clientY,
  //     color: eraserFlag ? eraserColor : penColor,
  //     width: eraserFlag ? eraserWidth : pencilWidth,
  //   });
  // }
});
socket.on("drawStroke" ,(data)=>{
  //data from server 
  drawStroke(data);
})
canvas.addEventListener("mouseup", (e) => {
    mousedown = false;
    saveState(); // Save canvas state after each drawing action
  });
  
  // Function to save the current canvas state
  function saveState() {
    let url = canvas.toDataURL();
    // Remove any states after the current position
    undoRedoTracker = undoRedoTracker.slice(0, track+1);
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1; // Move track to the last saved state

    socket.emit("canvasState", url);
  }
  
  // Undo action
  undo.addEventListener("click", (e) => {
    if (track > 0) {
      track--; // Move back one state
      updateCanvas(); // Update canvas to show the previous state
      socket.emit("undoAction", track);
    }
  });
  
  // Redo action
  redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length - 1) {
      track++; // Move forward one state
      updateCanvas(); // Update canvas to show the next state
      socket.emit("redoAction", track);
    }
  });
  
  // Function to update the canvas to the current track
  function updateCanvas() {
    let url = undoRedoTracker[track];
    let img = new Image();
    img.src = url;
    img.onload = () => {
      tool.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
      tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }
  socket.on("canvasState", (url) => {
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1; // Update the current track
    updateCanvas(); // Update the canvas
  });
//beginPath
function beginPath(strokeObj) {
  tool.beginPath();
  tool.moveTo(strokeObj.x, strokeObj.y);
}
function drawStroke(strokeObj) {
  tool.strokeStyle = strokeObj.color;
  tool.lineWidth = strokeObj.width;
  tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
}
pencilColors.forEach((colorElem) => {
  colorElem.addEventListener("click", (e) => {
    let color = colorElem.classList[0];
    penColor = color;
    tool.strokeStyle = penColor;
  });
});

pencilWidthElem.addEventListener("change", (e) => {
  pencilWidth = pencilWidthElem.value;
  tool.lineWidth = pencilWidth;
});
eraserWidthElem.addEventListener("change", (e) => {
  eraserWidth = eraserWidthElem.value;
  tool.lineWidth = eraserWidth;
  tool.strokeStyle = "white";
});
//inactive eraser afterr clicking
eraserIcon.addEventListener("click", (e) => {
  if (eraserFlag) {
    tool.strokeStyle = eraserColor;
    tool.lineWidth = eraserWidth;
  } else {
    tool.strokeStyle = penColor;
    tool.lineWidth = pencilWidth;
  }
});

downloadIcon.addEventListener("click", (e) => {
  let url = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = url;
  a.download = "board.png";
  a.click();
});




