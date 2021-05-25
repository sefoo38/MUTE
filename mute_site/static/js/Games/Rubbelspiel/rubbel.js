//Javascript Datei

function startRubbel(container, island) {
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

                    const game_container = $(document.createElement("div"));
                    game_container.addClass("rubbel");

//---------------------------------------------------------------------------------------------------------------
                    (function Rubbelspiel() {

                        var audio = document.getElementById("audioMusic");

                        var canvas = document.createElement("canvas");
                        var ctx = canvas.getContext("2d");
                        canvas.width = 700; canvas.height = 500;

                        var img = new Image();


                        img.onload = function () {

                            for (var column = 0, color = 0; column < 20; column++) {
                                for (var row = 0; row < 20; row++) {
                                    ctx.fillStyle = 'hsl(' + color + ',100%, 50%)';
                                    ctx.fillRect(column * 50, row * 50, 50, 50);
                                    color += 17;
                                }
                            }
                            ctx.drawImage(img, 100, 0);

                        };
                        img.src = 'Bilder/löwe1.png';
                         $(game_container).append(canvas);
                        //document.body.appendChild(canvas);

                        game_container.appendTo($(container));
                        document.getElementById("staticBackdropLabel").innerText = " rubbel ";

//---------------------------------------------------------------------------------------------------------------

                        function erase(event) {
                            var x = event.clientX - canvas.getBoundingClientRect().x;
                            var y = event.clientY - canvas.getBoundingClientRect().y;

                            ctx.clearRect(x, y, 80, 80);

                        }


                        function sound() {

                            // var audio = new Audio('Sounds/Scratching.mp3');  
                            audio.play();
                        }

                        function stop() {

                            audio.pause();
                        }


                        canvas.addEventListener('mousemove', erase, false);
                        canvas.addEventListener('mousemove', sound, false);
                        canvas.addEventListener('mouseout', stop, false);
                    }());
                }
            }
        }
    });
}