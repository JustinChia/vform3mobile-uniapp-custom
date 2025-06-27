<template>
  <view class="custom-picker" :class="{ disabled: disabled }">
    <!-- 显示区域 -->
    <view>
      <view class="picker-display" :class="{ 'is-placeholder': !displayText }" @click="showPicker">
        <slot name="display" :displayText="displayText">
          {{ displayText || placeholder }}
        </slot>
      </view>

      <!-- 右侧图标 -->
      <view class="picker-icon">
        <slot name="icon">
          <text class="uni-icons uniui-forward"></text>
        </slot>
      </view>
    </view>

    <!-- 弹窗 -->
    <!-- 这个弹窗的h5端会意外关闭，仅留下遮罩层，小程序端没有问题，如果需要h5端使用可以更改其他弹出组件 -->
    <uni-popup ref="popup" type="bottom" background-color="#fff" border-radius="10px 10px 0 0">
      <view class="popup-wrapper">
        <!-- 标题栏 -->
        <view class="popup-header">
          <view class="popup-title">
            <slot name="title">{{ title || '请选择' }}</slot>
          </view>
          <view class="popup-actions">
            <view class="popup-btn cancel" @click="cancel">取消</view>
            <view class="popup-btn confirm" @click="confirm">确定</view>
          </view>
        </view>

        <!-- 搜索栏 -->
        <view class="popup-search" v-if="searchable">
          <uni-easyinput v-model="searchText" placeholder="搜索" @input="onSearch" @clear="onSearch"></uni-easyinput>
        </view>
        <view v-if="field.options.desc" class="popup-desc">
          {{field.options.desc}}
        </view>

        <!-- 内容区域 -->
        <view class="popup-content">
          <!-- 表单容器 -->
          <scroll-view scroll-y class="option-list">
            <uni-forms ref="popupForm" :model="popupFormData">
              <view v-for="(item, index) in filteredOptions" :key="getItemKey(item, index)" class="radio-option-item-wrapper" @click.stop="()=>{}">
                <view class="radio-option-item" @click.stop="handleItemClick(item)" :class="{ 
                    selected: isSelected(item),
                    disabled: item.disabled 
                  }">
                  <!-- 选中状态指示器 -->
                  <view class="radio-indicator" :class="{ checked: isSelected(item) }">
                    <view class="radio-dot" v-if="isSelected(item)"></view>
                  </view>

                  <!-- 选项标签 -->
                  <view class="radio-option-label">
                    {{ item.text || item.label }}
                  </view>

                  <!-- 右侧操作区域 -->
                  <view class="radio-option-actions">
                    <!-- tooltip问号图标 -->
                    <view v-if="item.tooltip" class="tooltip-icon" @click.stop="toggleTooltip(item)">
                      ?
                    </view>

                    <!-- 示例图按钮 -->
                    <view v-if="item.exampleImage" class="example-image-btn" @click.stop="showImagePreview(item)">
                      示例图
                    </view>
                  </view>
                </view>

                <!-- tooltip提示文字 -->
                <view v-if="item.tooltip && tooltipExpanded[getItemKey(item, index)]" class="tooltip-content">
                  {{ item.tooltip }}
                </view>

                <!-- 附加组件区域 -->
                <additional-components 
                  v-if="item.additionalComponents && item.additionalComponents.length > 0" 
                  :item="item" 
                  :selectedValue="getSelectedValueForItem(item)" 
                  :additionalExpanded="additionalExpanded[getItemKey(item, index)]" 
                  @update-additional="updateAdditional"
                />
              </view>
            </uni-forms>
          </scroll-view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed, watch } from '../../utils/vueBuilder.js'
