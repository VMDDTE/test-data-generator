const storage = require('node-persist')
const log = global.log

function validateAction(actionJson) {
    if (!actionJson) {
        log.error("Action section can not be empty")
        return false
    }
    if (!actionJson.actions) {
        log.error("Actions can not be empty")
        return false
    }
    let actions = actionJson.actions
    actions.forEach(action => {
        log.debug(`Processing action record : ${JSON.stringify(action)}`)
        if (!action.type) {
            log.error('Type can not be empty')
            return false
        }
        if (!action.label) {
            log.error('Label can not be empty')
            return false
        }
        if (!action.data) {
            log.error('Data can not be empty')
            return false
        }
    });
    return true
}

module.exports.validateAction = validateAction