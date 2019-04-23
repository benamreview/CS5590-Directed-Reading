
$(document).ready(function () {
    $('#explore').click(function(e){
        e.preventDefault();
        var jumpId = $(this).attr('href');
        $('body, html').animate({scrollTop: $(jumpId).offset().top}, 'slow');
    });
    init();
});
function init(){
    //Click Listener for each category
    $(".feature_item").click(function() {
        location.href= "./category.html"
    });
}
