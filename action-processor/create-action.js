const actionTypes = require('../common/constants')
const orgTypes = require('../common/constants')
const userTypes = require('../common/constants')
const organisationService = require('../service/organisation-service')
const localStorage = require('../service/local-storage-service')
const userService = require('../service/user-service')
const productService = require('../service/product-service')
const speciesQualifyingService = require('../service/species-qualifying-service')
const referenceDataService = require('../service/reference-data-service')
const substanceQualifierService = require('../service/substance-qualifier-service')
const marketingAuthorisationService = require('../service/marketing-authorisation-service')
const maApplicationService = require('../service/ma-application-service')
const jobService = require('../service/job-service')
const messageService = require('../service/message-service')
const groupMessageService = require('../service/group-message-service')
const storageService = require('../service/storage-service')
const constants = require('../common/constants')
const log = global.log

const SERVICE_NAME = 'create-action-processor'

async function process (featureName, action) {
    log.debug(`${SERVICE_NAME}::${featureName}::process`)
    switch (action.type) {
    case actionTypes.ACTION_TYPE_VET:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_VET}`)
        await createVet(featureName, action)
        break
    case actionTypes.ACTION_TYPE_INTERNAL_USER:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_INTERNAL_USER}`)
        await createInternalUser(featureName, action)
        break
    case actionTypes.ACTION_TYPE_EXTERNAL_USER:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_EXTERNAL_USER}`)
        if (action.global == 'true') {
            await createGlobalExternalUser(action)
        } else {
            await createExternalUser(featureName, action)
        }
        break
    case actionTypes.ACTION_TYPE_VET_PRACTICE_RECORD:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_VET_PRACTICE_RECORD}`)
        await createVetPractice(featureName, action)
        break
    case actionTypes.ACTION_TYPE_PRODUCT:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_PRODUCT}`)
        await createProduct(featureName, action)
        break
    case actionTypes.ACTION_TYPE_SPECIES_QUALIFYING:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_SPECIES_QUALIFYING}`)
        await createSpeciesQualifying(featureName, action)
        break
    case actionTypes.ACTION_TYPE_REFERENCE_DATA:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_REFERENCE_DATA}`)
        await createReferenceData(featureName, action)
        break
    case actionTypes.ACTION_TYPE_SUBSTANCE_QUALIFIER:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_SUBSTANCE_QUALIFIER}`)
        await createSubstanceQualifier(featureName, action)
        break
    case actionTypes.ACTION_TYPE_MANUFACTURER:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_MANUFACTURER}`)
        await createOrganisation(orgTypes.ORG_TYPE_NAME_MANUFACTURER, featureName, action)
        break
    case actionTypes.ACTION_TYPE_WHOLESALER:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_WHOLESALER}`)
        await createOrganisation(orgTypes.ORG_TYPE_NAME_WHOLESALER, featureName, action)
        break
    case actionTypes.ACTION_TYPE_MARKETING_AUTHORISATION_HOLDER:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_MARKETING_AUTHORISATION_HOLDER}`)
        await createOrganisation(orgTypes.ORG_TYPE_NAME_MARKETING_AUTHORISATION_HOLDER, featureName, action)
        break
    case actionTypes.ACTION_TYPE_MARKETING_AUTHORISATION:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_MARKETING_AUTHORISATION}`)
        await createMarketingAuthorisation(featureName, action)
        break
    case actionTypes.ACTION_TYPE_NEW_MARKETING_AUTHORISATION_APPLICATION:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_NEW_MARKETING_AUTHORISATION_APPLICATION}`)
        await createNewMarketingAuthorisationApplication(featureName, action)
        break
    case actionTypes.ACTION_TYPE_DRAFT_MARKETING_AUTHORISATION_APPLICATION:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_DRAFT_MARKETING_AUTHORISATION_APPLICATION}`)
        await createDraftMarketingAuthorisationApplication(featureName, action)
        break
    case actionTypes.ACTION_TYPE_RENEWAL_MARKETING_AUTHORISATION_APPLICATION:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_RENEWAL_MARKETING_AUTHORISATION_APPLICATION}`)
        await createRenewalMarketingAuthorisationApplication(featureName, action)
        break
    case actionTypes.ACTION_TYPE_VARIATION_MARKETING_AUTHORISATION_APPLICATION:
      log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_VARIATION_MARKETING_AUTHORISATION_APPLICATION}`)
      await createVariationMarketingAuthorisationApplication(featureName, action)
      break
    case actionTypes.ACTION_TYPE_JOB_MARKETING_AUTHORISATION_RENEWAL:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_JOB_MARKETING_AUTHORISATION_RENEWAL}`)
        await createMarketingAuthorisationRenewalJob(featureName, action)
        break
    case actionTypes.ACTION_TYPE_JOB_MARKETING_AUTHORISATION_NEW:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_JOB_MARKETING_AUTHORISATION_NEW}`)
        await createMarketingAuthorisationNewJob(featureName, action)
        break
    case actionTypes.ACTION_TYPE_JOB_REGISTRATION:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_JOB_REGISTRATION}`)
        await createRegistrationJob(featureName, action)
        break
    case actionTypes.ACTION_TYPE_SECURE_MESSAGE:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_SECURE_MESSAGE}`)
        await createSecureMessage(featureName, action)
        break
    case actionTypes.ACTION_TYPE_SENT_MESSAGE:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_SENT_MESSAGE}`)
        await createSentMessage(featureName, action)
        break
        case actionTypes.ACTION_TYPE_GROUP_MESSAGE:
            log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_GROUP_MESSAGE}`)
            await createGroupMessage(featureName, action)
        break
    case actionTypes.ACTION_TYPE_STORAGE:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_STORAGE}`)
        await createStorageRecord(featureName, action)
        break
    default:
        log.debug(`${SERVICE_NAME}::unrecognised action type ${action.type}`)
        break
    }
}

async function createVetPractice (featureName, action) {
    log.debug(`${SERVICE_NAME}::createVetPractice`)
    let vetPracticeData = action.data
    log.info(`${SERVICE_NAME}::createVetPractice::${action.label}::creating vet practice from ${JSON.stringify(vetPracticeData)}`)
    let responseData = await organisationService.createOrganisation(orgTypes.ORG_TYPE_VET_PRACTICE, vetPracticeData)
    log.info(`${SERVICE_NAME}::createVetPractice::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createVetPractice, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var vetPracticeIdList = localStorage.getItem(featureName, 'vetPracticeIdList')
    if (!vetPracticeIdList) {
        vetPracticeIdList = []
    }
    vetPracticeIdList.push(responseData.Id)
    localStorage.setItem(featureName, 'vetPracticeIdList', vetPracticeIdList)
}

