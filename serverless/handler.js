import axios from 'axios';
import has from 'lodash.has';

const { env } = process;
const { log } = console;

const requestConfig = (page = 1, limit = 12) => ({
    url: `${env['URL']}/v3/catalog/products`,
    headers: {
        'X-Auth-Client': env['X_AUTH_CLIENT'],
        'X-Auth-Token': env['X_AUTH_TOKEN'],
    },
    params: {
        page,
        limit,
    },
    responseType: 'json',
});

export const getProducts = async (event, context, callback) => {
    let response;
    const { queryStringParameters } = event;
    if (has(queryStringParameters, 'page') && has(queryStringParameters, 'limit')) {
        const { page, limit } = queryStringParameters;
        const { data } = await axios(requestConfig(page, limit));
        response = {
            statusCode: 200,
            body: data,
        };
    } else {
        response = {
            statusCode: 400,
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
