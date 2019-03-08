$(document).ready(function () {
    var projectName;
    var modelURL;
    var imgName;
    console.log("init fire!");
    console.log(localStorage.getItem("pName"));
    init();
    $('#fileInput').on('change', function(){
        var control = $('#inputFileMaskText');
        control.val(this.files[0].name);
    });

    $('#fileInput2').on('change', function(){
        console.log("in file input2");
        var control = $('#inputFileMaskText2');
        control.val(this.files[0].name);
        imgName = this.files[0].name;
        //set listener for uploadBtn
        if (imgName.substr(imgName.length-4,4) != '.csv'){
            readURL(this);
        }
        else {
            $('#img-container').hide();
        }

    });
    $("#uploadBtn").click(function (event) {
        console.log('inupload!')
        var fileName;
        //Input Validation
        if ($('#fileInput2')[0].files[0] == undefined){
            alert("Please select an image!!!");
        }
        //if image is valid
        else {
            imgName = $('#fileInput2')[0].files[0].name;
            uploadImage();

            //console.log($('#fileInput2')[0].files[0].name);

        }


    });
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#previewImg').show();
                $('#img-container').show();
                $('#previewImg').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }
    function init(){
        $('#previewImg').hide();
        $('.result').hide();
        $('#img-container').hide();
        console.log(window.location.pathname);
        console.log(window.location.href);
        var fullURL = window.location.href;
        //console.log(fullURL.substring(fullURL.lastIndexOf("=")+1));
        var requiredDisplayPath = '/empty.html';
        projectName = decodeURI(fullURL.substring(fullURL.lastIndexOf("=")+1));
        if (window.location.pathname == requiredDisplayPath
            && projectName != null
            && projectName != "")
        {
            $(".page-header").html(projectName + "<small> Model </small>");
        }
        modelURL= '/loadProject?id=' + projectName;

    }
    function uploadImage(img){
        var actionurl = "fileupload";
        var data = new FormData();
        jQuery.each(jQuery('#fileInput2')[0].files, function (i, file) {
            console.log('in append');
            console.log(file);
            data.append('filetoupload', file);
        });
        data.append('pname', projectName);
        console.log(data.filetoupload);
        //do your own request an handle the results
        $.ajax({
            url: actionurl,
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            data: data,
            success: function (response, status, jqXHR) {
                console.log('in success ' + jqXHR.status);
                runModel(modelURL);

            },
            error: (function (jqXHR, textStatus, errorThrown) {
                //alert(jqXHR.status + textStatus + errorThrown);
                window.location.replace('404.html')
            })

        });
    }
    function runModel(url){
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'text',
            data: {imgname: imgName}
        }).done(function (response) {
            console.log(response);
            $('<p></p>', {
                title: "Results of Python's  " + projectName + ' Model',
                id: projectName,
                text: response,
                style: "font-size: 20px",
                //click:function(){alert('test');return false;}
            }).prependTo($('.result'));
            $('.result').show();
            console.log('good to go!');
        }).fail(function () {
            alert("Sorry. Server unavailable. ");
            window.location.replace('404.html')
        });
    }
    //Basic Bar Chart (apex chart)
    var options = {
        chart: {
            height: 350,
            type: 'bar',
        },
        plotOptions: {
            bar: {
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        series: [{
            data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
        }],
        xaxis: {
            categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],
        }
    };

    var chart = new ApexCharts(
        document.querySelector("#chart"),
        options
    );

    chart.render();
});