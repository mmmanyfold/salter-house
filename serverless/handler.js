import axios from 'axios';
import has from 'lodash.has';

const { env } = process;

const headers = {
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
};

const productRequestConfig = (page = 1, limit = 12) => ({
    url: `${env['URL']}/v3/catalog/products`,
    headers: {
        'X-Auth-Client': env['X_AUTH_CLIENT'],
        'X-Auth-Token': env['X_AUTH_TOKEN'],
    },
    params: {
        page,
        limit,
        is_visible: 1,
    },
    responseType: 'json',
});

const productImageRequestConfig = (id) => ({
    url: `${env['URL']}/v3/catalog/products/${id}/images`,
    headers: {
        'X-Auth-Client': env['X_AUTH_CLIENT'],
        'X-Auth-Token': env['X_AUTH_TOKEN'],
    },
    responseType: 'json',
});

async function getImageData(id) {
    try {
        const { data: { data: [images] } } = await axios(productImageRequestConfig(id));
        return { id, imageUrl: images['url_standard'] };
    } catch (e) {
        console.log(`Unable to retrieve image for product: ${id}`);
        return null;
    }
}

function processFilterParam(items) {
    return JSON.parse(items);
}

export const getProducts = async (event, context, callback) => {
    let response;
    let filterItems = [];
    const { queryStringParameters } = event;
    if (has(queryStringParameters, 'page') && has(queryStringParameters, 'limit')) {
        const { page, limit, filter } = queryStringParameters;
        if (filter) {
            filterItems = filter ? processFilterParam(filter) : [];
        }
        try {
            const { data: { data, meta } } = await axios(productRequestConfig(page, limit));
            return Promise.all(
                data.filter(p => !filterItems.some(id => id === p.id))
                    .map(async ({ id }) => await getImageData(id)))
                .catch(errors => {
                    console.log(errors);
                    return {
                        statusCode: 500,
                        headers,
                        body: 'Failed to retrieve images and/or products from API',
                    };
                })
                .then(productImages => {
                    const mergeData = productImages.map(productImage => {
                        const product = data.find(product => productImage.id === product.id);
                        return {
                            ...product,
                            ...productImage,
                        }
                    });
                    return response = {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({
                            data: mergeData,
                            meta,
                        }),
                    };
                });
        } catch (e) {
            response = {
                statusCode: 500,
                headers,
                body: e.message,
            }
        }
    } else {
        response = {
            statusCode: 400,
            headers,
            body: JSON.stringify(error('input error: missing limit or page query params.'))
        }
    }
    callback(null, response);
};

//
// Utilities
//

function error(message) {
    return { 'error': { message } };
}
