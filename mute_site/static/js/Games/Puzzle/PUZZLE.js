// ALL SOUNDS FROM ZAPSPLAT.COM and soundbible.com
function startPuzzle(container, island) {

    const game_container = $(document.createElement("div"));
    game_container.addClass("puzzle-game");

//-------------------------------------------------------------------------------------------------------------
    const school_puzzles = [
        "Teddy",  //Folder-Array
        "Malen",
        "Puppe",
        //"Thielen",
        "Rucksack"
    ];


    const playground_puzzles = [
        "Ball",  //Folder-Array
        "Dragon",
        "Eimer",
        "Fahrrad",
        "Klemmbaustein",
        //"Koenig"
    ];


    const home_puzzles = [
        "Baden",  //Folder-Array
        "Hamburger",
        "Händewaschen",
        "Haus",
        "Nudeln",
        "Pizza",
        "Pommes",
        "Wassertrinken",
        "Wc",
        "Zähneputzen"
    ];

    const zoo_puzzles = [
        "Horse",  //Folder-Array
        "Lion",
        "Monkey",
        "Zebra",
        "Rhino",
        "Penguin",
        "Owl",
        "Elephant"
    ];

    const puzzles = {
        "school": school_puzzles,
        "playground": playground_puzzles,
        "home": home_puzzles,
        "zoo": zoo_puzzles
    };

    function choosePic(myPuzzles) {
        return myPuzzles[Math.floor(Math.random() * myPuzzles.length)];
    }

    //const placeholder = choosePic(puzzles[island]);

    const placeholder = "Elephant"; // for debugging


    //SVG Elemenet
    const ns = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(ns, 'svg');
    svg.id = "mySvg";
    svg.setAttribute("width", "800");
    svg.setAttribute("height", "600");
    // document.body.appendChild(svg);								    // IN BODY   ERZEUGEN!!!!!!
    $(game_container).append(svg);

    let group = document.createElementNS(ns, "g");
    let innerPicture = document.createElementNS(ns, "image");


    //JIGSAW NR 0-8 <g></g> Element for SVG
    let jigsaws = 9;
    for (let i = 0; i < jigsaws; i++) {
        group[i] = document.createElementNS(ns, "g");
        group[i].setAttribute("id", [i]);
        group[i].setAttribute("class", "alpha");
        innerPicture[i] = document.createElementNS(ns, "image");
        innerPicture[i].setAttributeNS(null, 'href', `${base}/static/js/Games/Puzzle/img/Puzzles/${placeholder}/${i}.png`);
        innerPicture[i].classList.add('j');
        group[i].appendChild(innerPicture[i]);
        svg.appendChild(group[i]);

        // BackgroundPuzzle NR 9
        if (i === 8) {
            group = document.createElementNS(ns, "g");
            group.setAttribute("id", "9");
            innerPicture = document.createElementNS(ns, "image");
            innerPicture.setAttributeNS(null, 'href', `${base}/static/js/Games/Puzzle/img/Puzzles/${placeholder}/${i + 1}.png`);
            innerPicture.setAttribute("width", "400");
            innerPicture.setAttribute('height', '400');
            innerPicture.setAttributeNS(null, 'x', '200');
            innerPicture.setAttribute('y', '100');
            group.appendChild(innerPicture);
            svg.appendChild(group);

        }
    }
    game_container.appendTo($(container));
    document.getElementById("staticBackdropLabel").innerText= " Puzzle "
    MutePuzzle(placeholder);
}


// Puzzlr GAME

