const createActionProcessor = require('../action-processor/create-action')
const deleteActionProcessor = require('../action-processor/delete-action')
const getActionProcessor = require('../action-processor/get-action')
const roleActionProcessor = require('../action-processor/assign-role-action')
const sendInviteActionProcessor = require('../action-processor/send-invite-action')
const actions = require('../common/constants')
const fs = require('fs-extra')
const localStorage = require('../service/local-storage-service')
const organisationService = require('../service/organisation-service')
const userService = require('../service/user-service')
const productService = require('../service/product-service')
const invitationService = require('../service/invitation-service')
const speciesQualifyingService = require('../service/species-qualifying-service')
const referenceDataService = require('../service/reference-data-service')
const substanceQualifierService = require('../service/substance-qualifier-service')
const marketingAuthorisationService = require('../service/marketing-authorisation-service')
const maApplicationService = require('../service/ma-application-service')
const jobService = require('../service/job-service')
const messageService = require('../service/message-service')
const groupMessageService = require('../service/group-message-service')
const storageService = require('../service/storage-service')
const log = global.log
const CONTROLLER_NAME = 'generate-controller'

async function generate (filename, featureName, namespace) {
    log.info(`Generating ... ${featureName}`)
    localStorage.init()
    let rawdata = fs.readFileSync(filename)
    var jsonData = JSON.parse(rawdata)
    if (namespace) {
        jsonData = JSON.parse(JSON.stringify(jsonData).replace(/\$\{namespace\}/g, namespace))
    }
    await processActions(featureName, jsonData)
}

async function tearDown (featureName) {
    log.info(`Tearing down ... ${featureName}`)
    await tearDownEntities(featureName)
    await tearDownLocalStorage(featureName)
}

async function tearDownGlobal () {
    log.info(`Tearing down ... GLOBAL`)
    await tearDownEntities('global')
    await tearDownLocalStorage('global')
}

async function processActions (featureName, actionJson) {
    let actionRecords = actionJson.actions

    try {
        for (const action of actionRecords) {
            // Save a copy of each action for later reference
            localStorage.setItem(featureName, action.label, action)

            switch (action.action) {
            case actions.ACTION_CREATE:
                log.info(`${CONTROLLER_NAME}::processing ${action.action}`)
                await createActionProcessor.process(featureName, action)
                break
            case actions.ACTION_DELETE:
                log.info(`${CONTROLLER_NAME}::processing ${action.action}`)
                await deleteActionProcessor.process(featureName, action)
                break
            case actions.ACTION_GET:
                log.info(`${CONTROLLER_NAME}::processing ${action.action}`)
                await getActionProcessor.process(featureName, action)
                break
            case actions.ACTION_UPDATE:
                log.info(`${CONTROLLER_NAME}::processing ${action.action}`)
                break
            case actions.ACTION_ASSIGN_ROLE:
                log.info(`${CONTROLLER_NAME}::processing ${action.action}`)
                await roleActionProcessor.process(featureName, action)
                break
            case actions.ACTION_SEND_INVITE:
                log.info(`${CONTROLLER_NAME}::processing ${action.action}`)
                await sendInviteActionProcessor.process(featureName, action)
                break
            default:
                log.debug(`${CONTROLLER_NAME}::unrecognised action ${action.action}`)
                break
            }
        }
    } catch (error) {
        log.error(`${CONTROLLER_NAME}::${featureName}::processActions failed, error: ${error}`)
        log.info(`${CONTROLLER_NAME}::${featureName}::processActions failed, tearing down ...`)
        await tearDown(featureName)
        throw error // fail fast and stop trying to create test data
    }
}

