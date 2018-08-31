import $ from "jquery";
import Url from 'url';

export default function (currentUrl) {
    if (currentUrl !== '/') {
        const selector = $('#newArrivals-link');
        selector
            .siblings('div.category-dot-selected-orange')
            .toggleClass('u-hiddenVisually');
        selector
            .siblings('div.category-dot-unselected-orange')
            .toggleClass('u-hiddenVisually');
    } else if (currentUrl === '/') {
        $('.navPages-action')
            .filter('a[id!="newArrivals-link"]') // filter out new category link
            .siblings('div.u-hiddenVisually.category-dot-selected-green')
            .toggleClass('u-hiddenVisually');
    }
    $('#newArrivals-link').click(() => {
        const url = Url.parse(window.location.href, true);
        window.location.href = `${url.protocol}//${url.host}/#new`
    });
}