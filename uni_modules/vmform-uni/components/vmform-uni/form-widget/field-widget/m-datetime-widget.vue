<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <view class="field datetime-wrapper" :class="[inputAlignClass, inputBorder ? 'border' : '']">
      <uni-datetime-picker ref="fieldEditor" v-model="dateTime" type="datetime" return-type="string" :start="field.options.minDate" :end="field.options.maxDate" :disabled="field.options.disabled || field.options.readonly" @change="handlePickerChanged">
        <uni-easyinput :value="data.fieldModel" :inputBorder="false" :suffixIcon="!inputBorder && !methodObjs.showClearable() ? 'forward' : ''" :placeholder="field.options.placeholder" :disabled="true" :clearable="false" />
      </uni-datetime-picker>
      <text class="uni-icons uniui-clear content-clear-icon" v-show="methodObjs.showClearable()" @tap="clearFieldModel"> </text>
    </view>
    <template #readmode>
      {{ data.fieldModel }}
    </template>
  </form-item-wrapper>
</template>

<script setup>
import { useField } from './fieldMixin'
import { computed, ref } from '@/utils/vue.js'
import { formatDateTo, formatToUpper } from '../../utils/date-util'

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

const dateTime = ref('')
const actions = {}

const fieldMixin = useField({
  actions,
  componentType: 'FieldWidget',
  props,
  emit,
})

const { data, methodObjs, fieldWrapper, fieldEditor, inputBorder, inputAlignClass } = fieldMixin

const showPicker = () => {
  if (methodObjs.fieldDisabled() || methodObjs.fieldReadonly()) return
  fieldEditor.value.show()
}

const clearFieldModel = () => {
  methodObjs.setValue(null)
}

const handlePickerChanged = value => {
  value = formatDateTo(value, formatToUpper(props.field.options.format))
  methodObjs.handleDatePickerSelectEvent(value, 'YYYY-MM-DD HH:mm:ss')
}

actions.setFieldModel = newValue => {
  data.fieldModel = formatDateTo(newValue, formatToUpper(props.field.options.format))
  dateTime.value = formatDateTo(newValue, formatToUpper(props.field.options.format), 'YYYY-MM-DD HH:mm:ss')
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
.datetime-wrapper {
  display: flex;
  align-items: center;
}
</style>
