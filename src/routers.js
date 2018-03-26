import Menu from './components/Menu.vue'
import User from './components/User.vue'
import Role from './components/Role.vue'
import StockInfo from './components/StockInfo.vue'
import StockIndex from './components/StockIndex.vue'
import Login from './components/user/Login.vue'
import Home from './components/Home.vue'
import Personal from './components/Personal.vue'


const routers = [
    {
        path: '/manager/menu/addMenu',
        component: Menu
    },
    {
        path: '/manager/user',
        component: User
    },
    {
        path: '/manager/role',
        component: Role
    },
    {
        path: '/stock/stockInfo',
        component: StockInfo
    },
    {
        path: '/manager/role',
        component: Home
    },
    {
        path: '/stock/selectStock',
        component: StockIndex
    },
    {
        path: '/stock/personal',
        component: Personal
    }
    // {
    //     path: '/',
    //     component: Login
    // }
]
export default routers

