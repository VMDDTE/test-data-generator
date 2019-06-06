const actionTypes = require('../common/constants')
const orgTypes = require('../common/constants')
const userTypes = require('../common/constants')
const organisationService = require('../service/organisation-service')
const localStorage = require('../service/local-storage-service')
const userService = require('../service/user-service')
const productService = require('../service/product-service')
const speciesService = require('../service/species-service')
const speciesQualifyingService = require('../service/species-qualifying-service')
const jobService = require('../service/job-service')
const sisService = require('../service/sis-service')
const constants = require('../common/constants')
const log = global.log

const SERVICE_NAME = 'create-action-processor'

async function process (featureName, action) {
    log.debug(`${SERVICE_NAME}::${featureName}::process`)
    switch (action.type) {
    case actionTypes.TYPE_VET:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.TYPE_VET}`)
        await createVet(featureName, action)
        break
    case actionTypes.TYPE_INTERNAL_USER:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.TYPE_INTERNAL_USER}`)
        await createInternalUser(featureName, action)
        break
    case actionTypes.TYPE_VET_PRACTICE_RECORD:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.TYPE_VET_PRACTICE_RECORD}`)
        await createVetPractice(featureName, action)
        break
    case actionTypes.TYPE_PRODUCT:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.TYPE_PRODUCT}`)
        await createProduct(featureName, action)
        break
    case actionTypes.TYPE_SPECIES:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.TYPE_SPECIES}`)
        await createSpecies(featureName, action)
        break
    case actionTypes.TYPE_SPECIES_QUALIFYING:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.TYPE_SPECIES_QUALIFYING}`)
        await createSpeciesQualifying(featureName, action)
        break
    case actionTypes.TYPE_MANUFACTURER:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.TYPE_MANUFACTURER}`)
        await createManufacturer(featureName, action)
        break
    case actionTypes.TYPE_SPECIAL_IMPORT_APPLICATION:
        log.info(`${SERVICE_NAME}::processing ${actionTypes.TYPE_SPECIAL_IMPORT_APPLICATION}`)
        await createSpecialImportApplication(featureName, action)
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
        localStorage.setItem(featureName, 'testuser', { 'Email': email, 'Password': constants.DEFAULT_USER_PASSWORD })
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
    let responseData = await speciesQualifyingService.createSpecies(speciesQualifyingData)
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

async function createManufacturer (featureName, action) {
    log.debug(`${SERVICE_NAME}::createManufacturer`)
    let manufacturerData = action.data
    log.info(`${SERVICE_NAME}::createManufacturer::${action.label}::creating manufacturer from ${JSON.stringify(manufacturerData)}`)
    let responseData = await organisationService.createOrganisation(orgTypes.ORG_TYPE_MANUFACTURER, manufacturerData)
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

module.exports.process = process
