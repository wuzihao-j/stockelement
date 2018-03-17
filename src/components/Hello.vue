<template>
    <el-container style="height: 100%; border: 1px solid #eee">
        <el-aside width="200px" style="background-color: rgb(255, 255, 255)">
            <el-menu :default-openeds="['0-1', '0-2', '0-3']" v-for="oneMenu in allMenus">
                <el-submenu index="oneMenu.fullPath" @click="rootFunction()">
                    <template slot="title">
                        <i class="el-icon-message" v-if="oneMenu.menuName != '基础配置'"></i>
                        <i class="el-icon-setting" v-else></i>{{oneMenu.menuName}}
                    </template>
                        <template v-for="twoMenu in oneMenu.childMenus">
                            <el-menu-item index="1" v-if="twoMenu.childMenus == null" @click="rootFunction(twoMenu.url )">
                                {{twoMenu.menuName}}
                            </el-menu-item>
                            <el-submenu index="1" v-else v-for="threeMenu in twoMenu.childMenus">
                                <template slot="title">
                                    <i class="el-icon-message"></i>{{threeMenu.menuName}}
                                </template>
                                <el-menu-item index="1" @click="rootFunction(threeMenu.url )">
                                    {{threeMenu.menuName}}
                                </el-menu-item>
                            </el-submenu>
                        </template>
                </el-submenu>
            </el-menu>
        </el-aside>

        <el-container>
            <el-header style="text-align: right; font-size: 12px;">
                <el-dropdown>
                    <i class="el-icon-setting" style="margin-right: 15px"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>查看</el-dropdown-item>
                        <el-dropdown-item>新增</el-dropdown-item>
                        <el-dropdown-item>删除</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span>王小虎</span>
            </el-header>
            <router-view></router-view>
        </el-container>
    </el-container>
</template>

<style>
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }

    .el-aside {
        color: #333;
    }

</style>

<script>
    import ElSubmenu from "../../node_modules/element-ui/packages/menu/src/submenu.vue";

    export default {
        components: {ElSubmenu},
        data() {
            const item = {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            };
            return {
                tableData: Array(7).fill(item),
                menusList: [],
                menuUser: {
                    "userId" : 0
                },
                allMenus:[{
                    menuName: '',
                    parentId: '',
                    level: '',
                    menuId: ''
                }]
            }
        },
        methods: {
            rootFunction: function (url) {
                this.$router.replace({path: url})
            }
        },
        created () {
            // GET /someUrl
            this.$http.post('http://localhost:8080/paper/menu/listMenus', this.menuUser).then(response => {
                this.allMenus = response.data.data;
                console.log(this.allMenus);
            }, response => {
                console.log("error");
            });
        }
    };
</script>