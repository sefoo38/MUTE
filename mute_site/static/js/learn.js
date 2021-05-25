const csrftoken = getCookie('csrftoken');

$("#avatar").click(function () {
    if ($("#avatars_container").children().length > 0) return;
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("Content-Type", "application/json");
        }
    });
    $.ajax({
        type: "GET",
        url: `${base}/api/v1/avatars`,
        success: function (result, textStatus, xhr) {
            if (xhr.status === 200) {
                result.forEach(element => {
                    const img = $(document.createElement('img'));
                    img.attr("src", `${base}/media/${element.image_path}`);
                    img.addClass("avatar-selection-list-item");
                    img.data('image-path', element.image_path);
                    img.click(updateAvatar);
                    $("#avatars_container").append(img);
                });
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(xhr.status);
        },
        dataType: "json",
        async: true
    });
});

function updateAvatar(event) {
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    });
    $.ajax({
        type: "PUT",
        url: `${base}/api/v1/child/avatar`,
        data: JSON.stringify({
            'csrfmiddlewaretoken': csrftoken,
            'image': $(event.target).data("image-path")
        }),
        success: function (result, textStatus, xhr) {
            if (xhr.status === 200) {
                $(".avatar-selection-list-item").removeClass("avatar-selection-list-item-selected");
                $(event.target).addClass("avatar-selection-list-item-selected");
                $("#avatar").attr("src", `${base}${result.image}`);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(xhr.status);
        },
        dataType: "json"
    });
}

$("#avatar_image").on("change", function (e) {
    const image = e.currentTarget.files[0];
    const isImage = image['type'].includes('image');
    if (!isImage) {
        // feedback if user selects file which is not an image
        alert("not a valid image");
        return
    }
    if ((image.size / 1024) / 1024 > 5) {
        // feedback if the file is bigger than 5mb
        alert("Image too big, max 5mb");
        return;
    }
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    });
    const formData = new FormData($("#avatar_upload")[0]);
    $.ajax({
        type: "PUT",
        url: `${base}/api/v1/child/avatar`,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (result, textStatus, xhr) {
            if (xhr.status === 200) {
                $("#avatar").attr("src", `${base}${result.image}`);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(xhr.status);
        },
        dataType: "json"
    });
});

function updateCoins(coins) {
    let csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    });
    $.ajax({
        type: "PUT",
        url: `${base}/api/v1/child/coins`,
        data: JSON.stringify({
            'csrfmiddlewaretoken': csrftoken,
            'coins': coins
        }),
        success: function (result, textStatus, xhr) {
            if (xhr.status === 200) {
                $("#coins").html(result.coins);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(`Status: ${xhr.status}, Error: ${textStatus} ${errorThrown}`);
        },
        dataType: "json",
        async: true
    });
}

function refreshAvatar() {
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("Content-Type", "application/json");
        }
    });
    $.ajax({
        type: "GET",
        url: `${base}/api/v1/child`,
        success: function (result, textStatus, xhr) {
            if (xhr.status === 200) {
                $("#avatar").attr("src", `${base}${result.image}`);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(`Status: ${xhr.status}, Error: ${textStatus} ${errorThrown}`);
        },
        dataType: "json"
    });
}

$(document).ready(function () {
    $('#content').load(`${base}/island/overview`);
    refreshAvatar();
    // playGif("hallo");
});

function zoomZoo() {
    $('#content').load(`${base}/island/zoo`);
    document.getElementById("island_icon").style.display = "";
}

function zoomHome() {
    $('#content').load(`${base}/island/home`);
    document.getElementById("island_icon").style.display = "";
}

function zoomPlayground() {
    $('#content').load(`${base}/island/playground`);
    document.getElementById("island_icon").style.display = "";
}

function zoomSchool() {
    $('#content').load(`${base}/island/school`);
    document.getElementById("island_icon").style.display = "";
}

function back() {
    document.getElementById("island_icon").style.display = "none";
    $('#content').load(`${base}/island/overview`);
}