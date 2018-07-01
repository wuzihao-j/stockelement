<template  class="template">
    <el-container class="container">
        <el-aside class="left">
            <el-menu v-for="oneMenu in allMenus" style="height: 100%">
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

                        <!--<el-menu-item index="twoMenu.fullPath" v-if="twoMenu.childMenus == null" @click="rootFunction(twoMenu.url)">-->
                        <!--{{twoMenu.menuName}}-->
                        <!--</el-menu-item>-->
                        <!--<el-submenu index="twoMenu.fullPath" v-else v-for="threeMenu in twoMenu.childMenus">-->
                        <!--<template slot="title">-->
                        <!--<i class="el-icon-message"></i>{{threeMenu.menuName}}-->
                        <!--</template>-->
                        <!--<el-menu-item index="threeMenu.fullPath" @click="rootFunction(threeMenu.url )">-->
                        <!--{{threeMenu.menuName}}-->
                        <!--</el-menu-item>-->
                        <!--</el-submenu>-->
                    </template>
                </el-submenu>
            </el-menu>
        </el-aside>

        <el-main class="right" @touchmove.prevent>
            <el-header style="font-size: 12px;" class="right-top">
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
            <div class="right-bottom">
                <div class="right-bottom-in">
                    <router-view></router-view>
                </div>
            </div>
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

                loginUser = JSON.parse(sessionStorage.loginUser)
            }
        }
    };
</script>

<style>

    .container{
        display: flex;
        flex: 1;
        height: 100%;
    }

    .left{
        display: flex;
        width: 150px;
        height: 100%;
        background: slateblue;
        flex-direction: column;
    }

    .right{
        display: flex;
        height: 100%;
        flex: 1;
        flex-direction: column;
    }

    .right-top{
        height: 50px;
        background: #766efd;
        padding: 20px;
        margin-bottom: 20px;
    }

    .right-bottom{
        flex: 1;
        overflow:auto;
    }

    .right-bottom-in{
        height: 2000px;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }

</style>