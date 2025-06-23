<template>
  <static-content-wrapper :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <uni-notice-bar
      :single="true"
      :color="theme.color"
      :background-color="theme.backgroundColor"
      :show-icon="field.options.showIcon"
      :show-close="field.options.closable"
      :text="field.options.title"
      @click="e => methodObjs.handleEmitEvent({}, 'onClick')"
      @close="e => methodObjs.handleEmitEvent({}, 'onClose')"
    />
  </static-content-wrapper>
</template>

<script setup>
import { computed } from '../../utils/vueBuilder.js'
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

const theme = computed({
  get: () => {
    if (props.field.options.type === 'success') {
      return {
        color: 'white',
        backgroundColor: '#95D475',
      }
    } else if (props.field.options.type === 'warning') {
      return {
        color: 'white',
        backgroundColor: '#EEBE77',
      }
    } else if (props.field.options.type === 'error') {
      return {
        color: 'white',
        backgroundColor: '#F89898',
      }
    } else {
      return {
        color: '#646566',
        backgroundColor: '#DCDEE0',
      }
    }
  },
})

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

<style scoped></style>
