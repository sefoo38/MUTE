/*JavaScript*/
/*Sandro Falzone*/

// function MutePuzzle() {
// function startGame (container, zoo){
// $.ajaxSetup({
// 							beforeSend: function (xhr, settings)
// 							{xhr.setRequestHeader("Content-Type", "application/json");}
// 						});

// $.ajax({
//         type: "GET",
//         //url: `${base}/api/v1/objects?zoo=${zoo}`,
//         url: `http://127.0.0.1:8000/api/v1/objects?zoo=${zoo}`,
//         success: function (result, textStatus, xhr) {
//             if (xhr.status === 200) {
//                 let images = [];
//                 for (let i = 0; i < result.length; i++) {
//                     if (result[i].image == null) continue;
//                     images.push(result[i]);
//                 }
//                 const game_container = $(document.createElement("div"));
//                 game_container.addClass("puzzle-game");
//
//
//
//
//
//
//
//                 game_container.appendTo($(container));
//                 MutePuzzle();
//             }
//         },
//         error: function (xhr, textStatus, errorThrown) {
//             alert(xhr.status);
//         },
//         dataType: "json",
//         async: true
//     });
// }
// const game_path = `${base}/static/js/Games/Puzzle`;


// function Mutemory() {

// Welten Verknüpfpfung If Welt = Zoo nimm bilder aus zoo



// const myW = new Array(  //Insel-Array
// 											"zoo",
//                       "haus",
// 											"spielplatz",
// 											"Kindergarten",
//                           );
//
// 													if (container, zoo ) {
//
// 													}
//
// 													switch (container) {
// 																 case 'Zoo':																			// UPDATE
// 																			 //
// 																			 break;
// 																		}
// 																		case 'Kindergarten':																			// UPDATE
// 	 																			 //
// 	 																			 break;
// 	 																		}
// 																			case 'Spielplatz':																			// UPDATE
// 		 																			 //
// 		 																			 break;
// 		 																		}
// 																				case 'Haus':																			// UPDATE
// 			 																			 //
// 			 																			 break;
// 			 																		}
//
//Random Funktion onload
// window.onload = choosePic;

//
// If / Switch Funktion zur insel abfrage ???
//Kindergarten
// const myPuzzles3 = new Array("Teddy",  //Folder-Array
// 													"Malen",
//                         );
// //Spielplatz
// const myPuzzles2 = new Array("Ball",  //Folder-Array
// 													"Dragon",
//                           "Eimer",
// 												);
// //Haus
// const myPuzzles1 = new Array("Baden",  //Folder-Array
// 													"Händewaschen",
//                           "Wassertrinken",
// 													"Wc",
//                           "Zähneputzen");
//ZOO Ordner Array
const myPuzzles = new Array(
	// "Horse",  //Folder-Array
	// 												"Lion",
  //                         "Monkey",
	// 												"Zebra",
	// 												"Rhino",
  //                         "Penguin",
	// 												"Owl",
	// 												"Elephant",
													"Heinemann",
                          // "Thielen",
													"Penguin",
                          "Koenig");
function choosePic(myPuzzles){ return myPuzzles[Math.floor(Math.random()*myPuzzles.length)];}
let placeholder = (choosePic(myPuzzles));
// placeholder.setAttribute

//SOUND ONCLICK
let audio = new Audio("sound/zapsplat_industrial_magnet_attach_to_metal_007_32869.mp3");
document.onmouseup = function() {
  audio.play();
}

//SVG Elemenet
let ns = "http://www.w3.org/2000/svg";
let svg = document.createElementNS(ns,'svg');
svg.id = "mySvg";
svg.setAttribute("width","800");
svg.setAttribute("height","600");
document.body.appendChild(svg);
// svg=document.getElementById("mySvg");

let group = document.createElementNS(ns,"g");
let innerPicture = document.createElementNS(ns,"image");
// let placeholder = "ThielenPuzzle";

