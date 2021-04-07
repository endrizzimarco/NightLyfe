
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue')},
    ]
  },
  {
    path: '/chat/:otherUserId',
    component: () => import('layouts/ChatLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Chat.vue')}
    ]
  },
  { path: '/auth', component: () => import( 'pages/Auth.vue')},
  { path: '/userinfo', component: () => import( 'pages/UserInfo.vue')},
  { path: '/settings', component: () => import( 'pages/Settings.vue')},
  { path: '/privacy', component: () => import( 'pages/Privacy.vue')},
  { path: '/contactus', component: () => import( 'pages/ContactUs.vue')},
  { path: '/sendfeedback', component: () => import( 'pages/Feedback.vue')},
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
