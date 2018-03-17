import Menu from './components/Menu.vue'
import User from './components/User.vue'
import Role from './components/Role.vue'
import StockInfo from './components/StockInfo.vue'

const routers = [
    {
        path: '/menu/addMenu',
        component: Menu
    },
    {
        path: '/user',
        component: User
    },
    {
        path: '/role',
        component: Role
    },

    {
        path: '/stock/stockInfo',
        component: StockInfo
    }
]
export default routers

