
const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = `${process.env.ADMIN_BASE_API_URL}`
const SERVICE_NAME = 'message-service'

async function createDraft (userId, payload) {
    let url = `${ADMIN_BASE_API_URL}/messages`
    log.info(`${SERVICE_NAME}::createDraft:url:${url}`)
    const requestHeaders = { 'vmd-userid': userId }
    log.info('the whole request:')
    log.info(JSON.stringify({
        headers: { ...requestHeaders },
        method: 'post',
        url: url,
        data: payload.sendData
    }))
    return axios({
            headers: { ...requestHeaders },
            method: 'post',
            url: url,
            data: payload.sendData
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
    let url = `${ADMIN_BASE_API_URL}/messages/CreateSecure`
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
    let url = `${ADMIN_BASE_API_URL}/messages/CreateSent`
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
    let url = `${ADMIN_BASE_API_URL}/messages/${messageId}`
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
module.exports.sendMessage = sendMessage
module.exports.sentMessage = sentMessage
module.exports.deleteMessage = deleteMessage