function MutePuzzle(word) {

//SOUND ONCLICK
    //let audio = new Audio(`${base}/static/js/Games/Puzzle/sound/zapsplat_industrial_magnet_attach_to_metal_007_32869.mp3`);
    //document.onmouseup = function () {
        //audio.play();
    //};

// AudioController Class
    class AudioController {
        constructor() {
            // update
            this.placeholder = new Audio(`${base}/static/js/Games/Puzzle/sound/${word}.mp3`);
        }

        playPlaceholder() {
            this.placeholder.play();
        }
    }

// Jigsaw
    let jigsaws = document.getElementsByClassName('j');
    let jigsawWidth = [134, 192, 134, 163, 134, 163, 134, 192, 134];
    let jigsawHeight = [163, 134, 163, 134, 192, 134, 163, 134, 163];

//Random Jigsaw Position
    for (let i = 0; i < jigsaws.length; i++) {
        jigsaws[i].setAttribute("width", `${jigsawWidth[i]}`);
        jigsaws[i].setAttribute("height", `${jigsawHeight[i]}`);
        jigsaws[i].setAttribute("x", `${Math.floor((Math.random() * 10) + 1)}`);
        jigsaws[i].setAttribute("y", `${Math.floor((Math.random() * 409) + 1)}`);
        //jigsaws[i].setAttribute("onmousedown", "selectElement(evt)");
        jigsaws[i].addEventListener('mousedown', selectElement)

    }

    var elementSelect;
    let currentX = 0;
    let currentY = 0;
    let currentPosX = 0;
    let currentPosY = 0;

// Select Jigsaw
    function selectElement(evt) {
        console.log(this);
        elementSelect = reorder(evt);
        currentX = evt.clientX;
        currentY = evt.clientY;
        currentPosX = parseFloat(evt.target.getAttribute("x"));
        currentPosY = parseFloat(evt.target.getAttribute("y"));
        //elementSelect.setAttribute("onmousemove", "moveElement(evt)");

    }

// Move Jigsaws
    function moveElement(evt) {
        console.log(this);
        let dx = evt.clientX - currentX;
        let dy = evt.clientY - currentY;
        currentPosX = currentPosX + dx;
        currentPosY = currentPosY + dy;
        evt.target.setAttribute("x", currentPosX);
        evt.target.setAttribute("y", currentPosY);
        currentX = evt.clientX;
        currentY = evt.clientY;
        //evt.target.setAttribute("onmouseout", "deselectElement(evt)");
        //evt.target.setAttribute("onmouseup", "deselectElement(evt)");
        evt.addEventListener('mousedown', moveElement);
        evt.addEventListener('mousemove', moveElement);
        magnet();
    }

// Deselect Jigsaws
    function deselectElement(evt) {
        console.log(this);
        testing();
       if (evt.target !== 0) {
           evt.target.removeAttribute("onmousemove");
           evt.target.removeAttribute("onmouseout");
           evt.target.removeAttribute("onmouseup");
            // elementSelect = 0;
            //evt = 0;
        }
    }

    var mySvg = document.getElementById('mySvg');

    function reorder(evt) {
        var parent = evt.target.parentNode;
        var clone = parent.cloneNode(true);
        var id = parent.getAttribute("id");
        mySvg.removeChild(document.getElementById(id));
        mySvg.appendChild(clone);
        return mySvg.lastChild.firstChild;
    }

// Correct Position for each Jigsaw
    let origX = [200, 304, 466, 200, 333, 437, 200, 304, 466];
    let origY = [100, 100, 100, 233, 204, 233, 337, 366, 337];

// Magnet Help Funktion, to position the jisaw correctly, if it´s close to the origX and origY
    function magnet() {
        for (var i = 0; i < jigsaws.length; i++) {
            if (Math.abs(currentPosX - origX[i]) < 15 && Math.abs(currentPosY - origY[i]) < 15) {
                elementSelect.setAttribute("x", origX[i]);
                elementSelect.setAttribute("y", origY[i]);
            }
        }
    }

    var score = 0;

// Test if all Jigsaws are on the right position, for function deselectElement(evt)
    function testing() {
        let completet = 0;
        const alpha = document.getElementsByClassName('alpha');
        for (let i = 0; i < jigsaws.length; i++) {
            let posx = parseFloat(alpha[i].firstChild.getAttribute("x"));
            let posy = parseFloat(alpha[i].firstChild.getAttribute("y"));
            let ide = alpha[i].getAttribute("id");
            if (origX[ide] === posx && origY[ide] === posy) {
                completet = completet + 1;
            }
        }
        //GAMeOVER
        if (completet === 9) {
            score = score + 10;
            if (score === 20) {
                score = score - 10;
            }
            //WIN SOUND
            getMute("finale");
            let win = new AudioController();
            try {
                win.playPlaceholder();
                getMute("finale");
            } 
            catch (e) {
                console.log("no sounds available")
            }
        }
    }

    for (let jigsaw of jigsaws) {
        console.log(jigsaw);
       // jigsaw.addEventListener('mousedown', selectElement);
        jigsaw.addEventListener('mousedown', moveElement);
        jigsaw.addEventListener('mousemove', moveElement);

        jigsaw.addEventListener('mouseup', deselectElement);
       // jigsaw.addEventListener('mouseout', deselectElement);
       // jigsaw.addEventListener('mousemove', deselectElement);
    }

}