async function tearDownEntities (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownEntities:${featureName}`)
    await tearDownVetPractice(featureName)
    await tearDownVet(featureName)
    await tearDownProduct(featureName)
    await tearDownSpeciesQualifying(featureName)
    await tearDownReferenceData(featureName)
    await tearDownSubstanceQualifier(featureName)
    await tearDownOrganisation(featureName)
    await tearDownSpecialImportApplication(featureName)
    await tearDownMarketingAuthorisation(featureName)
    await tearDownMarketingAuthorisationApplication(featureName)
    await tearDownDraftMarketingAuthorisationApplication(featureName)
    await tearDownStorageRecords(featureName)
    await tearDownMessages(featureName)
    await tearDownGroupMessages(featureName)
    await tearDownExternalUser(featureName)
    await tearDownInvitations(featureName)
    await tearDownRegistrationJobs(featureName)
    await tearDownRenewalMAJobs(featureName)
    await tearDownNewMAJobs(featureName)
}

async function tearDownStorageRecords (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownStorageRecords:${featureName}`)
    const list = localStorage.getItem(featureName, 'StorageList')
    if (list) {
        for (let id of list) {
            log.info(`${CONTROLLER_NAME}::about to teardown storge record with id ${id}`)
            await storageService.deleteStorageRecord(id)
        }
    }
}

async function tearDownMessages (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownMessages:${featureName}`)
    const secureMessageList = localStorage.getItem(featureName, 'secureMessageList')
    if (secureMessageList) {
        for (let id of secureMessageList) {
            log.info(`${CONTROLLER_NAME}::about to teardown message with id ${id}`)
            await messageService.deleteMessage(id)
        }
    }
}

async function tearDownGroupMessages (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownGroupMessages:${featureName}`)
    const groupMessageList = localStorage.getItem(featureName, 'groupMessageList')
    if (groupMessageList) {
        for (let id of groupMessageList) {
            log.info(`${CONTROLLER_NAME}::about to teardown group message with id ${id}`)
            await groupMessageService.delete(id)
        }
    }
}

async function tearDownInvitations (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownInvitations:${featureName}`)
    const invitationsList = localStorage.getItem(featureName, 'invitations')
    if (invitationsList) {
        for (let id of invitationsList) {
            log.info(`${CONTROLLER_NAME}::about to teardown invitation with id ${id}`)
            await invitationService.deleteInvitation(id)
        }
    }
}

async function tearDownExternalUser (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownExternalUser:${featureName}`)
    const externalUsersIdList = localStorage.getItem(featureName, 'externalUsersIdList')
    if (externalUsersIdList) {
        for (let id of externalUsersIdList) {
            log.info(`${CONTROLLER_NAME}::about to teardown external user with id ${id}`)
            await userService.deleteUser(id)
        }
    }
}

async function tearDownLocalStorage (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownLocalStorage:${featureName}`)
    localStorage.clear(featureName)
}

async function tearDownVetPractice (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownVetPractice:${featureName}`)
    const vetPracticeIdList = localStorage.getItem(featureName, 'vetPracticeIdList')
    if (vetPracticeIdList) {
        for (let id of vetPracticeIdList) {
            log.info(`${CONTROLLER_NAME}::about to teardown vet practice with id ${id}`)
            await organisationService.deleteOrganisation(id)
        }
    }
}

async function tearDownVet (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownVet:${featureName}`)
    const vetIdList = localStorage.getItem(featureName, 'vetIdList')
    if (vetIdList) {
        for (let id of vetIdList) {
            log.info(`${CONTROLLER_NAME}::about to teardown vet with id ${id}`)
            await userService.deleteUser(id)
        }
    }
}

async function tearDownProduct (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownProduct:${featureName}`)
    const productList = localStorage.getItem(featureName, 'productList')
    if (productList) {
        for (let productNo of productList) {
            log.info(`${CONTROLLER_NAME}::about to teardown product with product no. ${productNo}`)
            await productService.deleteProduct(productNo)
        }
    }
}

async function tearDownSpeciesQualifying (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownSpeciesQualifying:${featureName}`)
    const speciesQualifyingList = localStorage.getItem(featureName, 'speciesQualifyingList')
    if (speciesQualifyingList) {
        for (let id of speciesQualifyingList) {
            log.info(`${CONTROLLER_NAME}::about to teardown species qualifying with id ${id}`)
            await speciesQualifyingService.deleteSpeciesQualifying(id)
        }
    }
}

async function tearDownReferenceData (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownReferenceData:${featureName}`)
    const referenceDataList = localStorage.getItem(featureName, 'referenceDataList')
    if (referenceDataList) {
        for (let id of referenceDataList) {
            log.info(`${CONTROLLER_NAME}::about to teardown reference data with id ${id}`)
            await referenceDataService.deleteReferenceData(id)
        }
    }
}

