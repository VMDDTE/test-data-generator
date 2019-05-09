const actionTypes = require('../common/constants')
const orgTypes = require('../common/constants')
const userTypes = require('../common/constants')
const organisationService = require('../service/organisation-service')
const localStorage = require('../service/local-storage-service')
const userService = require('../service/user-service')
const productService = require('../service/product-service')
const speciesService = require('../service/species-service')
const log = global.log

const SERVICE_NAME = 'create-action-processor'

async function process(featureName, action) {
    log.debug(`${SERVICE_NAME}::${featureName}::process`)
    switch (action.type) {
        case actionTypes.TYPE_VET:
            log.info(`${SERVICE_NAME}::processing ${actionTypes.TYPE_VET}`)
            await createVet(featureName, action)
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
        case actionTypes.TYPE_MANUFACTURER:
            log.info(`${SERVICE_NAME}::processing ${actionTypes.TYPE_MANUFACTURER}`)
            await createManufacturer(featureName, action)
            break
        default:
            log.debug(`${SERVICE_NAME}::unrecognised action type ${action.type}`)
            break
    }
}

async function createVetPractice(featureName, action) {
    log.debug(`${SERVICE_NAME}::createVetPractice`)
    let vetPracticeData = action.data
    log.info(`${SERVICE_NAME}::createVetPractice::${action.label}::creating vet practice from ${JSON.stringify(vetPracticeData)}`)
    let response = await organisationService.createOrganisation(orgTypes.ORG_TYPE_VET_PRACTICE, vetPracticeData)
    let responseData = response.data
    log.info(`${SERVICE_NAME}::createVetPractice::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createVetPractice, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var vetPracticeIdList = localStorage.getItem(featureName, 'vetPracticeIdList')
    if (!vetPracticeIdList) {
        vetPracticeIdList = []
    }
    vetPracticeIdList.push(responseData.id)
    localStorage.setItem(featureName, 'vetPracticeIdList', vetPracticeIdList)
}

async function createVet(featureName, action) {
    log.debug(`${SERVICE_NAME}::createVet`)
    let vetData = action.data
    log.info(`${SERVICE_NAME}::createVet::${action.label}::creating vet from ${JSON.stringify(vetData)}`)
    let response = await userService.createUser(userTypes.USER_TYPE_VET, vetData)
    let responseData = response.data
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

    let userId = responseData.UserId
    let password = responseData.Password
    if (userId && password) {
        let user = {
            'userId': userId,
            'password': password
        }
        localStorage.setItem(featureName, 'testuser', user)
    }
}

async function createProduct(featureName, action) {
    log.debug(`${SERVICE_NAME}::createProduct`)
    let productData = action.data
    log.info(`${SERVICE_NAME}::createProduct::${action.label}::creating product from ${JSON.stringify(productData)}`)
    let response = await productService.createProduct(productData)
    let responseData = response.data
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

async function createSpecies(featureName, action) {
    log.debug(`${SERVICE_NAME}::createSpecies`)
    let speciesData = action.data
    log.info(`${SERVICE_NAME}::createSpecies::${action.label}::creating species from ${JSON.stringify(speciesData)}`)
    let response = await speciesService.createSpecies(speciesData)
    let responseData = response.data
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

async function createManufacturer(featureName, action) {
    log.debug(`${SERVICE_NAME}::createManufacturer`)
    let manufacturerData = action.data
    log.info(`${SERVICE_NAME}::createManufacturer::${action.label}::creating manufacturer from ${JSON.stringify(manufacturerData)}`)
    let response = await organisationService.createOrganisation(orgTypes.ORG_TYPE_MANUFACTURER, manufacturerData)
    let responseData = response.data
    log.info(`${SERVICE_NAME}::createManufacturer::${action.label}::created:${JSON.stringify(responseData)}`)
    var savedAction = localStorage.getItem(featureName, action.label)
    savedAction.response = responseData
    log.debug(`${SERVICE_NAME}::createManufacturer, saved action ${JSON.stringify(savedAction)}`)
    localStorage.setItem(featureName, action.label, savedAction)
    var manufacturerIdList = localStorage.getItem(featureName, 'manufacturerIdList')
    if (!manufacturerIdList) {
        manufacturerIdList = []
    }
    manufacturerIdList.push(responseData.id)
    localStorage.setItem(featureName, 'manufacturerIdList', manufacturerIdList)
}


module.exports.process = process
