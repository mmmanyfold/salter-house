import $ from 'jquery';
import urlUtils from "../common/url-utils";

let isHome;

const header = $('header');

let lastScrollTop = 0;

// Hide Header on on scroll down
function hasScrolled() {
    const delta = 5;

    let headerbarHeight = header.outerHeight();
    let st = window.scrollY;

    // Make sure they scroll more than delta
    if (Math.abs(lastScrollTop - st) <= delta)
        return;

    if (isHome && st < 584) {
        header.addClass('header-home');
    } else {
        header.removeClass('header-home');
    }
    // If they scrolled down and are past the headerbar, add class .header-up.
    // This is necessary so you never see what is "behind" the headerbar.
    if (st > lastScrollTop && st > headerbarHeight) {
        // Scroll Down
        header.removeClass('header-down').addClass('header-up');
    } else {
        // Scroll Up
        if (st + $(window).height() < $(document).height()) {
            header.removeClass('header-up').addClass('header-down');
        }
    }

    lastScrollTop = st;
}

export default function () {
    let didScroll;

    isHome = "/" === urlUtils.getUrl();

    if (isHome) {
        header.addClass('header-home');
    }
    $(window).scroll(function (event) {
        didScroll = true;
    });

    setInterval(function () {
        isHome = "/" === urlUtils.getUrl();
        if (window.outerWidth > 800) {
            if (didScroll) {
                hasScrolled();
                didScroll = false;
            }
        } else {
            header.removeClass('header-up header-home').addClass('header-down');
        }

    }, 250);
}
