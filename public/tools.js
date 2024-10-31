let toolCont = document.querySelector(".tool-cont");
let optionCont = document.querySelector(".option-cont");
//for pencil-tool-cont
let pencilToolCont = document.querySelector(".pencil-tool-cont");
//for eraser tool cont
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencilIcon = document.querySelector(".pencil");
let eraserIcon = document.querySelector(".eraser");
let stickyIcon = document.querySelector(".sticky");

let upload = document.querySelector(".upload");

//flags for toggle
let optionFlag = true;
let pencilFlag = false;
let eraserFlag = false;
//eventListener in option button
optionCont.addEventListener("click", (e) => {
  optionFlag = !optionFlag;
  if (optionFlag) {
    openTools();
  } else {
    closeTools();
  }
});
//pencil ICON
pencilIcon.addEventListener("click", (e) => {
  //true = shows pencil tool||false->pencil hide

  pencilFlag = !pencilFlag;
  if (pencilFlag) {
    pencilToolCont.style.display = "block";
  } else {
    pencilToolCont.style.display = "none";
  }
});
//eraserICON
eraserIcon.addEventListener("click", (e) => {
  //true = shows pencil tool||false->pencil hide
console.log("hello")
  eraserFlag = !eraserFlag;
  if (eraserFlag) {
    eraserToolCont.style.display = "block";
  } else {
    eraserToolCont.style.display = "none";
  }
});
//upload
upload.addEventListener('click' , (e)=>{
  let input = document.createElement("input");
  let url
  input.setAttribute('type' , 'file')
  input.click();
  input.addEventListener("change" ,(e)=>{
   let file = input.files[0];
 
   url = URL.createObjectURL(file); 
   console.log(url)
   let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");

    stickyCont.innerHTML=`
        <div class="header-cont">
          <div class="image-icont-upload">
                 <i class="fa-solid fa-image"></i>
            </div>       
            <div class="minimize">
                <i class="fa-solid fa-minus"></i>
            </div>
            <div class="remove">
                <i class="fa-solid fa-x"></i>
            </div>
        </div>
          <div class="note-cont">
           <img class="upload-img" src="${url}"/>
          </div>
    `;
    document.body.appendChild(stickyCont);   
    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    noteActions(minimize, remove, stickyCont);
    stickyCont.onmousedown = function (event) {
      dragAndDrop(stickyCont, event);
  };

  stickyCont.ondragstart = function () {
      return false;
  }; 
  })
  
  

});

//sticky note
stickyIcon.addEventListener("click" ,(e)=>{
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");

    stickyCont.innerHTML=`
        <div class="header-cont">
            <div class="minimize">
                <i class="fa-solid fa-minus"></i>
            </div>
            <div class="remove">
                <i class="fa-solid fa-x"></i>
            </div>
        </div>
          <div class="note-cont">
            <textarea ></textarea>
          </div>
    `;
    document.body.appendChild(stickyCont);   
    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    noteActions(minimize, remove, stickyCont);
    stickyCont.onmousedown = function (event) {
      dragAndDrop(stickyCont, event);
  };

  stickyCont.ondragstart = function () {
      return false;
  }; 
})

function openTools() {
  let iconElem = optionCont.children[0];
  iconElem.classList.remove("fa-x");
  iconElem.classList.add("fa-bars");
  toolCont.style.display = "flex";
  //pencilToolCont.style.
}
function closeTools() {
  let iconElem = optionCont.children[0];
  iconElem.classList.remove("fa-bars");
  iconElem.classList.add("fa-x");
  toolCont.style.display = "none";
  pencilToolCont.style.display = "none";
  eraserToolCont.style.display = "none";
}

function noteActions(minimize, remove, stickyCont) {
  remove.addEventListener("click", (e) => {
      stickyCont.remove();
  })
  minimize.addEventListener("click", (e) => {
      let noteCont = stickyCont.querySelector(".note-cont");
      let display = getComputedStyle(noteCont).getPropertyValue("display");
      if (display === "none") noteCont.style.display = "block";
      else noteCont.style.display = "none";
  })
}

function dragAndDrop(element, event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = 'absolute';
  element.style.zIndex = 1000;

  moveAt(event.pageX, event.pageY);

  // moves the ball at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
      element.style.left = pageX - shiftX + 'px';
      element.style.top = pageY - shiftY + 'px';
  }

  function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
  }

  // move the ball on mousemove
  document.addEventListener('mousemove', onMouseMove);

  // drop the ball, remove unneeded handlers
  element.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
      element.onmouseup = null;
  };
}