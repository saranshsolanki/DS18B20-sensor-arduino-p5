var serial;   // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbserial-DN01DW79';    // fill in your serial port name here
var inData = new Array(4);   // variable to hold the input data from Arduino
var loopVariable = 0;
var finalData;

var waves = [];
var wavesNum = 4;
var colors = [];


function setup() {
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
  // background(255);
  for (var i = 0; i < wavesNum; i++) {
    waves[i].display();
  }

  // create box behind text
  fill(255);
  rect(20, 30, 175, 30);
  fill(0);
  var newFinal = Number.parseFloat(finalData).toFixed(2);
  textSize(12);
  text("Temperature: " + newFinal + " °C", 30, 50); 
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
  this.Rs = random(0.5, 1);
  this.r = 100;
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


    // // setup values for the particle. vel, simulationSpeed, 
    // var maxTempReading = 0;
    // for(var k=0; k<tempReadingInitial.length;k++){
    //   tempRange[k] = (tempReadingFinal-tempReadingInitial)/(maxTemperature - minTemperature);
    // }

    // for(var k=0; k<tempRange.length;k++){
    //   if(tempRange[k]>maxTempReading){
    //     maxTempReading = tempRange[k]; 
    //   } 
    // }
    // var modifier =  maxTemperature/maxTempReading;

    // for(var k=0; k<tempRange.length;k++){
    //   tempRange[k] = tempRange[k]*modifier;
    // }