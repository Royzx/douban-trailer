const qiniu = require('qiniu')
const nanoid = require('nanoid')
const config = require('../config')

const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, cfg)

const uploadToQiniu = async (url, key) => {
    return new Promise((resolve, reject) => {
        client.fetch(url, bucket, key, (err, ret, info) => {
            if (err) {
                reject(err)
            } else {
                if (info.statusCode === 200) {
                    resolve({ key })
                } else {
                    reject(info)
                }
            }
        })
    })
}

    ; (async () => {
        let movies = [{
            video: 'http://vt1.doubanio.com/201912251058/285be20036c0883e2b256f7dba5e09ef/view/movie/M/301650578.mp4',
            doubanId: '1889243',
            cover: 'https://img3.doubanio.com/img/trailer/medium/2209820525.jpg?',
            poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2206088801.jpg'
        }]

        movies.map(async movie => {
            if (movie.video && !movie.key) {
                try {
                    console.log('开始传 video');
                    let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
                    console.log('开始传 cover');
                    let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png')
                    console.log('开始传 poster');
                    let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png')

                    if (videoData.key) {
                        movie.videoKey = videoData.key
                    }
                    if (coverData.key) {
                        movie.coverKey = coverData.key
                    }
                    if (posterData.key) {
                        movie.posterKey = posterData.key
                    }

                    console.log(movie);
                    // {
                    //     video: 'http://vt1.doubanio.com/201912251058/285be20036c0883e2b256f7dba5e09ef/view/movie/M/301650578.mp4',
                    //     doubanId: '1889243',
                    //     cover: 'https://img3.doubanio.com/img/trailer/medium/2209820525.jpg?',
                    //     poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2206088801.jpg',
                    //     videoKey: 'http://q31tm11bs.bkt.clouddn.com/_VHDzm6zfy4Se-FPPifvP.mp4',
                    //     coverKey: 'http://q31tm11bs.bkt.clouddn.com/DhGVAwARkdQJLH1jHqBuB.png',
                    //     posterKey: 'http://q31tm11bs.bkt.clouddn.com/9KJNOVuc-UZELgh5C7MTX.png'
                    //   }
                } catch (err) {
                    console.log(err);
                }
            }
        })
    })()