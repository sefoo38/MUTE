function startQuiz(container, island) {
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

                const game_container = $(document.createElement("div"));
                game_container.addClass("quiz-game");
// -------------------------------------
                let quiz_animation = $(document.createElement("div"));
                quiz_animation.addClass("quiz_animation");
                let animation = $(document.createElement("img"));
                animation.attr('id', 'animation')


                let answers = $(document.createElement("div"));
                answers.addClass("answers");

                let choiceA = $(document.createElement("img"));
                choiceA.addClass("choices");
                choiceA.attr('id', 'choice1');


                let choiceB = $(document.createElement("img"));
                choiceB.addClass("choices");
                choiceB.attr('id', 'choice2');


                let choiceC = $(document.createElement("img"));
                choiceC.addClass("choices");
                choiceC.attr('id', 'choice3');


                quiz_animation.append(animation);
                quiz_animation.appendTo($(game_container));

                answers.append(choiceA);
                answers.append(choiceB);
                answers.append(choiceC);
                answers.appendTo($(game_container));

                game_container.appendTo($(container));
                document.getElementById("staticBackdropLabel").innerText = " Mute Quiz ";

// ------------------------------------- GAME FUNCTIONS ---------------------------------------------
                // MuteQuiz(images)
                let MUTE_COINS = 0;
                let actual_round = 0;
                const MAX_ROUND = 10;
                const game_path = `${base}/static/js/Games/Quiz`;
                const win_sound = new Audio(`${game_path}/sound/ui/happyend.mp3`);

                updateChoices();

                let aaa = document.getElementById("choice1");
                let bbb = document.getElementById("choice2");
                let ccc = document.getElementById("choice3");
                //
                // aaa.addEventListener('click', checkAnswer);
                // bbb.addEventListener('click', checkAnswer);
                // ccc.addEventListener('click', checkAnswer);


                function updateChoices() {
                    images = images.sort(() => Math.random() - 0.5); // shuffle the images
                    let choices = images.slice(0, 3);
                    let solution = choices[Math.floor(Math.random() * choices.length)];

                    animation.attr("src", `${solution.video}`);
                    animation.attr("data-word", `${solution.word}`);
                    let sound = `${solution.sound}`;
                    new Audio(sound).play();

                    choiceA.attr("src", `${choices[0].image}`);
                    choiceA.attr("data-word", `${choices[0].word}`);

                    choiceB.attr("src", `${choices[1].image}`);
                    choiceB.attr("data-word", `${choices[1].word}`);

                    choiceC.attr("src", `${choices[2].image}`);
                    choiceC.attr("data-word", `${choices[2].word}`);

                    let aaa = document.getElementById("choice1");
                    let bbb = document.getElementById("choice2");
                    let ccc = document.getElementById("choice3");


                    aaa.addEventListener('click', checkAnswer);
                    bbb.addEventListener('click', checkAnswer);
                    ccc.addEventListener('click', checkAnswer);

                }

                async function checkAnswer() {
                    let solution = document.getElementById("animation").getAttribute("data-word");
                    let choice = this.getAttribute("data-word");
                    if (choice === solution) {
                        MUTE_COINS++;
                        actual_round++;
                        getMute("green");
                        this.style.backgroundColor = "springgreen";

                        aaa.removeEventListener('click', checkAnswer);
                        bbb.removeEventListener('click', checkAnswer);
                        ccc.removeEventListener('click', checkAnswer);


                        if (actual_round < MAX_ROUND) {

                            await sleep(2000);

                            updateChoices();
                            aaa.style.backgroundColor = "#f0f8ff";
                            bbb.style.backgroundColor = "#f0f8ff";
                            ccc.style.backgroundColor = "#f0f8ff";
                        } else {
                            getMute("finale");
                            updateCoins(MUTE_COINS);
                            win_sound.play();
                            // closeModal();
                        }

                    } else {
                        console.log("else");
                        this.style.backgroundColor = "tomato";
                        getMute("red");

                    }
                }

                // function closeModal() {
                //     $(function () {
                //         $('.modal').modal('hide');
                //     });
                //     clearModal();
                // }

                function sleep(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }

// ------------------------------------- END GAME FUNCTIONS ------------------------------------------
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(xhr.status);
        },
        dataType: "json",
        async: true
    });
}
