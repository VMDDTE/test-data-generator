
const axios = require('axios')
const log = global.log
const JOB_API_URL = `${process.env.ADMIN_BASE_API_URL}/jobs`
const SERVICE_NAME = 'job-service'

async function createJob (type, name) {
  try {
    let url = `${JOB_API_URL}/start/${type}/${name}`
    log.info(`${SERVICE_NAME}::createJob:url:${url}`)
    return axios.post(url)
  } catch (error) {
    log.error(error)
  }
}

async function updateJobStatus (jobIdentifier, newStatus) {
  try {
    let url = `${JOB_API_URL}/updateStatus/${jobIdentifier}/${newStatus}`
    log.info(`${SERVICE_NAME}::updateJobStatus:url:${url}`)
    return axios.put(url, payload)
  } catch (error) {
    log.error(error)
  }
}

async function deleteJob (jobIdentifier) {
  try {
    let url = `${JOB_API_URL}/${jobIdentifier}`
    log.info(`${SERVICE_NAME}::deleteJob:url:${url}`)
    return axios.delete(url)
  } catch (error) {
    log.error(error)
  }
}


module.exports.createJob = createJob
module.exports.updateJobStatus = updateJobStatus
module.exports.deleteJob = deleteJob