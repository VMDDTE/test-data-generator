
const axios = require('axios')
const log = global.log
const JOB_API_URL = `${process.env.TEST_SUPPORT_API_URL}/jobs`
const SERVICE_NAME = 'job-service'

async function createJob (type, name) {
    let url = `${JOB_API_URL}/start/${type}/${name}`
    log.info(`${SERVICE_NAME}::createJob:url:${url}`)

    return axios.post(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createJob:error: ${error}`)
            throw error
        })
}

async function updateJobStatus (jobIdentifier, newStatus) {
    let url = `${JOB_API_URL}/updateStatus/${jobIdentifier}/${newStatus}`
    log.info(`${SERVICE_NAME}::updateJobStatus:url:${url}`)

    return axios.put(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::updateJobStatus:error: ${error}`)
            throw error
        })
}

async function updateJob (jobIdentifier, payload) {
    let url = `${JOB_API_URL}/update/${jobIdentifier}`
    log.info(`${SERVICE_NAME}::updateJob:url:${url}`)

    return axios.put(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::updateJob:error: ${error}`)
            throw error
        })
}

async function deleteJob (jobIdentifier) {
    let url = `${JOB_API_URL}/${jobIdentifier}`
    log.info(`${SERVICE_NAME}::deleteJob:url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteJob:error: ${error}`)
            throw error
        })
}

module.exports.createJob = createJob
module.exports.updateJobStatus = updateJobStatus
module.exports.updateJob = updateJob
module.exports.deleteJob = deleteJob
