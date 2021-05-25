const base = location.protocol.concat("//").concat(window.location.host);

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var timer_id;

function setGif(url) {
    clearTimeout(timer_id);
    let gif_player = $("#gif-player");
    gif_player.removeClass("fade-out");
    gif_player.attr("src", url);
    timer_id = setTimeout(function () {
        gif_player.addClass("fade-out");
    }, 12000);
}


function getMute(state) {
    const mute_states = {
        "red": "muteRedBlink.gif",
        "green": "muteGreenBlink.gif",
        "happy": "muteHappy.gif",
        "finale": "Freude_Feuerwerk.gif",
        "rainbow": "muteRainbow.gif"
    };
    $("#mute").attr("src", `${base}/static/images/muteImages/${mute_states[state]}`);
}

let _words = {};

function playGif(word) {
    let wordObj;
    if (typeof word === "string") {
        word = word.toLowerCase();
        if (_words[word]) {
            wordObj = _words[word];
        } else {
            $.ajaxSetup({
                beforeSend: function (xhr, settings) {
                    xhr.setRequestHeader("Content-Type", "application/json");
                }
            });
            $.ajax({
                type: "GET",
                url: `${base}/api/v1/objects/${word}`,
                success: function (result, textStatus, xhr) {
                    if (xhr.status === 200) {
                        _words[result.word.toLowerCase()] = result;
                        wordObj = result;
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(`Status: ${xhr.status}, Error: ${textStatus} ${errorThrown}`);
                },
                dataType: "json",
                async: false
            });
        }
    } else if (typeof word === "object") {
        if (!_words[word.word.toLowerCase()]) {
            _words[word.word.toLowerCase()] = wordObj = word;
        }
    } else {
        throw "Expected one argument of type 'string' or 'word-object' ";
    }
    setGif(wordObj.video);
    let audio = new Audio(wordObj.sound);
    audio.addEventListener("canplay", () => {
        audio.play();
    });
}