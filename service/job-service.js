const axios = require('axios')
const log = global.log
const SERVICE_NAME = 'job-service'

const ADMIN_TEST_JOBS_API_URL = process.env.ADMIN_API_URL + '/TestJobs'

async function startJob (type, name) {
    let url = `${ADMIN_TEST_JOBS_API_URL}/start/${type}/${name}`
    log.info(`${SERVICE_NAME}::startJob - url:${url}`)

    return axios.post(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::startJob - error: ${error}`)
            throw error
        })
}

async function updateJob (jobIdentifier, payload) {
    let url = `${ADMIN_TEST_JOBS_API_URL}/${jobIdentifier}`
    log.info(`${SERVICE_NAME}::updateJob - url:${url}`)

    return axios.put(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::updateJob - error: ${error}`)
            throw error
        })
}

async function updateJobStatus (jobIdentifier, newStatus) {
    let url = `${ADMIN_TEST_JOBS_API_URL}/${jobIdentifier}/${newStatus}`
    log.info(`${SERVICE_NAME}::updateJobStatus - url:${url}`)

    return axios.put(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::updateJobStatus - error: ${error}`)
            throw error
        })
}

async function deleteJob (jobIdentifier) {
    let url = `${ADMIN_TEST_JOBS_API_URL}/${jobIdentifier}`
    log.info(`${SERVICE_NAME}::deleteJob - url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteJob -error: ${error}`)
            throw error
        })
}

module.exports.startJob = startJob
module.exports.updateJob = updateJob
module.exports.updateJobStatus = updateJobStatus
module.exports.deleteJob = deleteJob