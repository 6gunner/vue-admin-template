import axios from 'axios'
import qs from 'qs'

const API_PREFIX = 'http://47.97.245.112:8081'
// const API_PREFIX = 'http://172.18.5.212:8130'
axios.defaults.withCredentials = true

export default {
  install (Vue) {
    Vue.prototype.$post = function (url, data) {
      return axios({
        method: 'post',
        url: API_PREFIX + '/' + url,
        data: qs.stringify(data || {})
      })
    }
    Vue.prototype.$get = function (url, params) {
      return axios.get(API_PREFIX + '/' + url, {
        params: params
      })
    }
    Vue.prototype.$http = axios

    Vue.http = axios
  }
}
