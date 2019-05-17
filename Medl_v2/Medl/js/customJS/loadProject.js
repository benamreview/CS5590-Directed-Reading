$(document).ready(function () {

    $("#projectPanel").hide();
    var url = 'pArchiveFirebase';
    $.ajax({
        url: url,
        method: 'POST',
        dataType: 'json'
    }).done(function (response) {
        $('#result').text("");
        console.log(response.project.length);
        for (var i = 0; i < response.project.length; i++) {
            console.log(response.project[i]);
            var newPanel = $('#projectPanel').clone();
            var newPanelID = response.project[i].name.toString();
            newPanel.show();
            newPanel.attr("id", "projectPanel" + i);
            newPanel.appendTo($("#projectBoard"));

            $("#projectPanel" + i + ' .fixed_name').text(response.project[i].fullname);
            $("#projectPanel" + i + ' a').attr("id", newPanelID);
            $("#projectPanel" + i).attr('href','/model-page.html?id=' + newPanelID + '&fullname=' + response.project[i].fullname+ '&m_id=' + response.project[i].m_id);
            $("#projectPanel" + i + ' .fixed_description').text(response.project[i].description);
            $("#projectPanel" + i + ' .owner-actual').attr("href", "user_profile_public.html?id=" + response.project[i].create_user_id);
            $("#projectPanel" + i + ' .owner-actual').text(response.project[i].create_username);
            //Click Listener for Div
            $( "#projectPanel" + i ).click(function() {
                location.href= $(this).attr("href");
            });
            loadModelImg("projectPanel" + i, response.project[i].name)

        }
    }).fail(function () {
        alert("Sorry. Server unavailable. ");
    });


    function loadModelImg(panelID, projectName){
        console.log(panelID + " " + projectName);
        var modelImg = $("#" + panelID + " .model-img");
        var imgSrc = "./tmp/" + projectName + '/logo.jpeg';
        modelImg.attr("src", imgSrc );
        console.log("Current Src:" + modelImg.attr('src'));
        modelImg.on("error", function(){
            var imgSrc = "./tmp/" + projectName + '/logo.jpg';
            modelImg.attr("src", imgSrc );
            console.log(imgSrc + "not found");
        })

    }
});