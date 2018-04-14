import axios from 'axios'
import qs from 'qs'
import { HOST } from '@/config.js'

const API_PREFIX = `http://${HOST}`
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
