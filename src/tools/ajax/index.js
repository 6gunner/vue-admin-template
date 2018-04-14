import axios from 'axios'
import qs from 'qs'

import { HOST } from '@/config.js'

const API_PREFIX = `http://${HOST}`
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
