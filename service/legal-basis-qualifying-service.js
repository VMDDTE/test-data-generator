
const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = process.env.ADMIN_BASE_API_URL
const SERVICE_NAME = 'legal-basis-qualifying-service'

async function createLegalBasisQualifying (payload) {
    let url = `${ADMIN_BASE_API_URL}/reference/legalBasis/${payload.Type}`
    log.info(`${SERVICE_NAME}::createLegalBasisQualifying:url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createLegalBasisQualifying:error: ${error}`)
            throw error
        })
}

async function deleteLegalBasisQualifying (legalBasisId) {
    let url = `${ADMIN_BASE_API_URL}/reference/legalBasis/${legalBasisId}`
    log.info(`${SERVICE_NAME}::deleteLegalBasisQualifying:url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteLegalBasisQualifying:error: ${error}`)
            throw error
        })
}

module.exports.createLegalBasisQualifying = createLegalBasisQualifying
module.exports.deleteLegalBasisQualifying = deleteLegalBasisQualifying
