<template>
  <div class="bg-white px-3" style="margin:-20px;margin-top:-1rem;margin-bottom:0 !important">
    <button-search class="pt-3">
      <template #right>
        <div class="d-flex align-items-center">
          <el-date-picker v-model="search.time" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" size="medium">
          </el-date-picker>
          <el-input v-model="search.keyword" size="medium" placeholder="请输入订单号" style="width:200px"
            class="px-2"></el-input>
          <el-button type="info" size="medium">
            搜索
          </el-button>
        </div>

      </template>
    </button-search>
    <el-table :data="tableData" style="width: 100%" border class="mt-3" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="45" align="center">
      </el-table-column>

      <el-table-column prop="name" label="商品信息">
      </el-table-column>
      <el-table-column prop="order" label="商品清单" align="center">
      </el-table-column>
      <el-table-column prop="order" label="订单金额" align="center">
      </el-table-column>
      <el-table-column prop="order" label="收货信息" align="center">
      </el-table-column>
      <el-table-column prop="order" label="买家" align="center">
      </el-table-column>
      <el-table-column prop="order" label="交易状态" align="center">
      </el-table-column>
      <el-table-column prop="order" label="创建时间" align="center">
      </el-table-column>

      <el-table-column label="操作" align="center" width="150px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="mini" plain @click="openModel(scope)">修改</el-button>
            <el-button type="danger" size="mini" plain @click="deleteItem(scope)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <div style="height:60px"></div>
    <el-footer class="border-top d-flex align-items-center px-0 position-fixed bg-white"
      style="bottom:0;left:200px;right:0;z-index:100;">
      <div style="flex:1;" class="px-2">
        <el-pagination :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="100"
          layout="total, sizes, prev, pager, next, jumper" :total="400">
        </el-pagination>
      </div>
    </el-footer>

  </div>
</template>
<script>
import buttonSearch from "@/components/common/button-search.vue"
export default {
  name: "app",
  components: {
    buttonSearch
  },
  data () {
    return {
      tabIndex: 0,

      tableData: [],
      currentPage: 1,
      multipleSelection: [],
      search: {
        time: "",
        keyword: ""
      }
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
  }
}
</script>
<style>
.sku-list-item>i {
  display: none;
  cursor: pointer;
}

.sku-list-item:hover {
  background-color: #f4f4f4;
}

.sku-list-item:hover>font {
  display: none
}

.sku-list-item:hover>i {
  display: inline-block;
}
</style>