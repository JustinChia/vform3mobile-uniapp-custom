<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <view class="field calendar-wrapper" @tap="showPicker" :class="[inputAlignClass, inputBorder ? 'border' : '']">
      <uni-easyinput
        ref="fieldEditor"
        :value="data.fieldModel"
        :placeholder="field.options.placeholder"
        :readonly="true"
        :disabled="true"
        :clearable="false"
        :prefix-icon="field.options.leftIcon"
        :suffix-icon="field.options.rightIcon"
        :inputBorder="false"
        :suffixIcon="!inputBorder && !methodObjs.showClearable() ? 'forward' : ''"
      />
      <uni-popup ref="popup_picker" :mask-click="true">
        <uni-calendar ref="fieldEditor" type="date" :start-date="field.options.minDate" :end-date="field.options.maxDate" :lunar="true" :date="dateTime" :placeholder="field.options.placeholder" @change="calendarSelected"> </uni-calendar>
      </uni-popup>
      <text class="uni-icons uniui-clear content-clear-icon" v-show="methodObjs.showClearable()" @tap.stop="clearFieldModel"> </text>
    </view>
    <template #readmode>
      {{ data.fieldModel }}
    </template>
  </form-item-wrapper>
</template>

<script setup>
import { ref } from '../../utils/vueBuilder.js'
import { useField } from './fieldMixin'

import FormItemWrapper from './form-item-wrapper'
import { formatDateTo } from '../../utils/date-util'

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
  componentType: 'FieldWidget',
  props,
  emit,
  actions,
})
const { data, methodObjs, fieldWrapper, fieldEditor, inputBorder, inputAlignClass } = fieldMixin

const popup_picker = ref()
const showPicker = () => {
  if (methodObjs.fieldDisabled() || methodObjs.fieldReadonly()) return
  popup_picker.value.open()
}

const calendarSelected = val => {
  let value = val.fulldate
  value = formatDateTo(value, props.field.options.format)
  methodObjs.handleDatePickerSelectEvent(value, '')
  popup_picker.value.close()
}

const clearFieldModel = () => {
  methodObjs.setValue(null)
}

actions.setFieldModel = newValue => {
  data.fieldModel = formatDateTo(newValue, props.field.options.format)
  dateTime.value = formatDateTo(newValue, props.field.options.format, 'YYYY-MM-DD')
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
.calendar-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  min-height: 35px;
  line-height: 35px;
}
</style>
