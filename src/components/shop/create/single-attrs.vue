<template>
  <el-form ref="form" label-width="80px">
    <el-form-item label="市场价格">
      <el-input type="number" :value="oprice" @input="vModel('oprice', $event)" placeholder="" class="w-25">
        <template slot="append">元</template>
      </el-input>

    </el-form-item>
    <el-form-item label="销售价格">
      <el-input type="number" :value="pprice" @input="vModel('pprice', $event)" placeholder="" class="w-25">
        <template slot="append">元</template>
      </el-input>

    </el-form-item>
    <el-form-item label="成本价格">
      <el-input type="number" :value="cprice" @input="vModel('cprice', $event)" placeholder="" class="w-25">
        <template slot="append">元</template>
      </el-input>

    </el-form-item>
    <el-form-item label="商品重量">
      <el-input type="number" :value="weight" @input="vModel('weight', $event)" placeholder="" class="w-25">
        <template slot="append">公斤</template>
      </el-input>

    </el-form-item>
    <el-form-item label="商品体积">
      <el-input type="number" :value="volumn" @input="vModel('volumn', $event)" placeholder="" class="w-25">
        <template slot="append">立方米</template>
      </el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import { mapState, mapMutations } from "vuex"
export default {
  data () {
    return {}
  },
  computed: {
    ...mapState({
      oprice: state => state.goods_create.oprice,
      pprice: state => state.goods_create.pprice,
      cprice: state => state.goods_create.cprice,
      weight: state => state.goods_create.weight,
      volumn: state => state.goods_create.volumn
    }),
  },
  methods: {
    ...mapMutations(['vModelState']),
    // 修改表单的值
    vModel (key, value) {
      this.vModelState({ key, value });
    },
  }
}
</script>
<style></style>