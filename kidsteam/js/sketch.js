var serial;   // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbserial-DN01DW79';    // fill in your serial port name here
var inData = new Array(4);   // variable to hold the input data from Arduino
var loopVariable = 0;
var finalData;
const Y_AXIS = 2;


var minTemperature = 10;
var maxTemperature = 50;
var currentTemp = 0;
var currentTime = 0;
var tempInc =0;
var maxHeight = 683;
var minHeight = 200;
var windowHeight = 200;
var timeIsHalf = false;


function setup() {
  frameRate(10);
  var c1 = color(255, 0, 0);
  var c2 = color(0, 0, 255);

  windowWidth = 1165;
  setGradient(0,0,windowWidth,windowHeight,c1,c2,2)
  createCanvas(windowWidth, windowHeight);
  noStroke();
  smooth();


  currentTemp = 655;
  // timeInc = windowWidth/(5*60*10);
  timeInc = windowWidth/(2*6*10);
  currentTime = 2*timeInc;

  var currentTempOld = 655;

  if(sessionStorage.getItem("steelTemperature") == 'true'){
    
    while(currentTime < windowWidth){

     var newTempOld = sessionStorage.getItem("steel:"+currentTime);
     
      stroke(0,204,255); //stroke color
      strokeWeight(4); //stroke wider
      line(currentTime,  currentTempOld, currentTime+timeInc, newTempOld);

      stroke(0,204,255,30);
      strokeWeight(1);
      line(currentTime,currentTempOld,currentTime+timeInc, maxHeight); 

      currentTempOld = newTempOld;
      currentTime = currentTime + timeInc;
      // sessionStorage.setItem("steelTemperature", 'false');    
    }
    currentTime = 2*timeInc;
  }
  
  if(sessionStorage.getItem("plasticTemperature") == 'true'){
    

    while(currentTime < windowWidth){

      var newTempOld = sessionStorage.getItem("plastic:"+currentTime);
      
      stroke(186,217,68); //stroke color
      strokeWeight(4); //stroke wider
      line(currentTime,  currentTempOld, currentTime+timeInc, newTempOld);

      stroke(186,217,68,30);
      strokeWeight(4);
      line(currentTime,currentTempOld,currentTime+timeInc, maxHeight); 

      currentTempOld = newTempOld;
      currentTime = currentTime + timeInc;
      // sessionStorage.setItem("plasticTemperature", 'false');    
    }
    currentTime = 2*timeInc;
  }

  if(sessionStorage.getItem("woodTemperature") == 'true'){
    
    while(currentTime < windowWidth){

      // hashItem+":"+currentTime
      var newTempOld = sessionStorage.getItem("wood:"+currentTime);
      

      stroke(249,105,73); //stroke color
      strokeWeight(4); //stroke wider
      line(currentTime, currentTempOld, currentTime+timeInc, newTempOld);

      stroke(249,105,73,30);
      strokeWeight(4);
      line(currentTime,currentTempOld,currentTime+timeInc, maxHeight); 

      currentTempOld = newTempOld;
      currentTime = currentTime + timeInc;
      // sessionStorage.setItem("woodTemperature", 'false'
    }
    currentTime = 2*timeInc;
  }

  currentTime = 2*timeInc;

  //set up communication port
  serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial.on('list', printList);  // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing
  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port
}

function draw() {
  // background(255);
  // console.log("tempVal1");
  // console.log(tempVal1);
  

}

function drawScale(){
  fill(0);
  rect((windowWidth - (windowWidth/(2*(numberofItem+1)))) , 0 , 2,windowHeight);
}




function printList(portList) {
 // portList is an array of serial port names
 for (var i = 0; i < portList.length; i++) {
 // Display the list the console:
 print(i + " " + portList[i]);
 }
}

function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial  opened.')
}

function serialEvent() {
  inData[3-loopVariable] = Number(serial.read());
  loopVariable = loopVariable + 1;

  if(loopVariable>3){
    loopVariable = 0;

    var buffer = new ArrayBuffer(4);
    var view = new DataView(buffer);

    inData.forEach(function (b, i) {
        view.setUint8(i, b);
    });
    finalData = view.getFloat32(0);
  }
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

