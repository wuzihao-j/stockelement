<template  class="template">
    <el-container class="container">
        <el-header style="font-size: 12px;" class="top">
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
        <div class="bottom">
            <el-aside class="left">
                <el-menu v-for="oneMenu in allMenus">
                    <el-submenu index="oneMenu.fullPath" @click="rootFunction()">
                        <template slot="title">
                            <i class="el-icon-message" v-if="oneMenu.menuName != '基础配置'"></i>
                            <i class="el-icon-setting" v-else></i>{{oneMenu.menuName}}
                        </template>
                        <template v-for="twoMenu in oneMenu.childMenus">
                            <el-submenu index="twoMenu.fullPath" v-if="twoMenu.childMenus != null">
                                <template slot="title">
                                    {{twoMenu.menuName}}
                                </template>
                                <template v-for="threeMenu in twoMenu.childMenus">
                                    <el-menu-item index="threeMenu.fullPath" @click="rootFunction(threeMenu.url )">
                                        {{threeMenu.menuName}}
                                    </el-menu-item>
                                </template>
                            </el-submenu>
                            <el-menu-item index="twoMenu.fullPath" v-else @click="rootFunction(twoMenu.url)">
                                {{twoMenu.menuName}}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main @touchmove.prevent  class="right">
                <router-view></router-view>
            </el-main>
        </div>
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
            this.$http.post('http://47.106.107.243:8080/paper/menu/listMenus', this.menuUser).then(response => {
                this.allMenus = response.data.data;
            }, response => {
                console.log("error");
            });
            if(sessionStorage.loginUser != null){
//                this.compSwitch.homeShow = true
//                this.compSwitch.loginShow = false

                loginUser = JSON.parse(sessionStorage.loginUser)
            }
        }
    };
</script>

<style>
    .container{
        width: 100%;
        height: 100%;
    }

    .top{
        position: fixed;
        top: 0;
        left: 0;
        height: 50px;
        width: 100%;
        background: #766efd;
        padding: 20px;
        z-index: 10000;
        margin: 0;
        display: block;
    }

    .left{
        position: fixed;
        top: 50px;
        left: 0;
        width: 150px;
        height: 100%;
        background: #ffffff;
    }

    .right{
        height: 100%;
        display: block;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }

</style>