async function createVet (featureName, action) {
    log.debug(`${SERVICE_NAME}::createVet`)
    let vetData = action.data
    log.info(`${SERVICE_NAME}::createVet::${action.label}::creating vet from ${JSON.stringify(vetData)}`)
    let responseData = await userService.createUser(userTypes.USER_TYPE_VET, vetData)
    log.info(`${SERVICE_NAME}::createVet::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createVet, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var vetIdList = localStorage.getItem(featureName, 'vetIdList')
    if (!vetIdList) {
        vetIdList = []
    }
    vetIdList.push(responseData.Id)
    localStorage.setItem(featureName, 'vetIdList', vetIdList)

    if (action.testUser === 'true' && responseData.Email) {
        let email = responseData.Email
        log.info(`${SERVICE_NAME}::createVet::${action.label}::saving test user ${email}`)
        localStorage.setItem(createInternalUserfeatureName, 'testuser', { 'Email': email, 'Password': constants.DEFAULT_USER_PASSWORD })
    }
}

async function createInternalUser (featureName, action) {
    log.debug(`${SERVICE_NAME}::createInternalUser`)
    let data = action.data
    log.info(`${SERVICE_NAME}::createInternalUser::${action.label}::creating internal user from ${JSON.stringify(data)}`)
    let responseData = await userService.createUser(userTypes.USER_TYPE_INTERNAL, data)
    log.info(`${SERVICE_NAME}::createInternalUser::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createInternalUser, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var internalUsersIdList = localStorage.getItem(featureName, 'internalUsersIdList')
    if (!internalUsersIdList) {
        internalUsersIdList = []
    }
    internalUsersIdList.push(responseData.Id)
    localStorage.setItem(featureName, 'internalUsersIdList', internalUsersIdList)
}

async function createProduct (featureName, action) {
    log.debug(`${SERVICE_NAME}::createProduct`)
    let productData = action.data
    log.info(`${SERVICE_NAME}::createProduct::${action.label}::creating product from ${JSON.stringify(productData)}`)
    let responseData = await productService.createProduct(productData)
    log.info(`${SERVICE_NAME}::createProduct::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createProduct, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var productList = localStorage.getItem(featureName, 'productList')
    if (!productList) {
        productList = []
    }
    productList.push(responseData.ProductNo)
    localStorage.setItem(featureName, 'productList', productList)
}

async function createSpeciesQualifying (featureName, action) {
    log.debug(`${SERVICE_NAME}::createSpeciesQualifying`)
    let speciesQualifyingData = action.data
    log.info(`${SERVICE_NAME}::createSpeciesQualifying::${action.label}::creating species qualifying from ${JSON.stringify(speciesQualifyingData)}`)
    let responseData = await speciesQualifyingService.createSpeciesQualifying(speciesQualifyingData)
    log.info(`${SERVICE_NAME}::createSpeciesQualifying::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createSpeciesQualifying, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var speciesQualifyingList = localStorage.getItem(featureName, 'speciesQualifyingList')
    if (!speciesQualifyingList) {
        speciesQualifyingList = []
    }
    speciesQualifyingList.push(responseData.Id)
    localStorage.setItem(featureName, 'speciesQualifyingList', speciesQualifyingList)
}

async function createReferenceData (featureName, action) {
    log.debug(`${SERVICE_NAME}::createReferenceData`)
    let referenceData = action.data
    log.info(`${SERVICE_NAME}::createReferenceData::${action.label}::creating referenceData from ${JSON.stringify(referenceData)}`)
    let responseData = await referenceDataService.createReferenceData(referenceData)
    log.info(`${SERVICE_NAME}::createReferenceData::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createReferenceData, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var referenceDataList = localStorage.getItem(featureName, 'referenceDataList')
    if (!referenceDataList) {
        referenceDataList = []
    }
    referenceDataList.push(responseData.Id)
    localStorage.setItem(featureName, 'referenceDataList', referenceDataList)
}

async function createSubstanceQualifier (featureName, action) {
    log.debug(`${SERVICE_NAME}::createSubstanceQualifier`)
    let substanceQualifierData = action.data
    log.info(`${SERVICE_NAME}::createSubstanceQualifier::${action.label}::creating substance qualifier from ${JSON.stringify(substanceQualifierData)}`)
    let responseData = await substanceQualifierService.createSubstanceQualifier(substanceQualifierData)
    log.info(`${SERVICE_NAME}::createSubstanceQualifier::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createSubstanceQualifier, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var substanceQualifierList = localStorage.getItem(featureName, 'substanceQualifierList')
    if (!substanceQualifierList) {
        substanceQualifierList = []
    }
    substanceQualifierList.push(responseData.Id)
    localStorage.setItem(featureName, 'substanceQualifierList', substanceQualifierList)
}

async function createOrganisation (organisationType, featureName, action) {
    log.debug(`${SERVICE_NAME}::createOrganisation`)
    let organisationData = action.data
    let responseData = await organisationService.createOrganisation(organisationType, organisationData)
    log.info(`${SERVICE_NAME}::createOrganisation::${action.label}::created:${JSON.stringify(responseData)}`)

    log.info(`${SERVICE_NAME}::createOrganisation::${featureName}::${action.label}::creating organisation from ${JSON.stringify(organisationData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    
    if (action.global == 'true') 
        featureName = 'global'

    log.info(`${SERVICE_NAME}::createOrganisation::${featureName}::${action.label}::setItem ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var organisationIdList = localStorage.getItem(featureName, 'organisationIdList')
    if (!organisationIdList) {
        organisationIdList = []
    }
    organisationIdList.push(responseData.Id)
    localStorage.setItem(featureName, 'organisationIdList', organisationIdList)
}

async function createMarketingAuthorisation (featureName, action) {
    log.debug(`${SERVICE_NAME}::createMarketingAuthorisation`)
    let maData = action.data
    log.info(`${SERVICE_NAME}::createMarketingAuthorisation::${action.label}::creating marketing authorisation from ${JSON.stringify(maData)}`)
    let responseData = await marketingAuthorisationService.createMarketingAuthorisation(maData)
    log.info(`${SERVICE_NAME}::createMarketingAuthorisation::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createMarketingAuthorisation, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var maList = localStorage.getItem(featureName, 'maList')
    if (!maList) {
        maList = []
    }
    maList.push(responseData.Id)
    localStorage.setItem(featureName, 'maList', maList)
}

async function createNewMarketingAuthorisationApplication (featureName, action) {
    log.debug(`${SERVICE_NAME}::createNewMarketingAuthorisationApplication`)
    let maData = action.data
    log.info(`${SERVICE_NAME}::createNewMarketingAuthorisationApplication::${action.label}::creating new marketing authorisation application from ${JSON.stringify(maData)}`)
    let responseData = await maApplicationService.createNewMarketingAuthorisationApplication(maData)
    log.info(`${SERVICE_NAME}::createNewMarketingAuthorisationApplication::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createNewMarketingAuthorisationApplication, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var maAppList = localStorage.getItem(featureName, 'maApplicationList')
    if (!maAppList) {
        maAppList = []
    }
    maAppList.push(responseData.InternalReference)
    localStorage.setItem(featureName, 'maApplicationList', maAppList)
}

async function createDraftMarketingAuthorisationApplication (featureName, action) {
    log.debug(`${SERVICE_NAME}::createDraftMarketingAuthorisationApplication`)
    let maData = action.data
    log.info(`${SERVICE_NAME}::createDraftMarketingAuthorisationApplication::${action.label}::creating draft marketing authorisation application from ${JSON.stringify(maData)}`)
    let responseData = await maApplicationService.createDraftMarketingAuthorisationApplication(maData)
    log.info(`${SERVICE_NAME}::createDraftMarketingAuthorisationApplication::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createDraftMarketingAuthorisationApplication, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var maDraftAppList = localStorage.getItem(featureName, 'maDraftApplicationList')
    if (!maDraftAppList) {
        maDraftAppList = []
    }
    console.log(responseData.InternalReference)
    maDraftAppList.push(responseData.InternalReference)
    localStorage.setItem(featureName, 'maDraftApplicationList', maDraftAppList)
}

async function createRenewalMarketingAuthorisationApplication (featureName, action) {
    log.debug(`${SERVICE_NAME}::createRenewalMarketingAuthorisationApplication`)
    let maData = action.data
    log.info(`${SERVICE_NAME}::createRenewalMarketingAuthorisationApplication::${action.label}::creating renewal marketing authorisation application from ${JSON.stringify(maData)}`)
    let responseData = await maApplicationService.createRenewalMarketingAuthorisationApplication(maData)
    log.info(`${SERVICE_NAME}::createRenewalMarketingAuthorisationApplication::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createRenewalMarketingAuthorisationApplication, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var maAppList = localStorage.getItem(featureName, 'maApplicationList')
    if (!maAppList) {
        maAppList = []
    }
    maAppList.push(responseData.InternalReference)
    localStorage.setItem(featureName, 'maApplicationList', maAppList)
}

async function createVariationMarketingAuthorisationApplication (featureName, action) {
  log.debug(`${SERVICE_NAME}::createVariationMarketingAuthorisationApplication`)
  let maData = action.data
  log.info(`${SERVICE_NAME}::createVariationMarketingAuthorisationApplication::${action.label}::creating variation marketing authorisation application from ${JSON.stringify(maData)}`)
  let responseData = await maApplicationService.createVariationMarketingAuthorisationApplication(maData)
  log.info(`${SERVICE_NAME}::createVariationMarketingAuthorisationApplication::${action.label}::created:${JSON.stringify(responseData)}`)
  var savedAction = localStorage.getItem(featureName, action.label)
  savedAction.response = responseData
  log.debug(`${SERVICE_NAME}::createVariationMarketingAuthorisationApplication, saved action ${JSON.stringify(savedAction)}`)
  localStorage.setItem(featureName, action.label, savedAction)
  var maAppList = localStorage.getItem(featureName, 'maApplicationList')
  if (!maAppList) {
    maAppList = []
  }
  maAppList.push(responseData.InternalReference)
  localStorage.setItem(featureName, 'maApplicationList', maAppList)
}

async function createMarketingAuthorisationRenewalJob (featureName, action){
    log.debug(`${SERVICE_NAME}::createMarketingAuthorisationRenewalJob`)
    let data = action.data
    log.info(`${SERVICE_NAME}::createMarketingAuthorisationRenewalJob::${action.label}::starting marketing authorisation renewal job from ${JSON.stringify(data)}`)
    let responseData = await jobService.startJob(constants.JOB_TYPE_MARKETING_AUTHORISATION_RENEWAL, featureName)
    let jobId = responseData.Id
    responseData = await jobService.updateJob(jobId, data)
    log.info(`${SERVICE_NAME}::createMarketingAuthorisationRenewalJob::${action.label}::updated:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createMarketingAuthorisationRenewalJob, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var maRenewalJobList = localStorage.getItem(featureName, 'maRenewalJobList')
    if (!maRenewalJobList) {
        maRenewalJobList = []
    }
    maRenewalJobList.push(responseData.Identifier)
    localStorage.setItem(featureName, 'maRenewalJobList', maRenewalJobList)
}

async function createMarketingAuthorisationNewJob (featureName, action){
    log.debug(`${SERVICE_NAME}::createMarketingAuthorisationNewJob`)
    let data = action.data
    log.info(`${SERVICE_NAME}::createMarketingAuthorisationNewJob::${action.label}::starting marketing authorisation new job from ${JSON.stringify(data)}`)
    let responseData = await jobService.startJob(constants.JOB_TYPE_MARKETING_AUTHORISATION_NEW, featureName)
    let jobId = responseData.Id
    responseData = await jobService.updateJob(jobId, data)
    log.info(`${SERVICE_NAME}::createMarketingAuthorisationNewJob::${action.label}::updated:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createMarketingAuthorisationNewJob, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var maNewJobList = localStorage.getItem(featureName, 'maNewJobList')
    if (!maNewJobList) {
        maNewJobList = []
    }
    maNewJobList.push(responseData.Identifier)
    localStorage.setItem(featureName, 'maNewJobList', maNewJobList)
}

async function createRegistrationJob (featureName, action){
    log.debug(`${SERVICE_NAME}::createRegistrationJob`)
    let data = action.data
    log.info(`${SERVICE_NAME}::createRegistrationJob::${action.label}::starting a new business registration job from ${JSON.stringify(data)}`)
    let responseData = await jobService.startJob(constants.JOB_TYPE_REGISTRATION, featureName)
    let jobId = responseData.Id
    responseData = await jobService.updateJob(jobId, data)
    log.info(`${SERVICE_NAME}::createRegistrationJob::${action.label}::updated:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createRegistrationJob, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var registrationJobList = localStorage.getItem(featureName, 'registrationJobList')
    if (!registrationJobList) {
        registrationJobList = []
    }
    registrationJobList.push(responseData.Identifier)
    localStorage.setItem(featureName, 'registrationJobList', registrationJobList)
}

async function createExternalUser (featureName, action) {
    log.debug(`${SERVICE_NAME}::createExternalUser`)
    let data = action.data
    log.info(`${SERVICE_NAME}::createExternalUser::${action.label}::creating external user from ${JSON.stringify(data)}`)
    let responseData = await userService.createExternalUser(data)
    log.info(`${SERVICE_NAME}::createExternalUser::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createExternalUser, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
 
    const externalUsersIdList = localStorage.getItem(featureName, 'externalUsersIdList') || []
    externalUsersIdList.push(responseData.Id) 
    localStorage.setItem(featureName, 'externalUsersIdList', externalUsersIdList)

    // Now wanted to access external users (non test user), however added new array rather than altering deletion logic
    if (action.testUser === 'true' && responseData.Email) {
        const email = responseData.Email
        log.info(`${SERVICE_NAME}::createExternalUser::${action.label}::saving test user ${email}`)
        localStorage.setItem(featureName, 'testuser', { 'Email': email, 'Password': constants.DEFAULT_USER_PASSWORD })
    } else {
        log.info(`${SERVICE_NAME}::createExternalUser::${action.label}::adding to external users: ${responseData.Name}`)
        const externalUsers = localStorage.getItem(featureName, 'externalUsers') || []
        externalUsers.push(responseData)
        localStorage.setItem(featureName, 'externalUsers', externalUsers)
    }
}

async function createSecureMessage (featureName, action){
    log.info(`${SERVICE_NAME}::createSecureMessage::${action.label}::creating a new secure message ${JSON.stringify(action.data)}`)
    let savedFromUser = await localStorage.getItem(featureName, action.data.FromUser)
    const organisation = await localStorage.getItem(featureName, action.data.Organisation)
    if (!savedFromUser) {
        // Check for a global user
        savedFromUser = await localStorage.getItem('global', action.data.FromUser)
    }
    let savedToUser = await localStorage.getItem(featureName, action.data.ToUser)
    if (!savedToUser) {
        // Check for a global user
        savedToUser = await localStorage.getItem('global', action.data.ToUser)
    }

    var sendData = {}
    sendData.FromUserId = savedFromUser.response.Id // Only used to populate header, should really be a param of sendMessage
    sendData.Subject = action.data.Subject
    sendData.Message = action.data.Message
    sendData.ToUserId = savedToUser.response.Id
    sendData.OrganisationId = organisation.response.Id

    sendData.RecipientIds = []
    for (const userLabel of action.data.Recipients) {
        let savedAction = await localStorage.getItem(featureName, userLabel)
        if(savedAction && savedAction.response) {
            log.info(`${SERVICE_NAME}::createSecureMessage::RecipientId ${savedAction.response.Id}`)
            sendData.RecipientIds.push(savedAction.response.Id)
        } else {
            let globalUserSavedAction = await localStorage.getItem('global', userLabel)
            if(globalUserSavedAction && globalUserSavedAction.response) {
                log.info(`${SERVICE_NAME}::createSecureMessage::RecipientId ${globalUserSavedAction.response.Id}`)
                sendData.RecipientIds.push(globalUserSavedAction.response.Id)
            }
        }
    }

    sendData.AttachmentsToCreate = []
    if(action.data && action.data.Attachments && action.data.Attachments.length) {
        sendData.AttachmentsToCreate = action.data.Attachments
    }

    var sendMessageResponse = await messageService.createSecure(sendData)

    log.info(`${SERVICE_NAME}::createSecureMessage::${action.label}::sendMessage:${JSON.stringify(sendMessageResponse)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = sendMessageResponse
    log.debug(`${SERVICE_NAME}::createSecureMessage, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)

    var secureMessageList = localStorage.getItem(featureName, 'secureMessageList')
    if (!secureMessageList) {
        secureMessageList = []
    }

    secureMessageList.push(sendMessageResponse.Id)
    localStorage.setItem(featureName, 'secureMessageList', secureMessageList)
}

async function createSentMessage (featureName, action){
    log.info(`${SERVICE_NAME}::createSentMessage::${action.label}::creating a new sent message ${JSON.stringify(action.data)}`)
    let storedUser = await localStorage.getItem(featureName, action.data.FromUser)
    const organisation = await localStorage.getItem(featureName, action.data.Organisation)
    if (!storedUser) {
        // Check for a global user
        storedUser = await localStorage.getItem('global', action.data.FromUser)
    }
    let fromUser = storedUser.response

    var sentDataPayload = {}
    sentDataPayload.Subject = action.data.Subject
    sentDataPayload.Message = action.data.Message
    sentDataPayload.FromUserId = fromUser.Id
    sentDataPayload.OrganisationId = organisation.response.Id

    sentDataPayload.RecipientIds = []
    for (const userLabel of action.data.Recipients) {
        let savedAction = await localStorage.getItem(featureName, userLabel)
        if(savedAction && savedAction.response) {
            log.info(`${SERVICE_NAME}::createSentMessage::RecipientId ${savedAction.response.Id}`)
            sentDataPayload.RecipientIds.push(savedAction.response.Id)
        } else {
            let globalUserSavedAction = await localStorage.getItem('global', userLabel)
            if(globalUserSavedAction && globalUserSavedAction.response) {
                log.info(`${SERVICE_NAME}::createSentMessage::RecipientId ${globalUserSavedAction.response.Id}`)
                sentDataPayload.RecipientIds.push(globalUserSavedAction.response.Id)
            }
        }
    }

    sentDataPayload.AttachmentsToCreate = []
    if(action.data && action.data.Attachments && action.data.Attachments.length) {
        sentDataPayload.AttachmentsToCreate = action.data.Attachments
    }

    var createdSentMessage = await messageService.createSent(sentDataPayload)

    log.info(`${SERVICE_NAME}::createSentMessage::${action.label}::createdSentMessage:${JSON.stringify(createdSentMessage)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = createdSentMessage
    log.debug(`${SERVICE_NAME}::createSentMessage, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)

    storeMessageIdForDeletion(featureName, createdSentMessage.Id)
}

function storeMessageIdForDeletion(featureName, messageId){
    var secureMessageList = localStorage.getItem(featureName, 'secureMessageList')
    if (!secureMessageList) {
        secureMessageList = []
    }

    secureMessageList.push(messageId)
    localStorage.setItem(featureName, 'secureMessageList', secureMessageList)
}

function storeGroupMessageIdForDeletion(featureName, messageId){
    var groupMessageList = localStorage.getItem(featureName, 'groupMessageList')
    if (!groupMessageList) {
        groupMessageList = []
    }

    groupMessageList.push(messageId)
    localStorage.setItem(featureName, 'groupMessageList', groupMessageList)
}

async function createGroupMessage (featureName, action){
    log.info(`${SERVICE_NAME}::createGroupMessage::${action.label}::creating a new group message ${JSON.stringify(action.data)}`)
    
    const organisation = await localStorage.getItem(featureName, action.data.Organisation)
    
    let storedFromUser = await localStorage.getItem(featureName, action.data.FromUser)
    if (!storedFromUser) {
        // Check for a global user
        storedFromUser = await localStorage.getItem('global', action.data.FromUser)
    }
    let fromUser = storedFromUser.response
    
    let storedToUser = await localStorage.getItem(featureName, action.data.ToUser)
    if (!storedToUser) {
        // Check for a global user
        storedToUser = await localStorage.getItem('global', action.data.ToUser)
    }
    let toUser = storedToUser.response

    var sentDataPayload = {}
    sentDataPayload.Subject = action.data.Subject
    sentDataPayload.Message = action.data.Message
    sentDataPayload.Team = action.data.Team
    sentDataPayload.FromUserId = fromUser.Id
    sentDataPayload.ToUserId = toUser.Id
    sentDataPayload.OrganisationId = organisation.response.Id

    sentDataPayload.RecipientIds = []
    for (const userLabel of action.data.Recipients) {
        let savedAction = await localStorage.getItem(featureName, userLabel)
        if(savedAction && savedAction.response) {
            log.info(`${SERVICE_NAME}::createGroupMessage::RecipientId ${savedAction.response.Id}`)
            sentDataPayload.RecipientIds.push(savedAction.response.Id)
        } else {
            let globalUserSavedAction = await localStorage.getItem('global', userLabel)
            if(globalUserSavedAction && globalUserSavedAction.response) {
                log.info(`${SERVICE_NAME}::createGroupMessage::RecipientId ${globalUserSavedAction.response.Id}`)
                sentDataPayload.RecipientIds.push(globalUserSavedAction.response.Id)
            }
        }
    }

    sentDataPayload.AttachmentsToCreate = []
    if(action.data && action.data.Attachments && action.data.Attachments.length) {
        sentDataPayload.AttachmentsToCreate = action.data.Attachments
    }

    var createdGroupMessage = await groupMessageService.create(sentDataPayload, sentDataPayload.FromUserId)

    log.info(`${SERVICE_NAME}::createSentGroupMessage::${action.label}::createdGroupMessage:${JSON.stringify(createdGroupMessage)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = createdGroupMessage
    log.debug(`${SERVICE_NAME}::createSentGroupMessage, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    storeGroupMessageIdForDeletion(featureName, createdGroupMessage.Id)
}



async function createStorageRecord (featureName, action){
    log.debug(`${SERVICE_NAME}::createStorage`)
    let savedUser = await localStorage.getItem(featureName, action.data.UserLabel)
    if (!savedUser) {
        // Check for a global user
        savedUser = await localStorage.getItem('global', action.data.UserLabel)
    }
    let user = savedUser.response

    let responseData = await storageService.createStorageRecord(
        user.Id,
        action.data.FileName,
        action.data.ContentType,
        action.data.Payload)

    var savedAction = localStorage.getItem(featureName, action.label)
    if(responseData && responseData.length){
        savedAction.response = responseData[0]
        log.debug(`${SERVICE_NAME}::createStorage, saved action ${JSON.stringify(savedAction)}`)
        localStorage.setItem(featureName, action.label, savedAction)
        var storageList = localStorage.getItem(featureName, 'StorageList')
        if (!storageList) {
            storageList = []
        }
        storageList.push(responseData[0].Id)
        localStorage.setItem(featureName, 'StorageList', storageList)
    }
}

async function createGlobalExternalUser (action) {
    log.debug(`${SERVICE_NAME}::createGlobalExternalUser`)
    let data = action.data
    log.info(`${SERVICE_NAME}::createGlobalExternalUser::${action.label}::creating GLOBAl external user from ${JSON.stringify(data)}`)
    let existingUser = localStorage.getItem('global', action.label)
    if (existingUser && existingUser.response) {
        log.debug(`${SERVICE_NAME}::createGlobalExternalUser::user already exists::${'global'}::${action.label}::${JSON.stringify(existingUser)}`)
        return
    }
    log.info(`${SERVICE_NAME}::createGlobalExternalUser::${action.label}::creating GLOBAl external user from ${JSON.stringify(data)}`)
    
    let responseData = await userService.createExternalUser(data)
    log.info(`${SERVICE_NAME}::createGlobalExternalUser::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = Object.assign({}, action)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createGlobalExternalUser, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem("global", action.label, savedAction)
    var externalUsersIdList = localStorage.getItem("global", 'externalUsersIdList')
    if (!externalUsersIdList) {
        externalUsersIdList = []
    }
    externalUsersIdList.push(responseData.Id)
    localStorage.setItem("global", 'externalUsersIdList', externalUsersIdList)

    if (action.testUser === 'true' && responseData.Email) {
        let email = responseData.Email
        log.info(`${SERVICE_NAME}::createGlobalExternalUser::${action.label}::saving test user ${email}`)
        localStorage.setItem("global", 'testuser', { 'Email': email, 'Password': constants.DEFAULT_USER_PASSWORD })
    }
}

module.exports.process = process
