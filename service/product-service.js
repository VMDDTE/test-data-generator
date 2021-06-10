
const axios = require('axios')
const log = global.log
const SERVICE_NAME = 'product-service'

const ADMIN_TEST_PRODUCTS_API_URL = process.env.ADMIN_API_URL + '/TestProducts'

async function createProduct (payload) {
    let url = ADMIN_TEST_PRODUCTS_API_URL
    log.info(`${SERVICE_NAME}::createProduct - url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createProduct - error:${error}`)
            throw error
        })
}

async function deleteProduct (productNo) {
    let url = `${ADMIN_TEST_PRODUCTS_API_URL}/ByProductNo/${productNo}`
    log.info(`${SERVICE_NAME}::deleteProduct - url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteProduct - error:${error}`)
            throw error
        })
}

module.exports.createProduct = createProduct
module.exports.deleteProduct = deleteProduct