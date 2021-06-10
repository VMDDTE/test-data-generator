const axios = require('axios')
const log = global.log
const SERVICE_NAME = 'reference-data-service'

const ADMIN_TEST_REFERENCE_DATA_API_URL = process.env.ADMIN_API_URL + '/TestReferenceData'

async function createReferenceData (payload) {
    let url = `${ADMIN_TEST_REFERENCE_DATA_API_URL}/${payload.Type}`
    log.info(`${SERVICE_NAME}::createReferenceData - url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createReferenceData - error:${error}`)
            throw error
        })
}

async function deleteReferenceData (referenceDataId) {
    let url = `${ADMIN_TEST_REFERENCE_DATA_API_URL}/${referenceDataId}`
    log.info(`${SERVICE_NAME}::deleteReferenceData - url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteReferenceData - error:${error}`)
            throw error
        })
}

module.exports.createReferenceData = createReferenceData
module.exports.deleteReferenceData = deleteReferenceData