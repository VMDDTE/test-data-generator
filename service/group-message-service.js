const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = `${process.env.ADMIN_BASE_API_URL}`
const SERVICE_NAME = 'group-message-service'


async function send (payload, userId) {
    let url = `${ADMIN_BASE_API_URL}/GroupMessages/`
    log.info(`${SERVICE_NAME}::sendGroupMessage:url:${url}`)
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
        log.error(`${SERVICE_NAME}::sendGroupMessage:error: ${error}`)
        throw error
    })
}

async function deleteMessage (messageId) {
    let url = `${ADMIN_BASE_API_URL}/GroupMessages/${messageId}`
    log.info(`${SERVICE_NAME}::deleteGroupMessage:url:${url}`)

    return axios.delete(url)
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteMessage:error: ${error}`)
            throw error
        })
}


module.exports.send = send
module.exports.delete = deleteMessage

