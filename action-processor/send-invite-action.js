const uuid = require('uuid')
const actionTypes = require('../common/constants')
const roleNames = require('../common/constants')
const invitationService = require('../service/invitation-service')
const localStorage = require('../service/local-storage-service')
const log = global.log

const SERVICE_NAME = 'send-invite-action-processor'

async function process (namespace, action) {
    log.debug(`${SERVICE_NAME}::${namespace}::process`)
    switch (action.type) {
    case actionTypes.ACTION_TYPE_PRIMARY_ADMIN_ROLE:
    case actionTypes.ACTION_TYPE_ADMIN_ROLE:
    case actionTypes.ACTION_TYPE_AUTHORISED_ROLE:
        log.info(`${SERVICE_NAME}::processing ${action.type}`)
        await sendInvitation(namespace, action)
        break
    default:
        log.debug(`${SERVICE_NAME}::unrecognised action type ${action.type}`)
        break
    }
}

async function sendInvitation (namespace, action) {
    let roleType = action.type
    log.debug(`${SERVICE_NAME}::sendInvitation::type:${roleType}:${JSON.stringify(action)}`)

    let org = await localStorage.getItemOrGlobal(namespace, action.data.orgId)

    var userList = []
    for (const userLabel of action.data.users) {

        let user = await localStorage.getItemOrGlobal(namespace, userLabel)

        userList.push(user.Id)
    }

    var roleName = ""
    switch (roleType) {
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

    var savedInvitations = localStorage.getItem(namespace, 'invitations') || []

    for (userId of userList) {
        log.info(`${SERVICE_NAME}::createInvitation::about to send ${roleName} invitation to ${userId} for organisation with id ${org.Id}`)
        const invitation = await invitationService
            .createInvitation(userId, org.Id, uuid.v1(), roleName)
        savedInvitations.push(invitation.Id)
    }

    localStorage.setItem(namespace, 'invitations', savedInvitations)
}

module.exports.process = process
