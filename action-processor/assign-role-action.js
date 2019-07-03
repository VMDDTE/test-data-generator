const actionTypes = require('../common/constants')
const roleNames = require('../common/constants')
const organisationService = require('../service/organisation-service')
const localStorage = require('../service/local-storage-service')
const log = global.log

const SERVICE_NAME = 'assign-role-action-processor'

async function process (namespace, action) {
    log.debug(`${SERVICE_NAME}::${namespace}::process`)
    switch (action.type) {
    case actionTypes.TYPE_VET_ROLE:
    case actionTypes.TYPE_VET_PRIMARY_ADMIN_ROLE:
    case actionTypes.TYPE_PRIMARY_ADMIN_ROLE:
    case actionTypes.TYPE_ADMIN_ROLE:
    case actionTypes.TYPE_AUTHORISED_ROLE:
        log.info(`${SERVICE_NAME}::processing ${action.type}`)
        await createRole(namespace, action)
        break
    default:
        log.debug(`${SERVICE_NAME}::unrecognised action type ${action.type}`)
        break
    }
}

async function createRole (namespace, action) {
    let roleType = action.type
    log.debug(`${SERVICE_NAME}::createRole::type:${roleType}:${JSON.stringify(action)}`)
    let roleData = action.data
    let users = roleData.users
    let orgIdLabel = roleData.orgId
    let savedOrgAction = localStorage.getItem(namespace, orgIdLabel)
    let response = savedOrgAction.response
    let orgId = response.Id

    var userList = []
    for (const userLabel of users) {
        let savedAction = await localStorage.getItem(namespace, userLabel)
        let response = savedAction.response
        let userId = response.Id
        log.info(`${SERVICE_NAME}::createRole::assigning role ${roleType} to ${userId} for organisation with id ${orgId}`)
        userList.push(userId)
    }

    var roleName = ""
    switch (roleType) {
    case actionTypes.TYPE_VET_ROLE:
        roleName = roleNames.ROLE_NAME_VET
        break
    case actionTypes.TYPE_USER_ADMIN_ROLE:
        if (roleProperties[roleNames.ROLE_NAME_ADMIN]) {
            roleProperties[roleNames.ROLE_NAME_ADMIN].push(...userList)
        } else {
            roleProperties[roleNames.ROLE_NAME_ADMIN] = userList
        }
        break
    case actionTypes.TYPE_USER_PRIMARY_ADMIN_ROLE:
        if (roleProperties[roleNames.ROLE_NAME_PRIMARY_ADMIN]) {
            roleProperties[roleNames.ROLE_NAME_PRIMARY_ADMIN].push(...userList)
        } else {
            roleProperties[roleNames.ROLE_NAME_PRIMARY_ADMIN] = userList
        }
        break
    case actionTypes.TYPE_USER_AUTHORISED_USER_ROLE:
        if (roleProperties[roleNames.ROLE_NAME_AUTHORISED_USER]) {
            roleProperties[roleNames.ROLE_NAME_AUTHORISED_USER].push(...userList)
        } else {
            roleProperties[roleNames.ROLE_NAME_AUTHORISED_USER] = userList
        }
        break
    case actionTypes.TYPE_VET_PRIMARY_ADMIN_ROLE:
        roleName = roleNames.ROLE_NAME_VET_PRIMARY_ADMIN
        break
    case actionTypes.TYPE_ADMIN_ROLE:
        roleName = roleNames.ROLE_NAME_ADMIN
        break
    case actionTypes.TYPE_AUTHORISED_ROLE:
        roleName = roleNames.ROLE_NAME_AUTHORISED_USER
        break
    case actionTypes.TYPE_PRIMARY_ADMIN_ROLE:
        roleName = roleNames.ROLE_NAME_PRIMARY_ADMIN
        break
    }
    for (userId of userList) {
        log.info(`${SERVICE_NAME}::assignRoleToOrganisationForUser::about to assign role ${roleName} to ${userId} for organisation with id ${orgId}`)
        await organisationService.assignRoleToOrganisationForUser (orgId, userId, roleName)
    }
}

module.exports.process = process
