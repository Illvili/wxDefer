/*
 * wxDefer
 * WeChat API jQuery Deferred-like interface
 * 
 * Illvili.me
 * v1.0.2
 */

var isFunction = _ => 'function' == typeof _

var Deferred = function () {
    var STATE_PENDING  = 'pending',
        STATE_RESOLVED = 'resolved',
        STATE_REJECTED = 'rejected'

    var self = this
    var res = [this]

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

    // _state = pending | resolved | rejected
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
    this.rejectWith = function (...args) {
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

var MakeDeferred = function (wxAPI) {
    return function (config) {
        var defer = new Deferred()
        config = config || {}

        // transform success -> done
        if (!!config['success']) {
            if (isFunction(config.success)) {
                defer.done(config.success)
            }

            delete(config.success)
        }

        // transform fail -> fail
        if (!!config['fail']) {
            if (isFunction(config.fail)) {
                defer.fail(config.fail)
            }

            delete(config.fail)
        }

        // transform complete -> always
        if (!!config['complete']) {
            if (isFunction(config.complete)) {
                defer.always(config.complete)
            }

            delete(config.complete)
        }

        // register new success and fail
        config.success = function (...args) {
            defer.resolveWith(this, ...args)
        }
        config.fail = function (...args) {
            defer.rejectWith(this, ...args)
        }

        wxAPI.call(wx, config)

        return defer
    }
}

var exportObj = { Deferred, MakeDeferred }
var wxAPIList = [
    // 网络
    // 发起请求
    'request',
    // 上传、下载
    'uploadFile',
    'downloadFile',
    // WebSocket
    'connectSocket',
    'sendSocketMessage',
    'closeSocket',

    // 媒体
    // 图片
    'chooseImage',
    'previewImage',
    'getImageInfo',
    'saveImageToPhotosAlbum',
    // 录音
    'startRecord',
    // 音频播放控制
    'playVoice',
    // 音乐播放控制
    'getBackgroundAudioPlayerState',
    'playBackgroundAudio',
    'seekBackgroundAudio',
    // 音频组件控制
    'createAudioContext',
    'createInnerAudioContext',
    // 视频
    'chooseVideo',
    'saveVideoToPhotosAlbum',
    // 视频组件控制
    'createVideoContext',
    // 相机组件控制
    'createCameraContext',
    // 实时音视频
    'createLivePlayerContext',
    'createLivePusherContext',

    // 文件
    'saveFile',
    'getFileInfo',
    'getSavedFileList',
    'getSavedFileInfo',
    'removeSavedFile',
    'openDocument',

    // 数据缓存
    'setStorage',
    'getStorage',
    'getStorageInfo',
    'removeStorage',
    'clearStorage',

    // 位置
    // 获取位置
    'getLocation',
    'chooseLocation',
    // 查看位置
    'openLocation',
    // 地图组件控制
    'createMapContext',

    // 设备
    // 系统信息
    'getSystemInfo',
    'canIUse',
    // 网络状态
    'getNetworkType',
    // 加速度计
    'startAccelerometer',
    'stopAccelerometer',
    // 罗盘
    'startCompass',
    'stopCompass',
    // 拨打电话
    'makePhoneCall',
    // 扫码
    'scanCode',
    // 剪贴板
    'setClipboardData',
    'getClipboardData',
    // 蓝牙
    'openBluetoothAdapter',
    'closeBluetoothAdapter',
    'getBluetoothAdapterState',
    'startBluetoothDevicesDiscovery',
    'stopBluetoothDevicesDiscovery',
    'getBluetoothDevices',
    'getConnectedBluetoothDevices',
    'createBLEConnection',
    'closeBLEConnection',
    'getBLEDeviceServices',
    'getBLEDeviceCharacteristics',
    'readBLECharacteristicValue',
    'writeBLECharacteristicValue',
    'notifyBLECharacteristicValueChange',
    // iBeacon
    'startBeaconDiscovery',
    'stopBeaconDiscovery',
    'getBeacons',
    // 屏幕亮度
    'setScreenBrightness',
    'getScreenBrightness',
    'setKeepScreenOn',
    // 振动
    'vibrateLong',
    'vibrateShort',
    // 手机联系人
    'addPhoneContact',
    // NFC
    'getHCEState',
    'startHCE',
    'stopHCE',
    'sendHCEMessage',
    // Wi-Fi
    'startWifi',
    'stopWifi',
    'connectWifi',
    'getWifiList',
    'setWifiList',
    'getConnectedWifi',

    // 界面
    // 交互反馈
    'showToast',
    'showLoading',
    'hideToast',
    'hideLoading',
    'showModal',
    'showActionSheet',
    // 设置导航条
    'setNavigationBarTitle',
    'showNavigationBarLoading',
    'hideNavigationBarLoading',
    'setNavigationBarColor',
    // 设置tabBar
    'setTabBarBadge',
    'removeTabBarBadge',
    'showTabBarRedDot',
    'hideTabBarRedDot',
    'setTabBarStyle',
    'setTabBarItem',
    'showTabBar',
    'hideTabBar',
    // 设置置顶信息
    'setTopBarText',
    // 导航
    'navigateTo',
    'redirectTo',
    'switchTab',
    'navigateBack',
    'reLaunch',
    // 动画
    'createAnimation',
    // 位置
    'pageScrollTo',
    // 绘图
    'createCanvasContext',
    'createContext',
    'drawCanvas',
    'canvasToTempFilePath',
    'canvasGetImageData',
    'canvasPutImageData',
    // 下拉刷新
    'startPullDownRefresh',

    // 第三方平台
    'getExtConfig',

    // 开放接口
    // 登录
    'login',
    'checkSession',
    // 授权
    'authorize',
    // 用户信息
    'getUserInfo',
    // 微信支付
    'requestPayment',
    // 转发
    'showShareMenu',
    'hideShareMenu',
    'updateShareMenu',
    'getShareInfo',
    // 收货地址
    'chooseAddress',
    // 卡券
    'addCard',
    'openCard',
    // 设置
    'openSetting',
    'getSetting',
    // 微信运动
    'getWeRunData',
    // 打开小程序
    'navigateToMiniProgram',
    'navigateBackMiniProgram',
    // 获取发票抬头
    'chooseInvoiceTitle',
    // 生物认证
    'checkIsSupportSoterAuthentication',
    'startSoterAuthentication',
    'checkIsSoterEnrolledInDevice',
]

for (var api of wxAPIList) {
    exportObj[api] = MakeDeferred(wx[api])
}

module.exports = exportObj
