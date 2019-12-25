const doSync = (sth, time) => new Promise(resolve => {
    setTimeout(() => {
        console.log(sth + '用了' + time + ' 毫秒')
        resolve()
    }, time)
})

const doASync = (sth, time, cb) => {
    setTimeout(() => {
        console.log(sth + '用了' + time + ' 毫秒')
        cb && cb()
    }, time)
}

const doElse = (sth) => {
    console.log(sth);
}

const Roy = { doSync, doASync }
const Meizi = { doSync, doASync, doElse }

    ; (async () => {
        console.log('case 1:妹子来到门口');
        await Roy.doSync('Roy 刷牙', 1000)
        console.log('啥也没干，一直等');
        await Meizi.doSync('妹子洗澡', 2000)
        Meizi.doElse('妹子去忙别的了');

        console.log('case 3: 妹子来到门口按下通知开关');
        Roy.doASync('Roy 刷牙', 1000, () => {
            console.log('洗手间通知妹子来洗澡');
            Meizi.doASync('妹子洗澡', 2000)
        })
        Meizi.doElse('妹子去忙别的了')
    })()