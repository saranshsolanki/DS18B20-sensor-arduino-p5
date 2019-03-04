var serial;   // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbserial-DN01DW79';    // fill in your serial port name here
var inData = new Array(4);   // variable to hold the input data from Arduino
var loopVariable = 0;
var finalData;
const Y_AXIS = 2;


var minTemperature = 0;
var maxTemperature = 50;
var currentTemp = 0;
var currentTime = 0;
var tempInc =0;
var maxHeight = 683;
var minHeight = 92;

function setup() {
  frameRate(10);
  var c1 = color(255, 0, 0);
  var c2 = color(0, 0, 255);

  windowWidth = 1180;
  setGradient(0,0,windowWidth,windowHeight,c1,c2,2)

  createCanvas(windowWidth, windowHeight);
  noStroke();
  smooth();
  // background(color(0));
  // fill(color(255))

  currentTemp = 0;
  // timeInc = windowWidth/(5*60*10);
  timeInc = windowWidth/(5*60*10);


  var currentTempOld = 0;

  if(sessionStorage.getItem("steelTemperature") == 'true'){

    while(currentTime < windowWidth){

      var newTempOld = sessionStorage.getItem(currentTime);
      stroke(253,202,64); //stroke color
      strokeWeight(1); //stroke wider
      line(currentTime,  currentTempOld, currentTime+timeInc, newTempOld);

      stroke(253,202,64,30);
      strokeWeight(1);
      line(currentTime,currentTempOld,currentTime+timeInc, maxHeight); 

      currentTempOld = newTempOld;
      currentTime = currentTime + timeInc;
      sessionStorage.setItem("steelTemperature", 'false');    
    }
  }
  
  
  currentTime = 0;




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
 
  finalData = Number.parseFloat(finalData).toFixed(2);

  var newTemp = maxHeight - (finalData - minTemperature)*(maxHeight - minHeight)/(maxTemperature - minTemperature);

  stroke(0,255,0); //stroke color
  strokeWeight(1); //stroke wider
  line(currentTime,  currentTemp, currentTime+timeInc, newTemp);

  var value = windowHeight- newTemp + "px";
  if(document.getElementById('line') != null){
    var dottedLine = document.getElementById('line');
    // console.log((windowHeight- newTemp).isFinite());

    if(isFinite(newTemp) == true){
      // console.log("here");
      dottedLine.x1.baseVal.value = 160;
      dottedLine.y1.baseVal.value = parseFloat( newTemp);
      dottedLine.x2.baseVal.value = 165+currentTime+timeInc;
      dottedLine.y2.baseVal.value = parseFloat(newTemp);
    }
  }


  // draw fill below
  stroke(0,255,0,30);
  strokeWeight(1);
  line(currentTime,currentTemp,currentTime+timeInc, maxHeight); 


  currentTemp = newTemp;
  currentTime = currentTime+timeInc;

  // stop after maxwidth
  if(currentTime>windowWidth){
    window.location.href = "spoon.html";
    sessionStorage.setItem("steelTemperature", "true");
  }
  else{
    sessionStorage.setItem(currentTime, currentTemp);
    numberOfReading++;
  }
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

function Particle(){
  // member properties and initialization
  this.vel = createVector(0, 0);
  this.pos = createVector(random(0, width), random(0, height));
  this.life = random(0, (maxLife*this.modifier));
  this.flip = int(random(0,2)) * 2 - 1;
  // this.color1 = this.color2 = color('blue');

  this.color1 = color_from;
  this.color2 = color_to;

  this.initialX = 0;
  this.finalX = 0;
  this.item = 0;
  this.modifier = 0;
  this.intitalY = 0;
  this.finalY = 0;
  // if(int(random(3)) == 1){
  //   //this.color1 = color('palegreen');
  //   //this.color2 = color('cyan');
  //   this.color1 = color_from;
  //   this.color2 = color_to;
  // }
  
  // member functions
  this.move = function(iterations){
    if((this.life -= 0.01666) < 0)
      this.respawnTop();
    while(iterations > 0){
      
      var transition = map(this.pos.x, this.initialX, this.finalX, 0, 1);
      var angle = noise(this.pos.x/noiseScale, this.pos.y/noiseScale)*transition*TWO_PI*noiseScale;
      //var transition = map(this.pos.y, height/5, height-padding_top, 0, 1, true);
      //var angle = HALF_PI;
      //angle += (noise(this.pos.x/noiseScale, this.pos.y/noiseScale)-0.5)*transition*TWO_PI*noiseScale/66;

      this.vel.x = cos(angle);
      this.vel.y = sin(angle);
      this.vel.mult(simulationSpeed*(tempReading[3][this.item] - tempReading[0][this.item])*windowHeight/100);
      this.pos.add((this.vel));
      --iterations;
    }
  }

  this.checkEdge = function(){
    if(this.pos.x > this.finalX
    || this.pos.x < this.initialX
    || this.pos.y > this.finalY
    || this.pos.y < this.intitalY){
      this.respawnTop();
    }
  }
  
  this.respawn = function(){
    this.pos.x = random(0, width);
    this.pos.y = random(0, height);
    this.life = maxLife;
  }
  
  this.respawnTop = function() {
    this.pos.x = random(this.initialX, this.finalX);
    this.pos.y = this.intitalY;
    this.life = maxLife;
    //this.color1 = lerpColor(color('white'), color_from, (this.pos.x-padding_side)/inner_square);
    //this.color2 = lerpColor(color('white'), color_to, (this.pos.x-padding_side)/inner_square);
  }

  this.display = function(r){
    ellipse(this.pos.x, this.pos.y, r, r);
  }
}