<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <view class="field date-wrapper" :class="[inputAlignClass, inputBorder ? 'border' : '']">
      <!--
		说明：
			1. datetime-picker无法定义显示格式，因此使用slot嵌套input的方式
			2. input自带的clearable属性会触发uni-datetime-picker弹出日期选择，因此重写了清空图标并放在datetime-picker组件外部
			3. easyinput readonly模式仍然会显示光标，因此用了disabled:true, 用样式把disable深灰色背景改成白色
			4. uni-datetime-picker 必须使用v-model才能回显数据 ，所以额外添加了dateTime
			5. 使用slot会导致在PC端和微信浏览器H5时无法弹出，需要加上pointer-events: none; (加在globalField_vueX.scss里了)
		问题：
			1. 选择器弹窗的数据回显只有第一次有效，与uni-datetime-picker组件有关.
		-->
      <uni-datetime-picker ref="fieldEditor" v-model="dateTime" type="date" return-type="string" :start="field.options.minDate" :end="field.options.maxDate" :disabled="field.options.disabled || field.options.readonly" @change="handlePickerChanged">
        <uni-easyinput :value="data.fieldModel" :inputBorder="false" :suffixIcon="!inputBorder && !methodObjs.showClearable() ? 'forward' : ''" :placeholder="field.options.placeholder" :disabled="true" />
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
import { computed, ref } from '../../utils/vueBuilder.js'
import { formatDateTo, formatToUpper } from '../../utils/date-util'

import FormItemWrapper from './form-item-wrapper'
import uniIcons from '@/uni_modules/uni-icons/components/uni-icons/uni-icons'

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
const { data, methodObjs, fieldWrapper, fieldEditor, showClearable, inputBorder, inputAlignClass } = fieldMixin

const showPicker = () => {
  if (methodObjs.fieldDisabled() || methodObjs.fieldReadonly()) return
  fieldEditor.value.show()
}

const clearFieldModel = () => {
  methodObjs.setValue(null)
}

const handlePickerChanged = value => {
  value = formatDateTo(value, formatToUpper(props.field.options.format), 'YYYY-MM-DD')
  methodObjs.handleDatePickerSelectEvent(value, 'YYYY-MM-DD')
}

actions.setFieldModel = newValue => {
  data.fieldModel = formatDateTo(newValue, formatToUpper(props.field.options.format), 'YYYY-MM-DD')
  dateTime.value = formatDateTo(newValue, formatToUpper(props.field.options.format), 'YYYY-MM-DD')
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
.date-wrapper {
  display: flex;
  align-items: center;
}
</style>
