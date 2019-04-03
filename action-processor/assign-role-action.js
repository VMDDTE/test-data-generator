const actionTypes = require('../common/constants')
const roleNames = require('../common/constants')
const organisationService = require('../service/organisation-service')
const log = global.log

const SERVICE_NAME = 'assign-role-action-processor'

async function process(action) {
    log.debug(`${SERVICE_NAME}::process`)
    switch (action.type) {
        case actionTypes.TYPE_VET_ROLE:
        case actionTypes.TYPE_VET_PRIMARY_ADMIN_ROLE:
            log.info(`${SERVICE_NAME}::processing ${action.type}`)
            await createRole(action)
            break
        default:
            log.debug(`${SERVICE_NAME}::unrecognised action type ${action.type}`)
            break
    }
}

async function createRole(action) {
    let roleType = action.type
    log.debug(`${SERVICE_NAME}::createRole::type:${roleType}:${JSON.stringify(action)}`)
    let roleData = action.data
    let users = roleData.users
    let orgIdLabel = roleData.orgId
    let savedAction = await storage.getItem(orgIdLabel)
    let response = savedAction.response
    let orgId = response.id

    var userList = []
    for (const userLabel of users) {
        let savedAction = await storage.getItem(userLabel)
        let response = savedAction.response
        let userId = response.Id
        log.info(`${SERVICE_NAME}::createRole::assigning role ${roleType} to ${userId} for organisation with id ${orgId}`)
        userList.push(userId)
    }

    var updatePayload = {}
    var roleProperties = {}
    switch (roleType) {
        case actionTypes.TYPE_VET_ROLE:
            roleProperties[roleNames.ROLE_NAME_VET] = userList
            break
        case actionTypes.TYPE_VET_PRIMARY_ADMIN_ROLE:
            roleProperties[roleNames.ROLE_NAME_VET_PRIMARY_ADMIN] = userList
            break
    }
    updatePayload["Id"] = orgId
    updatePayload["Properties"] = roleProperties
    log.debug(`${SERVICE_NAME}::createRole::properties ${JSON.stringify(updatePayload)}`)

    organisationService.updateOrganisation(updatePayload)
}


module.exports.process = process
