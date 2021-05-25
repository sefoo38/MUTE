const csrftoken = getCookie('csrftoken');

$("#start").click(function () {
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
            xhr.setRequestHeader("Content-Type", "application/json");
        }
    });
    $.ajax({
        type: "POST",
        url: `${base}/api/v1/child`,
        data: JSON.stringify({
            'csrfmiddlewaretoken': csrftoken
        }),
        success: function (result, textStatus, xhr) {
            if (xhr.status === 201) {
                document.cookie = `lecture_session_code=${result.lecture_session_code}`;
                window.location.replace('/learn/');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(xhr.status);
        },
        dataType: "json"
    });
});

$("#button-addon2").click(function () {
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
            xhr.setRequestHeader("Content-Type", "application/json");
        }
    });
    $.ajax({
        type: "POST",
        url: `${base}/api/v1/auth/child`,
        data: JSON.stringify({
            'csrfmiddlewaretoken': csrftoken,
            'lecture_session_code': $("#lecture_session_code").val()
        }),
        success: function (result, textStatus, xhr) {
            if (xhr.status === 200) {
                document.cookie = `lecture_session_code=${result.lecture_session_code}`;
                window.location.replace('/learn/');
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            if (xhr.status === 422) {
                $("#lecture_session_code").css("border-color", "tomato");
                alert("Input field cannot be empty");
            }
            if (xhr.status === 404) {
                $("#lecture_session_code").css("border-color", "tomato");
                alert("Child not found");
            }
        },
        dataType: "json"
    });
});

$("#lecture_session_code").focus(function () {
    $("#lecture_session_code").css("border-color", "transparent");
});
