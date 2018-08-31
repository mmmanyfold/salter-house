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
    const imgDataResponse = await axios(productImageRequestConfig(id));
    if (imgDataResponse.status === 200) {
      const { data: { data: [images] } } = imgDataResponse;
      return { id, imageUrl: images['url_standard'] };
    }
    return imgDataResponse.error;
  } catch (e) {
    console.log(`Unable to retrieve image for product: ${id}`);
    return null;
  }
}

function processFilterParam(items) {
  return JSON.parse(items);
}

export const getProducts = (event, context, callback) => {

  let response = {};
  let filterItems = [];
  const { queryStringParameters } = event;

  if (has(queryStringParameters, 'page') && has(queryStringParameters, 'limit')) {

    const { page, limit, filter } = queryStringParameters;

    if (filter) {
      filterItems = filter ? processFilterParam(filter) : [];
    }

    (async () => {

      try {

        const productResponse = await axios(productRequestConfig(page, limit));

        if (productResponse.status === 200) {

          const { data: { data, meta } } = productResponse;

          return Promise.all(data
            .filter(p => !filterItems.some(id => id === p.id))
            .map(async ({ id }) => {
              try {
                return await getImageData(id);
              } catch (e) {
                throw e;
              }
            }))
            .catch(errors => {
              console.log(errors);
              response = {
                statusCode: 500,
                headers,
                body: 'Failed to retrieve images and/or products from API',
              };
              return callback(null, response);
            })
            .then(productImages => {
              const mergeData = productImages.map(productImage => {
                const product = data.find(product => productImage.id === product.id);
                return {
                  ...product,
                  ...productImage,
                }
              });
              response = {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                  data: mergeData,
                  meta,
                }),
              };
              return callback(null, response);
            });
        } else {
          response = {
            statusCode: 500,
            headers,
            body: productResponse.error,
          }
          return callback(null, response);
        }
      } catch (e) {
        response = {
          statusCode: 500,
          headers,
          body: e.message,
        }
        return callback(null, response);
      }
    })();
  } else {
    response = {
      statusCode: 400,
      headers,
      body: JSON.stringify(error('input error: missing limit or page query params.'))
    }
    return callback(null, response);
  }
};

//
// Utilities
//

function error(message) {
  return { 'error': { message } };
}
