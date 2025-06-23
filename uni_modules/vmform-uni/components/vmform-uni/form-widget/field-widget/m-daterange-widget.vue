<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <view class="field daterange-wrapper" :class="[inputAlignClass, inputBorder ? 'border' : '']">
      <uni-datetime-picker ref="fieldEditor" v-model="dateTime" type="daterange" return-type="string" :start="field.options.minDate" :end="field.options.maxDate" :disabled="field.options.disabled || field.options.readonly" @change="handlePickerChanged">
        <uni-easyinput :value="displayValue" :inputBorder="false" :placeholder="placeHolder" :suffixIcon="!inputBorder && !methodObjs.showClearable() ? 'forward' : ''" :disabled="true" :clearable="false" />
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
import { formatDateTo } from '../../utils/date-util'

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

const dateTime = ref([])
const actions = {}

const widgetData = {
  dataRange: null,
}
const fieldMixin = useField({
  actions,
  componentType: 'FieldWidget',
  widgetData,
  props,
  emit,
})
const { data, methodObjs, fieldWrapper, fieldEditor, inputBorder, inputAlignClass } = fieldMixin

const clearFieldModel = () => {
  methodObjs.setValue(null)
}

const handlePickerChanged = e => {
  methodObjs.setValue(e)
  methodObjs.handleDatePickerSelectEvent(data.fieldModel)
}

actions.setFieldModel = newValue => {
  if (newValue && Array.isArray(newValue) && newValue.length == 2) {
    data.fieldModel = newValue.map(x => formatDateTo(x, props.field.options.format, 'YYYY-MM-DD')).join('~')
    dateTime.value = [formatDateTo(newValue[0], props.field.options.format, 'YYYY-MM-DD'), formatDateTo(newValue[1], props.field.options.format, 'YYYY-MM-DD')]
  } else {
    data.fieldModel = ''
    dateTime.value = []
  }
}

const displayValue = computed(() => {
  if (Array.isArray(data.fieldModel)) {
    return data.fieldModel.map(x => formatDateTo(x, props.field.options.format, 'YYYY-MM-DD')).join('~')
  } else {
    return data.fieldModel
  }
})

const placeHolder = computed(() => {
  if (props.field.options.startPlaceholder && props.field.options.endPlaceholder) {
    return `${props.field.options.startPlaceholder} ~ ${props.field.options.endPlaceholder}`
  } else if (props.field.options.startPlaceholder) {
    return props.field.options.startPlaceholder
  } else if (props.field.options.endPlaceholder) {
    return props.field.options.endPlaceholder
  }
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

<style scoped lang="scss">
.daterange-wrapper {
  display: flex;
  align-items: center;
}
</style>
