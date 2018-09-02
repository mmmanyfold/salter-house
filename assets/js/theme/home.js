import PageManager from './page-manager';
import urlUtils from "./common/url-utils";
import navUtils from "./common/nav-utils";
import $ from 'jquery';
import api from "@bigcommerce/stencil-utils/src/api";

export default class Home extends PageManager {
  constructor(context) {
    super(context);
    this.currentUrl = urlUtils.getUrl();
    this.categoryProductsPerPage = 36;
  }

  async onReady() {
    const $productGridNew = $('.productGridNew');
    const nextPage = await this.getNextPage('/categories', {
      page: 1,
      limit: 12,
      sort: 'newest',
    });
    const liNodes = this.processRawHtml(nextPage);
    $productGridNew.append(liNodes);
    $productGridNew.find('.new-label')
      .each((i, p) => $(p).removeClass('u-hiddenVisually'));
    this.bindEvents();
    navUtils(this.currentUrl);
    if ($(window).scrollTop() > 0) {
      $('.header').removeClass('header-home')
    }
  }

  bindEvents() {
    const $seeMoreBtn = $('#_see-more-btn');
    const $productGridNew = $('.productGridNew');
    const limit = this.categoryProductsPerPage;
    let page = 2; // assumes page one has been loaded by onReady() call
    $seeMoreBtn.click(async () => {
      const nextPage = await this.getNextPage('/categories', {
        page,
        limit,
        sort: 'newest',
      });
      const liNodes = this.processRawHtml(nextPage);
      if (liNodes.length < this.categoryProductsPerPage) {
        $('#_see-more-btn').hide();
      }
      $productGridNew.append(liNodes);
      page += 1;
    });
  }

  async getNextPage(url, params) {
    return new Promise((resolve, reject) =>
      api.getPage(url, {
        params: params
      }, (err, res) => {
        if (err) {
          throw new Error(err);
          return reject(err);
        }
        return resolve(res);
      }));
  }

  processRawHtml(html) {
    const template = document.createElement('div');
    template.innerHTML = html;
    return template.querySelectorAll('.productGridNew li');
  }

}
