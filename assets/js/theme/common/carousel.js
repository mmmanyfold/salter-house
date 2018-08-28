import $ from 'jquery';
import 'slick-carousel';

export default function () {
    const $carousel = $('[data-slick]');
    const autoplaySpeed = +$('[data-carousel-swap-frequency]');

    if ($carousel.length) {
        $carousel.slick({
            dots: true,
            mobileFirst: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            arrows: false,
            vertical: false,
            verticalSwiping: true,
            autoplaySpeed,
            lazyLoad: "anticipated",
            responsive: [{
                breakpoint: 501,
                settings: {
                    vertical: true,
                },
            }, {
                breakpoint: 801,
                settings: {
                    vertical: false,
                },
            }]
        });
    }

    // Alternative image styling for IE, which doesn't support objectfit
    if (typeof document.documentElement.style.objectFit === 'undefined') {
        $('.heroCarousel-slide').each(() => {
            const $container = $(this);
            const imgUrl = $container.find('img').data('lazy');

            if (imgUrl) {
                $container.css('backgroundImage', `url(${imgUrl})`).addClass('compat-object-fit');
            }
        });
        $('.productView-carousel-slide').each(() => {
            const $container = $(this);
            const imgUrl = $container.find('img').data('lazy');

            if (imgUrl) {
                $container.css('backgroundImage', `url(${imgUrl})`).addClass('compat-object-fit');
            }
        });
    }
}
