<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <!-- 默认 default -->
    <view class="field" :class="[inputAlignClass]">
      <uni-data-checkbox
        v-show="field.options.optionItems.length > 0"
        ref="fieldEditor"
        v-model="data.fieldModel"
        :mode="mode"
        :localdata="methodObjs.getOptions()"
        :disabled="methodObjs.fieldDisabled() || methodObjs.fieldReadonly()"
        :class="{ fieldReadonly: methodObjs.fieldReadonly(), 'is-focus': methodObjs.isFocus() }"
        @change="methodObjs.handleRadioSelectEvent"
      />
    </view>
    <template #readmode>
      <view class="field readonly" :class="[inputAlignClass]">
        {{ methodObjs.optionItemDisplayValue() }}
      </view>
    </template>
  </form-item-wrapper>
</template>

<script setup>
import { computed } from '../../utils/vueBuilder.js'
import { useField } from './fieldMixin'

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
const fieldMixin = useField({
  componentType: 'FieldWidget',
  props,
  emit,
})
const { data, methodObjs, fieldWrapper, fieldEditor, inputAlignClass } = fieldMixin

const mode = computed(() => {
  return props.field.options.direction === 'horizontal' ? 'default' : 'list'
})

methodObjs.initOptionItems()

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

<style lang="scss" scoped></style>
