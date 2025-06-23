<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <view class="field" :class="[inputAlignClass, inputBorder == true ? 'border' : '']">
      <uni-easyinput
        ref="fieldEditor"
        v-model="data.fieldModel"
        type="number"
        :focus="methodObjs.isFocus()"
        :disabled="methodObjs.fieldDisabled() || methodObjs.fieldReadonly()"
        :clearable="false"
        :placeholder="field.options.placeholder"
        :prefix-icon="field.options.leftIcon"
        :suffix-icon="field.options.rightIcon"
        confirm-type="send"
        :maxlength="field.options.maxLength || 10000"
        :inputBorder="false"
        :class="{ fieldReadonly: methodObjs.fieldReadonly(), 'is-focus': methodObjs.isFocus() }"
        @focus="methodObjs.handleFocusCustomEvent"
        @blur="methodObjs.handleBlurCustomEvent"
        @change="methodObjs.handleChangeEvent"
        @input="methodObjs.handleInputEvent"
      />
      <text class="uni-icons uniui-clear content-clear-icon" v-show="methodObjs.showClearable()" @tap="clearFieldModel"></text>
    </view>
    <template #readmode>
      {{ data.fieldModel }}
    </template>
  </form-item-wrapper>
</template>

<script setup>
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
const { data, methodObjs, fieldWrapper, fieldEditor, inputBorder, inputAlignClass } = fieldMixin

const clearFieldModel = () => {
  methodObjs.setValue(null)
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

<style lang="scss">
.field {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
