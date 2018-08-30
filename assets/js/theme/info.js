import PageManager from './page-manager';
import $ from 'jquery';
import * as axios from "axios";

export default class Info extends PageManager {
    constructor(context) {
        super(context);
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
    }
    bindEvents() {
        const $infoBtn = $('#_info-btn');
        const $infoDiv = $('#_info');
        $infoBtn.click(() => {
            $infoDiv.slideToggle('fast');
        });
    }
    
    async getInfoPage() {
        const { data, status } = await axios('/info');
        if (status !== 200) {
            return { data: null, err: true };
        }
        return { data, err: false };
    }
    
    processAsHtml(htmlStr) {
        const template = document.createElement('div');
        template.innerHTML = htmlStr;
        return template.querySelector('.static-page');
    }
}