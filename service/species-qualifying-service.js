
const axios = require('axios')
const log = global.log
const SERVICE_NAME = 'species-qualifying-service'

const ADMIN_TEST_REFERENCE_DATA_API_URL = process.env.ADMIN_API_URL + '/TestReferenceData'

async function createSpeciesQualifying (payload) {
    let url = `${ADMIN_TEST_REFERENCE_DATA_API_URL}/species`
    log.info(`${SERVICE_NAME}::createSpeciesQualifying - url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createSpeciesQualifying - error:${error}`)
            throw error
        })
}

async function deleteSpeciesQualifying (speciesId) {
    let url = `${ADMIN_TEST_REFERENCE_DATA_API_URL}/Species/${speciesId}`
    log.info(`${SERVICE_NAME}::deleteSpeciesQualifying - url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteSpeciesQualifying - error:${error}`)
            throw error
        })
}

module.exports.createSpeciesQualifying = createSpeciesQualifying
module.exports.deleteSpeciesQualifying = deleteSpeciesQualifying
