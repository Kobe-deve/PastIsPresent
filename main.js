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
	//document.addEventListener('mousemove', paddleInput);
	//document.addEventListener('mouseover', paddleInput);
	
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
paddleVelocity = 0

mouseX = 0
mouseY = 0

ballX = 10
ballY = 10
ballRadius = 5
ballVelocityX = 10
ballVelocityY = 10

// mouse input for paddle
function paddleInput(event)
{
	mouseX = event.clientX
	mouseY = event.clientY
}

function inputHandler(event)
{
	if(event.type == 'keydown') 
	{		
		switch (event.key) 
		{
			case "ArrowLeft":
			paddleVelocity = -5
			break;
			case "ArrowRight":
			paddleVelocity = 5
			break;	
		}
	}
	else if(event.type == 'keyup') 	
	{
		paddleVelocity = 0
	}
}

// handles in-game logic 
function logicHandling()
{
	console.log(ballX + " " + ballY + " " + ballVelocityX + " " + ballVelocityY)
	
	// paddle physics
	/*if(x+paddleWidth/2 < mouseX) // old mouse stuff
		paddleVelocity = 5
	else if(x+paddleWidth/2 > mouseY)
		paddleVelocity = -5
	else
		paddleVelocity = 0
	*/
	
	x = x + paddleVelocity//event.clientX-paddleWidth/2
	
	if(x > screen.width)
		x = screen.width-paddleWidth

	// check if ball hit paddle 
	if((ballX-ballRadius >= x && ballX-ballRadius <= x+paddleWidth) && (ballY-ballRadius >= y && ballY-ballRadius <= y+paddleHeight))
	{
		//if(ballVelocityX > 0 && paddleVelocity > 0)
		ballVelocityX = -ballVelocityX
		ballX += ballVelocityX
		
		ballVelocityY = -ballVelocityY
		ballY += ballVelocityY
	}		
	
	// check if ball hit edge of screen  
	if(ballX-ballRadius > 0 && ballX+ballRadius < screen.width)
		ballX += ballVelocityX
	else
	{
		if(ballX+ballRadius >= screen.width)
			ballX = screen.width
		else
			ballX = 0
		
		ballVelocityX = -ballVelocityX
		ballX += ballVelocityX
	}
	
	if(ballY-ballRadius > 0 && ballY+ballRadius < screen.height)
		ballY += ballVelocityY
	else
	{
		if(ballY+ballRadius >= screen.height)
			ballY = screen.height
		else
			ballY = 0
			
		ballVelocityY = -ballVelocityY
		ballY += ballVelocityY
	}
}

// displaying to the screen 
function draw()
{	
	// clear screen
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// draw assets
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI, false)
	ctx.stroke();	
	
	// draw player 
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
