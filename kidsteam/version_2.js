var serial;   // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbserial-DN01DW79';    // fill in your serial port name here
var inData = new Array(4);   // variable to hold the input data from Arduino
var loopVariable = 0;
var finalData;

var tempReading = [[21,21.2,21.5],
                  [22,22.5,25.8],
                  [23,24.2,29.9],
                  [30.1,26.5,39]];

var minTemperature = 18;
var maxTemperature = 40;

// var tempReading1Ratio = ;
var tempRange = [0.505, 0.285, 1];

var seed = "Temperature";

var nums; // number of molecules per item
var maxLife = 1000; //defines the range of particles
var noiseScale = 100;
var simulationSpeed = 0.0002; //pixel per second
var fadeFrame = 0;

var padding_top = 0;
var padding_side = 0;

var particles = [];
var particle_count_total = 0 ;
var backgroundColor;
var color_from;
var color_to;


var itemArray = ['Plastic', 'Wood' , 'Steel'];
var numberofItem = itemArray.length;

function setup() {
  //set up canvas
  randomSeed(seed);
  noiseSeed(seed);
  nums = 100; // number of particles for each item

  backgroundColor = color(255, 255, 255);
  color_from = color('red');
  color_to = color('blue');

  createCanvas(windowWidth, windowHeight);
  background(backgroundColor);
  noStroke();
  smooth();

  for(var k=0; k<numberofItem; k++){
    for(var i = 0; i < nums; i++){
      var p = new Particle();
      p.initialX = padding_side+40;
      p.finalX = p.initialX + windowWidth/(numberofItem+1) - 80;

      p.intitalY = (tempReading[0][k]-minTemperature)*(windowHeight/(maxTemperature-minTemperature));

      p.finalY = (tempReading[3][k]-minTemperature)*(windowHeight/(maxTemperature-minTemperature));

      p.item = k;
      p.pos.x = random(p.initialX, p.finalX);
      p.pos.y = tempReading[0][k];
      
      p.modifier = tempRange[k];
      particles[particle_count_total+i] = p;
    }
    particle_count_total = nums*(k+1);
    padding_side = padding_side + windowWidth/(numberofItem+1);
  }

  background(color(255));
  // fill(color(255));

  fill(0, 20);
  rect((windowWidth - (windowWidth/(2*(numberofItem+1))))-100 , 70 , 2, windowHeight);

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
  ++fadeFrame;
  if(fadeFrame % 100 == 0){
    blendMode(DIFFERENCE);
    fill(255, 255, 255);
    rect(0,0,width,height);

    blendMode(DIFFERENCE);
    //blendMode(DARKEST); //looks terrible. stutters
    fill(backgroundColor);
    rect(0,0,width,height);
  }

  blendMode(BLEND);

  for(var i = 0; i < particle_count_total; i++){
    var item = particles[i].item;
    var modifier = tempRange[item];

    var iterations = 3;
    var radius = 2;
    particles[i].life = random(0, maxLife);

    particles[i].move(iterations);
    particles[i].checkEdge();
    
    var alpha = 255;
    
    var particle_heading = particles[i].vel.heading()/PI;
    if(particle_heading < 0){
        particle_heading *= -1;
    }
    var particle_color = lerpColor(particles[i].color1, particles[i].color2, particle_heading);
    
    var fade_ratio = 1; 
    // fade_ratio = min(particles[i].life * 10 / maxLife, 1);
    // fade_ratio = min((maxLife - particles[i].life) * 5 / maxLife, fade_ratio);

    fill(red(particle_color), green(particle_color), blue(particle_color), alpha * fade_ratio);
    particles[i].display(radius);
  }

  
  for(var j=0; j <itemArray.length; j++){
    // print("here");

    fill(255);
    rect(( ( (2*j+1) * windowWidth)/(2*(numberofItem+1)) - 100), 30, 200, 30, 4);
    fill(0);
    var newFinal = Number.parseFloat(finalData).toFixed(2);
    textSize(12);
    textFont("Bree Serif");
    // textAlign(CENTER);
    text("Temperature of " + itemArray[j] + ":"  + newFinal + " °C", ( ( (2*j+1) * windowWidth)/(2*(numberofItem+1)) - 80), 50); 

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
    print(finalData);
  }
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
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