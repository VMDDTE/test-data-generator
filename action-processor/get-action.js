const actionTypes = require('../common/constants')
const userService = require('../service/user-service')
const localStorage = require('../service/local-storage-service')
const log = global.log

const SERVICE_NAME = 'get-action-processor'

async function process (featureName, action) {
    log.debug(`${SERVICE_NAME}::${featureName}::process`)
    switch (action.type) {
    case actionTypes.ACTION_TYPE_INTERNAL_USER:
        log.info(`${SERVICE_NAME}::processing ${action.type}`)
        await getUser(featureName, action)
        break
    default:
        log.debug(`${SERVICE_NAME}::unrecognised action type ${action.type}`)
        break
    }
}

async function getUser (featureName, action) {
    log.debug(`${SERVICE_NAME}::getUser::${JSON.stringify(action)}`)
    let email = action.data.Email

    try{
        const user = await userService.findUserByEmail(email)
        
        const getAction = localStorage.getItem(featureName, action.label)
        getAction.response = user

        log.debug(`${SERVICE_NAME}::getUser, get action ${JSON.stringify(getAction)}`)
        localStorage.setItem(featureName, action.label, getAction)

    }catch(ex){
        log.debug(`${SERVICE_NAME}::error getting user ${ex.message}`)
    }
}

module.exports.process = process
