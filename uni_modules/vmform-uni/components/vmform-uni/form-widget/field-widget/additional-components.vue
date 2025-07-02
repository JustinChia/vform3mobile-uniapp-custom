<template>
  <!-- 附加组件区域 -->
  <view v-if="item.additionalComponents && item.additionalComponents.length > 0 && additionalExpanded" class="additional-components" @click.stop="()=>{}">
    <!-- 多组附加组件支持 -->
    <view v-for="(group, groupIndex) in additionalData" :key="groupIndex" class="additional-group">
      <view v-if="item.additionalComponentsMultiple && additionalData.length > 1" class="group-header">
        <text class="group-title">{{ item.text }}: {{ groupIndex + 1 }}</text>
        <view v-if="groupIndex > 0" class="delete-group-btn" @click="deleteGroup(groupIndex)">
          删除
        </view>
      </view>

      <view v-for="(component, compIndex) in item.additionalComponents" :key="compIndex" class="additional-component-item">
        <uni-forms-item :name="buildName(groupIndex, component.name)" :rules="buildValidationRules(component)">
          <template #label></template>
          <view class="additinal-component-item-wrapper">
            <view class="additinal-component-item-title" v-if="component.label">{{ component.label }}</view>
            <view class="additinal-component-item-control">
              <!-- 下拉选择 -->
              <picker v-if="component.type === 'select'" :range="getSelectOptions(component)" range-key="label" :value="getPickerIndex(getSelectOptions(component), group[component.name])" @change="(val)=>{handleAdditionalPickerComponentChanged(groupIndex,component,val)}" class="additional-select">
                <view class="picker-display">
                  <text v-if="getPickerDisplayText(getSelectOptions(component), group[component.name])" class="picker-value">
                    {{ getPickerDisplayText(getSelectOptions(component), group[component.name]) }}
                  </text>
                  <text v-else class="picker-placeholder">
                    {{ component.placeholder || '请选择' }}
                  </text>
                </view>
              </picker>

              <!-- 文本输入 -->
              <uni-easyinput v-else-if="component.type === 'input'" v-model="group[component.name]" :type="component.inputType || 'text'" :placeholder="component.placeholder || '请输入'" :maxlength="component.maxLength" :disabled="component.disabled" :readonly="component.readonly" :inputBorder="false"
                             @change="updateComponentValue( groupIndex, component.name, $event)"/>

              <!-- 数字输入 -->
              <uni-number-box v-else-if="component.type === 'number'" v-model="group[component.name]" :min="component.min" :max="component.max" :step="component.step || 1" :disabled="component.disabled" @update:modelValue="updateComponentValue( groupIndex, component.name, $event)" class="additional-number"
                              :border="false" />

              <!-- 日期选择 -->
              <uni-datetime-picker v-else-if="component.type === 'date'" v-model="group[component.name]" type="date" :disabled="component.disabled" @change="updateComponentValue( groupIndex, component.name, $event)" class="additional-date" :border="false" />

              <!-- 时间选择 -->
              <uni-datetime-picker v-else-if="component.type === 'time'" v-model="group[component.name]" type="time" :disabled="component.disabled" @change="updateComponentValue( groupIndex, component.name, $event)" class="additional-time" :border="false" />

              <!-- 开关 -->
              <switch v-else-if="component.type === 'switch'" :checked="group[component.name]" :disabled="component.disabled" @change="updateSwitchValue(groupIndex, component.name, $event)" class="additional-switch" />

              <!-- 单选框 -->
              <radio-group v-else-if="component.type === 'radio'" :value="group[component.name]" @change="updateComponentValue( groupIndex, component.name, $event.detail.value)" class="additional-radio">
                <label v-for="option in component.simpleOptions" :key="option.value" class="radio-option">
                  <radio :value="option.value" :disabled="component.disabled" />
                  <text class="radio-text">{{ option.label }}</text>
                </label>
              </radio-group>

              <!-- 多选框 -->
              <checkbox-group v-else-if="component.type === 'checkbox'" :value="group[component.name] || []" @change="updateCheckboxValue(groupIndex, component.name, $event.detail.value)" class="additional-checkbox">
                <label v-for="option in component.simpleOptions" :key="option.value" class="checkbox-option">
                  <checkbox :value="option.value" :disabled="component.disabled" />
                  <text class="checkbox-text">{{ option.label }}</text>
                </label>
              </checkbox-group>
            </view>
          </view>
        </uni-forms-item>
      </view>
    </view>

    <!-- 添加组按钮 -->
    <view v-if="item.additionalComponentsMultiple && canAddGroup" class="add-group-btn" @click.stop="addGroup">
      + 添加一组
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from '../../utils/vueBuilder.js'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  selectedValue: {
    type: [String, Number, Object],
    default: null
  },
  additionalExpanded: {
    type: Boolean,
    default: false
  },
  // 新增：指定要编辑的数组项索引，-1表示编辑整个数组（兼容模式）
  editIndex: {
    type: Number,
    default: -1
  },
  allowAddAdditional: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update-additional'])

