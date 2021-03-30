import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

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
      menuList: [
        {
          icon: 'inbox',
          label: 'Inbox',
          color: 'black',
          separator: true
        },
        {
          icon: 'send',
          label: 'Outbox',
          color: 'blue',
          separator: false
        },
        {
          icon: 'delete',
          label: 'Trash',
          color: 'black',
          separator: false
        },
        {
          icon: 'error',
          label: 'Spam',
          color: 'red',
          separator: true
        },
        {
          icon: 'settings',
          label: 'Settings',
          color: 'gray',
          separator: false
        },
        {
          icon: 'feedback',
          label: 'Send Feedback',
          color: 'orange',
          separator: false
        },
        {
          icon: 'help',
          label: 'Help',
          color: 'green',
          separator: false
        }
      ],
      mapStyles: [
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [
            {
              color: '#193341'
            }
          ]
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [
            {
              color: '#2c5a71'
            }
          ]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [
            {
              color: '#29768a'
            },
            {
              lightness: -37
            }
          ]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [
            {
              color: '#406d80'
            }
          ]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [
            {
              color: '#406d80'
            }
          ]
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [
            {
              visibility: 'on'
            },
            {
              color: '#3e606f'
            },
            {
              weight: 2
            },
            {
              gamma: 0.84
            }
          ]
        },
        {
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#ffffff'
            }
          ]
        },
        {
          featureType: 'administrative',
          elementType: 'geometry',
          stylers: [
            {
              weight: 0.6
            },
            {
              color: '#1a3541'
            }
          ]
        },
        {
          elementType: 'labels.icon',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [
            {
              color: '#2c5a71'
            }
          ]
        }
      ]
    },
    modules: {
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
