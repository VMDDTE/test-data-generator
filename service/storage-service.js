
const axios = require('axios')
const log = global.log
const ADMIN_BASE_API_URL = `${process.env.STORAGE_API_URL}`
const SERVICE_NAME = 'storage-service'

async function createStorageRecord(userId, fileName, contentType, payload) {
    let url = `${ADMIN_BASE_API_URL}/storage/upload`
    log.info(`${SERVICE_NAME}::createStorageRecord:url:${url}`)
    const requestHeaders = {
        'vmd-userid': userId,
        'vmd-filename': fileName,
        'Content-Type': contentType,
        'vmd-system-generated': 'true'
    }

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
            log.error(`${SERVICE_NAME}::createStorageRecord:error: ${error}`)
            throw error
        })
}

async function deleteStorageRecord(storageId) {
    let url = `${ADMIN_BASE_API_URL}/storage/delete/${storageId}`
    log.info(`${SERVICE_NAME}::deleteStorageRecord:url:${url}`)

    return axios({
        method: 'delete',
        url: url
    })
        .then((response) => {
            return response.data
        })
        .catch(error => {
            log.error(`${SERVICE_NAME}::deleteStorageRecord:error: ${error}`)
            throw error
        })
}

module.exports.createStorageRecord = createStorageRecord
module.exports.deleteStorageRecord = deleteStorageRecord
