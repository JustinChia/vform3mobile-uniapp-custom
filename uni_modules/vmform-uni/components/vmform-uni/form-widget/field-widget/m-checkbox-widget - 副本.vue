<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <!-- 按钮显示模式 -->
    <view class="field" :class="[inputAlignClass]">
      <view class="checkbox-buttons-container">
        <view v-for="(option, index) in methodObjs.getOptions()" :key="option.value" class="checkbox-button-wrapper">
          <template v-if="getOptionAdditionalData(option.value).length==0">
            <!-- 如果没有选择 -->
            <view class="checkbox-button" :class="{ 
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
          </template>
          <template v-else>
            <!-- 如果选择了，循环里面的additional -->
            <view v-for="(additialItem,additinalIndex) in getOptionAdditionalData(option.value)" :key="additinalIndex" class="checkbox-button" :class="{ 
            'selected': isSelected(option.value), 
            'disabled': option.disable || methodObjs.fieldDisabled() || methodObjs.fieldReadonly() 
            }" @click="handleButtonClick(option)">
              <view class="button-content">
                <view class="option-name">{{ option.text }}</view>
                <view v-if="isSelected(option.value) && getAdditionalInfo(option.value,option.additionalComponents,additialItem)" class="additional-info">
                  {{ getAdditionalInfo(option.value,option.additionalComponents,additialItem) }}
                </view>
              </view>
            </view>
            <!--添加按钮-->
            <view class="checkbox-button" style="border-style:dashed" @click="handleAddButtonClick(option)">
              {{ option.text }}
            </view>
          </template>
        </view>
      </view>
    </view>

    <template #readmode>
      <view class="field readonly" :class="[inputAlignClass]">
        {{ methodObjs.optionItemDisplayValue() }}
      </view>
    </template>

    <!-- 确认操作弹窗 -->
    <uni-popup ref="confirmPopup" type="center" background-color="#fff" border-radius="20rpx">
      <view class="confirm-dialog">
        <view class="dialog-title">{{ currentOption?.text || '选项' }}</view>
        <view class="dialog-content" @click="clearAdditionalData">取消选中</view>
        <view class="dialog-content" @click="editAdditionalData">编辑数据</view>
        <view class="dialog-content" @click="confirmPopup.close()">取消</view>
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
const getAdditionalInfo = (value, additionalComponents, additionalItem) => {
  // if (!additionalComponents || !additionalItem) {
  //   const item = findItemByValue(value)
  //   if (item?.additional) return formatAdditionalInfo(item.additional)

  //   const additionalData = additionalDataMap.value.get(value)
  //   return formatAdditionalInfo(additionalData?.additional)
  // }

  // 根据additionalComponents配置显示additionalItem的值
  const displayItems = []

  additionalComponents.forEach(component => {
    const fieldValue = additionalItem[component.name]
    if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
      // 优先使用label，如果没有label则使用placeholder
      const displayLabel = component.label || component.placeholder || component.name
      displayItems.push(`${displayLabel}:${fieldValue}`)
    }
  })

  return displayItems.join(' | ')
}

// 根据value获取选项的text
const getOptionText = (value) => {
  const options = methodObjs.getOptions()
  const option = options.find(opt => opt.value === value)
  return option ? option.text : value
}

// 获取选项的additional数据
const getOptionAdditionalData = (optionValue) => {
  if (!data.fieldModel || data.fieldModel.length === 0) {
    return []
  }
  const selectedItem = data.fieldModel.find(item => item.value === optionValue)
  return selectedItem?.additional || []
}

// 处理按钮点击
const handleButtonClick = (option) => {
  if (option.disable || methodObjs.fieldDisabled() || methodObjs.fieldReadonly()) return

  // 如果选项已选中，弹出确认弹窗
  if (isSelected(option.value)) {
    currentOption.value = option
    confirmPopup.value?.open()
    return
  }

  // 如果有附加组件
  if (option.additionalComponents?.length > 0) {
    currentOption.value = option

    // 检查是否已有附加数据
    const item = findItemByValue(option.value)
    const existingData = item?.additional ? { value: option.value, additional: item.additional }
      : additionalDataMap.value.get(option.value)

    // 直接打开附加组件弹窗
    openAdditionalPopup(existingData)
    return
  }

  toggleSelection(option.value)
}

const handleAddButtonClick = (option) => {
  // 给选中的 data.fieldModel 找到 value 与option.value 相同的那一项，给他的additional数组中插入一条数据
  // 然后打开弹窗编辑这条数据
  const currentValues = normalizeFieldModel()
  const index = currentValues.findIndex(item => item.value === option.value)
  if (index >= 0) {
    currentValues[index].additional = currentValues[index].additional || []
    
    // 根据option.additionalComponents 来创建一个newItem
    const newItem = {}
    option.additionalComponents.forEach(component => {
      newItem[component.name] = component.defaultValue||null
    })
    console.error("新的",newItem)
    currentValues[index].additional.push(newItem)
  }
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

// 强制label 在上面
props.field.options.labelPosition = "top"

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
.checkbox-buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  width: 100%;
}
.popup-desc {
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
    border-color: #eec23d;
    background-color: #fff6da;
  }

  &.selected {
    border-color: #eec23d;
    background-color: #fff6da;

    .option-name {
      color: #eec23d;
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
  padding: 20rpx 12rpx;
  box-sizing: border-box;
  width: 50vw;
}

.dialog-title {
  font-size: 24rpx;
  color: #888;
  text-align: center;
  line-height: 70rpx;
}

.dialog-content {
  font-size: 14px;
  color: #666;
  text-align: center;
  line-height: 70rpx;
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

.selected-values {
  margin-top: 16rpx;
  padding: 12rpx 16rpx;
  background-color: #f8f9fa;
  border-radius: 8rpx;
  border-left: 4rpx solid #007aff;
}

.selected-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 6rpx;
  font-weight: 500;
}

.selected-items {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.selected-item {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
}
</style>
