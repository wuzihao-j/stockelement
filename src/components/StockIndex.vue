<script src="../main.js"></script>
<template>
    <div style="height: 100%; width: 100%">
        <div class="top">
            <el-autocomplete
                    v-model="stockDTO.keyword"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入内容"
                    @select="handleSelect"
                    class="input"
            >
            </el-autocomplete>
            <!--<el-input-number  class="top" style="width: 150px" v-model="stockNum" :min="100" :max="100000" label="描述文字"></el-input-number>-->
            <!--<el-button class="top" type="primary">购买</el-button>-->
            <div class="right-buttonn">
                <el-button class="button" type="primary" v-if="stockDetail.symbol != null" @click="open" >购买</el-button>
                <el-button class="button" type="primary" v-else style="visibility: hidden;" ></el-button>
                <el-button class="button" type="primary" v-if="stockDetail.symbol != null" @click="switchSelect">{{isAttentionTip}}</el-button>
                <el-button class="button" type="primary" v-else style="visibility: hidden;"></el-button>
            </div>
        </div>
        <div class="table">
            <div class="charts">
                <div id="myChart"></div>
            </div>
            <div  class="distory">
                <el-tabs type="border-card" style="width: 100%">
                    <el-tab-pane label="历史">
                        <el-table
                                :data="historyStocks"
                                style="width: 100%">
                            <el-table-column
                                    prop="stockName"
                                    label="股票"
                                    style="flex: 1">
                            </el-table-column>
                            <el-table-column
                                    prop="lastTrade"
                                    label="最新价"
                                    style="flex: 1">
                            </el-table-column>
                            <el-table-column
                                    prop="chg"
                                    label="涨跌幅"
                                    style="flex: 1">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>

                    <el-tab-pane label="自选股">自选股</el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>


<script>
    // 引入基本模板
    let echarts = require('echarts/lib/echarts')
    // 引入柱状图组件
    require('echarts/lib/chart/bar')
    // 引入提示框和title组件
    require('echarts/lib/component/tooltip')
    require('echarts/lib/component/title')

    export default {
        name: 'hello',
        data() {
            return {
                selectList: [],
                chartList: [],
                timeList: [],
                shares: [],
                stockDTO: {
                    keyword: '',
                    symbol: '',
                    userId: '',
                    stockNum: '',
                    lastTrade: ''
                },
                stockDetail: {},
                stockName: '',
                restaurants: [],
                state4: '',
                timeout:  null,
                historyStocks: [],
                isAttention: '',
                isAttentionTip: ''
            };
        },
        methods: {
            loadAll() {
                this.$http.post('http://localhost:8080/paper/stock/listStockName', this.stockDTO).then(response => {
                    response.headers.set("Content-Type", "application/json")
                    this.selectList = response.data.data;
                }, response => {
                    console.log("error");
                });
                return this.selectList;
            },
            querySearchAsync(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
//                clearTimeout(this.timeout);
//                this.timeout = setTimeout(() => {
                    cb(results);
//                }, 3000 * Math.random());
            },
            createStateFilter(queryString) {
                this.$http.post('http://localhost:8080/paper/stock/listStockName', this.stockDTO).then(response => {
                    response.headers.set("Content-Type", "application/json")
                    this.restaurants = response.data.data;
                }, response => {
                    console.log("error");
                });

                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                console.log('select')
                this.stockName = item.stockName;
                this.stockDTO.symbol = item.symbol;
                this.$http.post('http://localhost:8080/paper/stock/listStockByChart', this.stockDTO).then(response => {
                    response.headers.set("Content-Type", "application/json")
                    this.chartList = response.data.data;
                    this.drawLine();
                }, response => {
                    console.log("error");
                });
                this.$http.post('http://localhost:8080/paper/stock/getSymbolLastInfo', this.stockDTO).then(response => {
                    response.headers.set("Content-Type", "application/json")
                    this.stockDetail = response.data.data;
                    this.historyStocks.splice(0, 0, this.stockDetail)
                }, response => {
                    console.log("error");
                });
                //判断股票是否已经关注
                this.$http.post('http://localhost:8080/paper/stock/isAttention', this.stockDTO).then(response => {
                    response.headers.set("Content-Type", "application/json")
                    if(response.data.code == 103){
                        this.isAttention = 100
                    }
                    if(this.isAttention == 100){
                        this.isAttentionTip = '已关注'
                    } else {
                        this.isAttentionTip = '关注'
                    }
                }, response => {
                    console.log("error");
                });
            },
            drawLine() {
                //清空列表
                this.shares = [];
                this.timeList = [];
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('myChart'))
                // 绘制图表
                for (var i =0;i<this.chartList.length;i++){
                    this.shares.push(this.chartList[i].lastTrade);
                    this.timeList.push(this.chartList[i].stockDate);
                }
                console.log(this.shares)
                console.log(this.timeList)

                myChart.setOption({
                    title: { text: this.stockName + '股价趋势图' },
                    tooltip: {},
                    xAxis: {
                        data: this.timeList
                    },
                    yAxis: {},
                    series: [{
                        name: '股价',
                        type: 'line',
                        data: this.shares
                    }]
                });
            },
            open() {
                this.$prompt('请输入购买的数量', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[1-9]\d*$/,
                    inputErrorMessage: '只能输入数字并且大于0'
                }).then(({ value }) => {
                    this.$message({
                        type: 'success',
                        message: '你的购买了: ' + value + '股'
                    });
                    this.stockDTO.stockNum = value
                    this.stockDTO.lastTrade = this.stockDetail.lastTrade
                    this.$http.post('http://localhost:8080/paper/stock/buyStock', this.stockDTO).then(response => {
                        response.headers.set("Content-Type", "application/json")
                    }, response => {
                        console.log("error");
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            selectStock(){
                this.$http.post('http://localhost:8080/paper/stock/attentionStock', this.stockDTO).then(response => {
                    response.headers.set("Content-Type", "application/json")
                    if(response.data.code == 104){
                        this.isAttention = 100
                        this.isAttentionTip = '已关注'
                    }
                }, response => {
                    console.log("error");
                });
            },
            cancelSelect(){
                this.$http.post('http://localhost:8080/paper/stock/cancenAttention', this.stockDTO).then(response => {
                    response.headers.set("Content-Type", "application/json")
                    if(response.data.code == 104){
                        this.isAttention = 300
                        this.isAttentionTip = '关注'
                    }
                }, response => {
                    console.log("error");
                });
            },
            switchSelect(){
                if(this.isAttention == 100){
                    this.cancelSelect()
                    console.log(this.isAttention)
                    console.log(this.isAttentionTip)
                } else {
                    this.selectStock()
                    console.log(this.isAttention)
                    console.log(this.isAttentionTip)
                }
            }
        },
        mounted () {
            this.stockDTO.userId = JSON.parse(sessionStorage.loginUser).userId;
            this.restaurants = this.loadAll();
            this.drawLine();
        }
    };
</script>

<style>
    .top {
        display: flex;
        margin-bottom: 100px;
    }

    .input{
        display: inline-flex;
        flex: 2;
        margin-right: 100px;
    }

    .right-buttonn{
        display: inline-flex;
        flex: 1;
        margin-left: 100px;
    }

    .button{
        flex: 1;
        margin-left: 50px;
        margin-right: 50px;
    }

    .table {
        display: flex;
    }

    .charts {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .distory {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
    }


</style>


