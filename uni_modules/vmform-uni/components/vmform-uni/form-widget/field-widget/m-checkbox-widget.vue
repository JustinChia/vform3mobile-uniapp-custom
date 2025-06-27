<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <!-- 按钮显示模式 -->
    <view class="field" :class="[inputAlignClass]">
      <view class="checkbox-button-container">
        <view v-for="(option, index) in methodObjs.getOptions()" :key="option.value" class="checkbox-button" :class="{ 
            'selected': isSelected(option.value), 
            'disabled': option.disable || methodObjs.fieldDisabled() || methodObjs.fieldReadonly() 
          }" @click="handleButtonClick(option)">
          <view class="button-content">
            <view class="option-name">{{ option.text }}</view>
            <view v-if="isSelected(option.value) && getAdditionalInfo(option.value)" class="additional-info">
              {{ getAdditionalInfo(option.value) }}
            </view>
          </view>
        </view>
      </view>
    </view>

    <template #readmode>
      <view class="field readonly" :class="[inputAlignClass]">
        {{ methodObjs.optionItemDisplayValue() }}
      </view>
    </template>

    <!-- 确认操作弹窗 -->
    <uni-popup ref="confirmPopup" type="bottom" background-color="#fff" border-radius="10px 10px 0 0">
      <view class="confirm-dialog">
        <view class="dialog-title">{{ currentOption?.text || '选项' }}</view>
        <view class="dialog-content">该选项已有配置数据，请选择操作：</view>
        <view class="dialog-actions">
          <view class="dialog-btn cancel" @click="clearAdditionalData">清空数据</view>
          <view class="dialog-btn confirm" @click="editAdditionalData">编辑数据</view>
        </view>
      </view>
    </uni-popup>

    <!-- 附加组件弹窗 -->
    <uni-popup ref="additionalPopup" type="bottom" background-color="#fff" border-radius="10px 10px 0 0">
      <view class="additional-popup-wrapper">
        <view class="popup-header">
          <view class="popup-title">
            <view class="title-content">
              <view v-if="currentOption?.exampleImage" class="example-image-btn" @click="showImagePreview(currentOption.exampleImage)">示例图</view>
              <view class="option-text">{{ currentOption?.text || '附加信息' }}</view>
            </view>
          </view>
          <view class="popup-actions">
            <view class="popup-btn cancel" @click="cancelAdditional">取消</view>
            <view class="popup-btn confirm" @click="confirmAdditional">确定</view>
          </view>
        </view>
        
        <view v-if="currentOption?.tooltip" class="popup-desc">
          {{currentOption?.tooltip}}
        </view>

        <view class="popup-content">
          <uni-forms ref="popupForm" :model="popupFormData">
            <additional-components v-if="currentOption" :item="currentOption" :selected-value="getSelectedValueForOption(currentOption.value)" :additional-expanded="true" @update-additional="updateAdditionalData" />
          </uni-forms>
        </view>
      </view>
    </uni-popup>

    <!-- 图片预览弹窗 -->
    <view v-if="imagePreviewVisible" class="image-preview-modal" @click="closeImagePreview">
      <image :src="previewImageUrl" mode="widthFix" style="height:80vw;border-radius:16rpx;" />
      <view class="close-btn" @click="closeImagePreview">
        <uni-icons type="closeempty" size="18" color="#FFFFFF"></uni-icons>
      </view>
    </view>
  </form-item-wrapper>
</template>
<script setup>
import { computed, ref } from '../../utils/vueBuilder.js'
import { useField } from './fieldMixin'

import FormItemWrapper from './form-item-wrapper'
import AdditionalComponents from './additional-components.vue'

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

// 附加组件相关状态
const additionalPopup = ref(null)
const confirmPopup = ref(null)
const popupForm = ref(null)
const currentOption = ref(null)
const tempAdditionalData = ref(null)

// 图片预览相关状态
const imagePreviewVisible = ref(false)
const previewImageUrl = ref('')

