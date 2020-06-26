import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Store from '../store/index'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/newoffer',
    name: 'NewOffer',
    component: () => import('../views/NewOffer.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/youroffers',
    name: 'YourOffers',
    component: () => import('../views/YourOffers.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/history',
    name: 'YourHistory',
    component: () => import('../views/YourHistory.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/inbox',
    name: 'Inbox',
    component: () => import('../views/Inbox.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/newmessage',
    name: 'Message',
    component: () => import('../views/Message.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/Chat.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/modify',
    name: 'ModifyOffer',
    component: () => import('../views/ModifyOffer.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/panel',
    name: 'Panel',
    component: () => import('../views/Panel.vue'),
    meta: {
      requiresAuth: true
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.reuiresAuth)){
    if(!Store.getters.isLoggedIn){
      next('/login');
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.reuiresGuest)){
    if(Store.getters.isLoggedIn){
      next('/profile');
    } else {
      next();
    }
  } else {
    next()
  }
})

export default router
