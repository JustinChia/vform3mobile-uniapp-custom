<template>
  <static-content-wrapper
    ref="fieldWrapper"
    :designer="designer"
    :field="field"
    :design-state="designState"
    :display-style="field.options.displayStyle"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :sub-form-row-index="subFormRowIndex"
    :sub-form-col-index="subFormColIndex"
    :sub-form-row-id="subFormRowId"
  >
    <button ref="fieldEditor" :type="field.options.type" size="mini" :plain="field.options.plain" :round="field.options.round" :icon="field.options.icon" :disabled="methodObjs.fieldDisabled()" native-type="button" class="mini-button" @click="methodObjs.handleButtonClickEvent">
      <text class="button-text" :class="{ disabled: methodObjs.fieldDisabled() }">{{ field.options.label }}</text>
    </button>
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
const { data, methodObjs, fieldWrapper, fieldEditor } = fieldMixin

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

<style scoped>
.mini-button {
  border-radius: 8rpx;
}
.button-text.disabled {
  color: #eeee !important;
}
</style>
