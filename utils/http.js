import {
    Config
} from '../config/api'
const App = getApp()

class HTTP {

    request({url, data={}, method="GET"}) {
        return new Promise((resolve, reject) => {
            this._request(url, resolve, reject, data, method)
        })
    }
    
    _request(url, resolve, reject, data, method) {  
        wx.request({
            url: Config.api_base + url,
            data: data,
            method: method,
            header: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + App.globalData.token
            },
            success: function(res) {
                // 判断以2（2xx)开头的状态码为正确
                // 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
                const code = res.statusCode.toString();                
                if (code.startsWith('2')) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            },
            fail: function(err) {
                reject()
            }
        });
    }

    /*获得元素上的绑定的值*/
    getDataSet(event, key) {
        return event.currentTarget.dataset[key];
    };
    
};

export {
    HTTP
};