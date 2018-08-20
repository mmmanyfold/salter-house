import $ from 'jquery';
import Url from 'url';

let newArrivalsClickEventRegistered = false;

export default class PageManager {

    constructor(context) {
        this.context = context;
        newArrivalsClickEventRegistered = !newArrivalsClickEventRegistered;
        if (newArrivalsClickEventRegistered) {
            $('#newArrivals-link').click(() => {
                const url = Url.parse(window.location.href, true);
                window.location.href=`${url.protocol}//${url.host}/#new`
            });
        }

    }

    type() {
        return this.constructor.name;
    }

    onReady() {
    }

    static load(context) {
        const page = new this(context);

        $(document).ready(() => {
            page.onReady.bind(page)();
        });
    }
}
