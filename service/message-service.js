
const axios = require('axios')
const log = global.log
const MESSAGES_API_URL = `${process.env.MESSAGES_SERVICE_API_URL}`
const SERVICE_NAME = 'message-service'

async function createDraft (userId) {
    let url = `${MESSAGES_API_URL}/messages/${userId}`
    log.info(`${SERVICE_NAME}::createDraft:url:${url}`)

    return axios.post(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createDraft:error: ${error}`)
            throw error
        })
}

async function sendDraft (draftId, payload) {
    let url = `${MESSAGES_API_URL}/messages/send/${draftId}`
    log.info(`${SERVICE_NAME}::sendDraft:url:${url}`)

    return axios.post(url, payload)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::sendDraft:error: ${error}`)
            throw error
        })
}

async function deleteMessage (messageId) {
    let url = `${MESSAGES_API_URL}/messages/${messageId}`
    log.info(`${SERVICE_NAME}::deleteMessage:url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteMessage:error: ${error}`)
            throw error
        })
}

module.exports.createDraft = createDraft
module.exports.sendDraft = sendDraft
module.exports.deleteMessage = deleteMessage
