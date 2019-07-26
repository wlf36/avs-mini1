//app.js
import {
    Config
} from './config/api'

App({
    globalData: {
        openid: '',
        uid: '',
        token: ''
    },

    onLaunch: function () {
        //获取openid和用户id 新注册自动完成注册
        wx.login({
            success: (res) => {
                const js_code = res.code                
                if (js_code) {
                    wx.request({
                        url: Config.api_openid,
                        method: 'POST',
                        data: {
                            js_code: js_code
                        },
<<<<<<< HEAD
                        success: (res) => { 
                            console.log('res', res)
                            this.globalData.uid = res.data.uid
                            this.globalData.openid = res.data.openid
                            // this.globalData.token = res.data.token.token
=======
                        success: (res) => {
                            console.log('res', res)
                            this.globalData.uid = res.data.uid
                            this.globalData.openid = res.data.openid
                            this.globalData.token = res.data.access_token
>>>>>>> e29ea1b5b6146be9f3fbc33eab78de3e5ad692a2
                        }
                    })
                }
            }
        })
    }

})