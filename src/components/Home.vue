<template>
    <el-container class="root">
        <el-aside width="200px" style="background-color: rgb(115, 192, 172)">
            <el-menu :default-openeds="['0-1', '0-2', '0-3']" v-for="oneMenu in allMenus">
                <el-submenu index="oneMenu.fullPath" @click="rootFunction()">
                    <template slot="title">
                        <i class="el-icon-message" v-if="oneMenu.menuName != '基础配置'"></i>
                        <i class="el-icon-setting" v-else></i>{{oneMenu.menuName}}
                    </template>
                        <template v-for="twoMenu in oneMenu.childMenus">
                            <el-menu-item index="twoMenu.fullPath" v-if="twoMenu.childMenus == null" @click="rootFunction(twoMenu.url)">
                                {{twoMenu.menuName}}
                            </el-menu-item>
                            <el-submenu index="twoMenu.fullPath" v-else v-for="threeMenu in twoMenu.childMenus">
                                <template slot="title">
                                    <i class="el-icon-message"></i>{{threeMenu.menuName}}
                                </template>
                                <el-menu-item index="threeMenu.fullPath" @click="rootFunction(threeMenu.url )">
                                    {{threeMenu.menuName}}
                                </el-menu-item>
                            </el-submenu>
                        </template>
                </el-submenu>
            </el-menu>
        </el-aside>

        <el-main>
            <el-header style="font-size: 12px;">
                <div style="float: right; margin-right: 80px">
                    <i class="el-icon-bell"></i>
                    <el-dropdown :hide-on-click="false" class="el-dropdown-link" @command="handleCommand">
                    <span  class="el-dropdown-link">
                        {{loginUser.nickname}}
                    </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                            <el-dropdown-item command="exit">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>

            </el-header>
                <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
    import Login from './user/Login.vue'
    import ElSubmenu from "../../node_modules/element-ui/packages/menu/src/submenu.vue";

    export default {
        components: {ElSubmenu, Login},
        props: ["loginUser"],
        data() {
            return {
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
            },
            handleCommand(command) {
                if(command == 'exit'){
                    sessionStorage.clear()
                    this.$emit("switchExit")
                } else if (command == 'personal'){
                    this.rootFunction("/stock/personal");
                }
            }
        },
        created () {
            this.$http.post('http://localhost:8080/paper/menu/listMenus', this.menuUser).then(response => {
                this.allMenus = response.data.data;
            }, response => {
                console.log("error");
            });
            if(sessionStorage.loginUser != null){
//                this.compSwitch.homeShow = true
//                this.compSwitch.loginShow = false

//                loginUser = JSON.parse(sessionStorage.loginUser)
            }
        }
    };
</script>

<style>

    .root {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0px;
        bottom: 0px;
        border: 1px solid #eee;
        overflow: hidden;
        word-break: break-all;
    }

    .el-main {
        background-color: rgba(255, 255, 255, 0);
    }

    .el-header {
        background-color: rgba(115, 192, 172, 0.53);
        color: #333;
        line-height: 60px;
        margin-bottom: 20px;
    }

    .el-aside {
        color: rgba(115, 192, 172, 0.53);
    }

    .item {
        margin-top: 10px;
        margin-right: 40px;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }

</style>