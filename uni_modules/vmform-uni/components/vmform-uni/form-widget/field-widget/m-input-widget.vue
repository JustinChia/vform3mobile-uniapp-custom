<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <view class="field" :class="[inputAlignClass, inputBorder == true ? 'border' : '', field.options.appendButton ? 'show-append-button' : '']">
      <!-- 为了对齐clear按钮，不使用easyinput的clearable 和inputborder属性 -->
      <uni-easyinput
        ref="data.fieldEditor"
        v-model="data.fieldModel"
        :focus="methodObjs.isFocus()"
        :type="field.options.type"
        :disabled="methodObjs.fieldDisabled() || methodObjs.fieldReadonly()"
        :clearable="false"
        :placeholder="field.options.placeholder"
        :prefix-icon="field.options.leftIcon"
        :suffix-icon="field.options.rightIcon"
        :maxlength="field.options.maxLength || 10000"
        :inputBorder="false"
        :class="{ fieldReadonly: methodObjs.fieldReadonly(), 'is-focus': methodObjs.isFocus(), 'show-append-button': field.options.appendButton }"
        @focus="methodObjs.handleFocusCustomEvent"
        @blur="methodObjs.handleBlurCustomEvent"
        @change="methodObjs.handleChangeEvent"
        @input="methodObjs.handleInputEvent"
      />
      <button v-if="methodObjs.getAppendButtonVisible()" type="primary" size="mini" :icon="field.options.icon" :disabled="methodObjs.appendButtonDisabled()" native-type="button" class="mini-button" @click="methodObjs.handleAppendButtonClickEvent">
        <icon type="search" class="append-button-icon" size="14" color="white" /><text v-if="appendTextButton">{{ appendTextButton }}</text>
      </button>
      <text class="uni-icons uniui-clear content-clear-icon" v-show="methodObjs.showClearable()" @tap="clearFieldModel"> </text>
    </view>
    <template #readmode>
      <view class="field readonly" :class="[inputAlignClass]">
        {{ data.fieldModel }}
      </view>
    </template>
  </form-item-wrapper>
</template>
<script setup>
import { ref, watch } from '../../utils/vueBuilder'
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
const { data, methodObjs, fieldWrapper, fieldEditor, setFieldWrapper, inputBorder, appendTextButton, inputAlignClass } = fieldMixin

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

.show-append-button ::v-deep .is-input-border {
  border-radius: 8rpx 0 0 8rpx !important;
}

// #ifndef VUE3
.input-border ::v-deep .mini-button {
  border-radius: 0 8rpx 8rpx 0;
}
// #endif
// #ifdef VUE3
.input-border :deep(.mini-button) {
  border-radius: 0 8rpx 8rpx 0;
}
// #endif

.mini-button {
  height: 67rpx;
  line-height: 67rpx;
  display: flex;
  align-content: center;
  justify-content: center;
  // border-radius: 0 8rpx 8rpx 0;
}

.append-button-icon {
  display: inline-flex;
  align-items: center;
  height: 67rpx;
  line-height: 67rpx;
  vertical-align: middle;
  // #ifdef MP-WEIXIN
  line-height: 3rem;
  // #endif
}
</style>
