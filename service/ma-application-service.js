
const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = process.env.ADMIN_BASE_API_URL
const SERVICE_NAME = 'ma-application-service'

async function createMarketingAuthorisationApplication (payload) {
    let url = `${ADMIN_BASE_API_URL}/MarketingAuthorisationApplication/new`
    log.info(`${SERVICE_NAME}::createMarketingAuthorisationApplication:url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createMarketingAuthorisationApplication:error: ${error}`)
            throw error
        })
}

async function deleteMarketingAuthorisationApplication (maApplicationId) {
    let url = `${ADMIN_BASE_API_URL}/MarketingAuthorisationApplication/${maApplicationId}`
    log.info(`${SERVICE_NAME}::deleteMarketingAuthorisationApplication:url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteMarketingAuthorisationApplication:error: ${error}`)
            throw error
        })
}

module.exports.createMarketingAuthorisationApplication = createMarketingAuthorisationApplication
module.exports.deleteMarketingAuthorisationApplication = deleteMarketingAuthorisationApplication
