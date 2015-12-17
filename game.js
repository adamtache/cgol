$(document).ready(function(){

	var canvas = document.getElementById("myGame");
	var context = canvas.getContext("2d");
	var arr = [];
	makeGrid();
	randomizeInitial(false);
	var interval;
	var speed = 50;
	var progress = false;

	canvas.addEventListener("mousedown", function(evt){
		var rect = canvas.getBoundingClientRect();
		var x = Math.round(Math.floor(evt.clientX - rect.left)/10)*10;
		var y = Math.round(Math.floor(evt.clientY - rect.top)/10)*10;
		x = x/10-1;
		y = y/10-1;
		var val = arr[x][y];
		if(val==0){
			arr[x][y] = 1;
			context.fillStyle = "black";
			context.fillRect(x*10+1, y*10+1, 9, 9);
		}
		else{
			arr[x][y] = 0;
			context.fillStyle = "white";
			context.fillRect(x*10+1, y*10+1, 9, 9);
		}
	}, false);

	function makeGrid(){
		context.save();
		var gradient = context.createLinearGradient(0,0,canvas.height,0);
		gradient.addColorStop("0", "magenta");
		gradient.addColorStop("0.75", "blue");
		gradient.addColorStop("1.0", "red");
		context.strokeStyle = gradient;
		context.lineWidth = 0.5;
		context.strokeRect(10,10,canvas.height,canvas.height);
		for(var x=0; x<canvas.height; x+=10){
			context.beginPath();
			context.moveTo(0, x);
			context.lineTo(canvas.width, x);
			context.closePath();
			context.stroke();
		}
		for(var i=0; i<canvas.width; i+=10){
			context.beginPath();
			context.moveTo(i, 0);
			context.lineTo(i, canvas.height);
			context.closePath();
			context.stroke();
		}
		context.restore();
	}
	function randomizeInitial(reset){
		var d = canvas.height/10;
		for(var x=0; x<d; x++){
			arr.push([]);
			arr[x].push(new Array(d));
			for(var y=0; y<d; y++){
				arr[x][y] = 0;
			}
		}
		if(reset==false)
			randomize();
	};

	function randomize(){
		var d = canvas.height/10;
		for(var x=0; x<d; x++){
			for(var y=0; y<d; y++){
				arr[x][y] = Math.floor(Math.random()*2);
				if(arr[x][y]==0){
					context.fillStyle = "white";
					context.fillRect(x*10+1, y*10+1, 9, 9);
				}
				else{
					context.fillStyle = "black";
					context.fillRect(x*10+1, y*10+1, 9, 9);
				}
			}
		}
	}

	function play(){
		var xLive = [];
		var yLive = [];
		var xDead = [];
		var yDead = [];
		for(var x=0; x<arr.length; x++){
			for(var y=0; y<arr[x].length; y++){
				var neighbors = numNeighbors(x, y);
				if(arr[x][y]==1 && (neighbors<2 || neighbors>3)){
					xDead.push(x);
					yDead.push(y);
				}
				if(arr[x][y]==1 && (neighbors==2 || neighbors==3)){
					xLive.push(x);
					yLive.push(y);
				}
				else if(arr[x][y]==0 && (neighbors==3)){
					xLive.push(x);
					yLive.push(y);
				}
			}
		}
		updateCells(xLive, yLive, xDead, yDead);
	}

	function updateCells(xLive, yLive, xDead, yDead){
		for(var x=0; x<xLive.length; x++){
			arr[xLive[x]][yLive[x]] = 1;
			context.fillStyle = "black";
			context.fillRect(xLive[x]*10+1, yLive[x]*10+1, 9, 9);
		}
		for(var y=0; y<xDead.length; y++){
			arr[xDead[y]][yDead[y]] = 0;
			context.fillStyle = "white";
			context.fillRect(xDead[y]*10+1, yDead[y]*10+1, 9, 9);
		}
	}

	function numNeighbors(x, y){
		var total = 0;
		for(var i=-1; i<2; i++){
			var r = x+i;
			for(var j=-1; j<2; j++){
				var c = y+j;
				var b1 = (r==x);
				var b2 = (c==y);
				if((r>=0&&c>=0)){
					if(c<arr.length&&r<arr[x].length){
						if(b1==false||b2==false){
							var val = arr[r][c];
							if(val==1)
								total++;
						}
					}
				}
			}
		}
		return total;
	}

	function setConditions(){
		var currHeight = canvas.height;
		var currWidth = canvas.width;
		var $height=document.getElementById('amount').value;
		var $speed=document.getElementById("amount2").value;
		if($height!=currHeight){
			draw();
		}
		if($speed!=speed){
			speed = $speed;
		}
		function draw(){
			context.clearRect(0,0,canvas.height,canvas.height);
			canvas.height = $height*10;
			canvas.width = $height*10;
			makeGrid();
			randomizeInitial(false);
		}
	}

	$("#Play").click(function(){
		if(progress==false){
			interval = setInterval(function(){ play(); }, speed);
			progress = true;
		}
	});
	$("#Step").click(function(){
		play();
	});
	$("#SetConditions").click(function(){
		setConditions();
	});
	$("#Random").click(function(){
		randomize();
	});
	$("#Stop").click(function(){
		clearInterval(interval);
		progress = false;
	});
	$("#Reset").click(function(){
		randomizeInitial(true);
		var d = canvas.height/10;
		for(var x=0; x<d; x++){
			for(var y=0; y<d; y++){
				context.fillStyle = "white";
				context.fillRect(x*10+1, y*10+1, 9, 9);
			}
		}
	});

});