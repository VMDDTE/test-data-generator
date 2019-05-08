
const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = `${process.env.ADMIN_BASE_API_URL}`
const SERVICE_NAME = 'user-service'

async function createUser (userType, payload) {
  try {
    let url = ADMIN_BASE_API_URL + '/users/' + userType
    log.info(`${SERVICE_NAME}::createUser:url:${url}`)
    return axios.post(url, payload)
  } catch (error) {
    log.error(error)
  }
}

async function deleteUser (id) {
  try {
    let url = ADMIN_BASE_API_URL + `/users/${id}`
    log.info(`${SERVICE_NAME}::deleteUser:url:${url}`)
    return axios.delete(url)
  } catch (error) {
    log.error(error)
  }
}

module.exports.createUser = createUser
module.exports.deleteUser = deleteUser