// 存储每个选项的附加数据
const additionalDataMap = ref(new Map())

// 数据格式化工具函数
const normalizeFieldModel = () => {
  const values = Array.isArray(data.fieldModel) ? data.fieldModel : (data.fieldModel ? [data.fieldModel] : [])
  return values.map(item => typeof item === 'object' && item !== null ? item : { value: item })
}

const findItemByValue = (value) => {
  return normalizeFieldModel().find(item => item.value === value)
}

// 弹窗表单数据
const popupFormData = computed(() => ({ picker: tempAdditionalData.value }))

// 判断选项是否被选中
const isSelected = (value) => {
  return normalizeFieldModel().some(item => item.value === value)
}

// 格式化附加信息显示文本
const formatAdditionalInfo = (additional) => {
  if (!additional) return ''
  if (Array.isArray(additional)) return `已配置 ${additional.length} 组`
  if (typeof additional === 'object') {
    const filledFields = Object.values(additional).filter(v => v !== '' && v !== null && v !== undefined)
    return filledFields.length > 0 ? `已配置 ${filledFields.length} 项` : ''
  }
  return ''
}

// 获取选项的附加信息显示文本
const getAdditionalInfo = (value) => {
  const item = findItemByValue(value)
  if (item?.additional) return formatAdditionalInfo(item.additional)
  
  const additionalData = additionalDataMap.value.get(value)
  return formatAdditionalInfo(additionalData?.additional)
}

// 处理按钮点击
const handleButtonClick = (option) => {
  if (option.disable || methodObjs.fieldDisabled() || methodObjs.fieldReadonly()) return

  // 如果有附加组件
  if (option.additionalComponents?.length > 0) {
    currentOption.value = option
    
    // 检查是否已有附加数据
    const item = findItemByValue(option.value)
    const existingData = item?.additional ? { value: option.value, additional: item.additional } 
                        : additionalDataMap.value.get(option.value)
    
    // 如果已选中且有附加数据，弹出确认弹窗
    if (isSelected(option.value) && existingData?.additional) {
      confirmPopup.value?.open()
      return
    }
    
    // 否则直接打开附加组件弹窗
    openAdditionalPopup(existingData)
    return
  }

  toggleSelection(option.value)
}

// 切换选项选中状态
const toggleSelection = (value) => {
  const currentValues = normalizeFieldModel()
  const index = currentValues.findIndex(item => item.value === value)
  
  if (index >= 0) {
    currentValues.splice(index, 1)
    additionalDataMap.value.delete(value)
  } else {
    const additionalData = additionalDataMap.value.get(value)
    const newItem = { value, ...(additionalData?.additional && { additional: additionalData.additional }) }
    currentValues.push(newItem)
  }
  
  data.fieldModel = currentValues
  methodObjs.handleChangeEvent(currentValues)
}

// 获取选项的选中值（用于附加组件）
const getSelectedValueForOption = (value) => {
  return tempAdditionalData.value;
}

// 更新附加数据
const updateAdditionalData = (data) => {
  console.error("sss", data)
  tempAdditionalData.value = data
}

// 确认附加组件数据
const confirmAdditional = async () => {
  try {
    await popupForm.value?.validate()

    if (currentOption.value && tempAdditionalData.value) {
      const optionValue = currentOption.value.value
      additionalDataMap.value.set(optionValue, tempAdditionalData.value)

      const currentValues = normalizeFieldModel()
      const existingIndex = currentValues.findIndex(item => item.value === optionValue)
      
      const newItem = { value: optionValue, additional: tempAdditionalData.value.additional }
      
      if (existingIndex >= 0) {
        currentValues[existingIndex] = newItem
      } else {
        currentValues.push(newItem)
      }
      
      data.fieldModel = currentValues
      methodObjs.handleChangeEvent(currentValues)
    }

    closeAdditionalPopup()
  } catch (error) {
    console.error('表单校验失败:', error)
  }
}

