<template>
  <div>
    <home style="display: flex; height: 100%" v-show="homeShow" :loginUser="loginUser" v-on:switchExit="exit($event)"></home>
    <div v-show="loginShow">
      <div class="type" v-show="showLogin">
        <h3>登录</h3>
        <p v-show="showTishi">{{tishi}}</p>
        <input type="text" placeholder="请输入用户名" v-model="nickname">
        <input type="password" placeholder="请输入密码" v-model="password">
        <el-checkbox v-model="checked" style="color:#a0a0a0;">一周内自动登录</el-checkbox>
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
  </div>
</template>

<script>
    import Home from './components/Home.vue'
    import Login from './components/user/Login.vue'
    import {setCookie,getCookie} from './cookie'

    export default {
        data () {
            return{
                homeShow: false,
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
                },
                loginUser: {
                },
                checked:""
            }
        },
        components: {Home, Login},
        methods: {
            mounted(){


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
                            if(this.checked) {
                                this.setCookie(this.nickname, this.password, 7)
                            }
                            this.showTishi = true
                            this.loginShow = false
                            this.homeShow = true
                            setCookie('nickname', this.nickname, 1000 * 60)
                            setTimeout(function () {
                                this.$router.push('/home')
                            }.bind(this), 1000)
                            this.$http.get('http://localhost:8080/paper/user/getUserInfo/' + data.nickname).then(response => {
                                response.headers.set("Content-Type", "application/json")
                                this.loginUser = response.data.data;
                                sessionStorage.loginUser = JSON.stringify(this.loginUser)
                            }, response => {
                                console.log("error");
                            });
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
                    let data = {'nickname':this.newnickname,'password':this.newPassword}
                    this.$http.post('http://127.0.0.1:8080/paper/user/register',data).then((res)=>{
                        res.headers.set("Content-Type", "application/json");
                        console.log(res)
                        var code = res.data.code
                        if(code == "100"){
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
            },
            exit(){
                this.loginShow = true;
                this.homeShow = false;
                this.nickname = '';
                this.password = '';
            },
            setCookie(c_name,c_pwd,exdays) {
                var exdate=new Date();//获取时间
                exdate.setTime(exdate.getTime() + 24*60*60*1000*exdays);//保存的天数
                //字符串拼接cookie
                window.document.cookie="userName"+ "=" +c_name+";path=/;expires="+exdate.toGMTString();
                window.document.cookie="userPwd"+"="+c_pwd+";path=/;expires="+exdate.toGMTString();
            },
            getCookie:function () {
                if (document.cookie.length>0) {
                    var arr=document.cookie.split('; ');//这里显示的格式需要切割一下自己可输出看下
                    for(var i=0;i<arr.length;i++){
                        var arr2=arr[i].split('=');//再次切割
                        //判断查找相对应的值
                        if(arr2[0]=='userName'){
                            this.nickname=arr2[1];//保存到保存数据的地方
                        }else if(arr2[0]=='userPwd'){
                            this.password=arr2[1];
                        }
                    }
                }
            }
        },
        mounted(){
            console.log("app")
            this.getCookie()
            if(sessionStorage.loginUser != null){
                this.homeShow = true
                this.loginShow = false

                this.loginUser = JSON.parse(sessionStorage.loginUser)
            }
        },
        created(){
            console.log("created")
        }
    }
</script>

<style>

  #app {
    font-family: Helvetica, sans-serif;
    text-align: center;
  }
</style>
<style>
  .type{text-align:center;}
  input{display:block; width:250px; height:40px; line-height:40px; margin:0 auto; margin-bottom: 10px; outline:none; border:1px solid #888; padding:10px; box-sizing:border-box;}
  p{color:red;}
  button{display:block; width:250px; height:40px; line-height: 40px; margin:0 auto; border:none; background-color: #B3C0D1; color:#fff; font-size:16px; margin-bottom:5px;}
  span{cursor:pointer;}
  span:hover{color:#B3C0D1;}
</style>