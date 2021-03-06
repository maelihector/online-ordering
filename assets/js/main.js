$(document).ready(function () {

  // Javascript used in Materialize' CSS
  
  $('.button-collapse').sideNav({
    closeOnClick: true
  });

  $('#login-modal').modal();

  $('#message-sent').modal();

  $('#mobile-nav-trigger').on('click', function () {

    $('.navigation').css({
      '-webkit-transform': 'translateX(0%)',
      'transform': 'translateX(0%)'
    });

    $('body').addClass('js-modal-visible');

    $('#mobile-nav-trigger').addClass('js-modal-shown');

  });

  $('.js-modal-shown').on('click', function () {
    $('.navigation').css({
      '-webkit-transform': 'translateX(-100%)',
      'transform': 'translateX(-100%)'
    });
  });

  // Function to remove 'Get Started' Button after user clicks on it
  $("#getStarted").on("click", function () {
    var btn = $(this);
    btn.attr("style", "display: none;");
  });

  // Function to animate hero
  $("#enterButton").on("click", function () {
    $('#hero').animate({
      opacity: ".15"
    }, 1000);

  });
});

var width = function () {
  if (window.width > 768) {
    $("#mobile-demo").hide();
  } else {
    $("#mobile-demo").show();
  }
};

width;

$(document).on('click', '.meet-div-link', function () {
  alert("Coming Soon");
});