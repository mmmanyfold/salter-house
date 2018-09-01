import PageManager from './page-manager';
import urlUtils from "./common/url-utils";
import navUtils from "./common/nav-utils";
import $ from 'jquery';
import axios from 'axios';
import _ from 'lodash';

const loadingGif = 'https://s3.us-east-2.amazonaws.com/salter-house-images/loading-apples.gif';

function twoDecimalPlaces(num) {
  return parseFloat(Math.round(num * 100) / 100).toFixed(2);
}

const cartTemplate = ({ id, custom_url: { url }, imageUrl, name, price }) => `
<article class="card">
    <figure class="card-figure">
        <a href="${url}">
            <div class="card-img-container">
                <img 
                  class="card-image lazyload" 
                  src="${loadingGif}"
                  data-sizes="auto" 
                  data-src="${imageUrl}">
            </div>
        </a>
        <figcaption class="card-figcaption">
            <h5 class="overlay-text">${name}</h5>
            <div class="overlay-bottom">
                <h5 class="overlay-text">$${twoDecimalPlaces(price)}</h5>
                <div class="card-figcaption-body">
                      <a href="#" class="button button--small card-figcaption-button quickview" data-product-id="${id}">PREVIEW</a>
                </div>
            </div>
        </figcaption>
    </figure>
</article>`;

const productItemTemplate = (products) =>
  products.map(product => {
    return `
              <li class="product">
                    ${cartTemplate(product)} 
              </li>
       `;
  });

export default class Home extends PageManager {
  constructor(context) {
    super(context);
    this.currentUrl = urlUtils.getUrl();
    this.filterNewItems = null;
  }

  onReady() {
    if ($(window).scrollTop() > 0) {
      $('.header').removeClass('header-home')
    }
    navUtils(this.currentUrl);

    const items = $('[data-filter-product-ids-from-api]').data('filterProductIdsFromApi');
    this.filterNewItems = items.split(',').filter(e => e).map(e => +e);
    this.bindEvents();
  }

  async fetchProductsRequest(page, limit) {
    const baseAPIUrl = 'https://hi1q1w1kij.execute-api.us-east-1.amazonaws.com/dev';
    // const baseAPIUrl = 'http://localhost:4000';
    const endpoint = `${baseAPIUrl}/products?page=${page}&limit=${limit}&filter=[${this.filterNewItems}]`;
    try {
      const productDataResponse = await axios(endpoint, {
        crossdomain: true,
      });

      if (productDataResponse.status === 200) {
        const {
          data: {
            data,
            meta: { pagination: { current_page, total_pages } }
          }
        } = productDataResponse;

        if (_.isEmpty(data) || current_page === total_pages) {
          $('#_see-more-btn').hide();
        }

        return data;
      }
    } catch (e) {
      throw e;
    }
  }

  bindEvents() {
    const $seeMoreBtn = $('#_see-more-btn');
    const $productGrid = $('.productGrid');
    const limit = 36;
    let page = 2; // assumes page one has been loaded by handlebars template
    $seeMoreBtn.click(async () => {
      const moreProducts = await this.fetchProductsRequest(page, limit);
      if (!_.isEmpty(moreProducts)) {
        $productGrid.append(productItemTemplate(moreProducts));
        page += 1;
      }
    });
  }

}
