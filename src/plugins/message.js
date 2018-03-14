import { Message, MessageBox, Notification, Loading } from 'element-ui'

const plugin = {
  install (Vue) {
    Vue.prototype.$msgbox = MessageBox
    Vue.prototype.$alert = MessageBox.alert
    Vue.prototype.$confirm = MessageBox.confirm
    Vue.prototype.$prompt = MessageBox.prompt
    Vue.prototype.$notify = Notification
    Vue.prototype.$message = Message
    Vue.prototype.$loading = Loading.service
  }
}
export default plugin
