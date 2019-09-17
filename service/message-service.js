
const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = `${process.env.ADMIN_BASE_API_URL}`
const SERVICE_NAME = 'message-service'

async function createDraft (userId) {
    let url = `${ADMIN_BASE_API_URL}/messages`
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

async function sendMessage (draftId, payload) {
    let url = `${ADMIN_BASE_API_URL}/messages/send/${draftId}`
    log.info(`${SERVICE_NAME}::sendMessage:url:${url}`)
    const requestHeaders = { 'vmd-userid': payload.FromId }

    return axios({
        headers: { ...requestHeaders },
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
    const requestHeaders = { 'vmd-userid': payload.FromId }
    debugger
    return axios({
        headers: { ...requestHeaders },
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
