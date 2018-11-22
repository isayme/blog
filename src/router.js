import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/blogs',
      name: 'blogs',
      alias: '/',
      component: () => {
        return import('./views/Blogs.vue')
      }
    },
    {
      path: '/blog/:number',
      name: 'blog',
      component: () => {
        return import('./views/Blog.vue')
      }
    }
  ]
})

export default router
