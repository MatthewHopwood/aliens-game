var GameCanvas;
var DrawContext;

var Player1;
var ABullets = [];
var Bullets = [];
var Aliens = [];
var GameOver = false;
var FireCounter = 0;
var GameMode = 'Intro';
var Difficulty;
var Won = false;

var AKeyDown = false
var DKeyDown = false;
var SpaceDown = false;
var FirePressed = false;

function Player(x, y, width, height, speed)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.update = function()
    {    
        if (AKeyDown)
        {
            this.x -= this.speed;
            if (this.x < 50)
            {
                this.x = 50;
            }
        }
        if (DKeyDown)
        {
            this.x += this.speed;
            if (this.x > 550)
            {
                this.x = 550;
            }
        }
        this.draw(); 
    }
    this.draw = function()
    {
        var ctx = DrawContext;
        var x = this.x - this.width / 2;
        var y = this.y - this.height;
        var THeight = 20;
        var TWidth = 20;

        ctx.fillStyle ='rgb(255, 0, 0)';
        ctx.fillRect(x, y, this.width, this.height);
        ctx.fillStyle ='rgb(0, 0, 255)';
        ctx.fillRect(x, y - 20, TWidth, THeight);
        ctx.fillStyle ='rgb(0, 0, 255)';
        ctx.fillRect(x + 40, y - 20, TWidth, THeight);
        ctx.fillStyle ='rgb(0, 0, 255)';
        ctx.fillRect(x + 80, y - 20, TWidth, THeight);
    }
    this.fire = function()
    {
        var bullet = new Bullet(this.x, this.y - 60, -500);
    }
    this.die = function()
    {
        if (!GameOver)
        {
            GameMode = 'GameOver';
            Won = false;
        }
    }
}

function Bullet(x, y, speed)
{
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = 10;
    this.height = 10;
    this.update = function()
    {
        this.y += this.speed * (1 / 60);

        if (this.y < 0)
        {
            this.removeBullet();
        }
        if (this.y > 500)
        {
            this.removeBullet();
        }
       
        this.draw();
        this.dueCollision();
    }
    this.removeBullet = function()
    {
        for (var t = 0; t < Bullets.length; t++)
        {
            if (Bullets[t] == this)
            {
                Bullets.splice(t,1); 
                return;
            }
        }
    }
    this.collide = function(object)
    {
        var total_width = object.width + this.width;
        var total_height = object.height + this.height;
        
        var dx = Math.abs(object.x - this.x);
        var dy = Math.abs(object.y - this.y);
        
        if (dx <= total_width / 2 && dy <= total_height / 2)
        {
            object.die();
            this.removeBullet();
        }
    }
    this.dueCollision = function()
    {
        if (this.speed > 0)
        {
            this.collide(Player1);
        }
        else 
        {
            for(var t = 0; t < Aliens.length; t++)
            {
                this.collide(Aliens[t]);
            }
        }
    }

    this.draw = function()
    {
        var ctx = DrawContext;
        
        if (this.speed > 0)
        { 
            ctx.fillStyle = 'rgb(0, 0, 150)';
        }
        else
        {
            ctx.fillStyle = 'rgb(0, 150, 0)';
        }
        ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
    }
    Bullets.push(this);
}

function Alien(x, y, width, height, colour)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 5;
    this.colour = colour;
    this.update = function()
    {               
        this.x += this.speed;
        
        if (this.x > 585 || this.x < 15)
        {
            this.speed =- this.speed;
            this.y += 40;
            if(this.speed < 0)
            {
                this.speed -= 0.5;
            }
            else
            {
                this.speed += 0.5;
            }
        }
        
        if (this.y > 420)
        {
            GameOver = true;
            GameMode = 'GameOver';
            Won = false;
            
        }
        
        this.draw();
    }

    this.removeAlien = function()
    {
        for (var t = 0; t < Aliens.length; t++)
        {
            if (Aliens[t] == this)
            {
                Aliens.splice(t,1); 
                return;
            }
        }
    }

    this.fire = function()
    {
        var bullet = new Bullet(this.x, this.y, 200);
    }

    this.draw = function()
    {
        var ctx = DrawContext;

        ctx.fillStyle = this.colour;
        ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
    } 
    Aliens.push(this);

    this.die = function()
    {
        this.removeAlien();
    }
}

