import { hooks, api } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import $ from 'jquery';
import FacetedSearch from './common/faceted-search';
import urlUtils from "./common/url-utils";
import axios from 'axios';

const { log } = console;

const itemTempate = ({ id, custom_url: { url }, imageUrl }) => `
<article class="card">
    <figure class="card-figure">
        <a href="${url}">
            <div class="card-img-container">
                <img 
                  class="card-image lazyload" 
                  src="https://cdn8.bigcommerce.com/s-on22su51q0/images/stencil/500x500/products/485/563/original__87816.1534972977.png?c=2" 
                  data-sizes="auto" 
                  data-src="${imageUrl}" 
                  alt="{{image.alt}}" 
                  title="{{image.alt}}">
            </div>
        </a>
    </figure>
</article>
`;

const productItemTemplate = (products) =>
    products.map(product => {
        log(product)
        return `
              <li class="product">
                    ${itemTempate(product)} 
              </li>
       `;
    });


export default class Category extends CatalogPage {

    constructor(context) {
        super(context);
        this.currentUrl = urlUtils.getUrl();
    }

    onReady() {
        const currentUrl = this.currentUrl;
        const currentCategoryNode = $('.navPages-action').filter((index, elem) => {
            const url = $(elem).attr('href');
            return !!url && url.includes(currentUrl);
        });

        $(currentCategoryNode)
            .siblings('div.u-hiddenVisually.category-dot-selected')
            .toggleClass('u-hiddenVisually');

        $(currentCategoryNode)
            .siblings('div.category-dot-unselected')
            .toggleClass('u-hiddenVisually');

        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }
        this.bindEvents();
    }

    initFacetedSearch() {
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        });
    }

    shouldLoadMore({ current_page, total_pages }) {
        return current_page <= total_pages
    }

    async fetchProductsRequest(page = 1) {
        const limit = this.context.categoryProductsPerPage;
        const baseAPIUrl = 'https://atvef3doab.execute-api.us-east-1.amazonaws.com/dev'
        const endpoint = `${baseAPIUrl}/products?page=${page}&limit=${limit}`;
        try {
            const { data: { data, meta } } = await axios(endpoint, {
                crossdomain: true,
            });
            console.log(meta);
            // check metadata for number of pages
            if (this.shouldLoadMore(meta)) {
                // hide $seeMoreBtn
            }
            return data;
        } catch (e) {
            console.log(e);
        }
    }

    bindEvents() {
        const $seeMoreBtn = $('#_see-more-btn');
        const $productGrid = $('.productGrid');
        let page = 1;
        $seeMoreBtn.click(async () => {
            // const moreProducts = await this.fetchProductsRequest();
            // console.log(moreProducts);
            // $productGrid.append(productItemTemplate(moreProducts));
            api.getPage(urlUtils.getUrl(), {
                params: {
                    sort: 'featured',
                    page,
                    limit: 12,
                },
            }, (err, response) => {
                if (err) {
                    throw new Error(err);
                    return;
                }
                page++;
                $('body').append(response)
                console.log(response);
            });
        })
    }

}
