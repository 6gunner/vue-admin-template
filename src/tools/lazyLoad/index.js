// lazy loading Components
// https://github.com/vuejs/vue-router/blob/dev/examples/lazy-loading/app.js#L8
// resolve => require([URL], resolve), 支持性好
// () => import(URL)
export default (name) => () => import (`@/views/${name}.vue`)
