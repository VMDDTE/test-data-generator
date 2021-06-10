
const axios = require('axios')
const log = global.log
const SERVICE_NAME = 'marketing-authorisation-service'

const MARKETING_AUTHORISATION_TEST_MARKETING_AUTHORISATION_API_URL = process.env.MARKETING_AUTHORISATION_API_URL + '/TestMarketingAuthorisation'

async function createMarketingAuthorisation (payload) {
    let url = MARKETING_AUTHORISATION_TEST_MARKETING_AUTHORISATION_API_URL
    log.info(`${SERVICE_NAME}::createMarketingAuthorisation - url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createMarketingAuthorisation - error:${error}`)
            throw error
        })
}

async function deleteMarketingAuthorisation (maId) {
    let url = `${MARKETING_AUTHORISATION_TEST_MARKETING_AUTHORISATION_API_URL}/${maId}`
    log.info(`${SERVICE_NAME}::deleteMarketingAuthorisation - url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteMarketingAuthorisation - error:${error}`)
            throw error
        })
}

module.exports.createMarketingAuthorisation = createMarketingAuthorisation
module.exports.deleteMarketingAuthorisation = deleteMarketingAuthorisation
