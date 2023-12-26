<template>
  <div class="bg-white px-3" style="margin:-20px;margin-top:-1rem;margin-bottom:0 !important">
    <el-tabs v-model="activeName">
      <el-tab-pane label="运费模板" name="second">
        <div>
          <el-button type="primary" size="mini">
            添加模板
          </el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" border class="mt-3">

          <el-table-column label="模板名称" prop="name" align="center">
          </el-table-column>
          <el-table-column label="计费方式" align="center">
            <template slot-scope="scope">{{ scope.row.type | formatType }}</template>
          </el-table-column>
          <el-table-column label="排序" prop="order" align="center">
          </el-table-column>
          <el-table-column label="添加时间" prop="create_time" align="center">
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150px">
            <template slot-scope="scope">
              <el-button type="text" size="mini">修改</el-button>
              <el-button type="text" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="物流跟踪" name="third">
        <el-form ref="form" :model="form" label-width="160px">
          <el-form-item label="快递100 Customer">
            <el-input size="mini" style="width:50%" placeholder="快递100 Customer" v-model="form.customer"></el-input>
            <small class="text-secondary d-block">用于查询物流信息,<a href="#">快递100申请</a></small>
          </el-form-item>
          <el-form-item label="快递100 Key">
            <el-input size="mini" style="width:50%" placeholder="快递100 Key" v-model="form.key"></el-input>
            <small
              class="text-secondary d-block">秘钥设置关系系统中api调用传输签名串的编码规则,以及会员token解析,请慎重设置,注意设置之后对应会员要求重新登录获取token</small>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini">
              保存
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      activeName: "second",
      form: {
        customer: "",
        key: ""
      },
      tableData: [{
        name: "全国统一邮费",
        type: 1,
        create_time: "2019-07-17 15:15:14",
        status: 1,
        order: 100
      }],
    }
  },
  filters: {
    formatType (value) {
      let arr = ['按重量', '按件数'];
      return arr[value]
    }
  },
  methods: {
    handleClick () {

    }
  }
}
</script>
<style></style>