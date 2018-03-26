<template>
    <div>
        <div style="height: 100%;">
            <div>
                <el-autocomplete
                        v-model="stockDTO.keyword"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入内容"
                        @select="handleSelect"
                        style="float: left; display:inline-block"
                >
                </el-autocomplete>
                <el-input-number  class="top" style="width: 150px" v-model="stockNum" :min="100" :max="100000" label="描述文字"></el-input-number>
                <el-button class="top" type="primary">购买</el-button>
                <el-button class="top" type="primary">+自选</el-button>
            </div>
            <div style="margin-top: 50px">
                <div class="charts" style="float: left">
                    <div id="myChart" style="width:  700px; height: 400px; margin: 0 auto;"></div>
                </div>
                <div style="float: right; height: 100%; margin-right: 40px;">
                    <el-tabs type="border-card" style="width: 100%">
                        <el-tab-pane label="历史">
                            <el-table
                                    :data="tableData"
                                    style="width: 100%">
                                <el-table-column
                                        prop="date"
                                        label="股票"
                                        width="80">
                                </el-table-column>
                                <el-table-column
                                        prop="name"
                                        label="最新价"
                                        width="80">
                                </el-table-column>
                                <el-table-column
                                        prop="address"
                                        label="涨跌幅"
                                        width="80">
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="自选股">自选股</el-tab-pane>
                    </el-tabs>
                </div>
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
                    keyword: ''
                },
                stockDetail: {},
                stockName: '',
                restaurants: [],
                state4: '',
                timeout:  null,
                stockNum: ''
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
                return this.selectList;x
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
                this.$http.post('http://localhost:8080/paper/stock/selectDetailBySymbol', this.stockDTO).then(response => {
                    response.headers.set("Content-Type", "application/json")
                    this.stockDetail = response.data.data;
                    this.drawLine();
                    console.log("stockDetail")
                    console.log(this.stockDetail)
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
//                    xAxis: {
//                        type: 'category',
//                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//                    },
//                    yAxis: {
//                        type: 'value'
//                    },
//                    series: [{
//                        data: [820, 932, 901, 934, 1290, 1330, 1320],
//                        type: 'line'
//                    }]
                });
            }
        },
        mounted () {
            this.restaurants = this.loadAll();
            this.drawLine();
        }
    };
</script>

<style>
    .top {
        display:inline-block; margin-left: 40px;width: 100px
    }
</style>


