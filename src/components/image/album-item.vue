<template>
  <li class="list-group-item list-group-item-action d-flex align-items-center" @click.stop="$emit('change', index)"
    :class="{ 'active sum-active': active }" style="cursor: pointer;">
    {{ item.name }}

    <span class="btn btn-light btn-sm border ml-auto" v-if="!showOption">
      {{ item.images_count }}</i>
    </span>

    <el-dropdown class="ml-auto" v-else>
      <span class="btn btn-light btn-sm border">
        {{ item.images_count }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.stop.native="$emit('edit', { item, index })">修改</el-dropdown-item>
        <el-dropdown-item @click.stop.native="$emit('del', index)">删除</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </li>
</template>
<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },
    item: Object,
    index: Number,
    showOption: {
      type: Boolean,
      default: true
    }
  },
  methods: {
  }
}
</script>
<style></style>