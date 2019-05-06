const createActionProcessor = require('../action-processor/create-action')
const roleActionProcessor = require('../action-processor/assign-role-action')
const actions = require('../common/constants')
const fs = require('fs-extra')
const localStorage = require('../service/local-storage-service')
const organisationService = require('../service/organisation-service')
const userService = require('../service/user-service')
const productService = require('../service/product-service')
const speciesService = require('../service/species-service')
const log = global.log
const CONTROLLER_NAME = 'generate-controller'

async function generate(filename, featureName, namespace) {
    log.info(`Generating ... ${featureName}`)
    localStorage.init()
    let rawdata = fs.readFileSync(filename)
    var jsonData = ""
    if (namespace) {
        jsonData = JSON.parse(JSON.stringify(rawdata).replace("${namespace}", namespace))
    } else {
        jsonData = JSON.parse(rawdata)
    }
    console.dir(jsonData)
    await processActions(featureName, jsonData)
}

async function tearDown(featureName) {
    log.info(`Tearing down ... ${featureName}`)
    await tearDownEntities(featureName)
    await tearDownLocalStorage(featureName)
}

async function processActions(featureName, actionJson) {
    let actionRecords = actionJson.actions

    for (const action of actionRecords) {
        // Save a copy of each action for later reference
        localStorage.setItem(featureName, action.label, action)

        switch (action.action) {
            case actions.ACTION_CREATE:
                log.info(`${CONTROLLER_NAME}::processing ${action.action}`)
                await createActionProcessor.process(featureName, action)
                break
            case actions.ACTION_UPDATE:
                log.info(`${CONTROLLER_NAME}::processing ${action.action}`)
                break
            case actions.ACTION_ASSIGN_ROLE:
                log.info(`${CONTROLLER_NAME}::processing ${action.action}`)
                await roleActionProcessor.process(featureName, action)
                break
            default:
                log.debug(`${CONTROLLER_NAME}::unrecognised action ${action.action}`)
                break
        }
    }
}

async function tearDownEntities(featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownEntities:${featureName}`)
    await tearDownVetPractice(featureName)
    await tearDownVet(featureName)
    await tearDownProduct(featureName)
    await tearDownSpecies(featureName)
    await tearDownManufacturer(featureName)
}

async function tearDownLocalStorage(featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownLocalStorage:${featureName}`)
    localStorage.clear(featureName)
}

async function tearDownVetPractice(featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownVetPractice:${featureName}`)
    const vetPracticeIdList = localStorage.getItem(featureName, 'vetPracticeIdList')
    if (vetPracticeIdList) {
        for (id of vetPracticeIdList) {
            log.info(`${CONTROLLER_NAME}::about to teardown vet practice with id ${id}`)
            await organisationService.deleteOrganisation(id)
        }
    }
}

async function tearDownVet(featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownVet:${featureName}`)
    const vetIdList = localStorage.getItem(featureName, 'vetIdList')
    if (vetIdList) {
        for (id of vetIdList) {
            log.info(`${CONTROLLER_NAME}::about to teardown vet with id ${id}`)
            await userService.deleteUser(id)
        }
    }
}

async function tearDownProduct(featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownProduct:${featureName}`)
    const productList = localStorage.getItem(featureName, 'productList')
    if (productList) {
        for (productNo of productList) {
            log.info(`${CONTROLLER_NAME}::about to teardown product with product no. ${productNo}`)
            await productService.deleteProduct(productNo)
        }
    }
}

async function tearDownSpecies(featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownSpecies:${featureName}`)
    const speciesList = localStorage.getItem(featureName, 'speciesList')
    var deleted = []
    if (speciesList) {
        for (productNo of speciesList) {
            if (deleted.indexOf(productNo) == -1) {
                log.info(`${CONTROLLER_NAME}::about to teardown all species for product with product no. ${productNo}`)
                // Will delete ALL species for a specific product.
                await speciesService.deleteSpecies(productNo)
                // Track the species we have deleted for each product, in case the test data contained
                // multiple species for the same product. Otherwise, we will try and delete species for a
                // product that have already been deleted, causing an error.
                deleted.push(productNo)
            }
        }
    }
}

async function tearDownManufacturer(featureName) {
    log.info(`${CONTROLLER_NAME}::tearDownManufacturer:${featureName}`)
    const manufacturerIdList = localStorage.getItem(featureName, 'manufacturerIdList')
    if (manufacturerIdList) {
        for (id of manufacturerIdList) {
            log.info(`${CONTROLLER_NAME}::about to teardown manufacturer with id ${id}`)
            await organisationService.deleteOrganisation(id)
        }
    }
}

module.exports.generate = generate
module.exports.tearDown = tearDown