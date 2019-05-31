
const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = process.env.ADMIN_BASE_API_URL
const SERVICE_NAME = 'species-service'

async function createSpecies (payload) {
  let url = `${ADMIN_BASE_API_URL}/species`
  log.info(`${SERVICE_NAME}::createSpecies:url:${url}`)
  
  return axios.post(url, payload)
    .then((response) => {
        return response.data
    })
    .catch(error => {
        log.error(`${SERVICE_NAME}::createSpecies:error: ${error}`)
    })
}

async function deleteSpecies (productNo) {
  let url = `${ADMIN_BASE_API_URL}/species/productNo/${productNo}`
  log.info(`${SERVICE_NAME}::deleteSpecies:url:${url}`)

  return axios.delete(url)
    .then((response) => {
        return response.data
    })
    .catch(error => {
        log.error(`${SERVICE_NAME}::deleteSpecies:error: ${error}`)
    })
}

module.exports.createSpecies = createSpecies
module.exports.deleteSpecies = deleteSpecies