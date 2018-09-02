import PageManager from './page-manager';
import urlUtils from "./common/url-utils";
import navUtils from "./common/nav-utils";
import $ from 'jquery';

export default class Home extends PageManager {
  constructor(context) {
    super(context);
    this.currentUrl = urlUtils.getUrl();
  }

  async onReady() {
    navUtils(this.currentUrl);
    if ($(window).scrollTop() > 0) {
      $('.header').removeClass('header-home')
    }
  }
}
