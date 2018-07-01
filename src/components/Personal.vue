<template>
   <div>
       <div>
           <el-card class="box-card" style="display: inline-block">
               <div slot="header">
                   <img src="../assets/images/asset.jpg" class="image">
                   <span>我的资产</span>
               </div>
               <div class="text item">
                   {{userInfo.asset}}
               </div>
           </el-card>
           <el-card class="box-card" style="display: inline-block">
               <div slot="header">
                   <img src="../assets/images/money.jpg" class="image">
                   <span>持有资金</span>
               </div>
               <div class="text item">
                   {{userInfo.currentCash}}
               </div>
           </el-card>
           <el-card class="box-card" style="display: inline-block">
               <div slot="header">
                   <img src="../assets/images/profit.png" class="image">
                   <span>总收益</span>
               </div>
               <div class="text item">
                   {{userInfo.asset - userInfo.capital}}
               </div>
           </el-card>
       </div>
       <br>
       <div style="margin-left: 50px; margin-right: 50px;">
           <div>
               <i class="el-icon-d-arrow-right" style="display:inline-block"></i>
               <h5 style="display:inline-block">我持有的股票</h5>
           </div>
           <div>
               <el-table
                       :data="buyStockList"
                       style="width: 100%; "
                       :row-class-name="tableRowClassName">
                   <el-table-column prop="stockName" label="股票名称">
                   </el-table-column>
                   <el-table-column prop="lastTrade" label="最新价">
                   </el-table-column>
                   <el-table-column prop="chg" label="涨跌幅">
                   </el-table-column>
                   <el-table-column prop="stockChange" label="涨跌额">
                   </el-table-column>
                   <el-table-column prop="volume" label="成交量">
                   </el-table-column>
                   <el-table-column prop="swing" label="振幅">
                   </el-table-column>
                   <el-table-column prop="turnoverRate" label="换手率">
                   </el-table-column>
                   <el-table-column prop="count" label="数量">
                   </el-table-column>
                   <el-table-column prop="amount" label="持有金额">
                   </el-table-column>
                   <el-table-column label="操作">
                       <template slot-scope="scope" >
                           <el-button style="width: 100px;" @click="sellStock(scope.$index)" type="text">卖出</el-button>
                       </template>
                   </el-table-column>
               </el-table>
           </div>
       </div>
       <div style="margin-left: 50px; margin-right: 50px;">
           <div>
               <i class="el-icon-d-arrow-right" style="display:inline-block"></i>
               <h5 style="display:inline-block">我关注的股票</h5>
           </div>
           <div>
               <el-table
                       stripe
                       :data="attentionStockList"
                       style="width: 100%"
                       :row-class-name="tableRowClassName">
                   <el-table-column prop="stockName" label="股票名称" >
                   </el-table-column>
                   <el-table-column prop="lastTrade" label="最新价" >
                   </el-table-column>
                   <el-table-column prop="chg" label="涨跌幅" >
                   </el-table-column>
                   <el-table-column prop="stockChange" label="涨跌额" >
                   </el-table-column>
                   <el-table-column prop="volume" label="成交量">
                   </el-table-column>
                   <el-table-column prop="swing" label="振幅">
                   </el-table-column>
                   <el-table-column prop="turnoverRate" label="换手率">
                   </el-table-column>
                   <el-table-column
                           label="操作">
                       <template slot-scope="scope">
                           <el-button style="width: 100px" @click="cancelAttention(scope.$index)" type="text">取消关注</el-button>
                       </template>
                   </el-table-column>
               </el-table>
           </div>
       </div>

   </div>
</template>


<script>

    export default {
        data() {
            return {
                attentionStockList: [],
                buyStockList: [],
                stockDTO: {},
                userInfo: {}
            }
        },
        methods: {
            tableRowClassName({row, rowIndex}){
                if(row.stockChange > 0){
                    return 'warning-row'
                } else {
                    return 'success-row'
                }
            },
            listAttentionStockSelect(){
                this.stockDTO.userId = JSON.parse(sessionStorage.loginUser).userId;
                this.$http.post('http://localhost:8080/paper/stock/listAttentionStock', this.stockDTO).then(response => {
                    response.headers.set("Content-Type", "application/json")
                    this.attentionStockList = response.data.data
                }, response => {
                    console.log("error");
                });
            },
            listBuyStockSelect(){
                this.stockDTO.userId = JSON.parse(sessionStorage.loginUser).userId;
                this.$http.post('http://localhost:8080/paper/stock/listBuyStock', this.stockDTO).then(response => {
                    response.headers.set("Content-Type", "application/json")
                    this.buyStockList = response.data.data
                }, response => {
                    console.log("error");
                });
            },
            getUserInfo(){
                var nickname = JSON.parse(sessionStorage.loginUser).nickname;

                this.$http.get('http://localhost:8080/paper/user/getUserInfo/' + nickname).then(response => {
                    this.userInfo = response.data.data
                }, response => {
                    console.log("error");
                });
            },
             cancelAttention(index) {
                 this.stockDTO.symbol = this.attentionStockList[index].symbol
                 this.$http.post('http://localhost:8080/paper/stock/cancenAttention', this.stockDTO).then(response => {
                     response.headers.set("Content-Type", "application/json")
                     if(response.data.code == 104){
                        this.listAttentionStockSelect()
                     }
                 }, response => {
                     console.log("error");
                 });
            },
             sellStock(index) {
                 this.stockDTO.lastTrade = this.buyStockList[index].lastTrade
                 this.stockDTO.symbol = this.buyStockList[index].symbol
                 this.$prompt('请输入卖出的数量', '提示', {
                     confirmButtonText: '确定',
                     cancelButtonText: '取消',
                     inputPattern: /^[1-9]\d*$/,
                     inputErrorMessage: '只能输入数字并且大于0'
                 }).then(({ value }) => {
                     this.$message({
                         type: 'success',
                         message: '你卖出了: ' + value + '股'
                     });
                     this.stockDTO.stockNum = value
                     this.$http.post('http://localhost:8080/paper/stock/sellStock', this.stockDTO).then(response => {
                         response.headers.set("Content-Type", "application/json")
                         this.listBuyStockSelect()
                     }, response => {
                         console.log("error");
                     });
                 }).catch(() => {
                     this.$message({
                         type: 'info',
                         message: '取消输入'
                     });
                 });

             }
        },
        mounted() {
            this.listAttentionStockSelect()
            this.listBuyStockSelect()
            this.getUserInfo()
        }
    }
</script>

<style>
    .el-table .warning-row {
        background: #fda994;
    }

    .el-table .success-row {
        background: #a7f9a8;
    }

    .text {
        font-size: 26px;
    }

    .item {
        margin-bottom: 18px;
    }

    .box-card {
        width: 230px;
        margin-left: 50px;
        text-align:justify;
        text-align-last:justify;
    }

    .image {
        width: 30px;
        height: 30px;
    }
</style>