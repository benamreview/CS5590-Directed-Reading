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
            console.log(response.project[i].name);
            // console.log("\nThe Distance that it takes to travel is: " + response.location[i].distance);
            // console.log("\nThe Traveling Time is: " + response.location[i].duration);
            // $('<a>', {
            //     title: "Click to see results of project " + response.project[i].name,
            //     id: response.project[i].name,
            //     text: response.project[i].name,
            //     href: '/loadProject?id=' + response.project[i].name,
            //     style: "font-size: 20px",
            //     //click:function(){alert('test');return false;}
            // }).appendTo($('#projectBoard'));
            // $('<br>').appendTo($('#projectBoard'));
            if (i%3 == 0){
                var currentID = 'row' + i;
                jQuery('<div/>', {
                    id: 'row' + i,
                    class: 'row',
                    title: 'now this div has a title!'
                }).appendTo('#projectBoard');
            }
            var newPanel = $('#projectPanel').clone();
            var newPanelID = response.project[i].name.toString()
            newPanel.show();
            newPanel.attr("id", "projectPanel" + i);
            newPanel.appendTo($("#"+currentID));
            $("#projectPanel" + i + ' .pName').text(response.project[i].name)
            $("#projectPanel" + i + ' a').attr("id", newPanelID);


            //Event Listener for link
            $("[id='" + response.project[i].name +"']").click(function (e) {
                //alert($(this).attr('id'));
                console.log($(this).attr('id'));
                var currentLinkID = $(this).attr('id');
                // Check browser support for local storage
                // if (typeof(Storage) !== "undefined") {
                //     // Store
                //     localStorage.setItem("pName", currentLinkID);
                //     //localStorage.setItem("pName", $("#pname").val());
                //     // Retrieve
                //     //document.getElementById("result").innerHTML = localStorage.getItem("verID");
                //     //window.open('/callgraph-popup.html', 'MyWindow', 'width=800,height=600');
                // } else {
                //     document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
                // }
                location.href='empty.html?id=' + currentLinkID;
                return false;

            });
        }
    }).fail(function () {
        alert("Sorry. Server unavailable. ");
    });



});