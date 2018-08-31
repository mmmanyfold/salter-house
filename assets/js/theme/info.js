import PageManager from './page-manager';
import $ from 'jquery';
import * as axios from "axios";
import Global from './global';

export default class Info extends PageManager {
    constructor(context) {
        super(context);
        this.mobileMenu = null;
        this.bindEvents();
    }

    async onReady() {
        const $injectedTxt = $('#_injected-page-content-txt');
        const $injectedImg1 = $('#_injected-page-content-img-1');
        const $injectedImg2 = $('#_injected-page-content-img-2');
        try {
            const { data, err } = await this.getInfoPage();
            if (!err) {
                const pageData = this.processAsHtml(data);
                const $paragraph = pageData.querySelectorAll('p')[1];
                const $images = pageData.querySelectorAll('img');
                $injectedTxt.append($paragraph)
                $injectedImg1.append($images[0]);
                $injectedImg2.append($images[1]);
            }
        } catch (e) {
            throw e;
        }

        this.mobileMenu = Global.mobileMenuGetter();
    }

    bindEvents() {
        const $infoBtn = $('#_info-btn');
        const $infoDiv = $('#_info');
        $infoBtn.click(() => {
            $infoDiv.slideToggle('fast');
            $('#_cart').hide();
        });
        const $infoBtnMobile = $('#_info-btn-mobile');
        $infoBtnMobile.click(() => {
            $infoDiv.show();
            this.mobileMenu.hide();
            $('#_cart').hide();
        });
        const $infoBtnClose = $('#_info-btn-close');
        $infoBtnClose.click(() => {
            $infoDiv.slideUp('fast');
            $('html,body').animate({ scrollTop: 0 }, 100);
        });
        const $infoBtnFooter = $('#_info-btn-footer');
        $infoBtnFooter.click(() => {
            $infoDiv.slideDown('fast');
            $('html,body').animate({ scrollTop: 0 }, 100);
            $('#_cart').hide();
        });
    }

    async getInfoPage() {
        const { data, status } = await axios('/hidden');
        if (status !== 200) {
            return { data: null, err: true };
        }
        return { data, err: false };
    }

    processAsHtml(htmlStr) {
        const template = document.createElement('div');
        template.innerHTML = htmlStr;
        return template.querySelector('.Info');
    }
}