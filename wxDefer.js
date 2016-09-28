/*
 * wxDefer
 * WeChat API jQuery-like interface
 */

var Deferred = function () {
    var STATE_PENDING  = 'pending',
        STATE_RESOLVED = 'resolved',
        STATE_REJECTED = 'rejected'

    var self = this
    var res = [this]

    var isFunction = _ => 'function' == typeof _

    // resolve
    var resolve_function_list = [],
        resolve = callback => {
        if (!!callback && isFunction(callback)) {
            resolve_function_list.push(callback)
        }

        if (STATE_RESOLVED == state) {
            var list = resolve_function_list.slice()
            resolve_function_list.length = 0

            for (var i = 0; i < list.length; i++) {
                var cb = list[i]
                cb.call.apply(cb, res)
            }
        }
    }

    // reject
    var reject_function_list = [],
        reject = callback => {
        if (!!callback && isFunction(callback)) {
            reject_function_list.push(callback)
        }

        if (STATE_REJECTED == state) {
            var list = reject_function_list.slice()
            reject_function_list.length = 0

            for (var i = 0; i < list.length; i++) {
                var cb = list[i]
                cb.call.apply(cb, res)
            }
        }
    }

    // _state = pending | resolve | reject
    var state = STATE_PENDING

    // state()
    this.state = function () {
        return state
    }

    // done(callback)
    this.done = function (callback) {
        resolve(callback)

        return this
    }

    // fail(callback)
    this.fail = function (callback) {
        reject(callback)

        return this
    }

    // always(callback)
    this.always = function (callback) {
        resolve(callback)
        reject(callback)

        return this
    }

    // resolveWith(_thisObj, ...args)
    this.resolveWith = function (...args) {
        if (STATE_PENDING == state) {
            state = STATE_RESOLVED
            res = args
            resolve()
        }
    }
    // resolve(...args)
    this.resolve = function (...args) {
        args.unshift(this)

        this.resolveWith(...args)
    }

    // rejectWith(_thisObj, ...args)
    this.rejectWith = function (_thisObj, ...args) {
        if (STATE_PENDING == state) {
            state = STATE_REJECTED
            res = args
            reject()
        }
    }
    // reject(...args)
    this.reject = function (...args) {
        args.unshift(this)
        
        this.rejectWith(...args)
    }

    return this
}

module.exports = {
    Deferred
}
