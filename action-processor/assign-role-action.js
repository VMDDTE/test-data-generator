const actionTypes = require('../common/constants')
const roleNames = require('../common/constants')
const organisationService = require('../service/organisation-service')
const localStorage = require('../service/local-storage-service')
const log = global.log

const SERVICE_NAME = 'assign-role-action-processor'

async function process (namespace, action) {
    log.debug(`${SERVICE_NAME}::${namespace}::process`)
    switch (action.type) {
    case actionTypes.ACTION_TYPE_VET_ROLE:
    case actionTypes.ACTION_TYPE_VET_PRIMARY_ADMIN_ROLE:
    case actionTypes.ACTION_TYPE_PRIMARY_ADMIN_ROLE:
    case actionTypes.ACTION_TYPE_ADMIN_ROLE:
    case actionTypes.ACTION_TYPE_AUTHORISED_ROLE:
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

    let org = await localStorage.getItemOrGlobal(namespace, action.data.orgId)
    
    var userList = []
    for (const userLabel of action.data.users) {

        let user = await localStorage.getItemOrGlobal(namespace, userLabel)

        userList.push(user.Id)
    }

    var roleName = ""
    switch (roleType) {
    case actionTypes.ACTION_TYPE_VET_ROLE:
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
    case actionTypes.ACTION_TYPE_VET_PRIMARY_ADMIN_ROLE:
        roleName = roleNames.ROLE_NAME_VET_PRIMARY_ADMIN
        break
    case actionTypes.ACTION_TYPE_ADMIN_ROLE:
        roleName = roleNames.ROLE_NAME_ADMIN
        break
    case actionTypes.ACTION_TYPE_AUTHORISED_ROLE:
        roleName = roleNames.ROLE_NAME_AUTHORISED_USER
        break
    case actionTypes.ACTION_TYPE_PRIMARY_ADMIN_ROLE:
        roleName = roleNames.ROLE_NAME_PRIMARY_ADMIN
        break
    }
    for (userId of userList) {
        log.info(`${SERVICE_NAME}::assignRoleToOrganisationForUser::about to assign role ${roleName} to ${userId} for organisation with id ${org.Id}`)
        await organisationService.assignRoleToOrganisationForUser (org.Id, userId, roleName)
    }
}

module.exports.process = process
