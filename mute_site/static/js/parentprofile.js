$("#add_child").click(function () {
    let csrftoken = getCookie('csrftoken');
    let lecture_code = $("#lecture_session_code").val();
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
            xhr.setRequestHeader("Content-Type", "application/json");
        }
    });
    $.ajax({
        type: 'PUT',
        mode: 'same-origin',
        url: `${base}/api/v1/parent/addchild`,
        data: JSON.stringify({
            'csrfmiddlewaretoken': csrftoken,
            'lecture_session_code': `${lecture_code}`
        }),
        success: function (result, textStatus, xhr) {
            if (xhr.status === 200) {
                if (result.error) {
                    // code already taken, notify user
                    alert("already taken");
                } else {
                    // child was successfully added
                    window.location.reload();
                }
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(xhr.status);
            if (xhr.status === 400) {
                let response = JSON.parse(xhr.responseText);
                alert(response.message);
                // bad request, invalid parameters probably
            } else if (xhr.status === 422) {
                let response = JSON.parse(xhr.responseText);
                alert(response.message);
                // 'lecture_session_code' was empty, notify user
            } else if (xhr.status === 404) {
                // child not found
            }
        },
        dataType: "json"
    });
});