function MouseClick(Event)
{
    var x = Event.layerX;
    var y = Event.layerY;

    if (x > 200 && x < 400 && y > 125 && y < 175 && GameMode == 'Intro')
    {
        Difficulty = 180;
        GameMode = 'InGame';
        RestartGame();
    }

    if (x > 200 && x < 400 && y > 250 && y < 300 && GameMode == 'Intro')
    {
        Difficulty = 120;
        GameMode = 'InGame';
        RestartGame();
    }

    if (x > 200 && x < 400 && y > 375 && y < 425 && GameMode == 'Intro')
    {
        Difficulty = 60;
        GameMode = 'InGame';
        RestartGame();
    }

    if (x > 200 && x < 400 && y > 400 && y < 450 && GameMode == 'GameOver')
    {
        GameMode = 'Intro';
    }
}

function StartGame()
{
    
    window.addEventListener("keydown", HandleKeyDownEvent, true);
    window.addEventListener("keyup", HandleKeyUpEvent, true);
    
    GameCanvas = document.getElementById("game_canvas");
    DrawContext = GameCanvas.getContext("2d");

    window.addEventListener("click", MouseClick, true);

   
    RestartGame();
    MainLoop();
}

function RestartGame()
{
    Aliens = [];
    Bullets = [];
    GameOver = false;

    Player1 = new Player(300, 495 ,100, 40, 10);
    
    for(var x = 15; x < 16 * 30 + 15; x += 30)
    {
        new Alien(x, 0, 15, 15, 'rgb(100, 100, 0)');
        new Alien(x, 70, 15, 15, 'rgb(0, 100, 100)');
    }

    FireCounter = 0;
}

function HandleKeyDownEvent(key_event)
{
	if (key_event.key == "a")
	{
		AKeyDown = true;
	}
	else if (key_event.key == "d")
	{
		DKeyDown = true;
	}
	else if (key_event.key == " " && !FirePressed)
	{
        Player1.fire();
        FirePressed = true;
	}
}

function HandleKeyUpEvent(key_event)
{
	if (key_event.key == "a")
	{
		AKeyDown = false;
	}
	else if (key_event.key == "d")
	{
        DKeyDown = false;
    }
    else if (key_event.key == " ")
    {
        FirePressed = false;
    }
}

function DoIntro()
{
    var ctx = DrawContext;
    ctx.fillStyle = 'rgb(0, 0 ,255)';
    ctx.fillRect(200, 125, 200, 50);
    ctx.fillStyle = 'rgb(0, 0 ,255)';
    ctx.fillRect(200, 250, 200, 50);
    ctx.fillStyle = 'rgb(0, 0 ,255)';
    ctx.fillRect(200, 375, 200, 50);

    ctx.font = '40px Arial';
    ctx.fillStyle = 'rgb(0, 255, 0)';
    ctx.fillText('Easy', 257, 165);

    ctx.font = '40px Arial';
    ctx.fillStyle = 'rgb(0, 255, 0)';
    ctx.fillText('Medium', 230, 290);

    ctx.font = '40px Arial';
    ctx.fillStyle = 'rgb(0, 255, 0)';
    ctx.fillText('Hard', 255, 415);
}

function DoGameOver()
{
    var ctx = DrawContext;
    ctx.fillStyle = 'rgb(0, 0 ,255)';
    ctx.fillRect(200, 400, 200, 50);

    ctx.font = '30px Arial';
    ctx.fillStyle = 'rgb(0, 255, 0)';
    ctx.fillText('Restart Game', 205, 435);

    if (Won)
    {
        ctx.font = '100px Arial';
        ctx.fillStyle = 'rgb(0, 255, 0)';
        ctx.fillText('You Win!!', 100, 100);
    }
    else 
    {
        ctx.font = '100px Arial';
        ctx.fillStyle = 'rgb(0, 255, 0)';
        ctx.fillText('You Lose!!', 60, 100);
    }
}

function MainLoop()
{
    var ctx = DrawContext;

    ctx.clearRect(0, 0, 600, 500);
    ctx.fillStyle = 'rgb(243, 141, 9)';   
    ctx.fillRect(0, 0, 600, 500);
    
    if (GameMode == 'Intro')
    {
        DoIntro();
    }
    else if (GameMode == 'GameOver') 
    {
        DoGameOver();
    }
    else 
    { 
        Player1.update();

        for (var t = 0; t < Aliens.length; t++)
        {
            Aliens[t].update();
        }

        for (var t = 0; t < Bullets.length; t++)
        {
            Bullets[t].update();
        }
        
        if (GameOver)
        {
            RestartGame();
        }

        if (Aliens.length == 0)
        {
            Bullets = [];
            GameMode = 'GameOver';
            Won = true;
        }

        FireCounter++;
        if(FireCounter > Difficulty && Aliens.length > 0)
        {
            var Choice = (Math.random() * Aliens.length) | 0;
            Aliens[Choice].fire();
        
            FireCounter = 0;
        }
    }

    setTimeout(MainLoop, 16);
}

window.onload = function (e)
{
    console.log('Game Started');
    StartGame();
}
