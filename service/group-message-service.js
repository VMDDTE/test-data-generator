const axios = require('axios')
const log = global.log
const SERVICE_NAME = 'group-message-service'

const SECURE_MESSAGING_TEST_SHARED_MESSAGES_API_URL = process.env.SECURE_MESSAGING_API_URL + '/TestSharedMessages'

async function createSharedMessage (payload, userId) {
    let url = SECURE_MESSAGING_TEST_SHARED_MESSAGES_API_URL
    log.info(`${SERVICE_NAME}::createSharedMessage - url:${url}`)
    const headers = { 'vmd-userid': userId }
    return axios({
        headers,
        method: 'post',
        url: url,
        data: payload
    })
    .then((response) => {
            return response.data
        })
    .catch(error => {
        log.error(`${SERVICE_NAME}::createSharedMessage - error: ${error}`)
        throw error
    })
}

async function deleteSharedMessage (messageId) {
    let url = `${SECURE_MESSAGING_TEST_SHARED_MESSAGES_API_URL}/${messageId}`
    log.info(`${SERVICE_NAME}::deleteSharedMessage - url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteSharedMessage - error: ${error}`)
            throw error
        })
}

module.exports.create = createSharedMessage
module.exports.delete = deleteSharedMessage