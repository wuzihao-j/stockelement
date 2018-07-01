<template>
    <div>
        <el-table
                :data="stockDistory"
                style="width: 100%" class="top"
                :row-class-name="tableRowClassName">
            <el-table-column prop="symbol" label="代码" style="flex: 1"></el-table-column>
            <el-table-column prop="count" label="交易数量" style="flex: 1"></el-table-column>
            <el-table-column prop="amount" label="交易价格" style="flex: 1"></el-table-column>
            <el-table-column prop="stockDate" label="时间" style="flex: 1"></el-table-column>
            <el-table-column prop="value" label="交易类型" style="flex: 1"></el-table-column>
        </el-table>
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
                stockDistory: [],
                stockDTO: {}
            }
        },
        methods: {
            tableRowClassName({row, rowIndex}){
                if(row.value == '买入'){
                    return 'warning-row'
                } else {
                    return 'success-row'
                }
            },
        },
        mounted () {
            this.stockDTO.userId = JSON.parse(sessionStorage.loginUser).userId
            this.$http.post('http://localhost:8080/paper/stock/listStockDistory', this.stockDTO).then(response => {
                response.headers.set("Content-Type", "application/json")
                this.stockDistory = response.data.data;
                console.log(this.stockDistory)
            }, response => {
                console.log("error");
            });
        }
    }
</script>