// 关闭附加组件弹窗
const closeAdditionalPopup = () => {
  additionalPopup.value?.close()
  currentOption.value = null
  tempAdditionalData.value = null
}

// 打开附加组件弹窗
const openAdditionalPopup = (existingData) => {
  tempAdditionalData.value = existingData ? JSON.parse(JSON.stringify(existingData)) : { value: currentOption.value.value }
  additionalPopup.value?.open()
}

// 清空附加数据
const clearAdditionalData = () => {
  if (currentOption.value) {
    const optionValue = currentOption.value.value
    
    // 从 fieldModel 中移除该项
    const currentValues = normalizeFieldModel()
    const filteredValues = currentValues.filter(item => item.value !== optionValue)
    
    // 清除附加数据映射
    additionalDataMap.value.delete(optionValue)
    
    data.fieldModel = filteredValues
    methodObjs.handleChangeEvent(filteredValues)
  }
  
  confirmPopup.value?.close()
  currentOption.value = null
}

// 编辑附加数据
const editAdditionalData = () => {
  confirmPopup.value?.close()
  
  // 查找现有数据
  const item = findItemByValue(currentOption.value.value)
  const existingData = item?.additional ? { value: currentOption.value.value, additional: item.additional } 
                      : additionalDataMap.value.get(currentOption.value.value)
  
  openAdditionalPopup(existingData)
}

// 处理示例图预览
const showImagePreview = (imageUrl) => {
  previewImageUrl.value = imageUrl
  imagePreviewVisible.value = true
}

// 关闭图片预览
const closeImagePreview = () => {
  imagePreviewVisible.value = false
  previewImageUrl.value = ''
}

// 取消附加组件编辑
const cancelAdditional = closeAdditionalPopup

methodObjs.initOptionItems()

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
.checkbox-button-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  width: 100%;
}
.popup-desc{
  
  background-color: #f5f5f5;
  text-align: center;
  padding: 10px;
}

.checkbox-button {
  flex: 0 0 auto;
  min-width: 120rpx;
  padding: 10rpx 14rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  background-color: #fff;
  transition: all 0.3s ease;

  &:hover:not(.disabled) {
    border-color: #007aff;
    background-color: #f8f9ff;
  }

  &.selected {
    border-color: #007aff;
    background-color: #e3f2fd;

    .option-name {
      color: #007aff;
      font-weight: 600;
    }
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f5f5f5;
  }
}

.button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 60rpx;
  line-height: 1;
}

.option-name {
  font-size: 13px;
  color: #333;
  line-height: 1;
  margin-bottom: 4rpx;
}

.additional-info {
  font-size: 12px;
  color: #666;
  line-height: 1.2;
  margin-top: 4px;
  padding: 2px 6px;
  background-color: rgba(0, 122, 255, 0.1);
  border-radius: 4px;
}

.additional-popup-wrapper {
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.popup-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.popup-actions {
  display: flex;
  gap: 16px;
}

.popup-btn {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;

  &.cancel {
    color: #666;
  }

  &.confirm {
    color: #007aff;
    font-weight: 500;
  }
}

.popup-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.confirm-dialog {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  box-sizing: border-box;
  width:100%;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 12px;
}

.dialog-content {
  font-size: 14px;
  color: #666;
  text-align: center;
  line-height: 1.5;
  margin-bottom: 24px;
}

.dialog-actions {
  display: flex;
  gap: 12px;
}

.dialog-btn {
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &.cancel {
    color: #666;
    background-color: #f5f5f5;

    &:hover {
      background-color: #e0e0e0;
    }
  }

  &.confirm {
    color: #fff;
    background-color: #007aff;

    &:hover {
      background-color: #0056b3;
    }
  }
}

.title-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.example-image-btn {
  padding: 4px 8px;
  background-color: #007aff;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
}

.option-text {
  flex: 1;
}

.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  width: 30px;
  height: 30px;
  background-color: rgba(128, 128, 128, 0.5);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}
</style>