import AdditionalComponents from './additional-components.vue'
const props = defineProps({
  field: {
    type: Object,
    default: () => { }
  },
  // 选项数据
  options: {
    type: Array,
    default: () => []
  },
  // 当前值
  modelValue: {
    type: [String, Number, Array, Object],
    default: null
  },
  // 是否多选
  multiple: {
    type: Boolean,
    default: false
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 占位符
  placeholder: {
    type: String,
    default: '请选择'
  },
  // 弹窗标题
  title: {
    type: String,
    default: ''
  },
  // 是否可搜索
  searchable: {
    type: Boolean,
    default: false
  },
  // 字段映射
  fieldNames: {
    type: Object,
    default: () => ({
      label: 'label',
      value: 'value',
      children: 'children',
      disabled: 'disabled'
    })
  },
  // 显示文本分隔符
  separator: {
    type: String,
    default: ','
  },
  // 单选模式下是否自动关闭弹窗
  autoClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'confirm', 'cancel', 'show-image-preview'])
const popupForm = ref(null)
const popup = ref(null)
const searchText = ref('')
const tempSelectedValues = ref([])
// tooltip展开状态
const tooltipExpanded = ref({})
// 附加组件展开状态
const additionalExpanded = ref({})

const popupFormData = computed(() => {
  return {
    picker: props.multiple ? tempSelectedValues.value : tempSelectedValues.value[0]
  }
})

// 计算选中项的显示文本
const displayText = computed(() => {
  if (!props.modelValue?.value) return ''

  const values = props.multiple ? props.modelValue.value : [props.modelValue.value]
  const items = props.options.filter(item =>
    values.includes(getItemValue(item))
  )
  
  return items
    .map(item => getItemLabel(item))
    .join(props.separator)
})




const filteredOptions = computed(() => {
  if (!searchText.value) {
    return props.options
  }
  return props.options.filter(option => {
    const label = getItemLabel(option)
    return label.toLowerCase().includes(searchText.value.toLowerCase())
  })
})

const handleShowImagePreview = (event) => {
  emit('show-image-preview', event)
}

// 方法
const getItemValue = (item) => {
  return item[props.fieldNames.value]
}

const getItemLabel = (item) => {
  return item[props.fieldNames.label] || item.text || item.label || ''
}

const getItemKey = (item, index) => {
  return getItemValue(item) || (index !== undefined ? index : item.value || JSON.stringify(item))
}

const isSelected = (item) => {
  const value = getItemValue(item)

  return props.multiple
    ? tempSelectedValues.value.some(selectedItem => {
      const selectedValue = typeof selectedItem === 'object' ? selectedItem.value : selectedItem
      return selectedValue === value
    })
    : (() => {
      const selectedItem = tempSelectedValues.value[0]
      const selectedValue = typeof selectedItem === 'object' ? selectedItem.value : selectedItem
      return selectedValue === value
    })()
}


const showPicker = () => {
  if (props.disabled) return

  // 初始化临时选中值
  tempSelectedValues.value = props.multiple
    ? (props.modelValue ? JSON.parse(JSON.stringify(props.modelValue)) : [])
    : props.modelValue ? [JSON.parse(JSON.stringify(props.modelValue))] : []

  // 重置展开状态
  tooltipExpanded.value = {}
  additionalExpanded.value = {}
  
  searchText.value = ''
  popup.value?.open()
}

const onSearch = () => {
  // 搜索逻辑已在 filteredOptions 中处理
}

const handleItemClick = (item) => {
  if (item.disabled) return

  const itemKey = getItemKey(item)
  const selectValue = buildSelectValue(item)
  
  // 如果有附加组件，先展开附加组件
  if (item.additionalComponents && item.additionalComponents.length > 0) {
    additionalExpanded.value[itemKey] = !additionalExpanded.value[itemKey]
    updateAdditional(selectValue)
    return;
  }

  // 选择选项并直接关闭弹窗
  updateAdditional(selectValue)
  
  // 单选模式下自动关闭
  if (!props.multiple && props.autoClose) {
    setTimeout(() => {
      confirm()
    }, 100)
  }
}

const toggleTooltip = (item) => {
  const itemKey = getItemKey(item)
  tooltipExpanded.value[itemKey] = !tooltipExpanded.value[itemKey]
}

const showImagePreview = (item) => {
  emit('show-image-preview', item.exampleImage)
}

const buildSelectValue = (item) => {
  if (item.additionalComponents && item.additionalComponents.length > 0) {
    return {
      value: item.value
    }
  } else {
    return {
      value: item.value
    }
  }
}

const getSelectedValueForItem = (item) => {
  if (props.multiple) {
    return tempSelectedValues.value.find(selectedItem => {
      const selectedValue = typeof selectedItem === 'object' ? selectedItem.value : selectedItem
      return selectedValue === item.value
    })
  } else {
    const selectedItem = tempSelectedValues.value[0]
    if (selectedItem) {
      const selectedValue = typeof selectedItem === 'object' ? selectedItem.value : selectedItem
      return selectedValue === item.value ? selectedItem : null
    }
    return null
  }
}

const updateAdditional = (selectValue) => {
  if (!Array.isArray(selectValue)) {
    if (props.multiple) {
      // 多选模式：查找是否已存在，存在则更新，不存在则添加
      const existingIndex = tempSelectedValues.value.findIndex(item => {
        const itemValue = typeof item === 'object' ? item.value : item
        const selectValueValue = typeof selectValue === 'object' ? selectValue.value : selectValue
        return itemValue === selectValueValue
      })
      
      if (existingIndex >= 0) {
        tempSelectedValues.value[existingIndex] = selectValue
      } else {
        tempSelectedValues.value.push(selectValue)
      }
    } else {
      // 单选模式
      tempSelectedValues.value = [selectValue]
    }
  } else {
    tempSelectedValues.value = selectValue
  }
}

const confirm = async () => {
  try {
    // 表单校验
    await popupForm.value?.validate()

    const newValue = props.multiple
      ? [...tempSelectedValues.value]
      : tempSelectedValues.value[0] || null

    emit('update:modelValue', newValue)
    emit('change', newValue)
    popup.value?.close()
  } catch (error) {
    console.log('表单校验失败:', error)
  }
}

const cancel = () => {
  emit('cancel')
  popup.value?.close()
}

defineExpose({
  open: showPicker,
  close: () => popup.value?.close()
})
</script>

<style lang="scss" scoped>
.custom-picker {
  position: relative;

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.popup-desc{
  background-color: #f5f5f5;
  text-align: center;
  padding: 10px;
}

.picker-display {
  padding: 0px;
  border: none 0px;
  background-color: #fff;
  color: #333;
  min-height: 20px;
  display: flex;
  align-items: center;
  flex: 1;

  &.is-placeholder {
    color: #999;
  }
}

.picker-icon {
  position: absolute;
  right: -2rpx;
  top: 50%;
  transform: translateY(-50%);
  color: #c0c4cc;
}

.popup-wrapper {
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.popup-header {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.popup-actions {
  display: flex;
  gap: 20px;
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

.popup-search {
  padding: 10px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.popup-content {
  flex: 1;
  overflow: hidden;
}

.option-list {
  height: 400px;
}

.option-item {
  padding: 12px 20px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #f8f8f8;
  }

  &.selected {
    background-color: #e3f2fd;
    color: #007aff;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.option-label {
  flex: 1;
  margin-left: 10px;
}

.option-extra {
  color: #c0c4cc;
}

/* Radio Option Item 样式 */
.radio-option-item-wrapper {
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.radio-option-item {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f8f8;
  }

  &.selected {
    background-color: #e3f2fd;

    .radio-option-label {
      color: #007aff;
      font-weight: 500;
    }
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.radio-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  transition: all 0.2s;

  &.checked {
    border-color: #007aff;
    background-color: #007aff;
  }
}

.radio-dot {
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
}

.radio-option-label {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.radio-option-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tooltip-icon {
  width: 20px;
  height: 20px;
  background-color: #007aff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
}

.example-image-btn {
  color: #007aff;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f8ff;
  }
}

.tooltip-content {
  padding: 10px 20px;
  background-color: #f9f9f9;
  color: #666;
  font-size: 14px;
  border-left: 3px solid #007aff;
  animation: slideDown 0.3s ease;
}

.additional-components {
  margin: 10px 20px;
  padding: 10px;
  background-color: #fafafa;
  border-radius: 4px;
}

.additional-group {
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.group-title {
  font-weight: bold;
  font-size: 14px;
}

.delete-group-btn {
  padding: 4px 8px;
  background-color: #ff4d4f;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.additional-component-item {
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
}

.component-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.additional-input {
  width: 100%;
}

.additional-select {
  width: 100%;

  .picker-display {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #fff;
    min-height: 20px;
  }
}

.additional-number {
  width: 100%;
}

.additional-date {
  width: 100%;
}

.additional-time {
  width: 100%;
}

.additional-switch {
  margin: 8px 0;
}

.additional-radio {
  width: 100%;

  .radio-option {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    .radio-text {
      margin-left: 8px;
      font-size: 14px;
    }
  }
}

.additional-checkbox {
  width: 100%;

  .checkbox-option {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    .checkbox-text {
      margin-left: 8px;
      font-size: 14px;
    }
  }
}

.add-group-btn {
  padding: 8px 12px;
  background-color: #007aff;
  color: white;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  margin-top: 10px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>