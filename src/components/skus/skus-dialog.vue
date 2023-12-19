<template>
  <el-dialog title="商品规格选择" :visible.sync="createModel" width="80%" top="5vh">
    <el-container style="position:relative;height:70vh;margin:-30px -20px">
      <el-container>
        <el-aside width="200px" style="position: absolute;top: 0;left: 0px;bottom: 0;" class="bg-white border-right">
          <!-- 侧边 | 相册列表 -->
          <ul class="list-group list-group-flush">
            <li class="list-group-item list-group-item-action " v-for="(item, index) in skusList" :key="index"
              :class="skusIndex === index ? 'sum-active' : ''" @click="changeSku(index)">
              {{ item.name }}</li>
          </ul>
        </el-aside>
        <el-container>
          <el-header style="position:absolute;top:0;left:200px;right:0;height:60px;line-height:60px"
            class="border-top border-bottom">
            <el-button type="primary" size="mini" @click="doChooseAll">{{ isChooseAll ? '取消全选' : '全选' }}</el-button>
          </el-header>
          <el-main style="position: absolute;top: 60px;left: 200px;bottom: 0;right: 0;">
            <!-- 主内容 -->
            <div class="d-flex flex-wrap">
              <span class="border rounded py-1 px-2 m-2 " style="cursor:pointer" v-for="(item, index) in skuItems"
                :key="index" :class="item.ischeck ? 'sum-active' : ''" @click="choose(item)">{{ item.name }}</span>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      createModel: false,
      callback: false,
      // 选中的数据
      chooseList: [],
      skusIndex: 0,
      // 数据
      skusList: [
        {
          name: "颜色",
          type: 0,// 规格类型 0无 1颜色 2图片
          // 规格属性列表
          list: [
            {
              id: 1,
              name: "红色",
              image: "",
              color: "",
              ischeck: false

            },
            {
              id: 2,
              name: "黄色",
              image: "",
              color: "",
              ischeck: false
            }
          ]
        },
        {
          name: "尺寸",
          type: 0,// 规格类型 0无 1颜色 2图片
          // 规格属性列表
          list: [
            {
              id: 3,
              name: "XL",
              image: "",
              color: "",
              ischeck: false
            },
            {
              id: 4,
              name: "XXL",
              image: "",
              color: "",
              ischeck: false
            }
          ]
        }
      ],
    }
  },
  computed: {
    // 当前规格下的规格属性列表
    skuItems () {
      return this.skusList[this.skusIndex].list;
    },
    // 是否全选
    isChooseAll () {
      return this.skuItems.length === this.chooseList.length;
    }
  },
  created () {
  },
  methods: {
    // 打开弹出层
    chooseSkus (callback) {
      this.callback = callback;
      this.createModel = true;
    },
    confirm () {
      if (typeof this.callback === "function") {
        let item = this.skusList[this.skusIndex];
        this.callback({
          name: item.name,
          type: item.type,
          list: this.chooseList
        });
      }
      // 隐藏
      this.hide();
    },
    // 关闭弹出层
    hide () {
      this.unChooseAll();
      this.createModel = false;
      this.callback = false;
    },
    // 切换规格卡片
    changeSku (index) {
      this.skusIndex = index;
      this.unChooseAll();
    },
    // 选中规格属性
    choose (item) {
      console.log(this.chooseList)
      // 之前没有选中
      if (!item.ischeck) {
        // 加入选中列表
        this.chooseList.push(item);
        // 修改选中状态
        return item.ischeck = true;
      }
      // 之前选中
      // 找到当前对象在chooseList中的索引
      let index = this.chooseList.findIndex(v => {
        return v.id === item.id
      });
      // 找不到
      if (index < 0) return;
      // 从选中列表中移除
      this.chooseList.splice(index, 1);
      // 修改选中状态
      item.ischeck = false;
    },
    // 选中 | 取消选中
    doChooseAll () {
      let list = this.skusList[this.skusIndex].list;
      if (this.isChooseAll) {
        this.unChooseAll();
        return;
      }
      this.chooseList = list.map(v => {
        v.ischeck = true;
        return v;
      });
    },
    // 取消选中所有
    unChooseAll () {
      let list = this.skusList[this.skusIndex].list;
      // 取消选中状态
      list.forEach(v => {
        v.ischeck = false;
      });
      // 清空选中列表
      this.chooseList = [];
      return;
    }
  }
}
</script>
<style>
.sum-active {
  background-color: teal;
  color: #FFF
}
</style>