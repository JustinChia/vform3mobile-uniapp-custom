<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget"
    :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex"
    :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <!-- 默认 default -->
    <view class="field" :class="[inputAlignClass]">
      <!-- 新的自定义选择器 -->
      <custom-picker v-show="field.options.optionItems.length > 0"
        ref="customPicker" v-model="data.fieldModel" :options="methodObjs.getOptions()"
        :disabled="methodObjs.fieldDisabled() || methodObjs.fieldReadonly()"
        :placeholder="field.options.placeholder || '请选择'" :title="field.options.title || field.options.label"
        :multiple="false" style="width:100%"
        :field="field"
        :class="{ fieldReadonly: methodObjs.fieldReadonly(), 'is-focus': methodObjs.isFocus() }"
        @change="methodObjs.handleCustomPickerChange"
        @show-image-preview="showImagePreview">
        <!-- 自定义显示内容 -->
        <template #display="{ displayText }">
          <view class="radio-display" :class="{ 'is-placeholder': !displayText }">
            {{ displayText || field.options.placeholder || '请选择' }}
          </view>
        </template>
      </custom-picker>

      <!-- 原有的uni-data-checkbox -->
      <!-- <uni-data-checkbox v-else v-show="field.options.optionItems.length > 0" ref="fieldEditor"
        v-model="data.fieldModel" :mode="mode" :localdata="methodObjs.getOptions()"
        :disabled="methodObjs.fieldDisabled() || methodObjs.fieldReadonly()"
        :class="{ fieldReadonly: methodObjs.fieldReadonly(), 'is-focus': methodObjs.isFocus() }"
        @change="methodObjs.handleRadioSelectEvent" /> -->
    </view>
    <template #readmode>
      <view class="field readonly" :class="[inputAlignClass]">
        {{ methodObjs.optionItemDisplayValue() }}
      </view>
    </template>

    <!-- 图片预览组件 -->
    <ImagePreview 
      :visible="imagePreviewVisible" 
      :image-url="previewImageUrl" 
      @close="closeImagePreview" />
  </form-item-wrapper>
</template>

<script setup>
import { computed, ref, watch } from '../../utils/vueBuilder.js'
import { useField } from './fieldMixin'

import FormItemWrapper from './form-item-wrapper'
import CustomPicker from './custom-picker.vue'
import ImagePreview from './image-preview.vue'

// 状态管理
const imagePreviewVisible = ref(false)
const previewImageUrl = ref('')

const props = defineProps({
  field: {
    type: Object,
    default: () => { },
  },
  parentWidget: {
    type: Object,
    default: () => { },
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
    default: () => { },
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

const mode = computed(() => {
  return props.field.options.direction === 'horizontal' ? 'default' : 'list'
})

methodObjs.initOptionItems()

// 处理示例图预览
const showImagePreview = (imageUrl) => {
  previewImageUrl.value = imageUrl
  imagePreviewVisible.value = true
}

watch(()=>data.fieldModel,(newVal,oldVal)=>{
  console.error('fieldModel变更',newVal,oldVal)
})


// 关闭图片预览
const closeImagePreview = () => {
  imagePreviewVisible.value = false
  previewImageUrl.value = ''
}



var exposeObj = {}
// #ifdef VUE3
exposeObj = {
  ...data,
  ...methodObjs
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
.radio-display {
  padding: 10px;
  padding-right: 0px;
  border: 0px none;
  box-sizing: border-box;
  background-color: #fff;
  color: #333;
  min-height: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 24rpx;
  width: 100%;
  text-align:right;
  
  &.is-placeholder {
    color: #999;
  }
}

.fieldReadonly .radio-display {
  background-color: #f5f5f5;
  color: #999;
}

.is-focus .radio-display {
  border-color: #EEC23D;
}


</style>
