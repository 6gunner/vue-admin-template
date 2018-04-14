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
    if (item.type === 'group') { return generateRoutes(item.children, routes) }
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
      routes.push({
        path: '*', redirect: '/404', hidden: true
      })
      router.addRoutes(routes)
    }
  },
  actions: {
    // mock data
    getMenus({commit}) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('setMenus', [
            {
            name: '机构',
            icon: 'iconfont icon-company',
            id: 3000,
            url: '/company',
            parent: 0,
            children: [{
              name: '机构管理',
              parent: 3000,
              show: true,
              id: 30001000,
              url: '/company/company',
            }, {
              name: '操作员管理',
              parent: 3000,
              show: true,
              id: 30002000,
              url: '/company/operator'
            }]
          }, {
            name: '账户',
            icon: 'iconfont icon-account',
            id: 4000,
            url: '/account',
            parent: 0,
            children: [{
              name: '机构账户管理',
              parent: 4000,
              show: true,
              id: 40001000,
              url: '/account/co-account',
            }, {
              name: '业务账户管理',
              parent: 4000,
              show: true,
              id: 40002000,
              url: '/account/assets',
            }, {
              name: '交易账户管理',
              parent: 4000,
              show: true,
              id: 40003000,
              url: '/account/trade'
            }, {
              name: '提币地址管理',
              parent: 4000,
              show: true,
              id: 40004000,
              url: '/account/address'
            }]
          }, {
            name: '投资',
            icon: 'iconfont icon-invest',
            id: 5000,
            url: '/invest',
            parent: 0,
            children: [{
              name: '交易员管理',
              parent: 5000,
              show: true,
              id: 50001000,
              url: '/invest/trader'
            }]
          }, {
            name: '持仓',
            icon: 'iconfont icon-position',
            id: 6000,
            url: '/position',
            parent: 0,
            children: [{
              name: '业务账户持仓',
              parent: 6000,
              show: true,
              id: 60001000,
              url: '/position/assets-account'
            }, {
              name: '业务账户持仓流水',
              parent: 6000,
              show: true,
              id: 60003000,
              url: '/position/assets-account-flow'
            }, {
              name: '交易账户持仓',
              parent: 6000,
              show: true,
              id: 60002000,
              url: '/position/trade-account'
            }, {
              name: '交易账户持仓流水',
              parent: 6000,
              show: true,
              id: 60004000,
              url: '/position/trade-account-flow'
            }, {
              name: '提币管理',
              parent: 6000,
              show: true,
              id: 60005000,
              url: '/position/withdraw'
            }, {
              name: '提币记录',
              parent: 6000,
              show: true,
              id: 60006000,
              url: '/position/withdraw-flow'
            }]
          }, {
            name: '同步',
            icon: 'iconfont icon-sync',
            id: 8000,
            url: '/sync',
            parent: 0,
            children: [{
              name: '机构资产同步',
              parent: 8000,
              show: true,
              id: 80001000,
              url: '/sync/assets-account',
            }]
          }, {
            name: '风控',
            icon: 'iconfont icon-risk',
            id: 7000,
            url: '/risk',
            parent: 0,
            children: [{
              name: '风控维度',
              parent: 700,
              show: true,
              id: 70004000,
              url: '/risk/dimension'
            }, {
              name: '风控条目',
              parent: 700,
              show: true,
              id: 70001000,
              url: '/risk/rules',
            }, {
              name: '风控模板',
              parent: 7000,
              show: true,
              id: 70002000,
              url: '/risk/template',
            }, {
              name: '风控设置',
              parent: 7000,
              show: true,
              id: 70003000,
              url: '/risk/manage',
            }, {
              name: '触警流水',
              parent: 700,
              show: true,
              id: 70006000,
              url: '/risk/alarm-water'
            }]
          },
            {
            name: '查询',
            icon: 'iconfont icon-invest',
            id: 8000,
            url: '/report',
            parent: 0,
            children: [{
              name: '持仓',
              url: '/report/position',
              parent: 8000,
              type: 'group',
              children: [{
                name: '机构持仓',
                parent: 8000,
                show: true,
                id: 80003000,
                url: '/report/position/company'
              }, {
                name: '业务账户持仓',
                parent: 8000,
                show: true,
                id: 80002000,
                url: '/report/position/asset-account'
              }, {
                name: '交易账户持仓',
                parent: 8000,
                show: true,
                id: 80001000,
                url: '/report/position/trade-account'
              }]
            }, {
              name: '委托',
              url: '/report/order',
              parent: 8000,
              type: 'group',
              children: [{
                name: '机构委托',
                parent: 8000,
                show: true,
                id: 80004000,
                url: '/report/order/company'
              }, {
                name: '业务账户委托',
                parent: 8000,
                show: true,
                id: 80005000,
                url: '/report/order/asset-account'
              }, {
                name: '交易账户委托',
                parent: 8000,
                show: true,
                id: 80006000,
                url: '/report/order/trade-account'
              }]
            }, {
              name: '成交',
              url: '/report/strike',
              parent: 8000,
              type: 'group',
              children: [{
                name: '机构成交',
                parent: 8000,
                show: true,
                id: 80007000,
                url: '/report/strike/company'
              }, {
                name: '业务账户成交',
                parent: 8000,
                show: true,
                id: 80008000,
                url: '/report/strike/asset-account'
              }, {
                name: '交易账户成交',
                parent: 8000,
                show: true,
                id: 80009000,
                url: '/report/strike/trade-account'
              }]
            }]
          }])
          resolve()
        }, 1000)
      })
    }
  }
}
