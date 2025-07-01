<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <!-- 按钮显示模式 -->
    <view class="field">
      <view class="checkbox-buttons-container">
        <view v-for="(option, index) in getOptionAdditionList()" :key="index" class="checkbox-button-wrapper">
          <template v-if="option.optionType=='checkbox'">
            <!-- 如果没有选择 -->
            <view class="checkbox-button" :class="{ 
            'selected': isSelected(option.value), 
            'disabled': (option.disable==true) || methodObjs.fieldDisabled() || methodObjs.fieldReadonly() 
          }" @click="handleButtonClick(option)">
              <view class="button-content">
                <view class="option-name">{{ option.text }}</view>
                <view v-if="isSelected(option.value) && getAdditionalInfo(option.value,option.additionalComponents,option.additialItem)" class="additional-info">
                  <view class="additional-text">{{ getAdditionalInfo(option.value,option.additionalComponents,option.additialItem) }}</view>
                </view>
              </view>
            </view>
          </template>
          <template v-else-if="option.optionType=='add-button'">
            <view class="checkbox-button add-button" @click="handleAddButtonClick(option)">
              <uni-icons type="plusempty" size="14" color="#eec23d"></uni-icons>新增{{ option.text }}
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

    <!-- tooltip弹窗已移动到form-render/index.vue -->

    <!-- 确认操作弹窗 -->
    <uni-popup ref="confirmPopup" type="center" background-color="#fff" border-radius="20rpx">
      <view class="confirm-dialog">
        <view class="dialog-title">{{ currentOption?.text || '选项' }}</view>
        <view v-if="currentEditIndex >= 0" class="dialog-content" @click="clearSpecificAdditionalData">清空数据</view>
        <view v-if="currentEditIndex >= 0" class="dialog-content" @click="editSpecificAdditionalData">编辑数据</view>
        <view v-if="currentEditIndex < 0" class="dialog-content" @click="clearAdditionalData">取消选中</view>
        <view v-if="currentEditIndex < 0" class="dialog-content" @click="editAdditionalData">编辑数据</view>
        <view class="dialog-content" @click="confirmPopup.close()">取消</view>
      </view>
    </uni-popup>

    <!-- 附加组件弹窗 -->
    <uni-popup ref="additionalPopup" type="bottom" background-color="#fff" border-radius="10px 10px 0 0">
      <view class="popup-wrapper additional-popup-wrapper">
         <!-- 标题栏 -->
        <view class="popup-header">
          <view class="popup-button-wrapper" style="text-align:left">
            <text v-if="currentOption?.exampleImage" class="example-image-btn" @click="showImagePreview(currentOption.exampleImage)">示例图</text>
          </view>
          <view class="popup-title">
            <slot name="title">{{ currentOption?.text || '附加信息' }}</slot>
          </view>
          <!-- 显示圆形叉号图标 -->
          <view class="popup-button-wrapper" style="text-align:right">
            <view class="popup-button cancel" @click="cancelAdditional">
              <uni-icons type="closeempty" size="13" color="#FFFFFF"></uni-icons>
            </view>
          </view>
        </view>


        <view v-if="currentOption?.tooltip" class="popup-desc">
          {{currentOption?.tooltip}}
        </view>

        <view class="popup-content">
          <uni-forms ref="popupForm" :model="popupFormData" label-position="left">
            <additional-components v-if="currentOption" :item="currentOption" :selected-value="getSelectedValueForOption(currentOption.value)" :additional-expanded="true" :edit-index="currentEditIndex" :allow-add-additional="false" @update-additional="updateAdditionalData" />
          </uni-forms>
        </view>
        
      </view>
      <view class="popup-button-confirm-wrapper">
        <view class="confirm" @click="confirmAdditional">确定</view>
      </view>
    </uni-popup>

    <!-- 图片预览弹窗已移动到form-render/index.vue -->
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
// 当前编辑的数组项索引，-1表示编辑整个数组（兼容模式）
const currentEditIndex = ref(-1)

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



// 检查是否需要合并显示尺寸信息
const shouldCombineDimensions = (keys) => {
  return (keys.some(x => x.includes('long')) && keys.some(x => x.includes('short'))) ||
    (keys.some(x => x.includes('width')) && keys.some(x => x.includes('height')))
}

// 处理尺寸合并显示
const processDimensionDisplay = (component, additionalItem, keys) => {
  if (!component.name.includes('long') && !component.name.includes('width')) {
    return null
  }

  const longOrWidth = additionalItem[component.name] || ''
  const shortOrHeight = keys.find(key =>
    key.includes('short') || key.includes('height')
  )
  const shortValue = shortOrHeight ? additionalItem[shortOrHeight] || '' : ''

  return longOrWidth || shortValue ?
    `${longOrWidth}${longOrWidth && shortValue ? '*' : ''}${shortValue}` : null
}

