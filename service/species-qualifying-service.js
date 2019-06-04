
const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = process.env.ADMIN_BASE_API_URL
const SERVICE_NAME = 'species-qualifying-service'

async function createSpeciesQualifying (payload) {
    let url = `${ADMIN_BASE_API_URL}/reference/species`
    log.info(`${SERVICE_NAME}::createSpeciesQualifying:url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createSpeciesQualifying:error: ${error}`)
        })
}

async function deleteSpeciesQualifying (speciesId) {
    let url = `${ADMIN_BASE_API_URL}/reference/species/${speciesId}`
    log.info(`${SERVICE_NAME}::deleteSpeciesQualifying:url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteSpeciesQualifying:error: ${error}`)
        })
}

module.exports.createSpeciesQualifying = createSpeciesQualifying
module.exports.deleteSpeciesQualifying = deleteSpeciesQualifying
