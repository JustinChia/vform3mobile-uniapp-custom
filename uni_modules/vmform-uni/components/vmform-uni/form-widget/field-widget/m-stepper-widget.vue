<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <view class="field stepper-wrapper" :class="[inputAlignClass]">
      <uni-number-box
        ref="fieldEditor"
        v-model="data.fieldModel"
        type="number"
        :disabled="methodObjs.fieldDisabled() || methodObjs.fieldReadonly()"
        :max="max"
        :min="min"
        :step="field.options.step || 1"
        :class="{ fieldReadonly: methodObjs.fieldReadonly(), 'is-focus': methodObjs.isFocus() }"
        @focus="methodObjs.handleFocusCustomEvent"
        @blur="methodObjs.handleBlurCustomEvent"
        @change="methodObjs.handleChangeEvent"
        @input="methodObjs.handleInputEvent"
      />
    </view>
    <template #readmode>
      {{ data.fieldModel }}
    </template>
  </form-item-wrapper>
</template>

<script setup>
import { useField } from './fieldMixin'
import { computed } from '../../utils/vueBuilder.js'
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
    /* 子表单组件行索引，从0开始计数 */ type: Number,
    default: -1,
  },
  subFormColIndex: {
    /* 子表单组件列索引，从0开始计数 */ type: Number,
    default: -1,
  },
  subFormRowId: {
    /* 子表单组件行Id，唯一id且不可变 */ type: String,
    default: '',
  },
})

const emit = defineEmits(['props-changed'])
const fieldMixin = useField({ componentType: 'FieldWidget', props, emit })
const { data, methodObjs, fieldWrapper, fieldEditor, inputAlignClass } = fieldMixin

var exposeObj = {}
// #ifdef VUE3
exposeObj = {
  ...data,
  ...methodObjs,
}
// #endif
defineExpose(exposeObj)

const min = computed(() => {
  if (props.field.options.min == undefined || props.field.options.min == null) {
    return Math.min(-100000000000, Number.MIN_SAFE_INTEGER)
  } else {
    return props.field.options.min
  }
})
const max = computed(() => {
  if (props.field.options.max == undefined || props.field.options.max == null) {
    return Math.max(100000000000, Number.MAX_SAFE_INTEGER)
  } else {
    return props.field.options.max
  }
})
</script>
<script>
export default {
  options: {
    styleIsolation: 'shared',
  },
}
</script>

<style lang="scss" scoped>
.stepper-wrapper {
  display: flex;
  align-items: center;

  ::v-deep .uni-input-input {
    text-align: center;
  }
  :deep(.uni-input-input) {
    text-align: center;
  }
}
</style>