//JIGSAW NR 0-8 <g></g> Element for SVG
let jigsaws = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
for(let i = 0; i < jigsaws.length; i++) {
  group[i]=document.createElementNS(ns,"g");
  group[i].setAttribute("id",[i]);
  group[i].setAttribute("class","alpha");
  innerPicture[i] = document.createElementNS(ns,"image");
  innerPicture[i].setAttributeNS(null, 'href', 'img/Puzzles/'+ placeholder + '/'+[i]+'.png');
  innerPicture[i].classList.add('j');
  group[i].appendChild(innerPicture[i]);
  svg.appendChild(group[i]);

// BackgroundPuzzle NR 9
  if (i == 8) {
    group=document.createElementNS(ns,"g");
    group.setAttribute("id","9");
    innerPicture = document.createElementNS(ns,"image");
    innerPicture.setAttributeNS(null, 'href', 'img/Puzzles/'+ placeholder + '/'+[i+1]+'.png');
    innerPicture.setAttribute("width","400");
    innerPicture.setAttribute('height','400');
    innerPicture.setAttributeNS(null,'x','200');
    innerPicture.setAttribute('y','100');
    group.appendChild(innerPicture);
    svg.appendChild(group);
     }
}

// AudioController Class

class AudioController {
 	constructor(){
		// update
		this.placeholder = new Audio('sound/' + placeholder + '.mp3');
		// this.penguin = new Audio('sound/Penguin.mp3');
		// this.lion = new Audio('sound/ZAPSPLAT-com-loewe.mp3');
		// this.rhino = new Audio('sound/ZAPSPLAT-com-hippopotamus_grunt_001_19164.mp3');
		// this.horse = new Audio('sound/ZAPSPLAT-com-horse-whinny.mp3');
		// this.zebra = new Audio('sound/ZAPSPLAT-com-horse-whinny.mp3');
		// this.Elephant = new Audio('sound/ZAPSPLAT-com-Elefant.mp3');
    // this.owl = new Audio('sound/ZAPSPLAT-com-Eule.mp3');
    // this.elephant = new Audio('sound/ZAPSPLAT-com-Elefant.mp3');
    // this.monkey = new Audio('sound/Monkeys Monkeying Around-SoundBible.com-1738007729.mp3');
    // this.könig = new Audio('sound/ZAPSPLAT-com-Vogel-zwitschern.mp3');
    // this.thielen = new Audio('sound/machenSieEsGut.mp3');
	}

	// UPDATE
	playPlaceholder(){
		this.placeholder.play();
	}

	// playElephant(){
	// 	this.elephant.play();
	// }
	// playLion(){
	// 	this.lion.play();
	// }
	// playRhino(){
	// 	this.rhino.play();
	// }
	// playHorse(){
	// 	this.horse.play();
	// }
	// playZebra(){
	// 	this.zebra.play();
	// }
	// playMonkey(){
	// 	this.monkey.play();
	// }
	// playElephant(){
	// 	this.elephant.play();
	// }
	// playOwl(){
	// 	this.owl.play();
	// }
  // // playPenguin(){
	// // 	this.penguin.play();
	// // }
  // playKönig(){
	// 	this.könig.play();
	// }
  // playThielen(){
	// 	this.thielen.play();
	// }
 }

// Jigsaw
let jigsaw = document.getElementsByClassName('j');
let jigsawWidh = [134,192,134,163,134,163,134,192,134];
let jigsawHeight = [163,134,163,134,192,134,163,134,163];

//RAndom Jigsaw Position
for(let i=0;i<jigsaw.length;i++){
	jigsaw[i].setAttribute("width", jigsawWidh[i]);
	jigsaw[i].setAttribute("height",jigsawHeight[i]);
	jigsaw[i].setAttribute("x", Math.floor((Math.random() * 10) + 1));
	jigsaw[i].setAttribute("y", Math.floor((Math.random() * 409) + 1));
	jigsaw[i].setAttribute("onmousedown","selectElement(evt)");
}

let elementSelect = 0;
let currentX = 0;
let currentY = 0;
let currentPosX = 0;
let currentPosY = 0;