// 处理组件显示值
const getComponentDisplayValue = (component, fieldValue, additionalItem, keys, combineDisplay) => {
  if (!fieldValue && fieldValue !== 0) return null

  switch (component.type) {
    case 'select':
    case 'radio':
      const option = component.options?.find(x => x.value == fieldValue)
      return option?.label || null

    case 'checkbox':
      const options = component.options?.filter(x => x.value == fieldValue)
      return options?.length > 0 ? `${options[0].label}等${options.length}个` : null

    default:
      if (combineDisplay) {
        return processDimensionDisplay(component, additionalItem, keys)
      }
      return String(fieldValue)
  }
}

// 获取选项的附加信息显示文本
const getAdditionalInfo = (value, additionalComponents, additionalItem) => {
  console.error('getAdditionalInfo', value, additionalComponents, additionalItem)
  if (!additionalItem || !additionalComponents?.length) return null

  const keys = Object.keys(additionalItem)
  const combineDisplay = shouldCombineDimensions(keys)
  const displayItems = []

  additionalComponents.forEach(component => {
    const fieldValue = additionalItem[component.name]
    const displayValue = getComponentDisplayValue(component, fieldValue, additionalItem, keys, combineDisplay)

    if (displayValue) {
      displayItems.push(displayValue)
    }
  })

  return displayItems.length > 0 ? displayItems.join(',') : null
}

const getOptionAdditionList = () => {
  const options = methodObjs.getOptions();
  return options.flatMap(option => {
    const additionalData = getOptionAdditionalData(option.value);

    // 1. 生成基于选项和其附加数据的 "checkbox" 列表
    // 如果没有附加数据，则创建一个包含 null 的数组以确保至少生成一个基础的 checkbox 项
    let baseItems;
    if(additionalData && Array.isArray(additionalData) && additionalData.length>0){
      baseItems = additionalData;
    }else if(additionalData && !Array.isArray(additionalData)){
      baseItems = [additionalData];
    }else{
      baseItems = [null];
    }
    const checkboxItems = baseItems.map((additialItem, additinalIndex) => {
      const item = {
        ...option,
        optionType: 'checkbox'
      };
      // 仅当存在真实的附加数据时，才添加相关字段
      if (additialItem !== null) {
        item.additialItem = additialItem;
        item.additinalIndex = additinalIndex;
      }
      return item;
    });

    // 2. 如果允许多个附加组件且尚未达到上限，则添加 "add-button"
    if (option.additionalComponentsMultiple && additionalData?.length > 0 && additionalData.length < option.maxAdditionalComponents) {
      checkboxItems.push({ ...option, optionType: 'add-button' });
    }

    return checkboxItems;
  });
}



// 获取选项的additional数据
const getOptionAdditionalData = (optionValue) => {
  if (!data.fieldModel || data.fieldModel.length === 0) {
    return []
  }
  const selectedItem = data.fieldModel.find(item => item.value === optionValue)
  return selectedItem?.additional || []
}

// 检查是否禁用
const isOptionDisabled = (option) => {
  return option.disable || methodObjs.fieldDisabled() || methodObjs.fieldReadonly()
}

// 显示提示信息
const showTooltipIfNeeded = (option) => {
  if ((option.tooltip || option.exampleImage) && !isSelected(option.value) && option.showTooltip) {
    uni.$emit('openTooltipPopup', option)
    return true
  }
  return false
}

// 处理已选中选项的点击
const handleSelectedOptionClick = (option) => {
  if (isSelected(option.value) && option.additionalComponents?.length > 0) {
    currentOption.value = option
    confirmPopup.value?.open()
    return true
  }
  return false
}

// 处理附加组件选项
const handleAdditionalComponentOption = (option) => {
  if (option.additionalComponents?.length > 0) {
    currentOption.value = option
    currentEditIndex.value = -1  // 重置为兼容模式

    const item = findItemByValue(option.value)
    const existingData = item?.additional ?
      { value: option.value, additional: item.additional } :
      additionalDataMap.value.get(option.value)

    openAdditionalPopup(existingData)
    return true
  }
  return false
}

// 处理按钮点击
const handleButtonClick = (option) => {
  debugger
  if (isOptionDisabled(option)) return

  // 处理编辑附加项
  if (option.additinalIndex !== undefined && option.additionalComponentsMultiple==true && option.autoShowTooltip) {
    handleEditAdditionalItem(option, option.additinalIndex)
    return
  }

  // 显示提示信息
  showTooltipIfNeeded(option)

  // 处理已选中选项
  if (handleSelectedOptionClick(option)) return

  // 处理附加组件选项
  if (handleAdditionalComponentOption(option)) return

  // 默认切换选择状态
  toggleSelection(option.value)
}

