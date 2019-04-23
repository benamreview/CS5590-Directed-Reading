$(document).ready(function () {

    $("#projectPanel").hide();
    var url = 'pArchive';
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
            $("#projectPanel" + i + ' a').attr('href','/empty.html?id=' + newPanelID + '&fullname=' + response.project[i].fullname);
            $("#projectPanel" + i + ' .description').text(response.project[i].description);
            //Click Listener for Div
            $( "#projectPanel" + i ).click(function() {
                location.href= $(this).find('a').attr("href");
            });
            //Event Listener for link
            $("[id='" + response.project[i].name +"']").click(function (e) {
                //alert($(this).attr('id'));
                console.log($(this).attr('id'));
                var currentLinkID = $(this).attr('id');

                // Check browser support for local storage
                if (typeof(Storage) !== "undefined") {
                    // Store
                    localStorage.setItem("pName", fullpName);
                    //localStorage.setItem("pName", $("#pname").val());
                    // Retrieve
                    //document.getElementById("result").innerHTML = localStorage.getItem("verID");
                    //window.open('/callgraph-popup.html', 'MyWindow', 'width=800,height=600');
                } else {
                    document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
                }
                location.href='empty.html?id=' + currentLinkID;
                return false;

            });
        }
    }).fail(function () {
        alert("Sorry. Server unavailable. ");
    });



});