// ==================== 状态管理 ====================
// 附加组件数据组数组
// 数据结构说明：
// - 单组模式：[{ componentId1: value1, componentId2: value2 }]
// - 多组模式：[{ componentId1: value1 }, { componentId1: value2 }, ...]
// 每个组对象的key为组件的id，value为用户输入的值
const additionalData = ref([])

// 编辑数组的第groupIndex个元素，
const editComponentIndex = (groupIndex)=>{
  return groupIndex+( props.editIndex <0 ? 0: props.editIndex)
}

// 构建name数组
// @param {number} groupIndex - 组索引
// @param {string} componentName - 组件名称
// @returns {Array} name数组
const buildName = (groupIndex, componentName) => {
  if (props.item.additionalComponentsMultiple) {
    return ['picker', 'additional', editComponentIndex(groupIndex), componentName]
  } else {
    return ['picker', 'additional', componentName]
  }
}

// 计算属性
const maxGroups = computed(() => {
  return props.item.maxAdditionalComponents || 1
})

const canAddGroup = computed(() => {
  return additionalData.value.length < maxGroups.value &&
    props.editIndex === -1 && // -1表示编辑整个数组
    props.allowAddAdditional
})

// ==================== 数据初始化方法 ====================
// 初始化附加组件数据
// 根据props.selectedValue中的additional数据来初始化additionalData
// 支持单组和多组两种模式，以及指定索引编辑模式
const initializeAdditionalData = () => {
  if (props.item.additionalComponents && props.item.additionalComponents.length > 0) {
    // 如果已有选中值且包含additional数据，使用现有数据
    if (props.selectedValue && typeof props.selectedValue === 'object' && props.selectedValue.additional) {
      if (props.item.additionalComponentsMultiple && Array.isArray(props.selectedValue.additional)) {
        // 多组模式：additional是数组，每个元素是一个组对象
        if (props.editIndex >= 0 && props.editIndex < props.selectedValue.additional.length) {
          // 编辑指定索引的数组项
          additionalData.value = [props.selectedValue.additional[props.editIndex]]
        } else {
          // 编辑整个数组（兼容模式）
          additionalData.value = props.selectedValue.additional
        }
      } else if (!props.item.additionalComponentsMultiple && typeof props.selectedValue.additional === 'object') {
        // 单组模式：additional是对象，包装成数组
        additionalData.value = [props.selectedValue.additional]
      } else {
        // 数据格式不匹配，创建默认组
        Reflect.set(additionalData.value, 0, createEmptyGroup())
      }
    } else {
      // 没有现有数据，创建默认组
      Reflect.set(additionalData.value, 0, createEmptyGroup())
    }
  }
}

// 创建空的组数据对象
// 返回一个对象，key为组件ID，value为默认值
const createEmptyGroup = () => {
  const group = {}
  if (props.item.additionalComponents) {
    props.item.additionalComponents.forEach(component => {
      // 使用组件的默认值，如果没有则使用空字符串
      group[component.name] = component.defaultValue || ''
    })
  }
  return group
}

// 处理附加组件选择器组件值变化
// @param {number} groupIndex - 组索引
// @param {Object} component - 组件对象
// @param {Event} val - 事件对象，包含选择器的索引值
const handleAdditionalPickerComponentChanged = (groupIndex, component, val) => {
  if (additionalData.value[groupIndex]!=undefined) {
    additionalData.value[groupIndex][component.name] = getSelectOptions(component)[val.detail.value].value
    emitAdditionalUpdate()
  }
}

// 构建选择值对象
// 根据是否有附加组件来决定返回格式：
// - 有附加组件：返回 { value: 选项值, additional: 附加数据 }
// - 无附加组件：直接返回选项值
const buildSelectValue = () => {
  if (props.item.additionalComponents && props.item.additionalComponents.length > 0) {
    let additional

    if (props.item.additionalComponentsMultiple) {
      // 多组模式
      if (props.editIndex >= 0) {
        // 指定索引编辑模式：需要将编辑后的数据更新到原数组的指定位置
        const originalAdditional = props.selectedValue?.additional || []
        const updatedAdditional = [...originalAdditional]
        if (additionalData.value[0]) {
          updatedAdditional[props.editIndex] = additionalData.value[0]
        }
        additional = updatedAdditional
      } else {
        // 编辑整个数组（兼容模式）
        additional = additionalData.value
      }
    } else {
      // 单组模式：返回第一个组对象
      additional = additionalData.value[0] || {}
    }

    return {
      value: props.item.value,
      additional: additional,
      editIndex: props.editIndex >= 0 ? props.editIndex : undefined  // 传递编辑索引信息
    }
  } else {
    // 没有附加组件，直接返回选项值
    return {
      value: props.item.value
    }
  }
}