// 创建新的附加项
const createNewAdditionalItem = (additionalComponents) => {
  const newItem = {}
  additionalComponents.forEach(component => {
    newItem[component.name] = component.defaultValue || null
  })
  return newItem
}

// 更新数据模型
const updateFieldModel = (newValues) => {
  data.fieldModel = newValues
  methodObjs.handleChangeEvent(newValues)
}

const handleAddButtonClick = (option) => {
  const currentValues = normalizeFieldModel()
  const index = currentValues.findIndex(item => item.value === option.value)

  if (index < 0) return

  // 确保additional数组存在
  currentValues[index].additional = currentValues[index].additional || []

  // 创建并添加新项
  const newItem = createNewAdditionalItem(option.additionalComponents)
  currentValues[index].additional.push(newItem)

  // 更新数据模型
  updateFieldModel(currentValues)

  // 设置编辑状态
  currentOption.value = option
  currentEditIndex.value = currentValues[index].additional.length - 1

  // 打开编辑弹窗
  const editData = {
    value: option.value,
    additional: currentValues[index].additional
  }
  openAdditionalPopup(editData)
}

// 编辑指定的附加数据项
const handleEditAdditionalItem = (option, itemIndex) => {
  const currentValues = normalizeFieldModel()
  const valueIndex = currentValues.findIndex(item => item.value === option.value)

  if (valueIndex >= 0 && currentValues[valueIndex].additional && currentValues[valueIndex].additional[itemIndex]) {
    // 设置当前选项和编辑索引
    currentOption.value = option
    currentEditIndex.value = itemIndex  // 编辑指定索引的项

    // 先弹出确认对话框
    confirmPopup.value?.open()
  }
}

// 切换选项选中状态
const toggleSelection = (value) => {
  const currentValues = normalizeFieldModel()
  const index = currentValues.findIndex(item => item.value === value)

  if (index >= 0) {
    // 取消选中
    currentValues.splice(index, 1)
    additionalDataMap.value.delete(value)
  } else {
    // 选中
    const additionalData = additionalDataMap.value.get(value)
    const newItem = {
      value,
      ...(additionalData?.additional && { additional: additionalData.additional })
    }
    currentValues.push(newItem)
  }

  updateFieldModel(currentValues)
}

// 获取选项的选中值（用于附加组件）
const getSelectedValueForOption = () => tempAdditionalData.value

// 更新附加数据
const updateAdditionalData = (data) => {
  tempAdditionalData.value = data
}

// 确认附加组件数据
const confirmAdditional = async () => {
  try {
    await popupForm.value?.validate()

    if (!currentOption.value || !tempAdditionalData.value) {
      closeAdditionalPopup()
      return
    }

    debugger
    const optionValue = currentOption.value.value
    additionalDataMap.value.set(optionValue, tempAdditionalData.value)

    const currentValues = normalizeFieldModel()
    const existingIndex = currentValues.findIndex(item => item.value === optionValue)

    // 构建新项数据（简化逻辑，两种模式处理方式相同）
    const newItem = {
      value: optionValue,
      additional: tempAdditionalData.value.additional
    }

    // 更新或添加项
    if (existingIndex >= 0) {
      currentValues[existingIndex] = newItem
    } else {
      currentValues.push(newItem)
    }

    updateFieldModel(currentValues)
    closeAdditionalPopup()
  } catch (error) {
    console.error('表单校验失败:', error)
  }
}

// 重置弹窗状态
const resetPopupState = () => {
  currentOption.value = null
  tempAdditionalData.value = null
  currentEditIndex.value = -1
}

// 关闭附加组件弹窗
const closeAdditionalPopup = () => {
  additionalPopup.value?.close()
  resetPopupState()
}

// 打开附加组件弹窗
const openAdditionalPopup = (existingData) => {
  tempAdditionalData.value = existingData ?
    JSON.parse(JSON.stringify(existingData)) :
    { value: currentOption.value.value }

  additionalPopup.value?.open()
}

// 关闭确认弹窗并重置状态
const closeConfirmPopup = () => {
  confirmPopup.value?.close()
  currentEditIndex.value = -1
}

// 清空附加数据
const clearAdditionalData = () => {
  if (!currentOption.value) {
    closeConfirmPopup()
    return
  }

  const optionValue = currentOption.value.value
  const currentValues = normalizeFieldModel()
  const filteredValues = currentValues.filter(item => item.value !== optionValue)

  // 清除附加数据映射
  additionalDataMap.value.delete(optionValue)

  // 更新数据模型
  updateFieldModel(filteredValues)
  closeConfirmPopup()
}

