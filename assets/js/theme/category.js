import { hooks, api } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import $ from 'jquery';
import FacetedSearch from './common/faceted-search';
import urlUtils from "./common/url-utils";
import navUtils from "./common/nav-utils";

export default class Category extends CatalogPage {

    constructor(context) {
        super(context);
        this.currentUrl = urlUtils.getUrl();
        this.currentPage = 1;
    }

    async onReady() {
        const $productGridNew = $('#_productGridNew');
        const $newLink = $('#newArrivals-link');
        navUtils(this.currentUrl)
        const currentCategoryNode = $('.navPages-action').filter((index, elem) => {
            const url = $(elem).attr('href');
            return !!url && url.includes(this.currentUrl);
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

        // if /new
        if ($productGridNew.length) {
          $newLink
            .siblings('div.category-dot-selected-orange')
            .toggleClass('u-hiddenVisually');
          const page = await this.getPage('/categories', {
            sort: 'newest',
            limit: this.context.categoryProductsPerPage,
          });
          const liNodes = this.processRawHtml(page);
          $productGridNew.append(liNodes);
          $productGridNew.find('.new-label')
            .each((i, p) => $(p).removeClass('u-hiddenVisually'));
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
        this.currentPage += 1; // assumes page one has been loaded by handlebars template
        $seeMoreBtn.click(async () => {
            const sort = $('#sort').find(":selected").text().toLowerCase();
            const nextPage = await this.getPage(window.location.pathname, {
                sort,
                page: this.currentPage,
                limit,
            });
            const liNodes = this.processRawHtml(nextPage);
            $productGrid.append(liNodes);
            this.currentPage += 1;
            const manyLi = $('.productGrid li').length;
            window.history.replaceState({ page: this.currentPage }, null, `?page=1&limit=${manyLi}`);
        });
    }

    async getPage(url, params) {
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
        const productGrid = template.querySelectorAll('.productGrid li');
        if (productGrid.length < this.context.categoryProductsPerPage) {
            $('#_see-more-btn').hide();
        }
        return productGrid;
    }
}
