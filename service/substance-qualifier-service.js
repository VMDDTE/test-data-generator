const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = process.env.ADMIN_BASE_API_URL
const SERVICE_NAME = 'substance-qualifier-service'

async function createSubstanceQualifier (payload) {
    let url = `${ADMIN_BASE_API_URL}/reference/substance`
    log.info(`${SERVICE_NAME}::createSubstanceQualifier:url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createSubstanceQualifier:error: ${error}`)
        })
}

async function deleteSubstanceQualifier (substanceId) {
    let url = `${ADMIN_BASE_API_URL}/reference/substance/${substanceId}`
    log.info(`${SERVICE_NAME}::deleteSubstanceQualifier:url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteSubstanceQualifier:error: ${error}`)
        })
}

module.exports.createSubstanceQualifier = createSubstanceQualifier
module.exports.deleteSubstanceQualifier = deleteSubstanceQualifier
