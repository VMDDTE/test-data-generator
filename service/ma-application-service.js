
const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = process.env.ADMIN_BASE_API_URL
const SERVICE_NAME = 'ma-application-service'

async function createNewMarketingAuthorisationApplication (payload) {
    let url = `${ADMIN_BASE_API_URL}/MarketingAuthorisationApplication/new`
    log.info(`${SERVICE_NAME}::createNewMarketingAuthorisationApplication:url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createNewMarketingAuthorisationApplication:error: ${error}`)
            throw error
        })
}

async function createDraftNewMarketingAuthorisationApplication (payload) {
    let url = `${ADMIN_BASE_API_URL}/MarketingAuthorisationApplication/saveAsDraft`
    log.info(`${SERVICE_NAME}::createNewMarketingAuthorisationApplication:url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createNewMarketingAuthorisationApplication:error: ${error}`)
            throw error
        })
}

async function createRenewalMarketingAuthorisationApplication (payload) {
    let url = `${ADMIN_BASE_API_URL}/MarketingAuthorisationApplication/renewal`
    log.info(`${SERVICE_NAME}::createRenewalMarketingAuthorisationApplication:url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createRenewalMarketingAuthorisationApplication:error: ${error}`)
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

async function deleteMarketingAuthorisationApplicationByInternalReference (maInternalReference) {
    let url = `${ADMIN_BASE_API_URL}/MarketingAuthorisationApplication/deleteByInternalReference/${maInternalReference}`
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

module.exports = {
    createDraftNewMarketingAuthorisationApplication,
    createNewMarketingAuthorisationApplication,
    createRenewalMarketingAuthorisationApplication,
    deleteMarketingAuthorisationApplication,
    deleteMarketingAuthorisationApplicationByInternalReference
}