// ==================== 数据更新方法 ====================
// 更新附加组件的值
// @param {number} groupIndex - 组索引
// @param {string} componentId - 组件ID
// @param {string|Event} value - 新值或事件对象
const updateComponentValue = (groupIndex, componentId, value) => {
  if (additionalData.value[groupIndex]) {
    // 处理uni-easyinput的事件参数
    const newValue = typeof value === 'string' ? value : (value?.detail?.value || value || '')
    additionalData.value[groupIndex][componentId] = newValue
    emitAdditionalUpdate()
  }
}

// 根据值获取在选择器中的索引
// @param {Array} options - 选择器选项数组
// @param {string} value - 当前值
// @returns {number} 索引值，找不到时返回0
const getPickerIndex = (options, value) => {
  if (!options || !value) return 0
  const index = options.findIndex(option => option.value === value)
  return index >= 0 ? index : 0
}

// 根据值获取选择器的显示文本
// @param {Array} options - 选择器选项数组
// @param {string} value - 当前值
// @returns {string} 显示文本
const getPickerDisplayText = (options, value) => {
  if (!options || !value) return ''
  const option = options.find(option => option.value === value)
  return option ? option.label : ''
}

// ==================== 组管理方法 ====================
// 添加新的附加组件组
// 只有在多组模式且未达到最大组数时才能添加
const addGroup = () => {
  if (canAddGroup.value) {
    additionalData.value.push(createEmptyGroup())
    emitAdditionalUpdate()
  }
}

// 删除指定索引的组
// @param {number} groupIndex - 要删除的组索引
// 至少保留一个组，不能全部删除
const deleteGroup = (groupIndex) => {
  if (additionalData.value.length > 1) {
    additionalData.value.splice(groupIndex, 1)
    emitAdditionalUpdate()
  }
}

// 新增方法：获取选择器选项（支持分组）
const getSelectOptions = (component) => {
  if (!component.options) return []

  const flatOptions = []
  component.options.forEach(option => {
    if (option.isGroup && option.children) {
      // 分组选项，展开子选项
      option.children.forEach(childOption => {
        flatOptions.push({
          // label: `${option.label} - ${childOption.label}`,
          label: `${childOption.label}`,
          value: childOption.value
        })
      })
    } else {
      // 普通选项
      flatOptions.push({
        label: option.label,
        value: option.value
      })
    }
  })

  return flatOptions
}

// 新增方法：构建校验规则
const buildValidationRules = (component) => {
  const rules = []
  // 必填校验
  if (component.required !== false) {
    rules.push({
      required: true,
      errorMessage: `${component.requiredMessage ||'字段必填'}`
    })
  }

  // 根据组件类型添加特定校验
  switch (component.type) {
    case 'input':
      // 文本长度校验
      if (component.minLength) {
        rules.push({
          min: component.minLength,
          errorMessage: `${component.label}最少输入${component.minLength}个字符`
        })
      }
      if (component.maxLength) {
        rules.push({
          max: component.maxLength,
          errorMessage: `${component.label}最多输入${component.maxLength}个字符`
        })
      }
      // 正则校验
      if (component.pattern) {
        rules.push({
          pattern: new RegExp(component.pattern),
          errorMessage: component.patternMessage || `${component.label}格式不正确`
        })
      }
      // 邮箱校验
      if (component.inputType === 'email') {
        rules.push({
          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          errorMessage: '请输入正确的邮箱格式'
        })
      }
      // 手机号校验
      if (component.inputType === 'tel') {
        rules.push({
          pattern: /^1[3-9]\d{9}$/,
          errorMessage: '请输入正确的手机号格式'
        })
      }
      break

    case 'number':
      // 数值范围校验
      if (component.min !== undefined) {
        rules.push({
          validator: (rule, value, callback) => {
            if (value !== undefined && value !== null && value < component.min) {
              callback(new Error(`${component.label}不能小于${component.min}`))
            } else {
              callback()
            }
          }
        })
      }
      if (component.max !== undefined) {
        rules.push({
          validator: (rule, value, callback) => {
            if (value !== undefined && value !== null && value > component.max) {
              callback(new Error(`${component.label}不能大于${component.max}`))
            } else {
              callback()
            }
          }
        })
      }
      break

    case 'checkbox':
      // 多选数量校验
      if (component.minSelect) {
        rules.push({
          validator: (rule, value, callback) => {
            const selectedCount = Array.isArray(value) ? value.length : 0
            if (selectedCount < component.minSelect) {
              callback(new Error(`${component.label}至少选择${component.minSelect}项`))
            } else {
              callback()
            }
          }
        })
      }
      if (component.maxSelect) {
        rules.push({
          validator: (rule, value, callback) => {
            const selectedCount = Array.isArray(value) ? value.length : 0
            if (selectedCount > component.maxSelect) {
              callback(new Error(`${component.label}最多选择${component.maxSelect}项`))
            } else {
              callback()
            }
          }
        })
      }
      break

    case 'date':
    case 'time':
      // 日期时间范围校验
      if (component.minDate) {
        rules.push({
          validator: (rule, value, callback) => {
            if (value && new Date(value) < new Date(component.minDate)) {
              callback(new Error(`${component.label}不能早于${component.minDate}`))
            } else {
              callback()
            }
          }
        })
      }
      if (component.maxDate) {
        rules.push({
          validator: (rule, value, callback) => {
            if (value && new Date(value) > new Date(component.maxDate)) {
              callback(new Error(`${component.label}不能晚于${component.maxDate}`))
            } else {
              callback()
            }
          }
        })
      }
      break
  }

  // 自定义校验规则
  if (component.customRules && Array.isArray(component.customRules)) {
    rules.push(...component.customRules)
  }

  return rules
}