// Select Jigsaw
function selectElement(evt) {
	elementSelect = reorder(evt);
	currentX = evt.clientX;
	currentY = evt.clientY;
	currentPosX = parseFloat(elementSelect.getAttribute("x"));
	currentPosY = parseFloat(elementSelect.getAttribute("y"));
	elementSelect.setAttribute("onmousemove","moveElement(evt)");
}
// Move Jigsaws
function moveElement(evt){
	let dx = evt.clientX - currentX;
	let dy = evt.clientY - currentY;
	currentPosX = currentPosX + dx;
	currentPosY = currentPosY + dy;
	elementSelect.setAttribute("x",currentPosX);
	elementSelect.setAttribute("y",currentPosY);
	currentX = evt.clientX;
	currentY = evt.clientY;
	elementSelect.setAttribute("onmouseout","deselectElement(evt)");
	elementSelect.setAttribute("onmouseup","deselectElement(evt)");
	magnet();
}
// Deselect Jigsaws
function deselectElement(evt){
	testing(); 
	if(elementSelect != 0){
		elementSelect.removeAttribute("onmousemove");
		elementSelect.removeAttribute("onmouseout");
		elementSelect.removeAttribute("onmouseup");
		// elementSelect = 0;
	}
}

var mySvg = document.getElementById('mySvg');

function reorder(evt){
	let parent = evt.target.parentNode;
	let clone = parent.cloneNode(true);
	let id = parent.getAttribute("id");
	mySvg.removeChild(document.getElementById(id));
	mySvg.appendChild(clone);
	return mySvg.lastChild.firstChild;
}
// Correct Position for each Jigsaw
let origX = [200,304,466,200,333,437,200,304,466];
let origY = [100,100,100,233,204,233,337,366,337];

// Magnet Help Funktion, to position the jisaw correctly, if it´s close to the origX and origY
function magnet(){
	for(let i=0;i<jigsaw.length;i++){
		if (Math.abs(currentPosX-origX[i])<15 && Math.abs(currentPosY-origY[i])<15) {
			elementSelect.setAttribute("x",origX[i]);
			elementSelect.setAttribute("y",origY[i]);
		}
	}
}

let mscore = document.getElementById('score');
let score = 0;

// Testing SPECIAL for  Herr Prof.Dr. Herbert Thielen
// Test if all Jigsaws are on the right position, for function deselectElement(evt)
function testing() {
	let completet = 0;
	let alpha = document.getElementsByClassName('alpha');
	for(let i=0;i<jigsaw.length;i++){
		let posx = parseFloat(alpha[i].firstChild.getAttribute("x"));
		let posy = parseFloat(alpha[i].firstChild.getAttribute("y"));
		ide = alpha[i].getAttribute("id");
		if(origX[ide] == posx && origY[ide] == posy){
			completet = completet + 1;
		}
	}
  //GAMeOVER
	if(completet == 9){
		score = score +10;
		if (score == 20) {
			score = score -10;
		}
    //WIN SOUND
		// case 'Penguin','Lion','Elephant','Rhino','Monkey','Horse','Zebra','Owl','Thielen','König':
											// UPDATE
     let win = new AudioController();
     switch (placeholder) {
			 			//zoo
			 			case 'Penguin':
						case 'Lion':
						case 'Elephant':
						case 'Rhino':
						case 'Monkey':
						case 'Horse':
						case 'Zebra':
						case 'Owl':
						case 'Koenig':
						//house
						case 'Baden':
						case 'Hamburger':
						case 'Händewaschen':
						case 'Haus':
						case 'Nudeln':
						case 'Pizza':
						case 'Pommes':
						case 'Wassertrinken':
						case 'Wc':
						case 'Zähneputzen':
						//playground
						case 'Ball':
						case 'Dragon':
						case 'Eimer':
						case 'Fahrrad':
						case 'Klemmbaustein':
						case 'Koenig':
						// playschool
						case 'Malen':
						case 'Puppe':
						case 'Rucksack':
						case 'Teddy':
						case 'Thielen':
						case 'Heinemann':
						 			win.playPlaceholder();
						 			break;
               }
	}
}
// }
