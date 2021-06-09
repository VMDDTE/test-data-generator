
const axios = require('axios')
const log = global.log
const SERVICE_NAME = 'message-service'

const TEST_SUPPORT_API_URL = `${process.env.TEST_SUPPORT_API_URL}`
const SECURE_MESSAGING_TEST_MESSAGES_API_URL = process.env.SECURE_MESSAGING_API_URL + '/TestMessages'

async function createDraft (userId) {
    let url = `${TEST_SUPPORT_API_URL}/messages`
    log.info(`${SERVICE_NAME}::createDraft:url:${url}`)
    const requestHeaders = { 'vmd-userid': userId }

    return axios({
            headers: { ...requestHeaders },
            method: 'post',
            url: url
        })
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::createDraft:error: ${error}`)
            throw error
        })
}

async function sendMessage (payload) {
    let url = `${TEST_SUPPORT_API_URL}/messages/CreateSecure`
    log.info(`${SERVICE_NAME}::sendMessage:url:${url}`)
    
    return axios({
        method: 'post',
        url: url,
        data: payload
    })
    .then((response) => {
            return response.data
        })
    .catch(error => {
        log.error(`${SERVICE_NAME}::sendMessage:error: ${error}`)
        throw error
    })
}

async function sentMessage (payload) {
    let url = `${TEST_SUPPORT_API_URL}/messages/CreateSent`
    log.info(`${SERVICE_NAME}::sentMessage:url:${url}`)
    // TestSupport CreateSent not currently using headers, only payload contents
    return axios({
        method: 'post',
        url: url,
        data: payload
    })
    .then((response) => {
            return response.data
        })
    .catch(error => {
        log.error(`${SERVICE_NAME}::sentMessage:error: ${error}`)
        throw error
    })
}

async function deleteMessage (messageId) {
    let url = `${TEST_SUPPORT_API_URL}/messages/${messageId}`
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


async function deleteMessagesForUserId (id) {
    let url = `${SECURE_MESSAGING_TEST_MESSAGES_API_URL}/ForUser/${id}`
    log.info(`${SERVICE_NAME}::deleteUserMessages:url:${url}`)
    return axios.put(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteUserMessages:error: ${error}`)
            throw error
        })
}

module.exports.createDraft = createDraft
module.exports.sendMessage = sendMessage
module.exports.sentMessage = sentMessage
module.exports.deleteMessage = deleteMessage
module.exports.deleteMessagesForUserId = deleteMessagesForUserId
