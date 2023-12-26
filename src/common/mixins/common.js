export default {
  data () {
    return {
      preUrl: "",
      page: {
        current: 1,
        sizes: [10, 20, 50, 100],
        size: 10,
        total: 0
      },
      multipleSelection: [],
      loading: true
    }
  },
  filters: {
    numToString (value) {
      return value.toString();
    }
  },
  created () {
    console.log('mxin created')
    this.getList()
  },
  computed: {
    // 选中记录id组成的数组
    ids () {
      return this.multipleSelection.map(item => {
        return item.id
      })
    }
  },
  methods: {
    showLoading () {
      if (this.loading) {
        this.layout.showLoading()
      }
    },
    hideLoading () {
      if (this.loading) {
        this.layout.hideLoading()
      }
    },
    // 处理列表结果
    getListResult (data) {

    },
    // 获取请求列表分页url
    getListUrl () {
      return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}`
    },
    // 获取列表
    getList () {
      console.log('this.preUrl:', this.preUrl)
      if (this.preUrl == "") return
      this.showLoading()
      let url = this.getListUrl()
      this.axios.get(url, {
        token: true
      }).then(res => {
        let data = res.data.data
        this.page.total = data.totalCount

        this.getListResult(data)

        this.hideLoading()
      }).catch(err => {
        this.hideLoading()
      })
    },
    // 添加|编辑
    addOrEdit (data, id = 0) {
      this.showLoading()
      let msg = id > 0 ? '修改' : '添加'
      let url = id > 0 ? '/admin/' + this.preUrl + '/' + id : '/admin/' + this.preUrl
      this.axios.post(url, this.form, {
        token: true
      }).then(res => {
        this.$message({
          message: msg + "成功",
          type: "success"
        })
        this.getList()
        this.hideLoading()
      }).catch(err => {
        this.hideLoading()
      })
    },
    // 修改状态
    changeStatus (item) {
      // 请求服务端修改状态
      let status = item.status === 1 ? 0 : 1;
      let msg = status === 1 ? '启用' : '禁用'
      this.showLoading()
      this.axios.post('/admin/' + this.preUrl + '/' + item.id + '/update_status', {
        status: status
      }, {
        token: true
      }).then(res => {
        item.status = status
        this.$message({
          message: msg + '成功',
          type: "success"
        })
        this.hideLoading()
      }).catch(err => {
        this.hideLoading()
      })
    },
    // 删除单个
    deleteItem (item) {
      this.$confirm('是否要删除该规格?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showLoading()
        this.axios.post('/admin/' + this.preUrl + '/' + item.id + '/delete', {}, {
          token: true
        }).then(res => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.hideLoading()
        }).catch(err => {
          this.hideLoading()
        })
      }).catch(() => {
      });
    },
    deleteAllUrl () {
      return '/admin/' + this.preUrl + '/delete_all'
    },
    // 批量删除
    deleteAll () {
      if (this.ids.length === 0) {
        return this.$message({
          message: '请先选中需要删除的信息',
          type: 'warning'
        })
      }
      this.$confirm('是否要删除选中规格?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showLoading()
        this.axios.post(this.deleteAllUrl(), {
          ids: this.ids
        }, { token: true }).then(res => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.multipleSelection = []
          this.hideLoading()
        }).catch(err => {
          this.hideLoading()
        })
      }).catch(() => {
      });

    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    // 分页功能:设置每页条数
    handleSizeChange (val) {
      this.page.size = val
      this.getList()
    },
    // 分页功能:设置当前第几页
    handleCurrentChange (val) {
      this.page.current = val
      this.getList()
    }
  },
}