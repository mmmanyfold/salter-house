import $ from 'jquery';
import Url from 'url';
import urlUtils from "./common/url-utils";

let homePageEventRegister = false;

export default class PageManager {

    constructor(context) {
        this.currentUrl = urlUtils.getUrl();
        this.context = context;
        homePageEventRegister = !homePageEventRegister;
        console.log('got here 0');
    }

    type() {
        return this.constructor.name;
    }

    onReady() {
        console.log('got here 1');
        if (homePageEventRegister) {
            console.log('got here 2');
            if (this.currentUrl !== '/') {
                const selector = $('#newArrivals-link');
                selector
                    .siblings('div.category-dot-selected-orange')
                    .toggleClass('u-hiddenVisually');
                selector
                    .siblings('div.category-dot-unselected-orange')
                    .toggleClass('u-hiddenVisually');
            } else if (this.currentUrl === '/') {
                console.log('got here 3');
                $('.navPages-action')
                    // filter out new category link
                    .filter('a[id!="newArrivals-link"]')
                    .siblings('div.u-hiddenVisually.category-dot-selected-green')
                    .toggleClass('u-hiddenVisually');
            }
            $('#newArrivals-link').click(() => {
                const url = Url.parse(window.location.href, true);
                window.location.href = `${url.protocol}//${url.host}/#new`
            });
        }
    }

    static load(context) {
        const page = new this(context);

        $(document).ready(() => {
            page.onReady.bind(page)();
        });
    }
}
