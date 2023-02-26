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
	
	ctx.font = "48px serif";
	ctx.textBaseline = "hanging";
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

// play field information
fieldX = 0
fieldWidth = screen.width

// block placement information
brickMapWidth = 7;
brickMapHeight = 4;

blockSize = 50;

brickMapX = 100;
brickMapY = 0;

brickMap = [[1,1,1,1,1,1,1],
		    [1,1,1,1,1,1,1],
		    [1,1,1,1,1,1,1],
		    [1,1,1,1,1,1,1]];

// score counter
score = 0
bendingMeter = 0
bendingMeterMax = 3

// player information
paddleX = 100
paddleWidth = 100
paddleHeight = 50
paddleY = screen.height*6/8-paddleHeight
paddleVelocity = 0

mouseX = 0
mouseY = 0

// ball information
ballX = 10
ballY = 10
ballRadius = 4
ballVelocityX = 5
ballVelocityY = 5

// mouse input for paddle
function paddleInput(event)
{
	mouseX = event.clientX
	mouseY = event.clientY
}

// paddle input
function inputHandler(event)
{
	if(event.type == 'keydown') 
	{		
		switch (event.key) 
		{
			case "ArrowLeft":
			if(paddleX > fieldX)
				paddleVelocity = -5
			else
			{
				paddleX = fieldX
				paddleVelocity = 0
			}
			break;
			case "ArrowRight":
			if(paddleX+paddleWidth > fieldWidth)
			{
				paddleX = fieldWidth-paddleWidth
				paddleVelocity = 0
			}
			else			
				paddleVelocity = 5
			break;	
		}
	}
	else if(event.type == 'keyup') 	
		paddleVelocity = 0
}

// handles in-game logic 
function logicHandling()
{
	paddleX = paddleX + paddleVelocity
	
	// check if ball is hitting a block 
	if((ballX-ballRadius-brickMapX)/blockSize >= 0 && (ballX+ballRadius-brickMapX)/blockSize < brickMapWidth && (ballY-ballRadius-brickMapY)/blockSize >= 0 &&(ballY+ballRadius-brickMapY)/blockSize < brickMapHeight )
	{
		console.log((ballX-brickMapX)/blockSize + " " + (ballY-brickMapY)/blockSize)
		
		if(brickMap[parseInt((ballY-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] > 0)
		{
			brickMap[parseInt((ballY-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] = brickMap[parseInt((ballY-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] - 1;
			score = score + 1
			ballVelocityX = -ballVelocityX
			ballVelocityY = -ballVelocityY
		}
		else if(brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX-ballRadius-brickMapX)/blockSize)] > 0)
		{
			brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX-ballRadius-brickMapX)/blockSize)] = brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX-ballRadius-brickMapX)/blockSize)] - 1;
			score = score + 1
			ballVelocityX = -ballVelocityX
			ballVelocityY = -ballVelocityY
		}
		else if(brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX+ballRadius-brickMapX)/blockSize)] > 0)
		{
			brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX+ballRadius-brickMapX)/blockSize)] = brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX+ballRadius-brickMapX)/blockSize)] - 1;
			score = score + 1
			ballVelocityX = -ballVelocityX
			ballVelocityY = -ballVelocityY
		}
		else if(brickMap[parseInt((ballY+ballRadius-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] > 0)
		{
			brickMap[parseInt((ballY+ballRadius-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] = brickMap[parseInt((ballY+ballRadius-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] - 1;
			score = score + 1
			ballVelocityX = -ballVelocityX
			ballVelocityY = -ballVelocityY
		}
		else if(brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] > 0)
		{
			brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] = brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] - 1;
			score = score + 1
			ballVelocityX = -ballVelocityX
			ballVelocityY = -ballVelocityY
		}
		
	}
	
	// check if the ball hits paddle 
	if((ballX+ballRadius >= paddleX && ballX+ballRadius <= paddleX+paddleWidth) && (ballY+ballRadius >= paddleY && ballY+ballRadius <= paddleY+paddleHeight))
	{
		// check what direction the player is moving
		if ((ballVelocityX < 0 && paddleVelocity > 0) || (ballVelocityX > 0 && paddleVelocity < 0))
		{
			if(Math.abs(ballVelocityX) == 1)
				ballVelocityX+=paddleVelocity/2
			else if(ballVelocityX > 0)
				ballVelocityX--
			else if (ballVelocityX < 0)
				ballVelocityX++
			
			ballVelocityX = -ballVelocityX
		}
		else
		{
			if(ballVelocityX < 0)
				ballVelocityX--
			else
				ballVelocityX++
		}	
		ballX += ballVelocityX
		
		ballVelocityY = -ballVelocityY
		ballY += ballVelocityY
	}		
	
	// check if ball hit edge of screen  
	if(ballX-ballRadius > fieldX && ballX+ballRadius < fieldWidth)
		ballX += ballVelocityX
	else
	{
		if(ballX+ballRadius >= fieldWidth)
			ballX = fieldWidth-2*ballVelocityX
		else 
			ballX = fieldX+10
		
		ballVelocityX = -ballVelocityX
		ballX += 2*ballVelocityX
	}
	
	if(ballY-ballRadius > fieldX && ballY+ballRadius < screen.height)
		ballY += ballVelocityY
	else
	{
		if(ballY+ballRadius >= screen.height)
		{
			ballY = screen.height-2*ballVelocityY
		}
		else
			ballY = fieldX+10
			
		ballVelocityY = -ballVelocityY
		ballY += 2*ballVelocityY
	}
}

// display blocks
function drawBlocks()
{
	ctx.beginPath();
	for(var y = 0;y < brickMapHeight;y++)
	{
		for(var x = 0;x < brickMapWidth;x++)
		{
			if(brickMap[y][x] == 1)
				ctx.rect(x*blockSize+brickMapX,y*blockSize+brickMapY, blockSize, blockSize);			
		}
	}
	ctx.stroke();
}

// displaying to the screen 
function draw()
{	
	// clear screen
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// draw blocks
	drawBlocks();
	
	// draw ball 
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI, false)
	ctx.stroke();	
	
	// draw player 
	ctx.beginPath();
	ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
	ctx.stroke();	
	
	// display score
	ctx.strokeText("Score: " + score, fieldWidth*6/7, screen.height*1/100);
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
