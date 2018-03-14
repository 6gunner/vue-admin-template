import router from '@/router'
import {lazyLoad} from '@/tools/index'
import Index from '@/views/Index'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
function generateRoutes(menus = [], routes = []) {
  menus.forEach((item, index) => {
    let viewName = ''
    if (!item.parent) {
      if (item.url.startsWith('/')) {
        viewName = item.url.substr(1)
      } else {
        viewName = item.url
      }
    } else {
      if (item.url.startsWith('/')) {
        viewName = item.url.substr(1)
      } else {
        viewName = item.url
      }
    }
    if (!item.children) {
      if (!item.parent) {
        routes.push({
          path: item.url,
          component: Index,
          redirect: `${item.url}/index`,
          children: [{
            path: 'index',
            component: lazyLoad(viewName),
            meta: {
              requireAuth: true,
              title: item.name,
              icon: item.icon
            }
          }]
        })
      } else {
        routes.push({
          path: item.url,
          component: lazyLoad(viewName),
          meta: {
            requireAuth: true,
            title: item.name,
            icon: item.icon
          }
        })
      }
    } else {
      let route = {
        path: item.url,
        component: Index,
        redirect: 'noredirect',
        meta: {
          requireAuth: true,
          title: item.name,
          icon: item.icon
        },
        children: [...generateRoutes(item.children)]
      }
      routes.push(route)
    }
  })
  routes.push({
    path: '*', redirect: '/404', hidden: true
  })
  return routes
}

