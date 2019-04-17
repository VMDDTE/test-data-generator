
const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = `${process.env.ADMIN_BASE_API_URL}`
const SERVICE_NAME = 'species-service'

async function createSpecies (payload) {
  try {
    let url = ADMIN_BASE_API_URL + '/species/product'
    log.info(`${SERVICE_NAME}::createSpecies:url:${url}`)
    return axios.post(url, payload)
  } catch (error) {
    log.error(error)
  }
}

async function deleteSpecies (productNo) {
  try {
    let url = ADMIN_BASE_API_URL + `/species/productNo/${productNo}`
    log.info(`${SERVICE_NAME}::deleteSpecies:url:${url}`)
    return axios.delete(url)
  } catch (error) {
    log.error(error)
  }
}

module.exports.createSpecies = createSpecies
module.exports.deleteSpecies = deleteSpecies