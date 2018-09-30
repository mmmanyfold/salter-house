import $ from 'jquery';
import 'slick-carousel';

export default function () {
    const $carousel = $('[data-slick]');

    if ($carousel.length) {
        $carousel.slick();
    }

    const $carouselProduct = $('.productView-carousel');

    if ($carouselProduct.length) {
        $carouselProduct.slick({
            dots: true,
            mobileFirst: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            arrows: false,
            vertical: false,
            verticalSwiping: false,
            lazyLoad: "anticipated",
        });
        window._currentSlide = 0;
        $carouselProduct.on('beforeChange', (event, slick, currentSlide, nextSlide) => {
          window._currentSlide = currentSlide + 1;
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
