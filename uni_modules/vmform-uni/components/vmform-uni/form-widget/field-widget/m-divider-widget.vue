<template>
  <static-content-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <view ref="fieldEditor" class="divider-wrapper">
      <view class="divider-text" :class="['divider-text-' + field.options.contentPosition]">
        {{ methodObjs.fieldLabel() }}
      </view>
      <view class="divider-line" />
    </view>
  </static-content-wrapper>
</template>

<script setup>
import { useField } from './fieldMixin'

import StaticContentWrapper from './static-content-wrapper'

const props = defineProps({
  field: {
    type: Object,
    default: () => {},
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
  designer: {
    type: Object,
    default: () => {},
  },
  designState: {
    type: Boolean,
    default: false,
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

const emit = defineEmits(['props-changed'])
const fieldMixin = useField({
  componentType: 'FieldWidget',
  props,
  emit,
})
const { data, methodObjs } = fieldMixin

var exposeObj = {}
// #ifdef VUE3
exposeObj = {
  ...data,
  ...methodObjs,
}
// #endif
defineExpose(exposeObj)
</script>
<script>
export default {
  options: {
    styleIsolation: 'shared',
  },
}
</script>

<style scoped lang="scss">
// #ifdef VUE3
@use 'sass:math';

// #endif
.divider {
  position: relative;

  &-text {
    position: absolute;
    background: white;
    padding: 0px 20rpx;

    &-left {
      left: 40rpx;
    }

    &-right {
      right: 40rpx;
    }

    &-center {
      left: 50%;
      transform: translateX(-50%);
    }

    z-index: 11;
  }

  &-line {
    $lineWidth: 2rpx;
    position: absolute;
    top: 50%;
    left: 0px;
    right: 0px;
    // #ifdef VUE3
    margin-top: math.div($lineWidth, -2);
    // #endif
    // #ifndef VUE3
    margin-top: $lineWidth/-2;
    // #endif
    border: solid $lineWidth #f0f1f3;
    z-index: 10;
  }
}
</style>
