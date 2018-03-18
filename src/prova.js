const logger = require('./log')

const progress = logger.progress('calculating layout', 300)

const timer = setInterval(() => {
    progress.tick()
    if (progress.complete) {
        console.log('complete')
        clearInterval(timer)
    }
}, 100)
