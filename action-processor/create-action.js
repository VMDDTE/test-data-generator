const actionTypes = require('../common/constants')
const orgTypes = require('../common/constants')
const userTypes = require('../common/constants')
const organisationService = require('../service/organisation-service')
const localStorage = require('../service/local-storage-service')
const userService = require('../service/user-service')
const productService = require('../service/product-service')
const speciesService = require('../service/species-service')
const speciesQualifyingService = require('../service/species-qualifying-service')
const substanceService = require('../service/substance-service')
const substanceQualifierService = require('../service/substance-qualifier-service')
const marketingAuthorisationService = require('../service/marketing-authorisation-service')
const jobService = require('../service/job-service')
const sisService = require('../service/sis-service')
const messageService = require('../service/message-service')
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
        await createExternalUser(featureName, action)
        break
    case actionTypes.ACTION_TYPE_VET_PRACTICE_RECORD:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_VET_PRACTICE_RECORD}`)
        await createVetPractice(featureName, action)
        break
    case actionTypes.ACTION_TYPE_PRODUCT:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_PRODUCT}`)
        await createProduct(featureName, action)
        break
    case actionTypes.ACTION_TYPE_SPECIES:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_SPECIES}`)
        await createSpecies(featureName, action)
        break
    case actionTypes.ACTION_TYPE_SPECIES_QUALIFYING:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_SPECIES_QUALIFYING}`)
        await createSpeciesQualifying(featureName, action)
        break
    case actionTypes.ACTION_TYPE_SUBSTANCE:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_SUBSTANCE}`)
        await createSubstance(featureName, action)
        break
    case actionTypes.ACTION_TYPE_SUBSTANCE_QUALIFIER:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_SUBSTANCE_QUALIFIER}`)
        await createSubstanceQualifier(featureName, action)
        break
    case actionTypes.ACTION_TYPE_MANUFACTURER:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_MANUFACTURER}`)
        await createManufacturer(featureName, action)
        break
    case actionTypes.ACTION_TYPE_SPECIAL_IMPORT_APPLICATION:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_SPECIAL_IMPORT_APPLICATION}`)
        await createSpecialImportApplication(featureName, action)
        break
    case actionTypes.ACTION_TYPE_MARKETING_AUTHORISATION:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_MARKETING_AUTHORISATION}`)
        await createMarketingAuthorisation(featureName, action)
        break
    case actionTypes.ACTION_TYPE_JOB_MARKETING_AUTHORISATION_RENEWAL:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_JOB_MARKETING_AUTHORISATION_RENEWAL}`)
        await createMarketingAuthorisationRenewalJob(featureName, action)
        break
    case actionTypes.ACTION_TYPE_JOB_REGISTRATION:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_JOB_REGISTRATION}`)
        await createRegistrationJob(featureName, action)
        break
    case actionTypes.ACTION_TYPE_SECURE_MESSAGE:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.ACTION_TYPE_SECURE_MESSAGE}`)
        await createSecureMessage(featureName, action)
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

