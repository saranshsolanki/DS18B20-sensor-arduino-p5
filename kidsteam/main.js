

window.onload = function() {
	var valueSecond = 0;
	var valueMinute = 0;

	var minutes = 5;
	var increment = parseInt(minutes *60/142);

	function addPadding(n) {
   		return (n < 10) ? ("0" + n) : n;
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


	if(document.getElementById('buttonArduino') != null){
		var buttonArduino = document.getElementById('buttonArduino');
		buttonArduino.addEventListener('click', loadTimer, false);
	}
	

	function loadTimer() {
		console.log("here2ew");
		document.getElementById("largeHeader").style.display = "none";
		document.getElementById("buttonArduino").style.display = "none";
		document.getElementById("timerLoader").style.display = "block";
		console.log(finalData);

      // function check finalData
      setTimeout(function(){ checkFinalData(finalData) }, 1000); 
  }

}

function checkFinalData(finalData){
	if(finalData<0){
	  	// wait(5000);
	  	console.log("less");
	    document.getElementById("timerLoader").style.display = "none";
	    document.getElementById("largeHeader").innerHTML = "There was an error. <br>Insert the Red Wire inside port 6";
	    document.getElementById("largeHeader").style.display = "block";
	    document.getElementById("buttonArduino").style.display = "block";
	}
	else{
		// wait(3000);
		console.log("more");
		document.getElementById("timerLoader").style.display = "none";
		setTimeout(document.getElementById("checkMark").style.display = "block",5000);
		document.getElementById("buttonSpoon").style.display = "block";
		// setTimeout(window.location = "main.html", 3000);
	}  
}
function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

