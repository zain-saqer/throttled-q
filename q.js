const {RateLimiter} = require('limiter')

class Job {
    constructor(f, resolve, reject) {
        this.f = f
        this.resolve = resolve
        this.reject = reject
    }
}

class JobQueue {
    #queue = []
    #limiter

    constructor(frequencyPerInterval = 10, interval = 1000) {
        this.#queue = []
        this.#limiter = new RateLimiter({tokensPerInterval: frequencyPerInterval, interval});
        setInterval(() => {
            if (!this.#queue.length) return
            if (!this.#limiter.tryRemoveTokens(1)) return

            const job = this.#queue.shift()

            try {
                const result = job.f()
                if (result instanceof Promise) {
                    result.then(result => {
                        job.resolve(result)
                    }).catch(e => {
                        job.reject(e)
                    })
                } else {
                    job.resolve(result)
                }
            } catch (e) {
                job.reject(e)
            }
        }, 1)
    }

    enqueue = (f) => {
        return new Promise((resolve, reject) => {
            this.#queue.push(new Job(f, resolve, reject))
        })
    }
}

module.exports = {
    JobQueue,
}