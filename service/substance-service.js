const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = process.env.ADMIN_BASE_API_URL
const SERVICE_NAME = 'substance-service'

async function createSubstance (payload) {
    let url = `${ADMIN_BASE_API_URL}/substance`
    log.info(`${SERVICE_NAME}::createSubstance:url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createSubstance:error: ${error}`)
        })
}

async function deleteSubstance (productNo) {
    let url = `${ADMIN_BASE_API_URL}/substance/productNo/${productNo}`
    log.info(`${SERVICE_NAME}::deleteSubstance:url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteSubstance:error: ${error}`)
        })
}

module.exports.createSubstance = createSubstance
module.exports.deleteSubstance = deleteSubstance
