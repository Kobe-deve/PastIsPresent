// initialize game 
function onload()
{
	// set up canvas 
	canvas = document.getElementById('gameCanvas');
	canvas.setAttribute("style", "position: absolute; x:0; y:0;");
	canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
	ctx = canvas.getContext("2d");
	
	window.addEventListener("resize",setWindowSize);
	
	// set handlers for inputs
	document.onkeydown = inputHandler;	
	document.onkeyup = inputHandler;	
	document.addEventListener('mousemove', paddleInput);
	
	// set up main loop
	window.requestAnimationFrame(mainLoop);
}

// resizing window 
function setWindowSize()
{
	paddleWidth = 100
	paddleHeight = 100
	y = screen.height*6/8-paddleHeight
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

x = 100
paddleWidth = 100
paddleHeight = 50
y = screen.height*6/8-paddleHeight

function paddleInput(event)
{
	onmousemove = console.log(screen.width + " " + screen.height);
	
	x = event.clientX-paddleWidth/2
	
	if(x > screen.width)
		x = screen.width-paddleWidth
}

function inputHandler(event)
{
				
}

// handles in-game logic 
function logicHandling()
{
	
}

// displaying to the screen 
function draw()
{	
	// clear screen
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.beginPath();
	ctx.rect(x, y, paddleWidth, paddleHeight);
	ctx.stroke();	
}

// main loop 
function mainLoop(){
	// process player movment/ai/etc 
	logicHandling();
	
	// display to screen 
	draw();
	
	// get new frame 
	window.requestAnimationFrame(mainLoop);
}
