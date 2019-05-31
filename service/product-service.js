
const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = process.env.ADMIN_BASE_API_URL
const SERVICE_NAME = 'product-service'

async function createProduct (payload) {
  let url = `${ADMIN_BASE_API_URL}/products`
  log.info(`${SERVICE_NAME}::createProduct:url:${url}`)

  return axios.post(url, payload)
    .then((response) => {
        return response.data
    })
    .catch(error => {
        log.error(`${SERVICE_NAME}::createProduct:error: ${error}`)
    })
}

async function deleteProduct (productNo) {
  let url = `${ADMIN_BASE_API_URL}/products/productNo/${productNo}`
  log.info(`${SERVICE_NAME}::deleteProduct:url:${url}`)

  return axios.delete(url)
    .then((response) => {
        return response.data
    })
    .catch(error => {
        log.error(`${SERVICE_NAME}::deleteProduct:error: ${error}`)
    })
}

module.exports.createProduct = createProduct
module.exports.deleteProduct = deleteProduct