<template>
  <div class="bg-white px-3" style="margin:-20px;margin-top:-1rem;margin-bottom:0 !important">
    <button-search :showSearch="false" class="pt-3">
      <template #left>
        <el-button size="mini" type="success" @click="openModel(false)">添加类型</el-button>
        <el-button size="mini" type="danger" @click="deleteAll">批量删除</el-button>
      </template>
    </button-search>
    <el-table :data="tableData" style="width: 100%" border class="mt-3" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="45" align="center">
      </el-table-column>

      <el-table-column prop="name" label="类型名称">
      </el-table-column>
      <el-table-column prop="value" label="属性标签" align="center" width="380px">
        <template slot-scope="scope">
          {{ scope.row.value_list | formatValue }}
        </template>
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
            <el-button type="danger" size="mini" plain @click="deleteItem(scope.row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <div style="height:60px"></div>
    <el-footer class="border-top d-flex align-items-center px-0 position-fixed bg-white"
      style="bottom:0;left:200px;right:0;z-index:100;">
      <div style="flex:1;" class="px-2">
        <el-pagination :current-page="page.current" :page-sizes="page.sizes" :page-size="page.size"
          layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-footer>


    <!-- 新增|修改模态框 -->
    <el-dialog title="添加类型" :visible.sync="createModel" top="5vh" width="80%">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="类型名称" label-width="80px" prop="name">
          <el-input v-model="form.name" size="mini" placeholder="类型名称" style="width:50%"></el-input>
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
        <el-form-item label="关联规格" label-width="80px">
          <div class="d-flex">
            <span class="sku-list-item px-3 py-2 border rounder mr-3" style="line-height: initial;"
              v-for="(item, index) in form.sku_list" :key="index">
              <font>{{ item.name }}</font>
              <i class="el-icon-delete" @click="deleteFormSkuList(index)"></i>
            </span>
            <el-button size="mini" @click="chooseSkus">
              <i class="el-icon-plus"></i>
            </el-button>

          </div>
        </el-form-item>
        <el-form-item label="属性列表" label-width="80px" prop="value">
          <el-table :data="value_list" style="width: 100%">
            <el-table-column prop="order" label="排序" width="100" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.order" size="mini" placeholder="排序"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="属性名称" width="130" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" size="mini" placeholder="属性名称"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="所属类型" width="130" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.type" placeholder="请选择所属类型" size="mini">
                  <el-option label="输入框" value="input"></el-option>
                  <el-option label="单选框" value="radio"></el-option>
                  <el-option label="多选框" value="checkbox"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="是否显示" width="80" align="center">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
              </template>

            </el-table-column>
            <el-table-column prop="default" label="属性值" align="center">
              <template slot-scope="scope" v-if="scope.row.type !== 'input'">
                <el-input type="textarea" v-model="scope.row.default" size="mini" placeholder="一行为一个属性值,多个属性值用换行输入"
                  v-if="scope.row.isedit"></el-input>
                <span v-else>{{ scope.row.value }}</span>
              </template>

            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-button v-if="scope.row.type !== 'input'" type="link" size="mini" @click="editRow(scope)">{{
                  scope.row.isedit ? "完成" : "编辑属性值"
                }}</el-button>
                <el-button type="link" size="mini" @click="delRow(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label-width="80px">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="addValue">添加一个属性</el-button>
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
import common from "@/common/mixins/common.js"
export default {
  inject: ['layout', 'app'],
  mixins: [common],
  components: {
    buttonSearch
  },
  data () {
    return {
      preUrl: "goods_type",

      tableData: [],
      currentPage: 1,
      multipleSelection: [],
      createModel: false,
      editIndex: -1,
      form: {
        name: "",
        order: 50,
        status: 1,
        sku_list: [],
      },
      value_list: [],
      rules: {
        name: [
          { required: true, message: "类型名称不能为空", trigger: blur }
        ]
      }
    }
  },
  filters: {
    formatValue (value) {
      let arr = value.map(v => v.name);
      return arr.join(",")
    }
  },
  computed: {
    // 关联规格id组成的一维数组
    skus_id () {
      return this.form.sku_list.map(item => item.id)
    }
  },
  methods: {
    getListResult (e) {
      this.tableData = e.list.map(item => {
        item.value_list = item.goods_type_values
        return item
      })
    },
    // 打开模态框
    openModel (e = false) {
      // 增加
      if (!e) {
        this.form = {
          name: "",
          order: 50,
          status: 1,
          sku_list: [],
        }
        this.value_list = [];
        this.editIndex = -1;
      } else {
        this.form = {
          ...e.row
        }
        this.value_list = [...e.row.value_list];
        this.editIndex = e.$index;
      }
      this.createModel = true;
    },
    // 添加类型
    submit () {
      this.$refs.form.validate(res => {
        // 验证属性列表
        var result = true;
        var message = [];
        this.value_list.forEach((item, index) => {
          let no = index + 1;
          if (item.order == "") {
            result = result && false;
            message.push("第" + no + "行:排序不能为空");
          }
          if (item.name === "") {
            result = result && false;
            message.push("第" + no + "行:属性名称不能为空");
          }
          if (item.type !== "input" && item.default == "") {
            result = result && false;
            message.push("第" + no + "行:属性值不能为空");
          }
        });
        if (!result) {
          var temp = '';
          message.forEach(v => {
            temp += `<li>${v}</li>`;
          })
          return this.$notify({
            title: '属性列表提示',
            dangerouslyUseHTMLString: true,
            message: `<ul>${temp}</ul>`,
            type: 'warning',
            duration: 3000
          });
        }

        if (res) {
          var msg = "添加";
          if (this.editIndex === -1) {
            let value_list = this.value_list.map(item => {
              if (item.default) {
                item.default = item.default.replace(/\n/g, ',')
              }
              return item
            })
            let data = {
              ...this.form,
              skud_id: this.skus_id,
              value_list: [...value_list]
            }
            this.addOrEdit(data)
          } else {
            let item = this.tableData[this.editIndex];
            item.name = this.form.name;
            item.sku_list = this.form.sku_list;
            item.status = this.form.status;
            item.order = this.form.order;
            item.type = this.form.type;
            item.value_list = this.value_list;
            msg = "修改";
          }
          this.createModel = false;
        }
      })
    },
    // 添加属性
    addValue () {
      this.value_list.push({
        order: 50,
        name: "",
        type: "input",
        default: "",
        isedit: false
      })
    },
    // 编辑属性
    editRow (scope) {
      scope.row.isedit = !scope.row.isedit;
    },
    // 删除属性值
    delRow (index) {
      this.value_list.splice(index, 1);
    },
    chooseSkus () {
      this.app.chooseSkus((e) => {
        let index = this.form.sku_list.findIndex(item => {
          return item.id === e.id
        })
        if (index === -1) {
          this.form.sku_list.push(e)
        }
      })
    },
    deleteFormSkuList (index) {
      this.form.sku_list.splice(index, 1)
    }


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