(function($) {
    "use strict";

    //======= Run on Window Load ============
    $('.loading-wrapper').css({
        'visibility': 'visible'
    }).animate({
        opacity: '1'
    }, 600);
    $(window).load(function() {

        // //loader and Intro Animations
        // $('.animated').css({
        //     'opacity': 0
        // });
        // $('#page-loader').delay(1000).fadeOut(400, function() {
        //     $('#body').addClass('fadeInUp');
        // });


        //Viewport
        var windowHeight = $(window).height();

        function adjustViewport() {
            $('.viewport').css('min-height', windowHeight);
        }

        adjustViewport();

        $(window).resize(function() {
            windowHeight = $(window).height();
            adjustViewport();
        });

        // var $container = $('#mansonry');
        // // initialize Masonry after all images have loaded  
        // $container.imagesLoaded(function() {
        //     $container.masonry({
        //         itemSelector: '.mansonry-item'
        //     });
        // });

        // >> Owl Carousel
        var owlCarousel = $("#slideshow-gallery");

        owlCarousel.owlCarousel({
            navigation: true, // Show next and prev buttons
            slideSpeed: 300,
            paginationSpeed: 400,
            responsiveRefreshRate: 200,
            responsiveBaseWidth: window,
            pagination: false,
            singleItem: false,
            items: 3,
            autoPlay: 8000,
            loop: true,
            //autoplayTimeout: 1000,
            navigationText: ["<span class='fa fa-chevron-left'></span>", "<span class='fa fa-chevron-right'></span>"],
            afterAction: function(el) {
                //remove class active
                this.$owlItems.removeClass('active');
                //add class active
                this.$owlItems.eq(this.currentItem + 1).addClass('active')
            }
        });
    });


    //==== Run on Document Ready ========
    $(document).ready(function() {

        //=====>  Countdown (Edit this with your own date)  <====
        $("#countdown").countdown("2019/12/03", function(event) {
            var $this = $(this).html(event.strftime('' +
                '<div class="countdown-col-wrapper col-xs-3"><div class="countdown-col"><span class="countdown-time"> %-D </span> Dias </div></div> ' +
                '<div class="countdown-col-wrapper col-xs-3"><div class="countdown-col"><span class="countdown-time"> %H </span> Horas </div></div>' +
                '<div class="countdown-col-wrapper col-xs-3"><div class="countdown-col"><span class="countdown-time"> %M </span> Minutos </div></div>' +
                '<div class="countdown-col-wrapper col-xs-3"><div class="countdown-col"><span class="countdown-time"> %S </span> Segundos </div></div>'));
        });


        //Blog item - Hover
        $(".blog-item a").on({
            mouseenter: function() {
                $(this).parents('.blog-item').addClass('blog-item-hover');
            },
            mouseleave: function() {
                $(this).parents('.blog-item').removeClass('blog-item-hover');
            }
        });

        //Submenus
        $('.hd-list-menu li ul').hide();

        $('.hd-list-menu li').on({
            mouseenter: function() {
                $(this).find('> ul').fadeIn(200);
            },
            mouseleave: function() {
                $(this).find('> ul').fadeOut(200);
            }
        });


        //Home Slideshow
        $('.bg-slideshow').cycle({
            speed: 1600,
            slides: '> div'
        });

        //Active Page
        var str = location.href.toLowerCase();
        $(".hd-list-menu li a").each(function() {
            if (str.indexOf(this.href.toLowerCase()) > -1) {
                $("li.active").removeClass("active");
                $(this).parent().addClass("active");
            }
        });

        //Fade Between Links
        var newLocation = '';
        $('.hd-list-menu a').on('click', function(event) {

            event.preventDefault();

            newLocation = this.href;

            $('body').fadeOut(300, newpage);

        });

        function newpage() {
            window.location = newLocation;
        }


        //Nivo Lightbox
        $('#mansonry a').nivoLightbox({
            effect: 'fade'
        });


        //Smooth Scroll Anchor
        $('a[href*=#]:not([href=#])').on('click', function() {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                    return false;
                }
            }
        });

        //Form Validator
        $(".error").hide();
        $(".success").hide();
        $(".wait").hide();

        $('.form-send input').on('click', function() {
            $(this).attr("value", "Sending...");
        });
        $("#contactForm").validate({
            invalidHandler: function(event, validator) {
                $('.form-send input').attr("value", "Send");
            },
            submitHandler: function(form) {
                $.ajax({
                    type: "POST",
                    url: "php/contact-form.php",
                    data: {
                        "name": $("#contactForm #name").val(),
                        "email": $("#contactForm #email").val(),
                        "guests": $("#contactForm #guests").val(),
                        "attending": $("#contactForm #attending").val(),
                        "message": $("#contactForm #message").val()
                    },
                    dataType: "json",
                    success: function(data) {
                        if (data.response == "success") {
                            $('#contactForm').slideUp(200, 'linear');
                            $("#contactSuccess").delay(400).slideDown(300, 'linear');
                            $("#contactError").hide();

                            // $("#contactForm #name, #contactForm #email, #contactForm #subject, #contactForm #message")
                            // fadeOut(400);        

                        } else {
                            $('#contactForm').slideUp(300);
                            $("#contactError").fadeIn(300);
                            $("#contactSuccess").hide();
                            $('.form-send input').attr("value", "Send");
                        }
                    },
                    beforeSend: function() {
                        $('#contactForm').slideUp(300);
                        $("#contactSending").delay(400).slideDown(300, 'linear');
                    }

                });
            }
        });
    });
})(jQuery);
const linkClickEvent = (event) => {
    event.preventDefault();
    const section = event.currentTarget.href.split('#')[1];
    showSection(section);
};
const submitEvent = (event) => {
        event.preventDefault();
        const formData = {
            id: event.target.elements[1].value,
            confirmado: event.target.elements[0].value,
        };
        fetch('/api/invitations', {
                method: 'PUT', // or 'PUT'
                body: JSON.stringify(formData), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                asistencia(data)
            })
            .catch(error => console.error(error));
    }
    (function() {
        setTimeout(function() {
            document.querySelector('#page-loader').classList.toggle('disappear');
        }, 1000);

        const links = document.querySelectorAll('.link');
        links.forEach(link => {
            link.addEventListener('click', linkClickEvent, false);
        })
        loadUser(assingUser);
        document.querySelector('#contactForm').addEventListener('submit', submitEvent);
    })();

