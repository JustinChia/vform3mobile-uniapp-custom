<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <view v-if="field.options.range" style="width: 100%" :class="{ 'is-focus': methodObjs.isFocus(), disabled: methodObjs.fieldDisabled(), readonly: methodObjs.fieldReadonly() }">
      <sRegionSlider ref="fieldEditor" :min-value="rangeMinValue" :max-value="rangeMaxValue" :fill-min-value="field.options.min" :fill-value="field.options.max" :step="field.options.step" :block-size="20" @up="sliderValueChange" />
      <view class="disabled-mask" />
    </view>
    <view v-else style="width: 100%" :class="{ 'is-focus': methodObjs.isFocus(), disabled: methodObjs.fieldDisabled() }">
      <slider ref="fieldEditor" :value="data.fieldModel" :disabled="methodObjs.fieldDisabled() || methodObjs.fieldReadonly()" :block-size="20" show-value @change="sliderValueChange" />
      <view class="disabled-mask" />
    </view>
    <template #readmode>
      <template v-if="field.options.range">
        {{ data.fieldModel ? data.fieldModel.join('~') : `${rangeMinValue}~${rangeMaxValue}` }}
      </template>
      <template v-else>
        {{ data.fieldModel }}
      </template>
    </template>
  </form-item-wrapper>
</template>
<script>
export default {
  options: {
    styleIsolation: 'shared',
  },
}
</script>
<script setup>
import { computed } from '../../utils/vueBuilder.js'
import { useField } from './fieldMixin'

import FormItemWrapper from './form-item-wrapper'
// 使用了sRengionSlider组件并修改了样式
// https://ext.dcloud.net.cn/plugin?id=5093
import sRegionSlider from '@/uni_modules/s-region-slider/s-region-slider.vue'

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

const rangeMinValue = computed(() => {
  if (!data.fieldModel || !Array.isArray(data.fieldModel) || data.fieldModel.length < 2) {
    return props.field.options.min
  } else {
    return data.fieldModel[0]
  }
})

const rangeMaxValue = computed(() => {
  if (!data.fieldModel || !Array.isArray(data.fieldModel) || data.fieldModel.length < 2) {
    return props.field.options.max
  } else {
    return data.fieldModel[1]
  }
})

const sliderValueChange = e => {
  if (props.field.options.range) {
    data.fieldModel = [e.custom.minValue, e.custom.maxValue]
  } else {
    data.fieldModel = e.detail.value
  }
  methodObjs.handleChangeEvent(data.fieldModel)
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
<style lang="scss" scoped>
@import '../styles/variables.scss';

.slider-wrapper {
  display: inline-flex;
  position: relative;

  ::v-deep uni-slider {
    margin-left: 0px;
    margin-right: 0px;
    width: 100%;
  }
  :deep(uni-slider) {
    margin-left: 0px;
    margin-right: 0px;
    width: 100%;
  }
}

.slider-wrapper.disabled {
  ::v-deep .fj-touch-right {
    background-color: $field-disable-background !important;
  }

  ::v-deep .fj-touch-left {
    background-color: $field-disable-background !important;
  }

  ::v-deep .fj-line-pull {
    background-color: $field-disable-background-deep !important;
  }

  ::v-deep .uni-slider-thumb {
    background-color: $field-disable-background !important;
  }

  ::v-deep .uni-slider-handle-wrapper,
  ::v-deep .uni-slider-track {
    background-color: $field-disable-background-deep !important;
  }

  .disabled-mask {
    display: block;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    z-index: 100;
  }
}

.slider-wrapper.readonly {
  .disabled-mask {
    display: block;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    z-index: 100;
  }
}
</style>
