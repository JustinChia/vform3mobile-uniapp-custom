<!--
/**
 * author: vformAdmin
 * email: vdpadmin@163.com
 * website: https://www.vform666.com
 * date: 2021.08.18
 * remark: 如果要分发VForm源码，需在本文件顶部保留此文件头信息！！
 */
-->
<template>
  <view v-if="!props.widget.options.hidden" class="container-wrapper" :class="[props.widget.type, props.widget.options.name]">
    <slot />
  </view>
</template>

<script setup>
const props = defineProps({
  widget: {
    type: Object,
    default: () => {
      return {
        type: '',
        options: {},
      }
    },
  },
})
</script>
<style lang="scss" scoped>
.m-cell-group {
  margin-bottom: 40rpx !important;
}
.uni-group-noborder {
  box-shadow: none;
}
</style>