async function createSpecies (featureName, action) {
    log.debug(`${SERVICE_NAME}::createSpecies`)
    let speciesData = action.data
    log.info(`${SERVICE_NAME}::createSpecies::${action.label}::creating species from ${JSON.stringify(speciesData)}`)
    let responseData = await speciesService.createSpecies(speciesData)
    log.info(`${SERVICE_NAME}::createSpecies::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createSpecies, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var speciesList = localStorage.getItem(featureName, 'speciesList')
    if (!speciesList) {
        speciesList = []
    }
    speciesList.push(responseData.ProductNo)
    localStorage.setItem(featureName, 'speciesList', speciesList)
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

async function createSubstance (featureName, action) {
    log.debug(`${SERVICE_NAME}::createSubstance`)
    let substanceData = action.data
    log.info(`${SERVICE_NAME}::createSubstance::${action.label}::creating substance from ${JSON.stringify(substanceData)}`)
    let responseData = await substanceService.createSubstance(substanceData)
    log.info(`${SERVICE_NAME}::createSubstance::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createSubstance, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var substanceList = localStorage.getItem(featureName, 'substanceList')
    if (!substanceList) {
        substanceList = []
    }
    substanceList.push(responseData.ProductNo)
    localStorage.setItem(featureName, 'substanceList', substanceList)
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

async function createManufacturer (featureName, action) {
    log.debug(`${SERVICE_NAME}::createManufacturer`)
    let manufacturerData = action.data
    log.info(`${SERVICE_NAME}::createManufacturer::${action.label}::creating manufacturer from ${JSON.stringify(manufacturerData)}`)
    let responseData = await organisationService.createOrganisation(orgTypes.ORG_TYPE_NAME_MANUFACTURER, manufacturerData)
    log.info(`${SERVICE_NAME}::createManufacturer::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createManufacturer, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var manufacturerIdList = localStorage.getItem(featureName, 'manufacturerIdList')
    if (!manufacturerIdList) {
        manufacturerIdList = []
    }
    manufacturerIdList.push(responseData.Id)
    localStorage.setItem(featureName, 'manufacturerIdList', manufacturerIdList)
}

async function createSpecialImportApplication (namespace, action) {
    log.debug(`${SERVICE_NAME}::createSpecialImportApplication`)
    let specialImportApplicationData = action.data
    log.info(`${SERVICE_NAME}::createSpecialImportApplication::${action.label}::creating specialImportApplication from ${JSON.stringify(specialImportApplicationData)}`)

    log.info(`${SERVICE_NAME}::createSpecialImportApplication::${action.label}::about to create job`)
    let responseData = await jobService.createJob('import', 'SpecialImports')
    log.info(`${SERVICE_NAME}::createSpecialImportApplication::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(namespace, action.label)
    savedAction.createJobResponse = responseData
    log.debug(`${SERVICE_NAME}::createSpecialImportApplication, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(namespace, action.label, savedAction)
    let jobIdentifier = responseData.Identifier
    let jobId = responseData.Id

    log.info(`${SERVICE_NAME}::createSpecialImportApplication::${action.label}::about to update job state`)
    responseData = await jobService.updateJobStatus(jobIdentifier, specialImportApplicationData.JobState)
    log.info(`${SERVICE_NAME}::createSpecialImportApplication::${action.label}::created:${JSON.stringify(responseData)}`)
    savedAction = localStorage.getItem(namespace, action.label)
    savedAction.updateJobStateResponse = responseData
    log.debug(`${SERVICE_NAME}::createSpecialImportApplication, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(namespace, action.label, savedAction)

    log.info(`${SERVICE_NAME}::createSpecialImportApplication::${action.label}::about to update SIS record`)
    responseData = await sisService.update(jobId, specialImportApplicationData.JobUpdatedBy, specialImportApplicationData)
    log.info(`${SERVICE_NAME}::createSpecialImportApplication::${action.label}::updated:${JSON.stringify(responseData)}`)
    savedAction = localStorage.getItem(namespace, action.label)
    savedAction.updateSisRecordResponse = responseData
    log.debug(`${SERVICE_NAME}::createSpecialImportApplication, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(namespace, action.label, savedAction)

    var specialImportApplicationIdList = localStorage.getItem(namespace, 'specialImportApplicationIdList')
    if (!specialImportApplicationIdList) {
        specialImportApplicationIdList = []
    }
    specialImportApplicationIdList.push(jobIdentifier)
    localStorage.setItem(namespace, 'specialImportApplicationIdList', specialImportApplicationIdList)
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

async function createMarketingAuthorisationRenewalJob (featureName, action){
    log.debug(`${SERVICE_NAME}::createMarketingAuthorisationRenewalJob`)
    let data = action.data
    log.info(`${SERVICE_NAME}::createMarketingAuthorisationRenewalJob::${action.label}::creating marketing authorisation renewal job from ${JSON.stringify(data)}`)
    let responseData = await jobService.createJob(constants.JOB_TYPE_MARKETING_AUTHORISATION_RENEWAL, featureName)
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
    maRenewalJobList.push(responseData.Id)
    localStorage.setItem(featureName, 'maRenewalJobList', maRenewalJobList)
}

async function createRegistrationJob (featureName, action){
    log.debug(`${SERVICE_NAME}::createRegistrationJob`)
    let data = action.data
    log.info(`${SERVICE_NAME}::createRegistrationJob::${action.label}::creating a new business registration job from ${JSON.stringify(data)}`)
    let responseData = await jobService.createJob(constants.JOB_TYPE_REGISTRATION, featureName)
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
    registrationJobList.push(responseData.Id)
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
    var externalUsersIdList = localStorage.getItem(featureName, 'externalUsersIdList')
    if (!externalUsersIdList) {
        externalUsersIdList = []
    }
    externalUsersIdList.push(responseData.Id)
    localStorage.setItem(featureName, 'externalUsersIdList', externalUsersIdList)

    if (action.testUser === 'true' && responseData.Email) {
        let email = responseData.Email
        log.info(`${SERVICE_NAME}::createVet::${action.label}::saving test user ${email}`)
        localStorage.setItem(featureName, 'testuser', { 'Email': email, 'Password': constants.DEFAULT_USER_PASSWORD })
    }
}

async function createSecureMessage (featureName, action){
    log.debug(`${SERVICE_NAME}::createSecureMessage`)
    let data = action.data
    log.info(`${SERVICE_NAME}::createSecureMessage::${action.label}::creating a new secure message ${JSON.stringify(data)}`)
    let responseData = await messageService.createDraft(data.FromUserId)
    let draftId = responseData.Id
    responseData = await messageService.sendDraft(draftId, data)
    log.info(`${SERVICE_NAME}::createSecureMessage::${action.label}::sendDraft:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createSecureMessage, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var secureMessageList = localStorage.getItem(featureName, 'secureMessageList')
    if (!secureMessageList) {
        secureMessageList = []
    }
    secureMessageList.push(responseData.Id)
    localStorage.setItem(featureName, 'secureMessageList', secureMessageList)
}


module.exports.process = process
