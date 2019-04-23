

$(document).ready(function () {
    var projectName, fullpName;
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
    function getDescription(pName) {
        console.log('in client getDescription' + pName);
        var data = {};
        data.pname = pName;
        var actionurl = "getDescription";
        $.ajax({
            url: actionurl,
            cache: false,
            contentType: "application/json; charset=utf-8",
            processData: false,
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            success: function (response, status, jqXHR) {
                console.log('in success ' + jqXHR.status);
                $(".model-description").text(response.description);

            },
            error: (function (jqXHR, textStatus, errorThrown) {
                //alert(jqXHR.status + textStatus + errorThrown);
                window.location.replace('404.html')
            })

        });
    }
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
        /*Hide all the show-on-click elements */
        $('#previewImg').hide();
        $('.result').hide();
        $('#img-container').hide();
        $('#loading-screen').hide();


        console.log(window.location.pathname);
        console.log(window.location.href);
        var fullURL = window.location.href;
        //console.log(fullURL.substring(fullURL.lastIndexOf("=")+1));
        var requiredDisplayPath = '/empty.html';
        var url = new URL(fullURL);
        fullpName = url.searchParams.get("fullname");
        projectName = url.searchParams.get("id");
        if (window.location.pathname == requiredDisplayPath
            && projectName != null
            && projectName != "")
        {
            $(".model-name").html(fullpName + "<small> Model </small>");
        }
        modelURL= '/loadProject?id=' + projectName;
        getDescription(projectName);
    }

    function uploadImage(img){
        //Turn on loading icon
        $("#loading-screen").show();
        $(".result").hide();
        //Ajax Call to Server
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
            dataType: 'json',
            data: {imgname: imgName}
        }).done(function (response) {
            console.log(response);
            var projectName = response[0].projectName;
            var testID = response[0].testcaseNum;
            var imgName = response[0].imgName;
            var shareURL = "/testcase.html?id=" + projectName + '&testid=' + testID + "&imgname=" + imgName;
            var discussURL = "/testcase.html?id=" + projectName + '&testid=' + testID + "&imgname=" + imgName;
            var testcaseURL = './tmp/' + projectName + '/' + testID + '/' + imgName;
            $("#share-btn").attr("href", shareURL);
            $("#discuss-btn").attr("href", discussURL);
            $('#loading-screen').hide();
            $('.result').show();

            //Update Demo List
            var newImg = $('#hidden-demo').clone();
            newImg.find("img").attr('src', testcaseURL);
            newImg.find("h6").html('Date: ' + "<i>" + parseDate(Date().toString()) + "</i>");
            newImg.attr('id', testID);
            //Deactivate other entry animation
            $(".demo-div").css({"animation-name": "" });
            newImg.css({"animation-name": "squareAnim" });
            newImg.show();
            $('#demo-container').children().last().remove();
            $("#demo-container").prepend(newImg);
            setDemoListener(testID);
            //Chart Visualization
            $("#chart").empty();
            var chartData =[], xAxis = [];
            //First index is information for Test Case Num, Image Name, and Project Name
            for (i=1;i<response.length;i++){
                chartData.push(response[i].value * 100);
                xAxis.push(response[i].classname);
            }

            ///Chart Section
            var chartHeight=130 + 40* (response.length-1); //minus the first object which is irrelevant
            console.log("Chart Height: " + chartHeight);
            var options = {
                chart: {
                    height: chartHeight,
                    type: 'bar'
                },
                plotOptions: {
                    bar: {
                        barHeight: '100%',
                        distributed: true,
                        horizontal: true,
                        dataLabels: {
                            position: 'bottom'
                        },
                    }
                },
                colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e', '#f48024', '#69d2e7'],
                dataLabels: {
                    enabled: true,
                    textAnchor: 'start',
                    style: {
                        colors: ['#fff']
                    },
                    formatter: function(val, opt) {
                        return val.toFixed(2);
                    },
                    offsetX: 0,
                    dropShadow: {
                        enabled: true
                    }
                },
                series: [{
                    name: "Probability",
                    data: chartData
                }],
                stroke: {
                    curve: 'smooth',
                    width: 0.5,
                    colors: ['#fff']
                },
                xaxis: {
                    categories: xAxis,
                    title: {
                        text: 'Probability'
                    },
                    labels: {
                        formatter: function(val) {
                            return (Math.abs(Math.round(val)))
                        }
                    }
                },
                yaxis: {
                    min: 0,
                    max: 100,
                    decimalsInFloat: 2,
                    labels: {
                        show: true
                    }
                },
                title: {
                    text: 'Prediction Result',
                    align: 'center',
                    floating: true
                },
                subtitle: {
                    text: 'Model: ',
                    align: 'center',
                },
                tooltip: {
                    theme: 'dark',
                    shared: false,
                    x: {
                        formatter: function(val) {
                            return val
                        }
                    },
                    y: {
                        formatter: function(val) {
                            return Math.abs(val)/100
                        }
                    }
                }
            };

            var chart = new ApexCharts(
                document.querySelector("#chart"),
                options
            );

            chart.render();



        }).fail(function () {
            alert("Sorry. Server unavailable. ");
            window.location.replace('404.html')
        });
    }
    function parseDate(str){
        var originalDate = str.toString();
        var parsedDate = originalDate.slice(0, originalDate.indexOf('GMT'));
        return parsedDate;
    }
    function setDemoListener(name){
        $( "#" + name ).click(function() {
            $("#chart").empty();
            var response = [];
            console.log("clicked" + $(this).attr("id") );
            var tName = $(this).attr("id");
            jQuery.get('./tmp/' + projectName + '/' + tName + '/predictions.txt', function(data) {
                var myvar = data;
                console.log(data);
                var str = data.toString();
                str = str.substr(1,str.length-2);
                var result = str.split(", ");

                console.log(result);
                for (i=0;i<result.length;i+=2)
                {
                    //console.log(res[i][res[i].length-2] + res[i][res[i].length-1]);
                    result[i]=result[i].substr(2,result[i].length-3);
                    result[i+1] = result[i+1].substr(0,result[i+1].length-1);
                    console.log(result[i]);
                    console.log(result[i+1]);
                    response.push({"classname" : result[i],
                            "value": result[i+1]
                        }
                    )
                }
                /////Chart Rendering
                var chartData =[], xAxis = [];
                for (i=0;i<response.length;i++){
                    chartData.push(response[i].value * 100);
                    xAxis.push(response[i].classname);
                }
                console.log(chartData);
                console.log(xAxis);

                ///Chart Section
                var chartHeight=130 + 40* response.length;
                console.log("Chart Height: " + chartHeight);
                var options = {
                    chart: {
                        height: chartHeight,
                        type: 'bar'
                    },
                    plotOptions: {
                        bar: {
                            barHeight: '100%',
                            distributed: true,
                            horizontal: true,
                            dataLabels: {
                                position: 'bottom'
                            },
                        }
                    },
                    colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e', '#f48024', '#69d2e7'],
                    dataLabels: {
                        enabled: true,
                        textAnchor: 'start',
                        style: {
                            colors: ['#fff']
                        },
                        formatter: function(val, opt) {
                            return val.toFixed(2)
                        },
                        offsetX: 0,
                        dropShadow: {
                            enabled: true
                        }
                    },
                    series: [{
                        name: "Probability",
                        data: chartData
                    }],
                    stroke: {
                        curve: 'smooth',
                        width: 0.5,
                        colors: ['#fff']
                    },
                    xaxis: {
                        categories: xAxis,
                        title: {
                            text: 'Probability'
                        },
                        labels: {
                            formatter: function(val) {
                                return (Math.abs(Math.round(val)))
                            }
                        }
                    },
                    yaxis: {
                        min: 0,
                        max: 100,
                        decimalsInFloat: 2,
                        labels: {
                            show: true
                        }
                    },
                    title: {
                        text: 'Prediction Result',
                        align: 'center',
                        floating: true
                    },
                    subtitle: {
                        text: 'Model: ' + projectName,
                        align: 'center',
                    },
                    tooltip: {
                        theme: 'dark',
                        shared: false,
                        x: {
                            formatter: function(val) {
                                return val
                            }
                        },
                        y: {
                            formatter: function(val) {
                                return Math.abs(val)/100
                            }
                        }
                    }
                };

                var chart = new ApexCharts(
                    document.querySelector("#chart"),
                    options
                );

                chart.render();
            });
            $('.result').show();
        });
    }
});