async function tearDownSubstanceQualifier (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownSubstanceQualifier:${featureName}`)
    const substanceQualifierList = localStorage.getItem(featureName, 'substanceQualifierList')
    if (substanceQualifierList) {
        for (let id of substanceQualifierList) {
            log.info(`${CONTROLLER_NAME}::about to teardown substance qualifier with id ${id}`)
            await substanceQualifierService.deleteSubstanceQualifier(id)
        }
    }
}

async function tearDownOrganisation (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownOrganisation:${featureName}`)
    const organisationIdList = localStorage.getItem(featureName, 'organisationIdList')
    if (organisationIdList) {
        for (let id of organisationIdList) {
            log.info(`${CONTROLLER_NAME}::about to teardown manufacturer with id ${id}`)
            await organisationService.deleteOrganisation(id)
        }
    }
}

async function tearDownSpecialImportApplication (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownSpecialImportApplication:${featureName}`)
    const jobIdentifierList = localStorage.getItem(featureName, 'specialImportApplicationIdList')
    if (jobIdentifierList) {
        for (let identifier of jobIdentifierList) {
            log.info(`${CONTROLLER_NAME}::about to teardown special-import-application with id ${identifier}`)
            await jobService.deleteJob(identifier)
        }
    }
}

async function tearDownMarketingAuthorisation (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownMarketingAuthorisation:${featureName}`)
    const maList = localStorage.getItem(featureName, 'maList')
    if (maList) {
        for (let id of maList) {
            log.info(`${CONTROLLER_NAME}::about to teardown marketing authorisation with id ${id}`)
            await marketingAuthorisationService.deleteMarketingAuthorisation(id)
        }
    }
}

async function tearDownMarketingAuthorisationApplication (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownMarketingAuthorisationApplication:${featureName}`)
    const maAppList = localStorage.getItem(featureName, 'maApplicationList')
    if (maAppList) {
        for (let internalRef of maAppList) {
            deleteMarketingAuthorisationApplicationByInternalReference(internalRef)
        }
    }
}

async function tearDownDraftMarketingAuthorisationApplication (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownMarketingAuthorisationApplication:${featureName}`)
    const maDraftAppList = localStorage.getItem(featureName, 'maDraftApplicationList')
    if (maDraftAppList) {
        for (let internalRef of maDraftAppList) {
            deleteMarketingAuthorisationApplicationByInternalReference(internalRef)
        }
    }
}

async function deleteMarketingAuthorisationApplicationByInternalReference(internalRef){
    log.info(`${CONTROLLER_NAME}::about to delete marketing authorisation application with internal reference ${internalRef}`)
    await maApplicationService.deleteMarketingAuthorisationApplicationByInternalReference(internalRef)
}


async function tearDownRegistrationJobs(featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownRegistrationJobs:${featureName}`)
    const registrations = localStorage.getItem(featureName, 'registrationJobList')
    if (registrations) {
        for (let id of registrations) {
            log.info(`${CONTROLLER_NAME}::about to teardown registration jobs with id ${id}`)
            await jobService.deleteJob(id)
        }
    }
}

async function tearDownRenewalMAJobs (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownRenewalMAJobs:${featureName}`)
    const maRenewalJobsList = localStorage.getItem(featureName, 'maRenewalJobList')
    if (maRenewalJobsList) {
        for (let internalRef of maRenewalJobsList) {
            log.info(`${CONTROLLER_NAME}::about to teardown renew ma jobs with internal reference ${internalRef}`)
            await jobService.deleteJob(internalRef)
        }
    }
}

async function tearDownNewMAJobs (featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownNewMAJobs:${featureName}`)
    const maNewJobsList = localStorage.getItem(featureName, 'maNewJobList')
    if (maNewJobsList) {
        for (let internalRef of maNewJobsList) {
            log.info(`${CONTROLLER_NAME}::about to teardown new ma jobs with internal reference ${internalRef}`)
            await jobService.deleteJob(internalRef)
        }
    }
}

module.exports.generate = generate
module.exports.tearDown = tearDown
module.exports.tearDownGlobal = tearDownGlobal
