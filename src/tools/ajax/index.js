import axios from 'axios'
import qs from 'qs'

const API_PREFIX = 'http://47.97.245.112:8081'
// const API_PREFIX = 'http://172.18.5.212:8130'
axios.defaults.withCredentials = true

export default {
  post: function (url, data) {
    if (url.startsWith('http')) {
      url = url
    } else {
      url = API_PREFIX + '/' + url
    }
    return axios.post(url, qs.stringify(data))
  },
  get: function (url, params) {
    if (url.startsWith('http')) {
      url = url
    } else {
      url = API_PREFIX + '/' + url
    }
    return axios.get(url, {
      params: params
    })
  }
}
