import PageManager from './page-manager';
import urlUtils from "./common/url-utils";
import $ from 'jquery';
import axios from 'axios';

const loadingGif = '/stencil/00000000-0000-0000-0000-000000000001//img/loading-apples.gif';

const cartTemplate = ({ id, custom_url: { url }, imageUrl, name }) => `
<article class="card">
    <figure class="card-figure">
        <a href="${url}">
            <div class="card-img-container">
                <img 
                  class="card-image lazyload" 
                  src="${loadingGif}" 
                  data-sizes="auto" 
                  data-src="${imageUrl}" 
                  alt="${name}" 
                  title="${name}">
            </div>
        </a>
        <figcaption class="card-figcaption">
            <div class="card-figcaption-body">
               <a href="#" class="button button--small card-figcaption-button quickview" data-product-id="${id}">Quick view</a>              
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
    }

    onReady() {
        this.bindEvents();
    }

    shouldLoadMore({ current_page, total_pages }) {
        return current_page <= total_pages
    }

    async fetchProductsRequest(page, limit) {
        const baseAPIUrl = 'https://atvef3doab.execute-api.us-east-1.amazonaws.com/dev'
        const endpoint = `${baseAPIUrl}/products?page=${page}&limit=${limit}`;
        try {
            const { data: { data, meta } } = await axios(endpoint, {
                crossdomain: true,
            });
            console.log(meta);
            // check metadata for number of pages
            if (this.shouldLoadMore(meta)) {
                $('#_see-more-btn').hide();
            }
            return data;
        } catch (e) {
            console.log(e);
        }
    }

    bindEvents() {
        const $seeMoreBtn = $('#_see-more-btn');
        const $productGrid = $('.productGrid');
        const limit = 24;
        let page = 2; // assumes page one has been loaded by handlebars template
        $seeMoreBtn.click(async () => {
            const moreProducts = await this.fetchProductsRequest(page, limit);
            $productGrid.append(productItemTemplate(moreProducts));
            page += 1;
        });
    }

}
