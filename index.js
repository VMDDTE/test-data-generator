const config = require('./config')

var main = async function () { 
    console.log('Running data generator')
    global.log = require('./logging').setupLogging('data-generator', config)
    global.log.info('Data generator starting')
    const generator = require('./controller/generate-controller')
    await generator.generate('../end-to-end/data-generator/TDG-1000_Test_Create.json')
} 

if (require.main === module) { 
    main(); 
}
