const mongoose = require('mongoose')
const db = 'mongodb://localhost/douban-test'
const glob = require('glob')
const { resolve } = require('path')

mongoose.Promise = global.Promise

exports.initSchemas = () => {
    glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require)
}

exports.initAdmin = async () => {
    const User = mongoose.model('User')

    let user = await User.findOne({
        username: 'Roy'
    })

    if (!user) {
        const user = new User({
            username: 'Roy',
            email: 'roy@xfn.com',
            password: '123'
        })

        await user.save()
    }
}

exports.connect = () => {
    let maxConnectTime = 0

    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'prod') {
            mongoose.set('debug', true)
        }

        mongoose.set('useCreateIndex', true)
        mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })

        mongoose.connection.on('disconnected', () => {
            maxConnectTime++

            if (maxConnectTime < 5) {
                console.log('第', maxConnectTime, '次重新连接');
                mongoose.connect(db)
            } else {
                throw new Error('数据库挂了，快去修吧')
            }
        })

        mongoose.connection.on('error', err => {
            maxConnectTime++

            if (maxConnectTime < 5) {
                mongoose.connect(db)
            } else {
                throw new Error('数据库挂了，快去修吧')
            }
        })

        mongoose.connection.once('open', () => {
            // const Dog = mongoose.model('Dog', { name: String })
            // const doga = new Dog({ name: '阿尔法' })

            // doga.save().then(() => {
            //     console.log('wang');
            // })
            resolve()
            console.log('MongoDB Connected Successfully!');
        })
    })
}