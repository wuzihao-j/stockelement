<template>
    <div v-show="loginShow">
        <div class="type" v-show="showLogin">
            <h3>登录</h3>
            <p v-show="showTishi">{{tishi}}</p>
            <input type="text" placeholder="请输入用户名" v-model="nickname">
            <input type="password" placeholder="请输入密码" v-model="password">
            <button @click="login">登录</button>
            <span @click="ToRegister">没有账号？马上注册</span>
        </div>
        <div class="type" v-show="showRegister">
            <h3>注册</h3>
            <p v-show="showTishi">{{tishi}}</p>
            <input type="text" placeholder="请输入用户名" v-model="newnickname">
            <input type="password" placeholder="请输入密码" v-model="newPassword">
            <input type="password" placeholder="请确认密码" v-model="newPassword2">
            <button @click="register">注册</button>
            <span @click="ToLogin">已有账号？马上登录</span>
        </div>
    </div>
</template>

<style>
    .type{text-align:center;}
    input{display:block; width:250px; height:40px; line-height:40px; margin:0 auto; margin-bottom: 10px; outline:none; border:1px solid #888; padding:10px; box-sizing:border-box;}
    p{color:red;}
    button{display:block; width:250px; height:40px; line-height: 40px; margin:0 auto; border:none; background-color: #B3C0D1; color:#fff; font-size:16px; margin-bottom:5px;}
    span{cursor:pointer;}
    span:hover{color:#B3C0D1;}
</style>

<script>
    import {setCookie,getCookie} from '../../cookie'
    import App from '../../App.vue'

    export default{
        components: {App},
        data(){
            return{
                loginShow: true,
                showLogin: true,
                showRegister: false,
                showTishi: false,
                tishi: '',
                nickname: '',
                password: '',
                newnickname: '',
                newPassword: '',
                newPassword2: '',
                userInfo: {
                    code: ''
                }
            }
        },
        methods: {
            mounted(){
                /*页面挂载获取cookie，如果存在username的cookie，则跳转到主页，不需登录*/
                if(getCookie('username')){
                    this.$router.push('/home')
                }
            },
            login() {
                if (this.nickname == "" || this.password == "") {
                    alert("请输入用户名或密码")
                } else {
                    let data = {'nickname': this.nickname, 'password': this.password}
                    /*接口请求*/
                    this.$http.post('http://127.0.0.1:8080/paper/user/login', data).then((res) => {
                        res.headers.set("Content-Type", "application/json");
                        /*接口的传值是(-1,该用户不存在),(0,密码错误)，同时还会检测管理员账号的值*/
                        this.userInfo = res.data;
                        var code = this.userInfo.code;
                        if (code == 2) {
                            this.tishi = "该用户不存在"
                            this.showTishi = true
                        } else if (code == 0) {
                            this.tishi = "密码输入错误"
                            this.showTishi = true
                        } else if (code == 'admin') {
                            /*路由跳转this.$router.push*/
                            this.$router.push('/main')
                        } else {
                            this.tishi = "登录成功"
                            this.showTishi = true
                            App.loginShow = false
                            App.homeShow = true
                            console.log(App.loginShow)
                            console.log(App.homeShow)
                            setCookie('nickname', this.nickname, 1000 * 60)
                            setTimeout(function () {
                                this.$router.push('/home')
                            }.bind(this), 1000)
                        }
                    })
                }
            },
            register(){
                if(this.newUsername == "" || this.newPassword == ""){
                    alert("请输入用户名或密码")
                } else if(this.newPassword != this.newPassword2){
                    alert("两次密码输入必须相同")
                } else{
                    let data = {'nickname':this.newUsername,'password':this.newPassword}
                    this.$http.post('http://127.0.0.1:8080/paper/user/register',data).then((res)=>{
                        res.headers.set("Content-Type", "application/json");
                        console.log(res)
                        if(res.data == "ok"){
                            this.tishi = "注册成功"
                            this.showTishi = true
                            this.nickname = ''
                            this.password = ''
                            /*注册成功之后再跳回登录页*/
                            setTimeout(function(){
                                this.showRegister = false
                                this.showLogin = true
                                this.showTishi = false
                            }.bind(this),1000)
                        }
                    })
                }
            },
            ToRegister(){
                this.showLogin = false;
                this.showRegister = true;
            },
            ToLogin(){
                this.showLogin = true;
                this.showRegister = false;
            }
        }
    }
</script>s