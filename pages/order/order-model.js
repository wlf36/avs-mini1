import {
    Config
} from '../../config/api'
import {
    HTTP
} from '../../utils/http'

class Order extends HTTP {

    constructor() {
        super();
        this._storageKeyName = 'newOrder';
        this.api_wxpay = Config.api_wxpay;
    }

    /*下订单*/
    doOrder(products, address) {
        return this.request({
            url: 'order',
            method: 'POST',
            data: {
                products,
                address
            }
        })
    }

    /*
     * 拉起微信支付
     * params:
     * norderNumber - {int} 订单id
     * return：
     * callback - {obj} 回调方法 ，返回参数 可能值 0:商品缺货等原因导致订单不能支付;  1: 支付失败或者支付取消； 2:支付成功；
     * */
    execPay(id, data, callback) {
        // console.log(data)
        wx.request({
            url: this.api_wxpay,
            method: 'POST',
            data: data,
            success: function (res) {
                if (res.data) { //可以支付
                    wx.requestPayment({
                        'timeStamp': res.data.timeStamp,
                        'nonceStr': res.data.nonceStr,
                        'package': res.data.package,
                        'signType': res.data.signType,
                        'paySign': res.data.paySign,
                        success: function () {
                            callback && callback(2);
                        },
                        fail: function () {
                            callback && callback(1);
                        }
                    });
                } else {
                    callback && callback(0);
                }
            }
        })
    }

    //更新订单状态
    updateOrderStatus(id) {
        return this.request({
            url: `v1/updateorderstatus/${id}`
        })
    }

    /*获得订单的具体内容*/
    getOrderInfoById(order_id) {
        return this.request({
            url: `order/${order_id}`
        })
    }

    /*用户所有订单*/
    getOrders() {
        return this.request({
            url: `order/user`
        })
    }


    /*本地缓存 保存／更新*/
    execSetStorageSync(data) {
        console.log(data);
        wx.setStorageSync(this._storageKeyName, data);
    };

    /*是否有新的订单*/
    hasNewOrder() {
        var flag = wx.getStorageSync(this._storageKeyName);
        return flag == true;
    }

}

export {
    Order
};