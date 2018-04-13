/*
 * wxDefer
 * WeChat API jQuery Deferred-like interface
 * 
 * Illvili.me
 * v1.0
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
    wx.request,
    // 上传、下载
    wx.uploadFile,
    wx.downloadFile,
    // WebSocket
    wx.connectSocket,
    // wx.onSocketOpen
    // wx.onSocketError
    wx.sendSocketMessage,
    // wx.onSocketMessage
    wx.closeSocket,
    // wx.onSocketClose
    // SocketTask

    // 媒体
    // 图片
    wx.chooseImage,
    wx.previewImage,
    wx.getImageInfo,
    wx.saveImageToPhotosAlbum,
    // 录音
    wx.startRecord,
    // wx.stopRecord
    // 录音管理
    // wx.getRecorderManager
    // 音频播放控制
    wx.playVoice,
    // wx.pauseVoice
    // wx.stopVoice
    // 音乐播放控制
    wx.getBackgroundAudioPlayerState,
    wx.playBackgroundAudio,
    // wx.pauseBackgroundAudio
    wx.seekBackgroundAudio,
    // wx.stopBackgroundAudio
    // wx.onBackgroundAudioPlay
    // wx.onBackgroundAudioPause
    // wx.onBackgroundAudioStop
    // 背景音频播放管理
    // wx.getBackgroundAudioManager
    // 音频组件控制
    wx.createAudioContext,
    wx.createInnerAudioContext,
    // 视频
    wx.chooseVideo,
    wx.saveVideoToPhotosAlbum,
    // 视频组件控制
    wx.createVideoContext,
    // 相机组件控制
    wx.createCameraContext,
    // 实时音视频
    wx.createLivePlayerContext,
    wx.createLivePusherContext,

    // 文件
    wx.saveFile,
    wx.getFileInfo,
    wx.getSavedFileList,
    wx.getSavedFileInfo,
    wx.removeSavedFile,
    wx.openDocument,

    // 数据缓存
    wx.setStorage,
    // wx.setStorageSync
    wx.getStorage,
    // wx.getStorageSync
    wx.getStorageInfo,
    // wx.getStorageInfoSync
    wx.removeStorage,
    // wx.removeStorageSync
    wx.clearStorage,
    // wx.clearStorageSync

    // 位置
    // 获取位置
    wx.getLocation,
    wx.chooseLocation,
    // 查看位置
    wx.openLocation,
    // 地图组件控制
    wx.createMapContext,

    // 设备
    // 系统信息
    wx.getSystemInfo,
    // wx.getSystemInfoSync
    wx.canIUse,
    // 网络状态
    wx.getNetworkType,
    // wx.onNetworkStatusChange
    // 加速度计
    // wx.onAccelerometerChange
    wx.startAccelerometer,
    wx.stopAccelerometer,
    // 罗盘
    // wx.onCompassChange
    wx.startCompass,
    wx.stopCompass,
    // 拨打电话
    wx.makePhoneCall,
    // 扫码
    wx.scanCode,
    // 剪贴板
    wx.setClipboardData,
    wx.getClipboardData,
    // 蓝牙
    wx.openBluetoothAdapter,
    wx.closeBluetoothAdapter,
    wx.getBluetoothAdapterState,
    // wx.onBluetoothAdapterStateChange
    wx.startBluetoothDevicesDiscovery,
    wx.stopBluetoothDevicesDiscovery,
    wx.getBluetoothDevices,
    wx.getConnectedBluetoothDevices,
    // wx.onBluetoothDeviceFound
    wx.createBLEConnection,
    wx.closeBLEConnection,
    wx.getBLEDeviceServices,
    wx.getBLEDeviceCharacteristics,
    wx.readBLECharacteristicValue,
    wx.writeBLECharacteristicValue,
    wx.notifyBLECharacteristicValueChange,
    // wx.onBLEConnectionStateChange
    // wx.onBLECharacteristicValueChange
    // iBeacon
    wx.startBeaconDiscovery,
    wx.stopBeaconDiscovery,
    wx.getBeacons,
    // wx.onBeaconUpdate
    // wx.onBeaconServiceChange
    // 屏幕亮度
    wx.setScreenBrightness,
    wx.getScreenBrightness,
    wx.setKeepScreenOn,
    // 用户截屏事件
    // wx.onUserCaptureScreen
    // 振动
    wx.vibrateLong,
    wx.vibrateShort,
    // 手机联系人
    wx.addPhoneContact,
    // NFC
    wx.getHCEState,
    wx.startHCE,
    wx.stopHCE,
    // wx.onHCEMessage
    wx.sendHCEMessage,
    // Wi-Fi
    wx.startWifi,
    wx.stopWifi,
    wx.connectWifi,
    wx.getWifiList,
    // wx.onGetWifiList
    wx.setWifiList,
    // wx.onWifiConnected
    wx.getConnectedWifi,

    // 界面
    // 交互反馈
    wx.showToast,
    wx.showLoading,
    wx.hideToast,
    wx.hideLoading,
    wx.showModal,
    wx.showActionSheet,
    // 设置导航条
    wx.setNavigationBarTitle,
    wx.showNavigationBarLoading,
    wx.hideNavigationBarLoading,
    wx.setNavigationBarColor,
    // 设置tabBar
    wx.setTabBarBadge,
    wx.removeTabBarBadge,
    wx.showTabBarRedDot,
    wx.hideTabBarRedDot,
    wx.setTabBarStyle,
    wx.setTabBarItem,
    wx.showTabBar,
    wx.hideTabBar,
    // 设置置顶信息
    wx.setTopBarText,
    // 导航
    wx.navigateTo,
    wx.redirectTo,
    wx.switchTab,
    wx.navigateBack,
    wx.reLaunch,
    // 动画
    wx.createAnimation,
    // 位置
    wx.pageScrollTo,
    // 绘图
    // intro
    // coordinates
    // gradient
    // reference
    // color
    wx.createCanvasContext,
    wx.createContext,
    wx.drawCanvas,
    wx.canvasToTempFilePath,
    wx.canvasGetImageData,
    wx.canvasPutImageData,
    // setFillStyle
    // setStrokeStyle
    // setShadow
    // createLinearGradient
    // createCircularGradient
    // addColorStop
    // setLineWidth
    // setLineCap
    // setLineJoin
    // setLineDash
    // setMiterLimit
    // rect
    // fillRect
    // strokeRect
    // clearRect
    // fill
    // stroke
    // beginPath
    // closePath
    // moveTo
    // lineTo
    // arc
    // bezierCurveTo
    // quadraticCurveTo
    // scale
    // rotate
    // translate
    // clip
    // setFontSize
    // fillText
    // setTextAlign
    // setTextBaseline
    // drawImage
    // setGlobalAlpha
    // save
    // restore
    // draw
    // getActions
    // clearActions
    // measureText
    // globalCompositeOperation
    // arcTo
    // strokeText
    // lineDashOffset
    // createPattern
    // shadowBlur
    // shadowColor
    // shadowOffsetX
    // shadowOffsetY
    // font
    // transform
    // setTransform
    // 下拉刷新
    // Page.onPullDownRefresh
    wx.startPullDownRefresh,
    // wx.stopPullDownRefresh,
    // WXML节点信息
    // wx.createSelectorQuery,
    // selectorQuery.in
    // selectorQuery.select
    // selectorQuery.selectAll
    // selectorQuery.selectViewport
    // nodesRef.boundingClientRect
    // nodesRef.scrollOffset
    // nodesRef.fields
    // selectorQuery.exec
    // WXML节点布局相交状态
    // wx.createIntersectionObserver,
    // intersectionObserver.relativeTo
    // intersectionObserver.relativeToViewport
    // intersectionObserver.observe
    // intersectionObserver.disconnect

    // 第三方平台
    wx.getExtConfig,
    // wx.getExtConfigSync

    // 开放接口
    // 登录
    wx.login,
    wx.checkSession,
    // 授权
    wx.authorize,
    // 用户信息
    wx.getUserInfo,
    // getPhoneNumber
    // 微信支付
    wx.requestPayment,
    // 转发
    // Page.onShareAppMessage
    wx.showShareMenu,
    wx.hideShareMenu,
    wx.updateShareMenu,
    wx.getShareInfo,
    // 收货地址
    wx.chooseAddress,
    // 卡券
    wx.addCard,
    wx.openCard,
    // 设置
    wx.openSetting,
    wx.getSetting,
    // 微信运动
    wx.getWeRunData,
    // 打开小程序
    wx.navigateToMiniProgram,
    wx.navigateBackMiniProgram,
    // 打开APP
    // launchApp
    // 获取发票抬头
    wx.chooseInvoiceTitle,
    // 生物认证
    wx.checkIsSupportSoterAuthentication,
    wx.startSoterAuthentication,
    wx.checkIsSoterEnrolledInDevice,

    // 更新
    // wx.getUpdateManager

    // 多线程
    // wx.createWorker,
]

for (var api of wxAPIList) {
    exportObj[api] = MakeDeferred(wx[api])
}

module.exports = exportObj
