<template>
  <div class="bg-white px-3" style="margin:-20px;margin-top:-1rem;margin-bottom:0 !important">
    <button-search class="pt-3" placeholder="手机号/邮箱/会员昵称">
      <template #left>
        <el-button size="mini" type="success" @click="openModel(false)">添加会员</el-button>
      </template>
      <!-- 高级搜索表单 -->
      <template #form>
        <el-form inline ref="form" :model="search" label-width="80px">
          <el-form-item label="搜索内容" class="mb-0">
            <el-input v-model="form.keyword" size="mini" placeholder="手机号/邮箱/会员昵称"></el-input>
          </el-form-item>
          <el-form-item label="会员等级" class="mb-0">
            <el-select placeholder="请选择会员等级" v-model="form.group_id">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间" class="mb-0">
            <el-date-picker v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" size="small">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="mb-0">
            <el-button type="info" size="mini" @click="searchEvent">搜索</el-button>
            <el-button size="mini" @click="clearSearch">清空筛选条件</el-button>
          </el-form-item>
        </el-form>
      </template>
    </button-search>
    <el-table :data="tableData" style="width: 100%" border class="mt-3">

      <el-table-column label="会员" width="280">
        <template slot-scope="scope">
          <div class="media">
            <img class="align-self-center mr-3 rounded-circle" :src="scope.row.avatar" alt="Generic placeholder image"
              style="width:50px;height:50px">
            <div class="media-body">
              <h6 class="mt-0 d-flex">
                {{ scope.row.username }}<el-button type="text" size="mini" class="ml-auto">详情</el-button>
              </h6>
              <p>用户id: {{ scope.row.id }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="会员等级" align="center">
        <template slot-scope="scope">
          <!-- {{ scope.row.level.name }} -->
          {{ scope.row.level_id === 1 ? "普通会员" : "高级会员" }}
        </template>
      </el-table-column>
      <el-table-column label="登录注册" align="center">
        <template slot-scope="scope">
          <div>注册时间: {{ scope.row.create_time }}</div>
          <div>最后登录: {{ scope.row.update_time }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="openModel(scope)">修改</el-button>
          <el-button type="text" size="mini">重置密码</el-button>
          <el-button type="text" size="mini" @click="deleteItem(scope)">删除</el-button>
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
    <el-dialog title="添加会员" :visible.sync="createModel" top="5vh">
      <el-form ref="form" :model="form">
        <el-form-item label="用户名" label-width="80px">
          <el-input v-model="form.username" size="mini" placeholder="用户名" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px">
          <el-input v-model="form.password" size="mini" placeholder="密码" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="昵称" label-width="80px">
          <el-input v-model="form.nickname" size="mini" placeholder="昵称" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="头像" label-width="80px">
          <div>
            <span v-if="!form.avatar" class="btn btn-light border" @click="chooseImage">
              <i class="el-icon-plus"></i>
            </span>
            <img v-else :src="form.avatar" class="rounded" style="width:40px;height:40px;cursor:pointer;"
              @click="chooseImage"></img>
          </div>
        </el-form-item>
        <el-form-item label="会员等级" label-width="80px">
          <el-select placeholder="请选择会员等级" v-model="form.level_id" size="mini">
            <el-option label="普通会员" :value="1"></el-option>
            <el-option label="黄金会员" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" label-width="80px">
          <el-input v-model="form.phone" size="mini" placeholder="手机" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="80px">
          <el-input v-model="form.email" size="mini" placeholder="邮箱" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="80px">
          <el-radio-group v-model="form.sex" size="mini">
            <el-radio :label="0" border>保密</el-radio>
            <el-radio :label="1" border>男</el-radio>
            <el-radio :label="2" border>女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" label-width="80px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
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
  inject: ['app'],
  components: {
    buttonSearch
  },
  data () {
    return {
      tabIndex: 0,

      tableData: [{
        id: 10,
        username: "用户名",
        avatar: "http://static.yoshop.xany6.com/2018071718294208f086786.jpg",
        level_id: 1,
        level: {
          id: 1,
          name: "普通会员"
        },
        create_time: "2019-07-24 15:58:15",
        update_time: "2019-07-24 15:58:15",
        status: 1,//启用

      }],
      currentPage: 1,
      createModel: false,
      editIndex: -1,
      search: {
        keyword: "",
        group_id: 0,
        time: ""
      },
      form: {
        username: "",
        password: "",
        nickname: "",
        avatar: "",
        level_id: "",
        phone: "",
        email: "",
        sex: "",
        status: 1,
      },
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
          username: "",
          password: "",
          nickname: "",
          avatar: "",
          level_id: "",
          phone: "",
          email: "",
          sex: "",
          status: 1,
        }
        this.editIndex = -1;
      } else {
        this.form = {
          username: e.row.username,
          password: e.row.password,
          nickname: e.row.nickname,
          avatar: e.row.avatar,
          level_id: e.row.level_id,
          phone: e.row.phone,
          email: e.row.email,
          sex: e.row.sex,
          status: e.row.status,
        }
        this.editIndex = e.$index;
      }
      this.createModel = true;
    },
    // 添加规格
    submit () {
      var msg = "添加";
      if (this.editIndex === -1) {
        console.log(this.form)
        this.tableData.unshift(this.form);
      } else {
        let item = this.tableData[this.editIndex];
        item.username = this.form.username;
        item.password = this.form.password;
        item.nickname = this.form.nickname;
        item.avatar = this.form.avatar;
        item.level_id = this.form.level_id;
        item.phone = this.form.phone;
        item.email = this.form.email;
        item.sex = this.form.sex;
        item.status = this.form.status;
        msg = "修改";
      }
      this.createModel = false;
      this.$message({
        message: msg + "成功",
        type: "success"
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

    },
    // 清空搜索条件
    clearSearch () {
      this.search = {
        keyword: "",
        group_id: 0,
        time: ""
      };
      this.$refs.buttonSearch[this.tabIndex].closeSuperSearch();
    },
    // 搜索事件
    searchEvent (e = false) {
      console.log(e)
      // 简单搜索
      if (typeof e === "string") {
        return console.log('简单搜索', e);
      }
      // 高级搜索
      console.log("搜索事件");

    },
    chooseImage () {
      this.app.chooseImage((res) => {
        this.form.avatar = res[0].url;
      }, 1);
    }


  }
}
</script>
<style></style>