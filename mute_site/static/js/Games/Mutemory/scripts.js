var mute_words = {};

function startMutemory(container, island) {
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("Content-Type", "application/json");
        }
    });
    $.ajax({
        type: "GET",
        url: `${base}/api/v1/objects?island=${island}`,
        success: function (result, textStatus, xhr) {
            if (xhr.status === 200) {
                let images = [];
                for (let i = 0; i < result.length; i++) {   // remove all objects which do not contain an image
                    if (result[i].image == null) continue;
                    images.push(result[i]);
                }
                images = images.sort(() => Math.random() - 0.5); // shuffle the images

                const game_container = $(document.createElement("div"));
                game_container.addClass("col-12 memory-game");
                for (let j = 0; j < 2; j++) {
                    for (let i = 0; i < 6; i++) {
                        let memory_card = $(document.createElement("div"));
                        memory_card.addClass("col-3 memory-card");
                        memory_card.attr("data-framework", `${images[i].word}`);
                        let front_img = $(document.createElement("img"));
                        front_img.addClass("img-fluid front-face");
                        front_img.attr("src", `${images[i].image}`);
                        let back_img = $(document.createElement("img"));
                        back_img.addClass(" img-fluid back-face");
                        back_img.attr("src", `${base}/static/images/mute_not_moving.png`);
                        memory_card.append(front_img);
                        memory_card.append(back_img);
                        memory_card.appendTo($(game_container));
                        mute_words[images[i].word] = images[i];
                    }
                }

                game_container.appendTo($(container));
                document.getElementById("staticBackdropLabel").innerText= " Mutemory "
                Mutemory();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(xhr.status);
        },
        dataType: "json",
        async: true
    });
}


function Mutemory() {

    const cards = document.querySelectorAll('.memory-card');
    const game_path = `${base}/static/js/Games/Mutemory`;

    var score = 0;
    //scorePunkte.textContent = score;


    const win_sound = new Audio(`${game_path}/audio/sound.mp3`);

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;

    function playFlipSound() {
        let flip = new Audio(`${game_path}/audio/flip.wav`);
        flip.play();
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');


        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            playFlipSound();
            return;
        }

        secondCard = this;
        playFlipSound();
        checkForMatch();
    }

     async function checkForMatch() {

        let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

        if (isMatch) {
           /* scorePunkte.textContent = ' Richtig !';
		    scorePunkte.style.color = 'green';*/

            firstCard.style.borderColor = "springgreen";
            secondCard.style.borderColor = "springgreen";

            getMute("green");
            playGif(mute_words[firstCard.dataset.framework]);
            disableCards();
            score = score + 1;
            updateCoins(1);
            if (score === 6) {
                win_sound.play();
                getMute("finale");
            }
        } else {
          /*  scorePunkte.textContent = ' Neee !';
		    scorePunkte.style.color = 'red';*/

            firstCard.style.borderColor = "tomato";
            secondCard.style.borderColor = "tomato";

            getMute("red");

            await sleep(1000);

            unflipCards();
        }

    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            firstCard.style.borderColor = "";
            secondCard.style.borderColor = "";

            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    (function shuffle() {
        cards.forEach(card => {
            card.style.order = Math.floor(Math.random() * 12);
        });
    })();

    cards.forEach(card => card.addEventListener('click', flipCard));
}

function sleep(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }

