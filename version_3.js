/*
References for these codes:
https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
*/

var serial;   // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbserial-DN01DW79';    // fill in your serial port name here
var inData = new Array(4);   // variable to hold the input data from Arduino
var loopVariable = 0;
var finalData;

var minWidth = 600;   //set min width and height for canvas
var minHeight = 400;
var width, height;    // actual width and height for the sketch

function setup() {
  // set the canvas to match the window size
  // if (window.innerWidth > minWidth){
  //   width = window.innerWidth;
  // } else {
  //   width = minWidth;
  // }
  // if (window.innerHeight > minHeight) {
  //   height = window.innerHeight;
  // } else {
  //   height = minHeight;
  // }


  //set up canvas
  createCanvas(windowWidth, windowHeight);
  background(255);
  noStroke();


  // setup wave params
  for (var i = 0; i < wavesNum; i++) {
    waves.push(new Wave(i));
  }
  var alpha = 5;
  colors[0] = color(160,0,95, alpha);
  colors[1] = color(73,0,182, alpha);
  colors[2] = color(243,213,79, alpha);
  colors[3] = color(156,64,152, alpha);


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
  // set background to black
  // background(0);
  for (var i = 0; i < wavesNum; i++) {
    waves[i].display();
  }

  // drawing the left side to visualize my LED light
  var leftBrightness = map(finalData, 0, 255, 0, 255);   // map input to the correct range of brightness
  fill(leftBrightness);   // transfer the brightness to brightness of the color used for drawing
  rect(0,0,width/2,height);   // left half

  // draw the text - left
  var textLColor = map(leftBrightness, 0, 255, 255,0);  // inverse the color for drawing the text on background
  fill(textLColor);
  textSize(16);
  text("THE OTHER SIDE", 30, 30);
  textSize(12);
  text("BRIGHTNESS LEVEL: " + finalData, 30, 50);    // displaying the input

  // right side setup, using a variable for Part 3 purpose, currently it does not change
  var rightBrightness = 0;
  fill(rightBrightness);
  rect(width/2,0,width/2,height);

  // draw the text - right
  var textRColor = map(rightBrightness, 0, 255, 255,0);
  fill(textRColor);
  textSize(16);
  text("ME", width - 70, 30);
  textSize(12);
  text("BRIGHTNESS LEVEL: " + rightBrightness, width - 170, 50);

  // draw the separator between frames
  fill(255);
  rect(width/2 - 0.5, 0, 1, height);
}

// Following functions print the serial communication status to the console for debugging purposes

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
    print(finalData);
  }
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}

function Wave(tmpIndex) {
  // setting up the parameters
  this.index = tmpIndex;
  this.x = width / 2;
  this.y = height / 2;
  this.R = 0;
  this.Rs = random(0.5, 3);
  this.r = 5;
  this.rn = 0.0;
  this.rns = random(0.1, 0.5);
  this.t = 0;
  this.tn = 0.0;
  this.tns = random(0.001, 0.005);
  this.tr = random(0.00, 360.00);
  this.c = this.index % 4;
  this.Rmax = random(100, width);

  // plotting the lines
  this.display = function() {
    this.t = map(noise(this.tn + this.index), 0, 1, 0, 360);
    this.tn += this.tns;
    this.r = 15 * noise(this.rn + this.index);
    this.rn += this.rns;

    this.x = this.R * cos(radians(this.t)) + width;
    this.y = this.R * sin(radians(this.t)) + height / 2;

    fill(colors[this.c]);
    ellipse(this.x, this.y, this.r, this.r);

    this.R += this.Rs;

    if (this.R > this.Rmax) {
      this.R = 0;
      // give the distance parameter here [2nd param]
      this.Rmax = random(50, width/4);
    }
  }
}
