import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

import mapStyles from './mapStyles'
import menuList from './menuList'
import database from './database'

// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    state: {
      mapStyles: mapStyles['JSON'],
      menuList: menuList['data']
    },
    modules: {
      database
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
