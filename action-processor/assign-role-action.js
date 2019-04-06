const actionTypes = require('../common/constants')
const roleNames = require('../common/constants')
const organisationService = require('../service/organisation-service')
const localStorage = require('../service/local-storage-service')
const log = global.log

const SERVICE_NAME = 'assign-role-action-processor'

async function process(namespace, action) {
    log.debug(`${SERVICE_NAME}::${namespace}::process`)
    switch (action.type) {
        case actionTypes.TYPE_VET_ROLE:
        case actionTypes.TYPE_VET_PRIMARY_ADMIN_ROLE:
            log.info(`${SERVICE_NAME}::processing ${action.type}`)
            await createRole(namespace, action)
            break
        default:
            log.debug(`${SERVICE_NAME}::unrecognised action type ${action.type}`)
            break
    }
}

async function createRole(namespace, action) {
    let roleType = action.type
    log.debug(`${SERVICE_NAME}::createRole::type:${roleType}:${JSON.stringify(action)}`)
    let roleData = action.data
    let users = roleData.users
    let roleLabel = roleData.label
    let orgIdLabel = roleData.orgId
    let savedOrgAction = localStorage.getItem(namespace, orgIdLabel)
    let savedRoleProperties = localStorage.getItem(namespace, roleLabel)
    let response = savedOrgAction.response
    let orgId = response.id

    var userList = []
    for (const userLabel of users) {
        let savedAction = await localStorage.getItem(namespace, userLabel)
        let response = savedAction.response
        let userId = response.Id
        log.info(`${SERVICE_NAME}::createRole::assigning role ${roleType} to ${userId} for organisation with id ${orgId}`)
        userList.push(userId)
    }

    var updatePayload = savedOrgAction.data
    var roleProperties = {}
    if (savedRoleProperties) {
        roleProperties = savedRoleProperties
    }
    switch (roleType) {
        case actionTypes.TYPE_VET_ROLE:
            if (roleProperties[roleNames.ROLE_NAME_VET]) {
                roleProperties[roleNames.ROLE_NAME_VET].push(...userList)
            } else {
                roleProperties[roleNames.ROLE_NAME_VET] = userList
            }
            break
        case actionTypes.TYPE_VET_PRIMARY_ADMIN_ROLE:
            if (roleProperties[roleNames.ROLE_NAME_VET_PRIMARY_ADMIN]) {
                roleProperties[roleNames.ROLE_NAME_VET_PRIMARY_ADMIN].push(...userList)
            }
            roleProperties[roleNames.ROLE_NAME_VET_PRIMARY_ADMIN] = userList
            break
    }
    localStorage.setItem(namespace, roleLabel, roleProperties)
    updatePayload["Id"] = orgId
    updatePayload["Properties"] = roleProperties
    log.debug(`${SERVICE_NAME}::createRole::properties ${JSON.stringify(updatePayload)}`)

    await organisationService.updateOrganisation(updatePayload)
}


module.exports.process = process