// 清空指定项的附加数据
const clearSpecificAdditionalData = () => {
  if (!currentOption.value || currentEditIndex.value < 0) {
    closeConfirmPopup()
    return
  }

  const optionValue = currentOption.value.value
  const currentValues = normalizeFieldModel()
  const valueIndex = currentValues.findIndex(item => item.value === optionValue)

  if (valueIndex < 0 || !currentValues[valueIndex].additional ||
    !currentValues[valueIndex].additional[currentEditIndex.value]) {
    closeConfirmPopup()
    return
  }

  // 删除指定索引的数组项
  currentValues[valueIndex].additional.splice(currentEditIndex.value, 1)

  // 如果数组为空，则删除additional属性
  if (currentValues[valueIndex].additional.length === 0) {
    delete currentValues[valueIndex].additional
  }

  // 更新附加数据映射
  const additionalData = additionalDataMap.value.get(optionValue)
  if (additionalData) {
    additionalData.additional = currentValues[valueIndex].additional || []
    additionalDataMap.value.set(optionValue, additionalData)
  }

  // 更新数据模型
  updateFieldModel(currentValues)
  closeConfirmPopup()
}

// 获取现有编辑数据
const getExistingEditData = (optionValue) => {
  const item = findItemByValue(optionValue)
  return item?.additional ?
    { value: optionValue, additional: item.additional } :
    additionalDataMap.value.get(optionValue)
}

// 编辑指定项的附加数据
const editSpecificAdditionalData = () => {
  if (!currentOption.value || currentEditIndex.value < 0) {
    closeConfirmPopup()
    return
  }

  const currentValues = normalizeFieldModel()
  const valueIndex = currentValues.findIndex(item => item.value === currentOption.value.value)

  if (valueIndex < 0 || !currentValues[valueIndex].additional ||
    !currentValues[valueIndex].additional[currentEditIndex.value]) {
    closeConfirmPopup()
    return
  }

  // 构建编辑数据
  const editData = {
    value: currentOption.value.value,
    additional: currentValues[valueIndex].additional
  }

  // 关闭确认对话框并打开编辑弹窗
  confirmPopup.value?.close()
  openAdditionalPopup(editData)
}

// 编辑附加数据
const editAdditionalData = () => {
  if (!currentOption.value) {
    closeConfirmPopup()
    return
  }

  confirmPopup.value?.close()
  const existingData = getExistingEditData(currentOption.value.value)
  openAdditionalPopup(existingData)
}

// 图片预览相关函数
const showImagePreview = (imageUrl) => {
  uni.$emit('openImagePreview', imageUrl)
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
@import '../styles/variables.scss';
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

.checkbox-button-wrapper {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8rpx;
  align-items: center;
  min-width: 24%;
  max-width: 50%;
  flex-grow: 1;
}
.checkbox-button {
  flex: 0 0 auto;
  width: 100%;
  padding: 10rpx 14rpx;
  box-sizing: border-box;
  overflow: hidden;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  background-color: #fff;
  transition: all 0.3s ease;

  // &:hover:not(.disabled) {
  //   border-color: $primary-color;
  //   background-color: #fff6da;
  // }

  &.selected {
    border-color: $primary-color;
    background-color: $primary-color;

    .option-name {
      color: #fff6da;
      font-weight: 600;
    }
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f5f5f5;
    .option-name {
      color: #333;
      font-weight: 600;
    }
  }

  &.add-button {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 80rpx;
    line-height: 1;
    border: dashed #eec23d 2rpx;
    color: $primary-color;
    uni-icons {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: dashed #eec23d 2rpx;
      width: 30rpx;
      height: 30rpx;
      margin-right: 8rpx;
    }
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
  color: #fff;
  line-height: 1.2;
  margin-top: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8rpx;
}

.additional-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.edit-btn {
  flex-shrink: 0;
  font-size: 22rpx;
  color: $primary-color;
  padding: 2rpx 6rpx;
  border-radius: 4rpx;
  background-color: rgba(0, 122, 255, 0.1);
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background-color: rgba(0, 122, 255, 0.2);
}

/* tooltip样式已移动到form-render/index.vue */
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
  color: #fed752;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.option-text {
  flex: 1;
}

/* 图片预览样式已移动到form-render/index.vue */

.selected-values {
  margin-top: 16rpx;
  padding: 12rpx 16rpx;
  background-color: #f8f9fa;
  border-radius: 8rpx;
  border-left: 4rpx solid $primary-color;
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
