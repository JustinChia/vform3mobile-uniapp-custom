<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <view class="field rate-wrapper" :class="[inputAlignClass]">
      <!-- Vue2 App属性的绑定中使用 变量 或者computed 不刷新，需要使用函数才行 -->
      <uni-rate ref="fieldEditor" v-model="data.fieldModel" class="stars" :class="{ 'is-focus': methodObjs.isFocus() }" :disabled="methodObjs.fieldDisabled()" :allow-half="field.options.allowHalf" :readonly="methodObjs.fieldReadonly()" :max="field.options.max" @change="onRateChanged" />
      <span v-if="field.options.showScore" class="score">{{ data.fieldModel }}</span>
    </view>
    <template #readmode>
      {{ data.fieldModel }}
    </template>
  </form-item-wrapper>
</template>

<script setup>
import { useField } from './fieldMixin'
import { ref } from '@/utils/vue.js'

import FormItemWrapper from './form-item-wrapper'

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
const actions = {}

const fieldMixin = useField({
  actions,
  componentType: 'FieldWidget',
  props,
  emit,
})
const { data, methodObjs, fieldWrapper, fieldEditor, inputAlignClass } = fieldMixin

const onRateChanged = val => {
  methodObjs.handleChangeEvent(val.value)
}

actions.setFieldModel = newValue => {
  data.fieldModel = newValue
}

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

<style lang="scss" scoped>
.rate-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
}

.stars {
  display: inline-block;
}

.score {
  display: inline-block;
  margin-left: 20rpx;
}
</style>
