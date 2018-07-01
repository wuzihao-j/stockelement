<template>
    <div>
        <template>
            <!--<div class="block">-->
                <!--<el-date-picker-->
                        <!--v-model=""-->
                        <!--type="daterange"-->
                        <!--range-separator="至"-->
                        <!--start-placeholder="开始日期"-->
                        <!--end-placeholder="结束日期">-->
                <!--</el-date-picker>-->
            <!--</div>-->
        </template>
        <div>
        <el-table
                :data="stockInfo.list"
                style="width: 100%" class="top"
                :row-class-name="tableRowClassName">
            <el-table-column prop="symbol" label="代码" style="flex: 1"></el-table-column>
            <el-table-column prop="stockName" label="名称" style="flex: 1"></el-table-column>
            <el-table-column prop="lastTrade" label="最新价" style="flex: 1"></el-table-column>
            <el-table-column prop="chg" label="涨跌幅%" style="flex: 1"></el-table-column>
            <el-table-column prop="stockChange" label="涨跌额" style="flex: 1"></el-table-column>
            <!--<el-table-column prop="fiveMinCg" label="5分钟涨跌幅" width="60"></el-table-column>-->
            <!--<el-table-column prop="volume" label="成交量(手)" width="60"></el-table-column>-->
            <el-table-column prop="turnover" label="成交额（万元)" style="flex: 1"></el-table-column>
            <el-table-column prop="turnoverRate" label="换手率" style="flex: 1"></el-table-column>
            <el-table-column prop="swing" label="振幅" style="flex: 1"></el-table-column>
            <!--<el-table-column prop="qrr" label="量比" width="100"></el-table-column>-->
            <!--<el-table-column prop="theCommittee" label="委比" width="100"></el-table-column>-->
            <el-table-column prop="peratio" label="市盈率" style="flex: 1"></el-table-column>
            <el-table-column prop="stockDate" label="时间" style="flex: 1"></el-table-column>
        </el-table>
        </div>
        <div class="bottom">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="stockInfo.pageNum"
                    :page-sizes="[5, 10, 20, 50]"
                    :page-size="stockInfo.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="stockInfo.total">
            </el-pagination>
        </div>
    </div>
</template>

<style>
    .top {
        margin-left: auto;
        margin-right: auto;
    }
    .bottom {

        margin-left: auto;
        margin-right: auto;
    }

    .el-table .warning-row {
        background: rgba(181, 250, 255, 0.2);
    }

    .el-table .success-row {
        background: rgba(249, 213, 184, 0.14);
    }
</style>

<script>
    export default {
        data() {
            return {
                stockInfo: {},
                stockDTO: {
                    pageNum: 1,
                    pageSize: 10
                },
                allMenus:[{
                    symbol: '',
                    stockName: '',
                    lastTrade: '',
                    chg: '',
                    stockChange: '',
                    fiveMinCg: '',
                    volume: '',
                    turnover: '',
                    turnoverRate: '',
                    swing: '',
                    qrr: '',
                    theCommittee: '',
                    peratio: '',
                    stock_date: '',
                }],
                currentPage1: 5,
                currentPage2: 5,
                currentPage3: 5,
                currentPage4: 4
            }
        },
        mounted () {
            this.$http.post('http://localhost:8080/paper/stock/listStockInfo', this.stockDTO).then(response => {
                response.headers.set("Content-Type", "application/json")
                this.stockInfo = response.data.data;
                console.log('stockInfo')
                console.log(this.stockInfo)
            }, response => {
                console.log("error");
            });
        },
        methods: {
            handleSizeChange(val) {
                this.stockDTO.pageSize = val
            },
            handleCurrentChange(val) {
                console.log(111)
                this.stockDTO.pageNum = val;
                this.$http.post('http://localhost:8080/paper/stock/listStockInfo', this.stockDTO).then(response => {
                    response.headers.set("Content-Type", "application/json")
                    this.stockInfo = response.data.data;
                    console.log(this.stockInfo)
                }, response => {
                    console.log("error");
                });
            },
            tableRowClassName({row, rowIndex}){
                if(rowIndex % 2 == 0){
                    return 'warning-row'
                } else {
                    return 'success-row'
                }
            },
        }
    }
</script>
