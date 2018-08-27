import { hooks, api } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import $ from 'jquery';
import FacetedSearch from './common/faceted-search';
import urlUtils from "./common/url-utils";

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

    bindEvents() {
        const $seeMoreBtn = $('#_see-more-btn');
        const $productGrid = $('.productGrid');
        const limit = this.context.categoryProductsPerPage;
        let page = 1;
        $seeMoreBtn.click(async () => {
            const sort = $('#_sort-opt').find(":selected").text().toLowerCase();
            const nextPage = await this.getNextPage(urlUtils.getUrl(), {
                sort,
                page,
                limit,
            });
            const liNodes = this.processRawHtml(nextPage);
            $productGrid.append(liNodes);
            page++;
        })
    }

    async getNextPage(url, params) {
        return new Promise((resolve, reject) =>
            api.getPage(window.location.pathname, params, (err, response) => {
                if (err) {
                    throw new Error(err);
                    return reject(err);
                }
                resolve(response)
            }));
    }

    processRawHtml(html) {
        const template = document.createElement('div');
        template.innerHTML = html;
        const productGrid = template.querySelectorAll('.productGrid li');
        return productGrid;
    }

}
