<template>
    <div>
        <div >
        <el-table
                :data="stockInfo.itemList"
                style="width: 100%" class="top">
            <el-table-column prop="symbol" label="代码" width="80"></el-table-column>
            <el-table-column prop="stockName" label="名称" width="80"></el-table-column>
            <el-table-column prop="lastTrade" label="最新价" width="80"></el-table-column>
            <el-table-column prop="chg" label="涨跌幅" width="80"></el-table-column>
            <el-table-column prop="stockChange" label="涨跌额" width="80"></el-table-column>
            <el-table-column prop="fiveMinCg" label="5分钟涨跌幅" width="80"></el-table-column>
            <el-table-column prop="volume" label="成交量(手)" width="80"></el-table-column>
            <el-table-column prop="turnover" label="成交额（万元)" width="80"></el-table-column>
            <el-table-column prop="turnoverRate" label="换手率" width="80"></el-table-column>
            <el-table-column prop="swing" label="振幅" width="80"></el-table-column>
            <el-table-column prop="qrr" label="量比" width="80"></el-table-column>
            <el-table-column prop="theCommittee" label="委比" width="80"></el-table-column>
            <el-table-column prop="peratio" label="市盈率" width="80"></el-table-column>
            <el-table-column prop="stockDate" label="时间" width="80"></el-table-column>
        </el-table>
        </div>
            <div class="bottom">
                <el-pagination
                        @size-change="stockInfo"
                        @current-change="stockInfo.currentPage"
                        :current-page.sync="currentPage3"
                        :page-size="100"
                        layout="prev, pager, next, jumper"
                        :total="1000">
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
</style>

<script>
    export default {
        data() {
            return {
                stockInfo: {},
                stockDTO: {

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
        created () {
            // GET /someUrl
            this.$http.post('http://localhost:8080/paper/stock/listStockInfo', this.stockDTO).then(response => {
                this.stockInfo = response.data.data;
                console.log(this.itemList)
            }, response => {
                console.log("error");
            });
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            }
        }
    }
</script>
