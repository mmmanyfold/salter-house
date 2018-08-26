import $ from 'jquery';
import urlUtils from "../common/url-utils";

export default function() {
    let isHome = "/" === urlUtils.getUrl();
    if (isHome) {
        $('header').addClass('header-home');
    }
    $(window).scroll(function (event) {
        didScroll = true;
    });

    setInterval(function () {
        if (window.outerWidth > 800) {
            if (didScroll) {
                hasScrolled();
                didScroll = false;
            }
        } else {
            $('header').removeClass('header-up').removeClass('header-home').addClass('header-down');
        }

    }, 250);
// Hide Header on on scroll down
    let didScroll;
    let lastScrollTop = 0;
    let delta = 5;

    function hasScrolled() {
        let headerbarHeight = $('header').outerHeight();
        let st = window.scrollY;

        // Make sure they scroll more than delta
        if (Math.abs(lastScrollTop - st) <= delta)
            return;

        if (isHome && st >= 584) {
            $('header').removeClass('header-home');
        } else {
            $('header').addClass('header-home');
        }
        // If they scrolled down and are past the headerbar, add class .header-up.
        // This is necessary so you never see what is "behind" the headerbar.
        if (st > lastScrollTop && st > headerbarHeight) {
            // Scroll Down
            $('header').removeClass('header-down').addClass('header-up');
        } else {
            // Scroll Up
            if (st + $(window).height() < $(document).height()) {
                $('header').removeClass('header-up').addClass('header-down');
            }
        }

        lastScrollTop = st;
    }
}
