//declare pferd

    var img = document.createElement("img");
	img.src = "pferd.gif";
	document.body.appendChild(img); 
	
	/*var hElement = document.createElement("H1");
	var textEl = document.createTextNode("<img id="pferd" src="pferd.gif" width="100%" height="100%" align = "right" />");
	hElement.appendChild(textEl);
	document.body.appendChild(hElement);*/


//Canvas setup

//const canvas = document.getElementById('canvas1');
var canvas = document.createElement("canvas");
var ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;
var audio = new Audio('eat.mp3');

var freude = document.createElement("img");

var sound = new Audio('sound.mp3');

let score = 0;
let gameFrame = 0;
let eaten = 0;
ctx.font = '50px Georgia';

//Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
	x: canvas.width - 60,
	y: canvas.height/2,
	click: false
}
canvas.addEventListener('mousedown', function(event){
	mouse.click = true;
	mouse.x = event.x - canvasPosition.left;
	mouse.y = event.y - canvasPosition.top;
	if((mouse.x > 15) && (mouse.y > 50)){
       console.log(mouse.x, mouse.y);
	}else{
	console.log("disappear: ", mouse.x, mouse.y);
	audio.play();
	//
	function endAnimation(){
	freude.src="Freude.gif";
			document.body.appendChild(freude);
			sound.play();
	}
	setTimeout(endAnimation, 10000);
	//
		eaten = 1;
	}
});
canvas.addEventListener('mouseup', function(){
	mouse.click = false;
});

//Player
class Player{
	constructor(){
		this.x = canvas.width;
		this.y = canvas.height/2;
		this.radius = 30;
		this.angle = 0;
		this.frameX = 0;
		this.frameY = 0;
		this.frame = 0;
		this.spriteWidth = 556;
		this.spriteHeight = 389;
		this.distance;
		
	}
	
	update(){
		const dx = this.x - mouse.x;
		const dy = this.y - mouse.y;
		if(mouse.x != this.x){
			this.x -= dx/10;
		}
		if(mouse.y != this.y){
			this.y -= dy/10;
		}
		if(eaten == 1){
			Player.radius = 10;
		}
	}
	draw(){
		if(mouse.click){
			ctx.lineWidth = 0.2;
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(mouse.x, mouse.y);
			ctx.stroke();
		}
		ctx.fillStyle = 'green';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}
	
}
const player = new Player();
const player1 = new Player();

//Animation Loop
function animate(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	player.update();
	player.draw();
	player1.draw();
	ctx.fillStyle = 'black';
	ctx.fillText('Füttere das Pferd', 100, 40);
	//gameFrame++;
	//console.log(gameFrame);
	requestAnimationFrame(animate);
}
animate();