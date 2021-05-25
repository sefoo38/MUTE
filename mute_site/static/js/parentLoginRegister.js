const csrftoken = getCookie('csrftoken');

$("#login").click(function () {
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
            xhr.setRequestHeader("Content-Type", "application/json");
        }
    });
    $.ajax({
        type: "POST",
        url: `${base}/api/v1/auth/parent`,
        data: JSON.stringify({
            'csrfmiddlewaretoken': csrftoken,
            'username': $("#username").val(),
            'password': $("#password").val()
        }),
        success: function (result, textStatus, xhr) {
            if (xhr.status === 200) {
                if (result.error && result.incorrect_password) {
                    // if password incorrect, do something
                    $("#password").css("border-color", "tomato");
                    $("#feedback").html("Passwort falsch");
                } else {
                    // success
                    window.location.replace('/profile/');
                }
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            if (xhr.status === 404) {
                // user not found
                $("#username").css("border-color", "tomato");
                $("#feedback").html("Benutzer nicht gefunden");
            }
        },
        dataType: "json"
    });
});

$("#register").click(function () {
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
            xhr.setRequestHeader("Content-Type", "application/json");
        }
    });
    $.ajax({
        type: "POST",
        url: `${base}/api/v1/parent`,
        data: JSON.stringify({
            'csrfmiddlewaretoken': csrftoken,
            'username': $("#username").val(),
            'password': $("#password").val()
        }),
        success: function (result, textStatus, xhr) {
            if (xhr.status === 201) {
                // new user successfully created
                window.location.replace('/profile/')
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            $("#username").css("border-color", "tomato");
            $("#feedback").html("Benutzer existiert bereits");
        },
        dataType: "json"
    });
});

$("#username").focus(function () {
    $("#username").css("border-color", "transparent");
    $("#feedback").html("");
});

$("#password").focus(function () {
    $("#password").css("border-color", "transparent");
    $("#feedback").html("");
});
