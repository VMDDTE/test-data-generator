
const axios = require('axios')
const log = global.log
const SERVICE_NAME = 'ma-application-service'

const MA_APPLICATION_TEST_MA_APPLICATIONS_API_URL = process.env.MARKETING_AUTHORISATION_APPLICATION_API_URL + '/TestMarketingAuthorisationApplications'

async function createNewMarketingAuthorisationApplication (payload) {
    let url = `${MA_APPLICATION_TEST_MA_APPLICATIONS_API_URL}/New`
    log.info(`${SERVICE_NAME}::createNewMarketingAuthorisationApplication - url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createNewMarketingAuthorisationApplication - error: ${error}`)
            throw error
        })
}

async function createDraftMarketingAuthorisationApplication (payload) {
    let url = `${MA_APPLICATION_TEST_MA_APPLICATIONS_API_URL}/saveAsDraft`
    log.info(`${SERVICE_NAME}::createDraftMarketingAuthorisationApplication:url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createDraftMarketingAuthorisationApplication:error: ${error}`)
            throw error
        })
}

async function createRenewalMarketingAuthorisationApplication (payload) {
    let url = `${MA_APPLICATION_TEST_MA_APPLICATIONS_API_URL}/Renewal`
    log.info(`${SERVICE_NAME}::createRenewalMarketingAuthorisationApplication - url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createRenewalMarketingAuthorisationApplication - error: ${error}`)
            throw error
        })
}

async function createVariationMarketingAuthorisationApplication (payload) {
    let url = `${MA_APPLICATION_TEST_MA_APPLICATIONS_API_URL}/CreateBasicVariation`
    log.info(`${SERVICE_NAME}::createVariationMarketingAuthorisationApplication - url:${url}`)

    return axios.post(url, payload)
      .then((response) => {
          return response.data
      })
      .catch(error => {
          log.error(`${SERVICE_NAME}::createVariationMarketingAuthorisationApplication - error: ${error}`)
          throw error
      })
}

async function deleteMarketingAuthorisationApplication (maApplicationId) {
    let url = `${MA_APPLICATION_TEST_MA_APPLICATIONS_API_URL}/${maApplicationId}`
    log.info(`${SERVICE_NAME}::deleteMarketingAuthorisationApplication - url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteMarketingAuthorisationApplication - error: ${error}`)
            throw error
        })
}

async function deleteMarketingAuthorisationApplicationByInternalReference (maInternalReference) {
    let url = `${MA_APPLICATION_TEST_MA_APPLICATIONS_API_URL}/ByInternalReference/${maInternalReference}`
    log.info(`${SERVICE_NAME}::deleteMarketingAuthorisationApplicationByInternalReference - url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteMarketingAuthorisationApplicationByInternalReference - error: ${error}`)
            throw error
        })
}

module.exports = {
    createDraftMarketingAuthorisationApplication,
    createNewMarketingAuthorisationApplication,
    createRenewalMarketingAuthorisationApplication,
    createVariationMarketingAuthorisationApplication,
    deleteMarketingAuthorisationApplication,
    deleteMarketingAuthorisationApplicationByInternalReference
}