export default {
  namespaced: true,
  state: {
    menus: [],
    currentMenu: {}
  },
  mutations: {
    setMenus(state, menus) {
      state.menus = menus
      let routes = generateRoutes(menus)
      router.addRoutes(routes)
    }
  },
  actions: {
    // mock data
    getMenus({commit}) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('setMenus', [{
              name: '导航一',
              id: 1000,
              url: '/1',
              parent: 0,
              children: [{
                name: '选项1',
                url: '/1/1',
                parent: 1000,
                id: 10001
              }, {
                name: '选项2',
                url: '/1/2',
                parent: 1000,
                id: 10002
              }]
            }, {
              name: '导航二',
              url: '/2',
              id: 2000,
              parent: 0
            }, {
              name: '导航三',
              url: '/3',
              icon: 'el-icon-menu',
              id: 3000,
              parent: 0
            }, {
              name: '导航四',
              url: '/4',
              icon: 'el-icon-document',
              id: 4000,
              parent: 0
            }]
          )
          resolve()
          // commit('setMenu', {
          //   "menus": [{
          //     "parent": 0,
          //     "children": [{
          //       "parent": 301000000,
          //       "name": "机构管理",
          //       "icon": "",
          //       "show": true,
          //       "id": 301010000,
          //       "url": "system/company_manage.html"
          //     }, {
          //       "parent": 301000000,
          //       "name": "操作员管理",
          //       "icon": "",
          //       "show": true,
          //       "id": 301020000,
          //       "url": "system/operator_manage.html"
          //     }, {
          //       "parent": 301000000,
          //       "name": "角色管理",
          //       "icon": "",
          //       "show": true,
          //       "id": 301030000,
          //       "url": "system/role_manage.html"
          //     }, {
          //       "parent": 301000000,
          //       "name": "定时任务管理",
          //       "icon": "",
          //       "show": true,
          //       "id": 301040000,
          //       "url": "system/time_task_manage.html"
          //     }, {
          //       "parent": 301000000,
          //       "name": "机构初始化",
          //       "icon": "",
          //       "show": false,
          //       "id": 301050000,
          //       "url": "system/company_init.html"
          //     }],
          //     "name": "系统管理",
          //     "icon": "icon-xiangmuguanli",
          //     "show": true,
          //     "id": 301000000,
          //     "url": ""
          //   }, {
          //     "parent": 0,
          //     "children": [{
          //       "parent": 302000000,
          //       "children": [{
          //         "parent": 302010000,
          //         "name": "数据字典",
          //         "icon": "",
          //         "show": true,
          //         "id": 302010100,
          //         "url": "settings/dictionary.html"
          //       }, {
          //         "parent": 302010000,
          //         "name": "证券类型",
          //         "icon": "",
          //         "show": true,
          //         "id": 302010200,
          //         "url": "settings/stock_type.html"
          //       }],
          //       "name": "系统参数",
          //       "icon": "",
          //       "show": true,
          //       "id": 302010000,
          //       "url": ""
          //     }, {
          //       "parent": 302000000,
          //       "children": [{
          //         "parent": 302020000,
          //         "name": "微信配置",
          //         "icon": "",
          //         "show": true,
          //         "id": 302020100,
          //         "url": "wechat/wx_config.html"
          //       }, {
          //         "parent": 302020000,
          //         "name": "微信模板配置",
          //         "icon": "",
          //         "show": true,
          //         "id": 302020200,
          //         "url": "wechat/wx_tpl_config.html"
          //       }],
          //       "name": "微信管理",
          //       "icon": "",
          //       "show": true,
          //       "id": 302020000,
          //       "url": ""
          //     }, {
          //       "parent": 302000000,
          //       "name": "短信配置",
          //       "icon": "",
          //       "show": true,
          //       "id": 302030000,
          //       "url": "settings/smsg_config.html"
          //     }, {
          //       "parent": 302000000,
          //       "name": "短信模板配置",
          //       "icon": "",
          //       "show": true,
          //       "id": 302040000,
          //       "url": "settings/smsg_tpl_config.html"
          //     }, {
          //       "parent": 302000000,
          //       "name": "机构域名配置",
          //       "icon": "",
          //       "show": true,
          //       "id": 302050000,
          //       "url": "system/company_domain_manage.html"
          //     }, {
          //       "parent": 302000000,
          //       "name": "平台机构配置",
          //       "icon": "",
          //       "show": false,
          //       "id": 302060000,
          //       "url": "system/co_info_setting.html"
          //     }],
          //     "name": "系统配置",
          //     "icon": "icon-shezhi",
          //     "show": true,
          //     "id": 302000000,
          //     "url": ""
          //   }, {
          //     "parent": 0,
          //     "children": [{
          //       "parent": 303000000,
          //       "name": "产品管理",
          //       "icon": "",
          //       "show": true,
          //       "id": 303010000,
          //       "url": "oper/product_list.html"
          //     }, {
          //       "parent": 303000000,
          //       "name": "试用管理",
          //       "icon": "",
          //       "show": true,
          //       "id": 303020000,
          //       "url": "oper/trival_mgr.html"
          //     }],
          //     "name": "运营管理",
          //     "icon": "icon-zhanghuguanli",
          //     "show": true,
          //     "id": 303000000,
          //     "url": ""
          //   }, {
          //     "parent": 0,
          //     "children": [{
          //       "parent": 304000000,
          //       "name": "数据总览",
          //       "icon": "",
          //       "show": true,
          //       "id": 304010000,
          //       "url": "data/overview.html"
          //     }, {
          //       "parent": 304000000,
          //       "name": "每日汇总",
          //       "icon": "",
          //       "show": true,
          //       "id": 304020000,
          //       "url": "data/dailyreport.html"
          //     }],
          //     "name": "统计报表",
          //     "icon": "icon-biaoge",
          //     "show": true,
          //     "id": 304000000,
          //     "url": ""
          //   }, {
          //     "parent": 0,
          //     "children": [{
          //       "parent": 305000000,
          //       "name": "合规宣传",
          //       "icon": "",
          //       "show": true,
          //       "id": 305010000,
          //       "url": "activity/radar.html"
          //     }],
          //     "name": "活动管理",
          //     "icon": "icon-zhanghuguanli",
          //     "show": true,
          //     "id": 305000000,
          //     "url": ""
          //   }]
          // }
        }, 1000)
      })
    }
  }
}
