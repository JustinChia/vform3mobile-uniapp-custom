<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <view class="field" :class="{ [inputAlignClass]: true, 'input-border': inputBorder, 'show-append-button': field.options.appendButton }" :style="{ height: rowHeight }">
      <uni-easyinput
        ref="fieldEditor"
        v-model="data.fieldModel"
        :focus="methodObjs.isFocus()"
        type="textarea"
        :disabled="methodObjs.fieldDisabled() || methodObjs.fieldReadonly()"
        :class="{ fieldReadonly: methodObjs.fieldReadonly(), 'is-focus': methodObjs.isFocus() }"
        :auto-height="!rowHeight || field.options.rows == 0"
        :clearable="field.options.clearable"
        :placeholder="field.options.placeholder"
        :prefix-icon="field.options.leftIcon"
        :suffix-icon="field.options.rightIcon"
        :maxlength="field.options.maxLength || 10000"
        :inputBorder="inputBorder"
        style="height: 100%"
        @focus="methodObjs.handleFocusCustomEvent"
        @blur="methodObjs.handleBlurCustomEvent"
        @change="methodObjs.handleChangeEvent"
        @input="methodObjs.handleInputEvent"
      />
    </view>
    <view v-if="field.options.maxLength" class="text-count">{{ data.fieldModel.length }}/{{ field.options.maxLength }}</view>
    <template #readmode>
      {{ data.fieldModel }}
    </template>
  </form-item-wrapper>
</template>

<script setup>
import { useField } from './fieldMixin'
import { computed } from '../../utils/vueBuilder'
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
  actions: {
    buildFieldRules: rules => {
      rules.push({
        validateFunction: (rule, value, callback) => {
          if (value && value.length < props.field.options.minLength) {
            return `长度必须大于${props.field.options.minLength}个字符`
          } else {
            return true
          }
        },
        trigger: ['blur', 'change'],
        label: props.field.options.label,
      })
    },
  },
})
const { data, methodObjs, fieldWrapper, fieldEditor, inputBorder, inputAlignClass } = fieldMixin

const rowHeight = computed(() => {
  if (props.field.options.rows < 4) return undefined
  return 39 * props.field.options.rows + 'rpx'
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

<style lang="scss" scoped>
.field {
  ::v-deep .uni-easyinput__content {
    height: 100%;
    .uni-easyinput__content-textarea {
      margin: 0px;
    }
    textarea {
      height: 100%;
    }
  }

  :deep(.uni-easyinput__content) {
    height: 100%;
    .uni-easyinput__content-textarea {
      margin: 0px;
    }
    textarea {
      height: 100%;
    }
  }
}
::v-deep .uni-forms-item__content {
  flex-direction: column;
  .text-count {
    width: 100%;
    text-align: right;
    color: #999999;
  }
}
:deep(.uni-forms-item__content) {
  flex-direction: column;
  .text-count {
    width: 100%;
    text-align: right;
    color: #999999;
  }
}
</style>
