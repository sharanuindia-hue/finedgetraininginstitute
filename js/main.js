(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Courses carousel
    $(".courses-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        loop: true,
        dots: false,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    // Team carousel
    $(".team-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 30,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
    });


    // Related carousel
    $(".related-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 30,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            }
        }
    });

 $(".partner-carousel").owlCarousel({
      loop: true,
      autoplay: true,
      autoplayTimeout: 1,       // almost zero delay
      autoplaySpeed: 3000,      // controls speed
      autoplayHoverPause: false,
      smartSpeed: 3000,
      dots: false,
      nav: false,
      margin: 40,
      slideTransition: "linear", // smooth non-stop movement
      responsive: {
        0:   { items: 2 },
        576: { items: 3 },
        768: { items: 4 },
        992: { items: 5 }
      }
    });

    $(document).ready(function(){
  var owl = $('.program-carousel');
  
  owl.owlCarousel({
    loop: true,             // Infinite looping
    margin: 20,
    autoplay: true,         // Enable auto-sliding
    autoplayTimeout: 3000,  // Slide every 3 seconds
    autoplayHoverPause: true, // Stop sliding when mouse is over a card
    smartSpeed: 800,        // Smooth transition speed
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      1200: { items: 4 }
    }
  });

  // Custom Navigation (linking your < and > buttons)
  $('.custom-next').click(function() {
    owl.trigger('next.owl.carousel');
  });
  
  $('.custom-prev').click(function() {
    owl.trigger('prev.owl.carousel');
  });
});

$(document).ready(function(){
  var courseOwl = $('.course-carousel');

  courseOwl.owlCarousel({
    loop: true,
    margin: 20,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    smartSpeed: 800,
    nav: false, // Disabling default nav as we have custom buttons
    dots: true,
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      1200: { items: 4 }
    }
  });

  // Custom Navigation Trigger
  $('.custom-next').click(function() {
    courseOwl.trigger('next.owl.carousel');
  });

  $('.custom-prev').click(function() {
    courseOwl.trigger('prev.owl.carousel');
  });
});
    
})(jQuery);



