import {
    HTTP
} from '../../utils/http'
import {
    Config
} from '../../config/api'

class User extends HTTP {
    constructor() {
        super();
    }

    getAddress() {
        return this.request({
            url: `address/user`
        })
    }

    addAddress(data) {
        return this.request({
            url: `address`,
            method: 'POST',
            data
        })
    }

    updateAddress(id, data) {
        return this.request({
            url: `address/${id}`,
            method: 'PUT',
            data
        })
    }

    updateAddressStatus(id, data) {
        console.log(id, data)
        return this.request({
            url: `address/status/${id}`,
            method: 'PUT',
            data
        })
    }

    updateUserInfo(data) {
        return this.request({
            url: `updateuserinfo`,
            method: 'PUT',
            data
        })
    }

}

export {
    User
};