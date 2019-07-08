
const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = process.env.ADMIN_BASE_API_URL
const SERVICE_NAME = 'marketing-authorisation-service'

async function createMarketingAuthorisation (payload) {
    let url = `${ADMIN_BASE_API_URL}/MarketingAuthorisations/marketingAuthorisation`
    log.info(`${SERVICE_NAME}::createMarketingAuthorisation:url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createMarketingAuthorisation:error: ${error}`)
        })
}

async function deleteMarketingAuthorisation (maId) {
    let url = `${ADMIN_BASE_API_URL}/MarketingAuthorisations/marketingAuthorisation/${maId}`
    log.info(`${SERVICE_NAME}::deleteMarketingAuthorisation:url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteMarketingAuthorisation:error: ${error}`)
        })
}

module.exports.createMarketingAuthorisation = createMarketingAuthorisation
module.exports.deleteMarketingAuthorisation = deleteMarketingAuthorisation
