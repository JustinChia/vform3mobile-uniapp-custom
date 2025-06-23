<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <view class="field switch-wrapper" :class="{ [inputAlignClass]: true, fieldDisabled: methodObjs.fieldDisabled() }">
      <text v-if="inactiveText !== ''" class="switch-label" :class="{ diabled: methodObjs.fieldDisabled() || methodObjs.fieldReadonly(), active: !checked() }" :style="{ color: inactiveColor }">
        {{ inactiveText }}
      </text>
      <switch ref="fieldEditor" :checked="checked()" :color="field.options.activeColor" style="transform: scale(0.65)" :class="{ 'is-focus': methodObjs.isFocus() }" :disabled="methodObjs.fieldDisabled() || methodObjs.fieldReadonly()" @change="switcherChange" />
      <text v-if="activeText" class="switch-label" :class="{ diabled: methodObjs.fieldDisabled() || methodObjs.fieldReadonly(), active: checked() }" :style="{ color: activeColor }">
        {{ activeText }}
      </text>
    </view>
    <template #readmode>
      {{ methodObjs.switchDisplayValue() }}
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

const checked = () => {
  return data.fieldModel === props.field.options.activeValue
}

const switcherChange = val => {
  if (val.detail.value) {
    data.fieldModel = props.field.options.activeValue
  } else {
    data.fieldModel = props.field.options.inactiveValue
  }
  methodObjs.handleChangeEvent(data.fieldModel)
}

const activeText = computed(() => {
  if (props.field.options.activeLabel !== undefined) {
    return props.field.options.activeLabel || props.field.options.activeValue
  } else {
    return props.field.options.activeText || props.field.options.activeValue
  }
})
const inactiveText = computed(() => {
  if (props.field.options.inactiveLabel !== undefined) {
    return props.field.options.inactiveLabel || props.field.options.inactiveValue
  } else {
    return props.field.options.inactiveText || props.field.options.inactiveValue
  }
})

const activeColor = computed(() => {
  return checked() === true ? props.field.options.activeColor || 'var(--primary-color)' : undefined
})
const inactiveColor = computed(() => {
  return checked() === false ? props.field.options.inactiveColor || 'var(--primary-color)' : undefined
})

var exposeObj = {}
// #ifdef VUE3
exposeObj = {
  ...data,
  ...methodObjs,
  activeText,
  inactiveText,
  activeColor,
  inactiveColor,
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
.switch-wrapper {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;

  .switch-label {
    display: inline-block;
  }
}
</style>
