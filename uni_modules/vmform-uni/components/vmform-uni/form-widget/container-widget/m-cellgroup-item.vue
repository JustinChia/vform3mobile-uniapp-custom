<template>
  <container-item-wrapper :widget="widget">
    <uni-group :title="widget.options.label" :class="{ 'uni-group-noborder': !widget.options.border }" :mode="widget.options.inset ? 'card' : ''" top="20" style="margin-bottom: 20px">
      <view v-for="(subWidget, swIdx) in widget.widgetList" :key="swIdx">
        <vmformComponent :comp="subWidget.type" :field="subWidget" :parent-list="widget.widgetList" :index-of-parent-list="swIdx" :parent-widget="props.widget" :sub-form-row-id="subFormRowId" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" />
      </view>
    </uni-group>
  </container-item-wrapper>
</template>

<script setup>
import ContainerItemWrapper from './container-item-wrapper'

import { useContainer } from './containerItemMixin'

const props = defineProps({
  widget: {
    type: Object,
    default: () => {
      return { type: '', options: {} }
    },
  },
  parentWidget: {
    type: Object,
    default: () => {},
  },
  parentList: {
    type: Array,
    default: () => [],
  },
  indexOfParentList: {
    type: Number,
    default: 0,
  },
  subFormRowIndex: {
    /* 子表单组件行索引，从0开始计数 */
    type: Number,
    default: -1,
  },
  subFormColIndex: {
    /* 子表单组件列索引，从0开始计数 */
    type: Number,
    default: -1,
  },
  subFormRowId: {
    /* 子表单组件行Id，唯一id且不可变 */
    type: String,
    default: '',
  },
})

const { data, methodObjs } = useContainer({ componentType: 'ContainerItem', props })

var exposeObj = {}
// #ifdef VUE3
exposeObj = {
  ...data,
  ...methodObjs,
}
// #endif
defineExpose(exposeObj)
</script>

<style lang="scss" scoped></style>
