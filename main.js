

window.onload = function() {
	var valueSecond = 0;
	var valueMinute = 0;

	var minutes = 5;
	var increment = parseInt(minutes *60/142);
	var speed = setInterval(animateTime, 100);

	function animateTime() {
		console.log("ere");
		valueSecond = valueSecond+increment;

		if(valueSecond > 60){
			valueSecond = valueSecond-60;
			valueMinute = valueMinute+1;
		}
		if(valueMinute == 5){
			valueSecond = 10;
		}
		var finalSec = addPadding(valueSecond);
		var finalMin = addPadding(valueMinute);
		
		document.getElementById("minute").innerHTML = finalMin;
		document.getElementById("second").innerHTML = finalSec;
		

	  // var d = new Date();
	  // document.getElementById("demo").innerHTML = d.toLocaleTimeString();
	}
	
	function addPadding(n) {
   		return (n < 10) ? ("0" + n) : n;
	}	
	
	

	document.getElementById("button").onclick = function f1() {
		document.getElementById("title").innerHTML = "Measure the temperature <br> of each spoon.";
		document.getElementById("buttonFamily").style.display = "block";
		document.getElementById("button").style.display = "none";

		//validation code to see State field is mandatory.  
	}

	var buttons = document.getElementsByClassName('readingButton');
	var buttonLength = buttons.length;
	console.log(buttonLength);


	for (var i = 0; i < buttonLength; i++) {
	  buttons[i].addEventListener('click', showTimer, false);
	}

	function showTimer(e) {
		console.log("here");
		showtemp = true;
		buttonClicked = this.id;

		document.getElementById("tempValue").style.display = "block";
    	document.getElementById("finalTempValue").style.display = "none";
    	document.getElementById("recordReading").style.display = "none";
		document.getElementById("buttonFamily").style.display = "none";
		document.getElementById("timer").style.display = "block";
		document.getElementById("timerLoader").style.display = "block";

		document.getElementById("largeHeader").style.display = "none";
	}

	document.getElementById("analyzeButton").onclick = function f3() {
		console.log("thsi is it");
		window.location = "index.html";

		//validation code to see State field is mandatory.  
	}

	// window.location = "https://www.example.com";

	

}
