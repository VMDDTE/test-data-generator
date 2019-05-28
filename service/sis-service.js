
const axios = require('axios')
const log = global.log
const SIS_API_URL = `${process.env.ADMIN_BASE_API_URL}/SpecialImportApplications`
const SERVICE_NAME = 'sis-service'

async function update (jobId, updatedBy, payload) {

  let url = `${SIS_API_URL}/update/${jobId}/${updatedBy}`
  log.info(`${SERVICE_NAME}::update:url:${url}`)

  return axios.put(url, payload)
    .then((response) => {
        return response.data
    })
    .catch(error => {
        log.error(`sis-service::update::error: ${error}`)
    })
}

module.exports.update = update