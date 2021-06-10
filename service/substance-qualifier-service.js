const axios = require('axios')
const log = global.log
const SERVICE_NAME = 'substance-qualifier-service'

const ADMIN_TEST_REFERENCE_DATA_API_URL = process.env.ADMIN_API_URL + '/TestReferenceData'

async function createSubstanceQualifier (payload) {
    let url = `${ADMIN_TEST_REFERENCE_DATA_API_URL}/Substance`
    log.info(`${SERVICE_NAME}::createSubstanceQualifier - url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createSubstanceQualifier - error:${error}`)
            throw error
        })
}

async function deleteSubstanceQualifier (substanceId) {
    let url = `${ADMIN_TEST_REFERENCE_DATA_API_URL}/Substance/${substanceId}`
    log.info(`${SERVICE_NAME}::deleteSubstanceQualifier - url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteSubstanceQualifier - error:${error}`)
            throw error
        })
}

module.exports.createSubstanceQualifier = createSubstanceQualifier
module.exports.deleteSubstanceQualifier = deleteSubstanceQualifier
