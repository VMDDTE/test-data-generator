
const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = `${process.env.ADMIN_BASE_API_URL}`
const SERVICE_NAME = 'organisation-service'

async function createOrganisation (orgType, payload) {
  try {
    let url = ADMIN_BASE_API_URL + '/organisations/organisations/' + orgType
    log.info(`${SERVICE_NAME}::url:${url}`)
    return axios.post(url, payload)
  } catch (error) {
    log.error(error)
  }
}

async function updateOrganisation (payload) {
  try {
    let url = ADMIN_BASE_API_URL + '/organisations/vetPractices/sample'
    log.info(`${SERVICE_NAME}::url:${url}`)
    return axios.put(url, payload)
  } catch (error) {
    log.error(error)
  }
}

async function deleteOrganisation (orgId) {
  try {
    let url = ADMIN_BASE_API_URL + `/organisations/${orgId}`
    log.info(`${SERVICE_NAME}::url:${url}`)
    return axios.delete(url)
  } catch (error) {
    log.error(error)
  }
}


module.exports.createOrganisation = createOrganisation
module.exports.updateOrganisation = updateOrganisation
module.exports.deleteOrganisation = deleteOrganisation