const axios = require('axios')
const log = global.log
const TEST_SUPPORT_API_URL = process.env.TEST_SUPPORT_API_URL
const SERVICE_NAME = 'audit-service'

function auditLog(method, type, message) {
    log.info(`${SERVICE_NAME}::${method}:${type}:${message}`)
}

async function createAuditLog(orgRef, userId, auditedOn, type, descriptionLine1, descriptionLine2 = null) {
    const METHOD = 'createAuditLog'
    const url = `${TEST_SUPPORT_API_URL}/Audit/byOrganisationReference/${orgRef}/byUserId/${userId}`
    const payload = {
        AuditedOn: auditedOn,
        DescriptionLine1: descriptionLine1,
        DescriptionLine2: descriptionLine2,
        Type: type
    }

    auditLog(METHOD, 'url', url)

    try {
        const { data } = await axios.post(url, payload)

        return data
    } catch (e) {
        auditLog(METHOD, 'error', e)
        
        throw e
    }
}

async function deleteAuditLog(id) {
    const METHOD = 'deleteAuditLog';
    const url = `${TEST_SUPPORT_API_URL}`

    auditLog(METHOD, 'url', url)

    try {
        const { data } = await axios.delete(url)

        return data
    } catch (e) {
        auditLog(METHOD, 'error', e)
        
        throw e
    }
}

exports.createAuditLog = createAuditLog
exports.deleteAuditLog = deleteAuditLog