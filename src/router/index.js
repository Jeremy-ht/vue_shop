import Vue from 'vue'
import VueRouter from "vue-router"

//懒加载方式
const Login = () => import( "components/login/Login");
const Home = () => import("components/home/Home")
const Welcome = () => import("components/Welcome")
const Users = () => import("components/home/users/Users")

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      }
    ]
  },

];

const router = new VueRouter({
  routes
});

//路由导航守卫，实现前端权限控制
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/home')
  next()

})

export default router