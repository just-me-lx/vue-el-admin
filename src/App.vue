<template>
  <div id="app">
    <router-view></router-view>
    <image-dialog ref="imageDialog" :max="maxChooseImage"></image-dialog>
    <skus-dialog ref="skusDialog"></skus-dialog>
  </div>
</template>

<script>
import imageDialog from "@/components/image/image-dialog.vue";
import skusDialog from "@/components/skus/skus-dialog"
export default {
  name: 'app',
  // 依赖注入
  provide () {
    return {
      app: this
    }
  },
  components: {
    imageDialog,
    skusDialog
  },
  data () {
    return {
      maxChooseImage: 9
    }
  },
  created () {
    // 初始化用户信息
    this.$store.commit('initUser');
    // 初始化后台菜单
    this.$store.commit('initNavBar');
  },
  methods: {
    // 选择图片
    chooseImage (callback, max = 9) {
      this.maxChooseImage = max;
      this.$refs.imageDialog.chooseImage(callback);
    },
    // 选择规格
    chooseSkus (callback) {
      this.$refs.skusDialog.chooseSkus(callback);
    }

  }
}
</script>

<style>
/* 滚动条样式 */
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, .1);
  border-radius: 0;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(0, 0, 0, .25);
  transition: color .2s ease;
}
</style>