// 更新开关值
const updateSwitchValue = (groupIndex, componentName, event) => {
  if (additionalData.value[groupIndex]) {
    const newValue = event.detail.value
    additionalData.value[groupIndex][componentName] = newValue
    emitAdditionalUpdate()
  }
}

// 更新多选框值
const updateCheckboxValue = (groupIndex, componentName, selectedValues) => {
  if (additionalData.value[groupIndex]) {
    additionalData.value[groupIndex][componentName] = selectedValues
    emitAdditionalUpdate()
  }
}

// 触发附加组件数据更新事件
// 构建完整的选择值并通知父组件
const emitAdditionalUpdate = () => {
  const selectValue = buildSelectValue()
  emit('update-additional', selectValue)
}

// 监听选中值变化
watch(() => props.selectedValue, () => {
  initializeAdditionalData()
}, { immediate: true })

// 监听展开状态变化
watch(() => props.additionalExpanded, (newVal) => {
  if (newVal) {
    initializeAdditionalData()
  }
})

// 初始化
initializeAdditionalData()
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
.additional-components {
  padding: 5rpx 10rpx;
  border-top: $border;
  animation: slideDown 0.3s ease;
}

.additional-group {
  border-radius: 6px;
  background-color: white;

  &:last-child {
    margin-bottom: 0;
  }
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height:70rpx;
  padding-left:20rpx;
  border-left: 3px solid $primary-color;
  border-bottom: $border;
}

.group-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.delete-group-btn {
  color: #ff4757;
  font-size: 12px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 3px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ffe0e0;
  }
}

.additional-component-item {
  &:last-child {
    margin-bottom: 0;
  }

  :deep(.uni-forms-item){    
    padding: 0rpx 30rpx;
    height: 80rpx;
    flex-direction:row!important;
    border-bottom: $border;
    border-top:none 0px!important;

    .uni-forms-item__error{
      width:100%;
      text-align:right;
      padding-right:10px;
      box-sizing:border-box;
    }
  }
}

.additinal-component-item-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
}
.additinal-component-item-control {
  width: 50%;
  flex-grow: 1;

  .uni-easyinput {
    width: 100%;
    .uni-input-placeholder{
      text-align:right;
    }
  }

  .picker-display{
    padding-left:20rpx;
    text-align:right;
  }
}

.additional-select {
  width: 100%;
  flex-grow: 1;
  padding: 10rpx 0px;
}

.picker-value {
  font-size: 14px;
  color: #333;
}

.picker-placeholder {
  font-size: 12px;
  color: #999999;
}

.add-group-btn {
  margin-top: 10px;
  padding: 8px 15px;
  background-color: $primary-color;
  color: white;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

// 附加组件样式
.additional-number,
.additional-date,
.additional-time {
  width: 100%;
}

.additional-switch {
  transform: scale(0.8);
}

.additional-radio {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.radio-option {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.radio-text {
  margin-left: 5px;
  font-size: 14px;
  color: #333;
}

.additional-checkbox {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.checkbox-option {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.checkbox-text {
  margin-left: 5px;
  font-size: 14px;
  color: #333;
}
</style>