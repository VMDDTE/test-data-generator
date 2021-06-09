const axios = require('axios')
const log = global.log
const TEST_SUPPORT_API_URL = process.env.TEST_SUPPORT_API_URL
const SERVICE_NAME = 'substance-service'

async function createSubstance (payload) {
    let url = `${TEST_SUPPORT_API_URL}/substance`
    log.info(`${SERVICE_NAME}::createSubstance:url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createSubstance:error: ${error}`)
            throw error
        })
}

async function deleteSubstance (productNo) {
    let url = `${TEST_SUPPORT_API_URL}/substance/productNo/${productNo}`
    log.info(`${SERVICE_NAME}::deleteSubstance:url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteSubstance:error: ${error}`)
            throw error
        })
}

module.exports.createSubstance = createSubstance
module.exports.deleteSubstance = deleteSubstance
