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

async function generate(filename, namespace) {
    log.info(`Generating ... ${namespace}`)
    localStorage.init()
    let rawdata = fs.readFileSync(filename)
    let jsonData = JSON.parse(rawdata)
    await processActions(namespace, jsonData)
}

async function tearDown(namespace) {
    log.info(`Tearing down ... ${namespace}`)
    await tearDownEntities(namespace)
    await tearDownLocalStorage(namespace)
}

async function processActions(namespace, actionJson) {
    let actionRecords = actionJson.actions

    for (const action of actionRecords) {
        // Save a copy of each action for later reference
        localStorage.setItem(namespace, action.label, action)

        switch (action.action) {
            case actions.ACTION_CREATE:
                log.info(`${CONTROLLER_NAME}::processing ${action.action}`)
                await createActionProcessor.process(namespace, action)
                break
            case actions.ACTION_UPDATE:
                log.info(`${CONTROLLER_NAME}::processing ${action.action}`)
                break
            case actions.ACTION_ASSIGN_ROLE:
                log.info(`${CONTROLLER_NAME}::processing ${action.action}`)
                await roleActionProcessor.process(namespace, action)
                break
            default:
                log.debug(`${CONTROLLER_NAME}::unrecognised action ${action.action}`)
                break
        }
    }
}

async function tearDownEntities(namespace) {
    log.info(`${CONTROLLER_NAME}::tearDownEntities:${namespace}`)
    await tearDownVetPractice(namespace)
    await tearDownVet(namespace)
    await tearDownProduct(namespace)
    await tearDownSpecies(namespace)
    await tearDownManufacturer(namespace)
}

async function tearDownLocalStorage(namespace) {
    log.info(`${CONTROLLER_NAME}::tearDownLocalStorage:${namespace}`)
    localStorage.clear(namespace)
}

async function tearDownVetPractice(namespace) {
    log.info(`${CONTROLLER_NAME}::tearDownVetPractice:${namespace}`)
    const vetPracticeIdList = localStorage.getItem(namespace, 'vetPracticeIdList')
    if (vetPracticeIdList) {
        for (id of vetPracticeIdList) {
            log.info(`${CONTROLLER_NAME}::about to teardown vet practice with id ${id}`)
            await organisationService.deleteOrganisation(id)
        }
    }
}

async function tearDownVet(namespace) {
    log.info(`${CONTROLLER_NAME}::tearDownVet:${namespace}`)
    const vetIdList = localStorage.getItem(namespace, 'vetIdList')
    if (vetIdList) {
        for (id of vetIdList) {
            log.info(`${CONTROLLER_NAME}::about to teardown vet with id ${id}`)
            await userService.deleteUser(id)
        }
    }
}

async function tearDownProduct(namespace) {
    log.info(`${CONTROLLER_NAME}::tearDownProduct:${namespace}`)
    const productList = localStorage.getItem(namespace, 'productList')
    if (productList) {
        for (productNo of productList) {
            log.info(`${CONTROLLER_NAME}::about to teardown product with product no. ${productNo}`)
            await productService.deleteProduct(productNo)
        }
    }
}

async function tearDownSpecies(namespace) {
    log.info(`${CONTROLLER_NAME}::tearDownSpecies:${namespace}`)
    const speciesList = localStorage.getItem(namespace, 'speciesList')
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

async function tearDownManufacturer(namespace) {
    log.info(`${CONTROLLER_NAME}::tearDownManufacturer:${namespace}`)
    const manufacturerIdList = localStorage.getItem(namespace, 'manufacturerIdList')
    if (manufacturerIdList) {
        for (id of manufacturerIdList) {
            log.info(`${CONTROLLER_NAME}::about to teardown manufacturer with id ${id}`)
            await organisationService.deleteOrganisation(id)
        }
    }
}


module.exports.generate = generate
module.exports.tearDown = tearDown