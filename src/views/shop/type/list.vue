<template>
  <div class="bg-white px-3" style="margin:-20px;margin-top:-1rem;margin-bottom:0 !important">
    <button-search :showSearch="false" class="pt-3">
      <template #left>
        <el-button size="mini" type="success" @click="openModel(false)">添加规格</el-button>
        <el-button size="mini" type="danger" @click="deleteAll">批量删除</el-button>
      </template>
    </button-search>
    <el-table :data="tableData" style="width: 100%" border class="mt-3" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="45" align="center">
      </el-table-column>

      <el-table-column prop="name" label="类型名称">
      </el-table-column>
      <el-table-column prop="value" label="属性标签" align="center" width="380px">
      </el-table-column>
      <el-table-column prop="order" label="排序" align="center">
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-button :type="scope.row.status ? 'success' : 'danger'" size="mini" plain @click="changeStatus(scope.row)">
            {{ scope.row.status ? '启用' : '禁用' }}
          </el-button>
        </template>
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


    <!-- 新增|修改模态框 -->
    <el-dialog title="添加规格" :visible.sync="createModel" top="5vh">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="规格名称" label-width="80px" prop="name">
          <el-input v-model="form.name" size="mini" placeholder="规格名称" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="80px">
          <el-input-number v-model="form.order" size="mini" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" label-width="80px">
          <el-radio-group v-model="form.status" size="mini">
            <el-radio :label="1" border>启用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型" label-width="80px">
          <el-radio-group v-model="form.type" size="mini">
            <el-radio :label="0" border>文字</el-radio>
            <el-radio :label="1" border>颜色</el-radio>
            <el-radio :label="2" border>图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规格值" label-width="80px" prop="value">
          <el-input type="textarea" :rows="3" v-model="form.value" size="mini" placeholder="一行为一个规格项,多个规格项用换行输入"
            style="width:50%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createModel = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

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

      tableData: [{
        id: 1,
        name: "颜色",
        value: "棕色,蓝色",
        order: 50,
        status: 1,
        type: 1
      }, {
        id: 2,
        name: "颜色",
        value: "棕色,蓝色",
        order: 50,
        status: 1,
        type: 1
      }, {
        id: 3,
        name: "颜色",
        value: "棕色,蓝色",
        order: 50,
        status: 1,
        type: 1
      }],
      currentPage: 1,
      multipleSelection: [],
      createModel: false,
      editIndex: -1,
      form: {
        name: "",
        order: 50,
        status: 1,
        type: 0,
        value: ""
      },
      rules: {
        name: [
          { required: true, message: "规则名称不能为空", trigger: blur }
        ],
        value: [
          { required: true, message: "规则值不能为空", trigger: blur }
        ]
      }
    }
  },
  created () {

  },
  methods: {
    // 打开模态框
    openModel (e = false) {
      // 增加
      if (!e) {
        this.form = {
          name: "",
          order: 50,
          status: 1,
          type: 0,
          value: ""
        }
        this.editIndex = -1;
      } else {
        this.form = {
          name: e.row.name,
          order: e.row.order,
          status: e.row.status,
          type: e.row.type,
          value: e.row.value.replace(",", "\n")
        }
        this.editIndex = e.$index;
      }
      this.createModel = true;
    },
    // 添加规格
    submit () {
      this.$refs.form.validate(res => {
        if (res) {
          var msg = "添加";
          this.form.value = this.form.value.replace("/\n/g", ",");
          if (this.editIndex === -1) {
            this.tableData.unshift(this.form);
          } else {
            let item = this.tableData[this.editIndex];
            item.name = this.form.name;
            item.value = this.form.value;
            item.status = this.form.status;
            item.order = this.form.order;
            item.type = this.form.type;
            msg = "修改";
          }
          this.createModel = false;
          this.$message({
            message: msg + "成功",
            type: "success"
          })
        }
      })
    },
    // 修改状态
    changeStatus (item) {
      // 请求服务端修改状态
      item.status = !item.status;
      this.$message({
        message: item.status ? "启用" : "禁用",
        type: "success"
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    // 删除单个
    deleteItem (scope) {
      this.$confirm('是否要删除该规格?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(scope.$index, 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
      });
    },
    // 批量删除
    deleteAll () {
      console.log(111)
      this.$confirm('是否要删除选中规格?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.multipleSelection.forEach(item => {
          let index = this.tableData.findIndex(v => v.id === item.id);
          if (index !== -1) {
            this.tableData.splice(index, 1)
          }
        });
        this.multipleSelection = [];
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
      });

    }


  }
}
</script>
<style></style>