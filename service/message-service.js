
const axios = require('axios')
const log = global.log
const SERVICE_NAME = 'message-service'

const SECURE_MESSAGING_TEST_MESSAGES_API_URL = process.env.SECURE_MESSAGING_API_URL + '/TestMessages'

async function createDraft (userId) {
    let url = SECURE_MESSAGING_TEST_MESSAGES_API_URL
    log.info(`${SERVICE_NAME}::createDraft - url:${url}`)
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
            log.error(`${SERVICE_NAME}::createDraft - error: ${error}`)
            throw error
        })
}

async function createSecure (payload) {
    let url = `${SECURE_MESSAGING_TEST_MESSAGES_API_URL}/CreateSecure`
    log.info(`${SERVICE_NAME}::sendMessage - url:${url}`)
    
    return axios({
        method: 'post',
        url: url,
        data: payload
    })
    .then((response) => {
            return response.data
        })
    .catch(error => {
        log.error(`${SERVICE_NAME}::sendMessage - error:${error}`)
        throw error
    })
}

async function createSent (payload) {
    let url = `${SECURE_MESSAGING_TEST_MESSAGES_API_URL}/CreateSent`
    log.info(`${SERVICE_NAME}::sentMessage - url:${url}`)
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
        log.error(`${SERVICE_NAME}::sentMessage - error:${error}`)
        throw error
    })
}

async function deleteMessage (messageId) {
    let url = `${SECURE_MESSAGING_TEST_MESSAGES_API_URL}/${messageId}`
    log.info(`${SERVICE_NAME}::deleteMessage - url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteMessage - error:${error}`)
            throw error
        })
}


async function deleteMessagesForUserId (id) {
    let url = `${SECURE_MESSAGING_TEST_MESSAGES_API_URL}/ForUser/${id}`
    log.info(`${SERVICE_NAME}::deleteUserMessages - url:${url}`)
    return axios.put(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteUserMessages - error:${error}`)
            throw error
        })
}

module.exports.createDraft = createDraft
module.exports.createSecure = createSecure
module.exports.createSent = createSent
// TestSupport/TestMesages endpoint have a send endpoint accepting a draft message id, doesnt seem to be used
module.exports.deleteMessage = deleteMessage
module.exports.deleteMessagesForUserId = deleteMessagesForUserId