function showSection(section) {
    const loader = document.querySelector('#page-loader').classList;
    const menuIsOpen = document.querySelector('.navbar-collapse').classList.contains('in') // .classList.toggle('collapsed')

    loader.toggle('disappear');
    setTimeout(function() {
        if (menuIsOpen) {
            document.querySelector(`button.navbar-toggle`).click()
        }
        const pagesSection = document.querySelectorAll('.page-content');
        pagesSection.forEach(page => {
            page.style.display = 'none'
        });
        document.querySelector(`#${section}`).style.display = 'inherit'
        setTimeout(function() { loader.toggle('disappear') }, 300);
    }, 1000);

}

function loadUser(cb) {
    const telefono = getUrlParameter('t');
    if (telefono !== undefined) {
        fetch(`/api/invitations/telefono/${telefono}`)
            .then(response => response.json())
            .then(data => {
                cb(data[0]);
            })
            .catch(error => console.error(error));
    }
}

function assingUser(user) {
    if (user !== null) {
        console.log(user);
        const familyHome = document.querySelector('#family-home');
        familyHome.querySelector('#apellidos').innerHTML = user.apellidos
        familyHome.setAttribute('style', 'display: inline');

        document.querySelector('#nombreInvitado').innerHTML = user.nombre + '' + user.apellidos;
        document.querySelector('#telefono').innerHTML = user.telefono;
        document.querySelector('#numeroInvitados').innerHTML = user.invitados;
        document.querySelector('#asistenciaNoUser').toggleAttribute('hidden');
        asistencia(user);
    }

}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function asistencia(user) {
    document.querySelector('#idUser').value = user.id;
    console.log(user);
    switch (user.confirmado) {
        case '-':
            document.querySelector('#confirmarAsistencia').removeAttribute('hidden');
            document.querySelector('#asistenciaRechazada').setAttribute('hidden', true);
            document.querySelector('#asistenciaConfirmada').setAttribute('hidden', true);
            break;
        case 'false':
            document.querySelector('#asistenciaRechazada').removeAttribute('hidden');
            document.querySelector('#confirmarAsistencia').setAttribute('hidden', true);
            document.querySelector('#asistenciaConfirmada').setAttribute('hidden', true);
            break;
        case 'true':
            document.querySelector('#asistenciaRechazada').setAttribute('hidden', true);
            document.querySelector('#confirmarAsistencia').setAttribute('hidden', true);
            document.querySelector('#asistenciaConfirmada').removeAttribute('hidden');
            break;
    }
}