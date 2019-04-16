
const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = `${process.env.ADMIN_BASE_API_URL}`
const SERVICE_NAME = 'product-service'

async function createProduct (payload) {
  try {
    let url = ADMIN_BASE_API_URL + '/products/product'
    log.info(`${SERVICE_NAME}::createProduct:url:${url}`)
    return axios.post(url, payload)
  } catch (error) {
    log.error(error)
  }
}

async function deleteProduct (productNo) {
  try {
    let url = ADMIN_BASE_API_URL + `/products/productNo/${productNo}`
    log.info(`${SERVICE_NAME}::deleteProduct:url:${url}`)
    return axios.delete(url)
  } catch (error) {
    log.error(error)
  }
}

module.exports.createProduct = createProduct
module.exports.deleteProduct = deleteProduct