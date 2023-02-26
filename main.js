var fallingBlockHandler = null;

var timerRange;
		
var bounce = new Audio("bounce.wav");
var falling = new Audio("falling_blocks.wav");

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
	
	// set up main loop
	window.requestAnimationFrame(mainLoop);
	
	ctx.font = "24px serif";
	ctx.textBaseline = "hanging";
	
	timerRange = 10000
	fallingBlockHandler = setInterval(pushDown,timerRange);
	start = new Date().getTime();
	currentTimeline.push(0)
}

// restart after game over
function restartGame()
{
	onload();
	
	// time traveling information
	timeline = [] // the option of times to go to 
	currentTimeline = [] // the current times the player has used 
	snapShots = [] // player data at times on the timeline 

	// play field information
	fieldX = screen.width/4
	fieldWidth = screen.width/4+screen.width/2

	// block placement information
	brickMapWidth = 14;
	brickMapHeight = 14;

	blockSize = 50;

	brickMapX = fieldX+(fieldWidth-(fieldX+(blockSize*brickMapWidth)))/2;
	brickMapY = 0;

	brickMap = [[1,0,1,0,1,0,1,0,1,0,1,0,0,1],
		    [1,1,0,1,0,1,0,1,0,0,0,1,1,1],
		    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

	// score counter
	score = 0
	au = 0
	bendingMeter = 0
	bendingMeterMax = 3
	level = 1
	gameOver = false;

	// AI information - [[paddleLocation],[ball]]
	pastSelves = [];

	// player information
	paddleX = fieldX+100
	paddleWidth = 100
	paddleHeight = 20
	paddleY = screen.height*6/8-paddleHeight
	paddleVelocity = 0

	// ball information
	ballX = fieldX+10
	ballY = screen.height/2+10
	ballRadius = 4
	ballVelocityX = 2
	ballVelocityY = 2
	ballStrength = 1
	ballExp = 0
	ballExpMax = 4

	// used for time
	timeMode = false;
	timeOption = 0;
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

// time traveling information
timeline = [] // the option of times to go to 
currentTimeline = [] // the current times the player has used 
snapShots = [] // player data at times on the timeline 

// play field information
fieldX = screen.width/4
fieldWidth = screen.width/4+screen.width/2

// block placement information
brickMapWidth = 14;
brickMapHeight = 14;

blockSize = 50;

brickMapX = fieldX+(fieldWidth-(fieldX+(blockSize*brickMapWidth)))/2;
brickMapY = 0;

brickMap = [[1,0,1,0,1,0,1,0,1,0,1,0,0,1],
		    [1,1,0,1,0,1,0,1,0,0,0,1,1,1],
		    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

// score counter
score = 0
au = 0
bendingMeter = 0
bendingMeterMax = 3
level = 1
var gameOver = false;

// AI information - [[paddleLocation],[ball]]
pastSelves = [];

// player information
paddleX = fieldX+100
paddleWidth = 100
paddleHeight = 20
paddleY = screen.height*6/8-paddleHeight
paddleVelocity = 0

// ball information
ballX = fieldX+10
ballY = screen.height/2+10
ballRadius = 4
ballVelocityX = 2
ballVelocityY = 2
ballStrength = 1
ballExp = 0
ballExpMax = 4

// used for time
var start,timerMAth;
var timeMode = false;
var timeOption = 0;

// mouse coordinates??
mouseX = 0
mouseY = 0

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
		toggleEffects = true;
		switch (event.key) 
		{
			case "Backspace":
			break;
			case " ":
			if(bendingMeter == bendingMeterMax)
			{
				clearInterval(fallingBlockHandler)
				document.onkeydown = timeSelection;	
				document.onkeyup = timeSelection;	
				timeMode = true
				timeOption = 0
				au++
				bendingMeterMax = bendingMeterMax * 2;
 				bendingMeter = 0;
			}
			break;
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

// push blocks downward
function pushDown()
{
	for(var y = brickMapHeight-1;y >= 0;y--)
	{
		for(var x = 0;x < brickMapWidth;x++)
		{
			if(brickMap[y][x] == 0 && y > 0 && brickMap[y-1][x] > 0)
			{
				brickMap[y][x] = brickMap[y-1][x]
				brickMap[y-1][x] = 0
				
				if(y == brickMapHeight-1) // if blocks are too far down, set game over status
					gameOver = true;
			}
			else if(y == 0 && brickMap[y][x] <= 0)
			{
				brickMap[y][x] = 2*level;		
				if(timerRange > 2000)		
				{
					timerRange = timerRange - 100
					clearInterval(fallingBlockHandler);
					fallingBlockHandler = setInterval(pushDown,timerRange);
				}
			}
		}
	}
	if(toggleEffects)
		falling.play();
	level++
}

// add to event list when a block is destroyed
function addTimelineEvent()
{
	// set up snapshot of information 
	playerData = [structuredClone(brickMap),[[structuredClone(paddleX), structuredClone(paddleWidth), structuredClone(paddleHeight), structuredClone(paddleY), structuredClone(paddleVelocity)], 
											[structuredClone(ballX), structuredClone(ballY), structuredClone(ballRadius+2), structuredClone(ballVelocityX), structuredClone(ballVelocityY)],structuredClone(pastSelves)]];
	
	if(timeline.length < 20)
	{
		snapShots.push(playerData)
		timeline.push(timerMAth)
	}
	else // shift if stack is full 
	{
		snapShots.shift()
		timeline.shift()
		
		timeline.push(timerMAth)
		snapShots.push(playerData)
	}
}

// setting the environment when the time changes
function goBack()
{
	// set new time 
	start = new Date().getTime();
	
	// change map to snapshot
	brickMap = snapShots[timeOption][0];
	
	// set current timeline to selected time 
	currentTimeline.push(timeline[timeOption]);

	// set AI to past self coordinates and set current level 	
	pastSelves.push(snapShots[timeOption][1],snapShots[timeOption][2]);	
	
	// add past AI 
	for(var l = 0;l<snapShots[timeOption][3];l++)
	{
		if(!pastSelves.includes(snapShots[timeOption][3][l]))
			pastSelves.push(snapShots[timeOption][3][l]);
	}
	
	pastSelves.pop();
	
	// reallocate the space of the snapshot and timeline stacks 
	timeline.length = timeOption;
	snapShots.length = timeOption;
}

// handles past selves
function enemyLogic()
{
	console.log(pastSelves);
	for(var j=0;j<pastSelves.length;j++)
	{		
		// check if the player's ball hit the past paddle
		if((ballX+ballRadius >= pastSelves[j][0][0] && ballX+ballRadius <= pastSelves[j][0][0]+paddleWidth) && (ballY+ballRadius >= pastSelves[j][0][3] && ballY+ballRadius <= pastSelves[j][0][3]+paddleHeight))
			pastSelves.splice(j,1);
		else
		{
			// past self paddle logic 
			pastSelves[j][0][0] = pastSelves[j][0][0] + pastSelves[j][0][4]; // x
			pastSelves[j][0][3] = screen.height*6/8-paddleHeight-((10+paddleHeight)*j); // y
			
			// move paddle
			if(pastSelves[j][1][0] > fieldX && pastSelves[j][1][0] < pastSelves[j][0][0])
				pastSelves[j][0][4] = -2;
			else if(pastSelves[j][1][0] < fieldWidth && pastSelves[j][1][0] > pastSelves[j][0][0])
				pastSelves[j][0][4] = 2;
			else
				pastSelves[j][0][4] = 0
			// past self ball logic  
			pastSelves[j][1][0]  
			pastSelves[j][1][1]  
			pastSelves[j][1][2]
		
			// check if the ball hits paddle 
			if((pastSelves[j][1][0]+pastSelves[j][1][2] >= paddleX && pastSelves[j][1][0]+pastSelves[j][1][2] <= paddleX+paddleWidth) && (pastSelves[j][1][1] +pastSelves[j][1][2] >= paddleY && pastSelves[j][1][1] +pastSelves[j][1][2] <= paddleY+paddleHeight))
				gameOver = true;
		
			// handle logic with hitting blocks 
			if((pastSelves[j][1][0]-pastSelves[j][1][2]-brickMapX)/blockSize >= 0 && (pastSelves[j][1][0]+pastSelves[j][1][2]-brickMapX)/blockSize < brickMapWidth && (pastSelves[j][1][1]-pastSelves[j][1][2]-brickMapY)/blockSize >= 0 &&(pastSelves[j][1][1]+pastSelves[j][1][2]-brickMapY)/blockSize < brickMapHeight )
			{
				if(brickMap[parseInt((pastSelves[j][1][1]-brickMapY)/blockSize)][parseInt((pastSelves[j][1][0]-brickMapX)/blockSize)] > 0)
				{
					brickMap[parseInt((pastSelves[j][1][1]-brickMapY)/blockSize)][parseInt((pastSelves[j][1][0]-brickMapX)/blockSize)] = brickMap[parseInt((pastSelves[j][1][1]-brickMapY)/blockSize)][parseInt((pastSelves[j][1][0]-brickMapX)/blockSize)] - ballStrength;
			
					pastSelves[j][1][3] = -pastSelves[j][1][3]
					pastSelves[j][1][4] = -pastSelves[j][1][4]
				}
				else if(brickMap[parseInt((pastSelves[j][1][1]-pastSelves[j][1][2]-brickMapY)/blockSize)][parseInt((pastSelves[j][1][0]-pastSelves[j][1][2]-brickMapX)/blockSize)] > 0)
				{
					brickMap[parseInt((pastSelves[j][1][1]-pastSelves[j][1][2]-brickMapY)/blockSize)][parseInt((pastSelves[j][1][0]-pastSelves[j][1][2]-brickMapX)/blockSize)] = brickMap[parseInt((pastSelves[j][1][1]-pastSelves[j][1][2]-brickMapY)/blockSize)][parseInt((pastSelves[j][1][0]-pastSelves[j][1][2]-brickMapX)/blockSize)] - ballStrength;
			
					pastSelves[j][1][3] = -pastSelves[j][1][3]
					pastSelves[j][1][4] = -pastSelves[j][1][4]
				}
				else if(brickMap[parseInt((pastSelves[j][1][1]-pastSelves[j][1][2]-brickMapY)/blockSize)][parseInt((pastSelves[j][1][0]+pastSelves[j][1][2]-brickMapX)/blockSize)] > 0)
				{
					brickMap[parseInt((pastSelves[j][1][1]-pastSelves[j][1][2]-brickMapY)/blockSize)][parseInt((pastSelves[j][1][0]+pastSelves[j][1][2]-brickMapX)/blockSize)] = brickMap[parseInt((pastSelves[j][1][1]-pastSelves[j][1][2]-brickMapY)/blockSize)][parseInt((pastSelves[j][1][0]+pastSelves[j][1][2]-brickMapX)/blockSize)] - ballStrength;
				
					pastSelves[j][1][3] = -pastSelves[j][1][3]
					pastSelves[j][1][4] = -pastSelves[j][1][4]
				}
				else if(brickMap[parseInt((pastSelves[j][1][1]+pastSelves[j][1][2]-brickMapY)/blockSize)][parseInt((pastSelves[j][1][0]-brickMapX)/blockSize)] > 0)
				{
					brickMap[parseInt((pastSelves[j][1][1]+pastSelves[j][1][2]-brickMapY)/blockSize)][parseInt((pastSelves[j][1][0]-brickMapX)/blockSize)] = brickMap[parseInt((pastSelves[j][1][1]+pastSelves[j][1][2]-brickMapY)/blockSize)][parseInt((pastSelves[j][1][0]-brickMapX)/blockSize)] - ballStrength;
				
					score = score + 1
					pastSelves[j][1][3] = -pastSelves[j][1][3]
					pastSelves[j][1][4] = -pastSelves[j][1][4]
				}
				else if(brickMap[parseInt((pastSelves[j][1][1]-pastSelves[j][1][2]-brickMapY)/blockSize)][parseInt((pastSelves[j][1][0]-brickMapX)/blockSize)] > 0)
				{
					brickMap[parseInt((pastSelves[j][1][1]-pastSelves[j][1][2]-brickMapY)/blockSize)][parseInt((pastSelves[j][1][0]-brickMapX)/blockSize)] = brickMap[parseInt((pastSelves[j][1][1]-pastSelves[j][1][2]-brickMapY)/blockSize)][parseInt((pastSelves[j][1][0]-brickMapX)/blockSize)] - ballStrength;
			
					score = score + 1
					pastSelves[j][1][3] = -pastSelves[j][1][3]
					pastSelves[j][1][4] = -pastSelves[j][1][4]
				}
			
			}
	
			// check if ball hit edge of screen  
			if(pastSelves[j][1][0]-pastSelves[j][1][2] > fieldX && pastSelves[j][1][0]+pastSelves[j][1][2] < fieldWidth)
				pastSelves[j][1][0] += pastSelves[j][1][3]
			else
			{
				if(pastSelves[j][1][0]+pastSelves[j][1][2] >= fieldWidth)
					pastSelves[j][1][0] = fieldWidth-2*pastSelves[j][1][3]
				else 
					pastSelves[j][1][0] = fieldX+10
		
				pastSelves[j][1][3] = -pastSelves[j][1][3]
				pastSelves[j][1][0] += 2*pastSelves[j][1][3]
			}
	
			if(pastSelves[j][1][1]-pastSelves[j][1][2] > 0 && pastSelves[j][1][1]+pastSelves[j][1][2] < screen.height)
				pastSelves[j][1][1] += pastSelves[j][1][4]
			else
			{
				if(pastSelves[j][1][1]+pastSelves[j][1][2] >= screen.height)
				{
					pastSelves[j][1][1] = screen.height-2*pastSelves[j][1][4]
				}
				else
					pastSelves[j][1][1] = 10
			
				pastSelves[j][1][4] = -pastSelves[j][1][4]
				pastSelves[j][1][1] += 2*pastSelves[j][1][4]
			}
		
		}
	}
}

// display past selves
function drawEnemies()
{	
    ctx.strokeStyle  = 'red';
	for(var j=0;j<pastSelves.length;j++)
	{
		// draw past self ball 
		ctx.beginPath();
		ctx.arc(pastSelves[j][1][0], pastSelves[j][1][1], pastSelves[j][1][2], 0, 2 * Math.PI, false)
		ctx.stroke();
	
		// draw past self paddle 
		ctx.beginPath();
		ctx.rect(pastSelves[j][0][0], pastSelves[j][0][3], paddleWidth, paddleHeight);
		ctx.stroke();	
	}
	
    ctx.strokeStyle  = 'black';
}

// handles in-game logic 
function logicHandling()
{
	enemyLogic();
	
	console.log(paddleX+ " " +paddleY)
	
	// handles paddle movement from player 
	paddleX = paddleX + paddleVelocity;
	paddleY = screen.height*6/8-paddleHeight-((10+paddleHeight)*pastSelves.length);
	
	// check if ball is hitting a block 
	if((ballX-ballRadius-brickMapX)/blockSize >= 0 && (ballX+ballRadius-brickMapX)/blockSize < brickMapWidth && (ballY-ballRadius-brickMapY)/blockSize >= 0 &&(ballY+ballRadius-brickMapY)/blockSize < brickMapHeight )
	{
		if(brickMap[parseInt((ballY-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] > 0)
		{
			brickMap[parseInt((ballY-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] = brickMap[parseInt((ballY-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] - ballStrength;
			if(brickMap[parseInt((ballY-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] <= 0)
			{
				if(bendingMeter < bendingMeterMax)
					bendingMeter++
				ballExp++
				addTimelineEvent()
			}
			
			score = score + 1
			if(toggleEffects)
				bounce.play();
			ballVelocityX = -ballVelocityX
			ballVelocityY = -ballVelocityY
		}
		else if(brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX-ballRadius-brickMapX)/blockSize)] > 0)
		{
			brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX-ballRadius-brickMapX)/blockSize)] = brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX-ballRadius-brickMapX)/blockSize)] - ballStrength;
			if(brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX-ballRadius-brickMapX)/blockSize)] <= 0)
			{
				if(bendingMeter < bendingMeterMax)
					bendingMeter++
				ballExp++
				addTimelineEvent()
			}
			
			score = score + 1
			if(toggleEffects)
				bounce.play();
			ballVelocityX = -ballVelocityX
			ballVelocityY = -ballVelocityY
		}
		else if(brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX+ballRadius-brickMapX)/blockSize)] > 0)
		{
			brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX+ballRadius-brickMapX)/blockSize)] = brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX+ballRadius-brickMapX)/blockSize)] - ballStrength;
			if(brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX+ballRadius-brickMapX)/blockSize)] <= 0)
			{
				if(bendingMeter < bendingMeterMax)
					bendingMeter++
				ballExp++
				addTimelineEvent()
			}
			
			score = score + 1
			if(toggleEffects)
				bounce.play();
			ballVelocityX = -ballVelocityX
			ballVelocityY = -ballVelocityY
		}
		else if(brickMap[parseInt((ballY+ballRadius-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] > 0)
		{
			brickMap[parseInt((ballY+ballRadius-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] = brickMap[parseInt((ballY+ballRadius-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] - ballStrength;
			if(brickMap[parseInt((ballY+ballRadius-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] <= 0)
			{
				if(bendingMeter < bendingMeterMax)
					bendingMeter++
				ballExp++
				addTimelineEvent()
			}
			
			score = score + 1
			if(toggleEffects)
				bounce.play();
			ballVelocityX = -ballVelocityX
			ballVelocityY = -ballVelocityY
		}
		else if(brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] > 0)
		{
			brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] = brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] - ballStrength;
			if(brickMap[parseInt((ballY-ballRadius-brickMapY)/blockSize)][parseInt((ballX-brickMapX)/blockSize)] <= 0)
			{
				if(bendingMeter < bendingMeterMax)
					bendingMeter++
				ballExp++
				addTimelineEvent()
			}
			
			score = score + 1
			if(toggleEffects)
				bounce.play();
			ballVelocityX = -ballVelocityX
			ballVelocityY = -ballVelocityY
		}
		
	}
	
	// check if the ball hits paddle 
	if((ballX+ballRadius >= paddleX && ballX+ballRadius <= paddleX+paddleWidth) && (ballY+ballRadius >= paddleY && ballY+ballRadius <= paddleY+paddleHeight))
	{
		if(ballY+ballRadius <= paddleY)
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
		}
		else
		{
			ballVelocityX = -ballVelocityX
		}
		
		if(toggleEffects)
			bounce.play();
		ballVelocityY = -ballVelocityY
		ballY += ballVelocityY
	}		
	
	// ball strength logic 
	if(ballExp > ballExpMax-1)
	{
		ballExp-=ballExpMax
		ballExpMax= ballExpMax *3
		ballStrength++
	}
	
	// check if ball hit edge of screen  
	if(ballX-ballRadius > fieldX && ballX+ballRadius < fieldWidth)
		ballX += ballVelocityX
	else
	{
		if(toggleEffects)
			bounce.play();
		if(ballX+ballRadius >= fieldWidth)
			ballX = fieldWidth-2*ballVelocityX
		else 
			ballX = fieldX+10
		
		ballVelocityX = -ballVelocityX
		ballX += 2*ballVelocityX
	}
	
	if(ballY-ballRadius > 0 && ballY+ballRadius < screen.height)
		ballY += ballVelocityY
	else
	{
		if(toggleEffects)
			bounce.play();
		if(ballY+ballRadius >= screen.height)
		{
			ballY = screen.height-2*ballVelocityY
		}
		else
			ballY = 10
			
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
			if(brickMap[y][x] >= 1)
			{
				switch(brickMap[y][x])
				{
					case 1:
					ctx.fillStyle = "#FF0000";
					break;
					case 2:
					ctx.fillStyle = "#0000FF";
					break;
					case 3:
					ctx.fillStyle = "#000FFF";
					break;
					case 4:
					ctx.fillStyle = "#00FFFF";
					break;
					case 5:
					ctx.fillStyle = "#0F00F0";
					break;
					case 6:
					ctx.fillStyle = "#0F0FF0";
					break;
					default:
					case 7:
					ctx.fillStyle = "#000000";
					break;
				}
				ctx.fillRect(x*blockSize+brickMapX,y*blockSize+brickMapY, blockSize, blockSize);
			}		
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
	
	// draw AI/enemies
	drawEnemies();
	
	// display score
	ctx.strokeText("Score: " + score*(au+1), 200+fieldWidth*6/7, screen.height*1/100);
	ctx.strokeText("Strength: " + ballStrength, 200+fieldWidth*6/7, screen.height*1/100+40);
	
	// display reality bending meter
	for(var j=0;j<bendingMeter;j++)
	{
		ctx.beginPath();
		ctx.fillStyle = "#00FF00";
		ctx.fillRect(200+fieldWidth*6/7+j*20, screen.height*1/20+80, 20, 10);
		ctx.stroke();	
	}
	ctx.beginPath();
	ctx.rect(200+fieldWidth*6/7, screen.height*1/20+80, bendingMeterMax*20, 10);
	ctx.stroke();	
	ctx.strokeText("Reality Bending:", 200+fieldWidth*6/7, screen.height*1/100+80);
	
	// show option to travel if meter is full
	if(bendingMeter == bendingMeterMax)
		ctx.strokeText("Press Space to Travel", 200+fieldWidth*6/7, screen.height*1/100+400);
	
	ctx.strokeText("Alternate Reality Multiplier: " + au, 200+fieldWidth*6/7, screen.height*1/100+150);
	ctx.strokeText("EXP: " + ballExp + "/" + ballExpMax, 200+fieldWidth*6/7, screen.height*1/100+190);
	
	// draw boundary lines 
	ctx.beginPath(); 
	ctx.moveTo(fieldX, 0); 
	ctx.lineTo(fieldX, screen.height); 
	ctx.stroke(); 
	
	ctx.beginPath(); 
	ctx.moveTo(fieldWidth, 0); 
	ctx.lineTo(fieldWidth, screen.height);
	ctx.stroke();
	
	timerMAth = (new Date().getTime() - start);
	
	// display options for time travel 
	ctx.strokeText("Times to travel to: ", fieldWidth*1/6, screen.height*1/40);
	for(z=0;z<timeline.length;z++)
		ctx.strokeText(Math.floor((timeline[z] % (1000 * 60 * 60)) / (1000*60)) + ":" + Math.floor(( timeline[z] % (1000 * 60)) / 1000), fieldWidth*1/6, z*20+screen.height*1/20);
	
	// show current timeline
	ctx.strokeText("Your Timeline: ", fieldWidth*1/100, screen.height*1/40);
	for(z=0;z<currentTimeline.length;z++)
		ctx.strokeText(Math.floor((currentTimeline[z] % (1000 * 60 * 60)) / (1000*60)) + ":" + Math.floor(( currentTimeline[z] % (1000 * 60)) / 1000), fieldWidth*1/100, z*20+screen.height*1/20);
	
	// show time
	if(!gameOver)
		ctx.strokeText("Time: " + Math.floor((timerMAth % (1000 * 60 * 60)) / (1000*60)) + ":" + Math.floor(( timerMAth % (1000 * 60)) / 1000), 200+fieldWidth*6/7, screen.height*1/100+230);
	
	// display cursor to select time when time mode is active
	if(timeMode)
	{
		ctx.beginPath(); 
		ctx.strokeText(">", fieldWidth*1/6-20, screen.height*1/20+timeOption*20);
		ctx.stroke();
		
		ctx.strokeText("Press Backspace to select a time", fieldWidth*1/90, screen.height*2/3);
	}
	
	// display when game is over 
	if(gameOver)
	{
		ctx.beginPath();
		ctx.fillStyle = "#0000FF";
		ctx.fillRect(screen.width/2-100, screen.height/2-100, 300, 200);
		ctx.stroke();	
		ctx.strokeText("GAME OVER", screen.width/2, screen.height/2);
		ctx.strokeText("Press Backspace to restart", screen.width/2, screen.height/2+30);
	}
}

// logic for selecting a time 
function timeSelection(event)
{
	if(event.type == 'keydown') 
	{
		switch (event.key) 
		{
			case "Backspace":
			goBack();
			fallingBlockHandler = setInterval(pushDown,10000);
			timeMode = false
			timeOption = 0
			document.onkeydown = inputHandler;	
			document.onkeyup = inputHandler;	
		
			break;
			case "ArrowUp":
			if(timeOption > 0)
				timeOption--;
			break;
			case "ArrowDown":
			if(timeOption < timeline.length-1)
				timeOption++
			break;	
		}
	}
}

// handling game over 
function gameOverHandle(event)
{
	clearInterval(fallingBlockHandler);
	
	if(event.type == 'keydown' && event.key == "Backspace") 
	{
		restartGame();
		document.onkeydown = inputHandler;	
		document.onkeyup = inputHandler;	
		gameOver = false;
	}
}

// main loop 
function mainLoop(){
	
	
	// process player movment/ai/etc 
	if(!timeMode && !gameOver)
		logicHandling();
	else if(gameOver)
	{
		document.onkeydown = gameOverHandle;	
		document.onkeyup = gameOverHandle;	
	}
	
	// display to screen 
	draw();
	
	// get new frame 
	window.requestAnimationFrame(mainLoop);
}
