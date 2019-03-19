var serial;   // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbserial-DN01DW79';    // fill in your serial port name here
var inData = new Array(4);   // variable to hold the input data from Arduino
var loopVariable = 0;
var finalData;
const Y_AXIS = 2;
var roomTemperature = 0;
var lastX = 0;

function setup() {
	frameRate(10);
	windowWidth = 1165;

	roomTemperature = sessionStorage.getItem("roomTemp");
	//set up communication port
	serial = new p5.SerialPort();       // make a new instance of the serialport library
	serial.on('list', printList);  // set a callback function for the serialport list event
	serial.on('connected', serverConnected); // callback for connecting to the server
	serial.on('open', portOpen);        // callback for the port opening
	serial.on('data', serialEvent);     // callback for when new data arrives
	serial.on('error', serialError);    // callback for errors
	serial.on('close', portClose);      // callback for the port closing
	serial.list();                      // list the serial ports
	serial.open(portName);     
}

function draw() {
	var hash = (window.location.hash);
	finalData = Number.parseFloat(finalData).toFixed(2);
	// finalData = Math.round(finalData);
	
	var currentX = 190 + (50 - finalData)/(50-roomTemperature)*400;
	

	document.getElementById('currentTemp').style.top = currentX + 'px';
	document.getElementById('currentTempLabel').style.top = currentX-25 + 'px';


	if(finalData > 0 && (finalData - roomTemperature < 1.5) && (finalData - roomTemperature > 1)){
		// console.log("here");
		// console.log(currentX);
		lastX = currentX;
	}


	if(finalData > 0 && (finalData - roomTemperature < 1.5)){
		document.getElementById('currentTemp').style.top = lastX + 'px';
		document.getElementById('currentTempLabel').style.top = lastX-25 + 'px';

		document.getElementById('subtitle').innerHTML = 'Perfect!';
		document.getElementById('title').innerHTML = 'Thermometer is ready to investigate the next island!';
		document.getElementById('button').style.display = 'block';
		document.getElementById('button_link').href = 'instructions2.html' + hash;


		// setTimeout(function(){
		// 	window.location.href = "explore.html" + hash
		// }, 5000);
	}

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