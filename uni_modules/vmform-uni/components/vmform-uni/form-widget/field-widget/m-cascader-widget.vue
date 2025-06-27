<template>
  <form-item-wrapper
    ref="fieldWrapper"
    :field="field"
    :focus="methodObjs.isFocus()"
    :design-state="designState"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :sub-form-row-index="subFormRowIndex"
    :sub-form-col-index="subFormColIndex"
    :sub-form-row-id="subFormRowId"
  >
    <custom-picker
      ref="fieldEditor"
      v-model="data.fieldModel"
      :options="currentOptions"
      :disabled="props.field.options.disabled || props.field.options.readonly"
      :placeholder="props.field.options.placeholder || '请选择'"
      :title="props.field.options.title || props.field.options.label"
      :multiple="props.field.options.multiple"
      :field-names="cascaderFieldNames"
      @change="handleCascaderChange"
      class="cascader-wrapper"
    >
      <!-- 自定义显示内容 -->
      <template #display="{ displayText }">
        <view class="cascader-display" :class="[inputAlignClass]">
          <view class="selected-list" v-if="!inputBorder">
            <uni-tag :text="item" :inverted="true" v-for="item in displayArray" :key="item"></uni-tag>
            <view v-if="displayArray.length == 0" class="placeholder">{{ props.field.options.placeholder }}</view>
          </view>
          <view class="selected-list" v-else>
            <view v-if="displayArray.length > 0">{{ displayArray[0] }}</view>
            <view v-else class="placeholder">{{ props.field.options.placeholder }}</view>
          </view>
          <text class="uni-icons uniui-clear content-clear-icon" @click.stop="clearTag" v-if="displayArray.length > 0 && field.options.clearable"> </text>
          <text class="uni-icons uniui-forward content-clear-icon" v-if="displayArray.length == 0 && !inputBorder"></text>
        </view>
      </template>
      
      <!-- 自定义级联选择内容 -->
      <template #content="{ options, selectedValues, onSelect }">
        <view class="cascader-content">
          <!-- 面包屑导航 -->
          <view class="selected-items">
            <view v-for="(item, index) in selectedPaths" :key="item.value" @click="changeSelectedPaths(item, index)">
              {{ item[data.fieldNames.text] }}
            </view>
            <view v-if="selectedPaths.length == 0">请选择</view>
          </view>
          
          <!-- 选项列表 -->
          <scroll-view scroll-y class="cascader-option-list">
            <view 
              class="cascader-option-item" 
              v-for="(item, index) in currentOptions" 
              :key="item[data.fieldNames.value]"
              @click="handleCascaderItemSelect(item)"
              :class="{ 
                selected: isChecked(item),
                disabled: item.disabled 
              }"
            >
              <checkbox 
                v-if="props.field.options.multiple" 
                :checked="isChecked(item)" 
                :disabled="item.disabled"
                @click.stop
              />
              <view class="cascader-option-label">
                {{ item[data.fieldNames.text] }}
              </view>
              <view class="cascader-option-arrow" v-if="item[data.fieldNames.children]">
                <text class="uni-icons uniui-right"></text>
              </view>
            </view>
          </scroll-view>
        </view>
      </template>
    </custom-picker>
    <template #readmode>
      {{ displayArray }}
    </template>

    <uni-popup ref="fieldEditor" type="bottom" class="popup-content" background-color="#fff" border-radius="10px 10px 0 0">
      <view class="popup-content-wrapper" style="width: 100%; max-height: 80vh">
        <view class="title-wrapper">
          <view class="title-action-wrapper">
            <view class="popup-button" size="mini" @click="closePopup">取消</view>
            <view class="popup-button" size="mini" @click="confirmSelected">确定</view>
          </view>
          <view class="title-search-wrapper">
            <!-- <uni-easyinput ref="searchRef" v-model.trim="searchVal" autofocus placeholder="搜索" @search="onSearch" @clear="onSearch"></uni-easyinput> -->
          </view>
        </view>
        <view class="content-list-wrapper">
          <view class="selected-items">
            <view v-for="(item, index) in selectedPaths" :key="item.value" @click="changeSelectedPaths(item, index)">
              {{ item.label }}
            </view>
            <view v-if="selectedPaths.length == 0">请选择</view>
          </view>
          <view class="content-select">
            <view class="checkbox-group">
              <view class="content-item" v-for="(item, index) in optionItems" :key="item.value" @tap="handleCheckboxChange(item)">
                <checkbox :value="item.value.toString()" :checked="isChecked(item)" v-if="props.field.options.multiple" readonly="true" />
                <!--content-item-label 挡住checkbox，由view控制checkbox的选中状态 -->
                <view class="content-item-label" :style="{ paddingLeft: props.field.options.multiple ? '60rpx' : '0px' }">
                  <view>{{ item[data.fieldNames.text] }}</view>
                  <uni-icons type="right" color="#c0c4cc" size="18" v-if="item[data.fieldNames.children]"></uni-icons>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
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
import { deepClone } from '../../utils/util.js'
import { computed, ref, reactive } from '../../utils/vueBuilder.js'
import { useField } from './fieldMixin'

import FormItemWrapper from './form-item-wrapper'
import CustomPicker from './custom-picker.vue'

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
const fieldValue = ref([])
const actions = {}
const widgetData = reactive({
  fieldNames: {
    children: props.field.options.childrenKey || 'children',
    text: props.field.options.labelKey || 'label',
    value: props.field.options.valueKey || 'value',
  },
})

const fieldMixin = useField({
  actions,
  componentType: 'FieldWidget',
  props,
  widgetData,
  emit,
})
const { data, methodObjs, fieldWrapper, fieldEditor, inputBorder, inputAlignClass } = fieldMixin

const displayFieldModel = computed(() => {
  if (!data.fieldModel) return []

  let value = []

  const getChildValue = (list, valueIndex) => {
    let findI = list.find(x => x.value === data.fieldModel[valueIndex])
    if (findI) {
      value.push({
        value: findI.value,
        text: findI.label,
      })

      if (valueIndex < props.field.options.optionItems.length - 1 && findI.children) getChildValue(findI.children, valueIndex + 1)
    }
  }

  getChildValue(props.field.options.optionItems, 0)
  return value
})

actions.setFieldModel = newValue => {
  data.fieldModel = newValue
  fieldValue.value = displayFieldModel.value.map(x => x.text).join(' / ')

  selectedItems.value = newValue
}

const getSelectedOptionsByValue = (options, value, layer) => {
  let selectedOptions = []
  for (let i = 0; i < options.length; i++) {
    let option = options[i]

    if (option[data.fieldNames.value] === value[layer]) {
      selectedOptions.push(option)
      if (option[data.fieldNames.children]) {
        selectedOptions.push(...getSelectedOptionsByValue(option[data.fieldNames.children], value, layer + 1))
      }
      break
    }
  }
  return selectedOptions
}

// 获取选择项的label
const getSelectedLabel = selectedItem => {
  if (selectedItem.length == 0) return null
  let selectedOptions = getSelectedOptionsByValue(props.field.options.optionItems, selectedItem, 0)

  if (!!selectedOptions && selectedOptions.length > 0) {
    return selectedOptions.map(option => option[data.fieldNames.text]).join('/')
  }
}

// 显示的值
const displayArray = computed(() => {
  let displayLabels = []
  if (props.field.options.multiple) {
    for (let i = 0; i < data.fieldModel.length; i++) {
      let selectedItem = data.fieldModel[i]
      let selectedLabel = getSelectedLabel(selectedItem)
      displayLabels.push(selectedLabel)
    }
  } else if (data.fieldModel) {
    let selectedLabel = getSelectedLabel(data.fieldModel)
    if (selectedLabel) {
      displayLabels.push(selectedLabel)
      data.selectedValue = data.fieldModel[data.fieldModel.length - 1]
    }
  }

  return displayLabels
})

const showPopup = () => {
  if (props.field.options.disabled || props.field.options.readonly) return
  fieldEditor.value.open('bottom')
}
const closePopup = () => {
  fieldEditor.value.close()
}

const selectedPaths = ref([])
const selectedItems = ref([])
const optionItems = ref(props.field.options.optionItems)
const currentOptions = ref(props.field.options.optionItems)

// 级联选择器的字段映射
const cascaderFieldNames = computed(() => ({
  label: data.fieldNames.text,
  value: data.fieldNames.value,
  children: data.fieldNames.children,
  disabled: 'disabled'
}))

// 处理级联选择器变化
const handleCascaderChange = (value) => {
  data.fieldModel = value
  methodObjs.handleChangeEvent(value)
}

// 处理级联选择项点击
const handleCascaderItemSelect = (item) => {
  handleCheckboxChange(item)
}
const handleCheckboxChange = item => {
  // 单选时，清空已选
  if (!props.field.options.multiple) {
    selectedItems.value.splice(0)
  }

  if (item[widgetData.fieldNames.children]) {
    // 如果选择的是有子项的节点，则更新路径
    // 检查是否已存在该项
    if (selectedPaths.value.length > 0) {
      const lastItem = selectedPaths.value[selectedPaths.value.length - 1]
      if (!lastItem || lastItem[widgetData.fieldNames.value] !== item[widgetData.fieldNames.value]) {
        selectedPaths.value.push(item) // 重置为新选择的项
      }
    } else {
      selectedPaths.value.push(item)
    }
    loadOptionItems()
  } else {
    let findIndex = selectedItems.value.findIndex(arr => arr.includes(item.value))
    if (findIndex === -1) {
      selectedItems.value.push([...selectedPaths.value.map(x => x.value), item.value])
    } else {
      selectedItems.value.splice(findIndex, 1)
    }
    // 单选时，确定选择
    if (!props.field.options.multiple) {
      confirmSelected()
    }
  }
}
const changeSelectedPaths = (item, index) => {
  selectedPaths.value.splice(index)
  loadOptionItems()
}
const loadOptionItems = () => {
  let options = props.field.options.optionItems
  for (let i = 0; i < selectedPaths.value.length; i++) {
    let selectedItem = selectedPaths.value[i]

    let findIndex = options.findIndex(x => x[widgetData.fieldNames.value] === selectedItem[widgetData.fieldNames.value])
    if (findIndex !== -1) {
      options = selectedItem[widgetData.fieldNames.children]
    } else {
      options = options[findIndex][widgetData.fieldNames.children]
    }
  }
  optionItems.value = options
  currentOptions.value = options
}
const isChecked = item => {
  return selectedItems.value.findIndex(arr => arr.includes(item.value)) >= 0
}

const confirmSelected = () => {
  if (props.field.options.multiple) {
    data.fieldModel = deepClone(selectedItems.value)
  } else {
    if (selectedItems.value.length > 0) {
      data.fieldModel = deepClone(selectedItems.value[0])
    }
  }
  closePopup()
  methodObjs.handleChangeEvent(data.fieldModel)
}

const clearTag = () => {
  selectedItems.value.splice(0)
  data.fieldModel.splice(0)
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
.empty-select {
  border: solid 1px red;
  width: 100%;
  height: 60rpx;
}

.field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  min-height: 35px;
  line-height: 35px;

  .selected-list {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 10rpx;
    align-items: center;
    flex: 1;
    margin: 0px 10rpx;
  }

  &.input-align-right {
    .selected-list {
      justify-content: flex-end;
    }

    .selected-list {
      justify-content: flex-end;
    }
  }

  &.input-align-center {
    .selected-list {
      justify-content: center;
      padding-right: 10px;
    }

    .selected-list {
      justify-content: center;
      padding-right: 10px;
    }
  }

  &.disabled {
    pointer-events: none;
    background-color: #f7f6f6;
  }
  .placeholder {
    color: #999;
    font-size: 14px;
  }

  .content-clear-icon {
    color: #c0c4cc;
    font-size: 16px;
  }
}

.cascader-wrapper {
  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.cascader-display {
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  min-height: 20px;
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

.cascader-content {
  display: flex;
  flex-direction: column;
  height: 500px;
}

.selected-items {
  display: flex;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #666;
  gap: 10px;
  align-items: center;
  background-color: #f8f8f8;

  view {
    color: #007aff;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 4px;
    background-color: #e3f2fd;
    font-size: 12px;

    &:after {
      content: ' > ';
      color: #999;
      margin-left: 5px;
    }

    &:last-child:after {
      content: '';
    }
  }
}

.cascader-option-list {
  flex: 1;
  padding: 10px 0;
}

.cascader-option-item {
  padding: 15px 20px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f8f8f8;
  }
  
  &.selected {
    background-color: #e3f2fd;
    
    .cascader-option-label {
      color: #007aff;
      font-weight: 500;
    }
  }
  
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:last-child {
    border-bottom: none;
  }
}

.cascader-option-label {
  flex: 1;
  margin-left: 12px;
  font-size: 16px;
  color: #333;
}

.cascader-option-arrow {
  color: #c0c4cc;
  font-size: 14px;
}

.popup-content {
  // #ifndef MP-WEIXIN
  width: 100%;
  max-height: 80vh;
  min-height: 20vh;
  padding: 20rpx;
  // #endif

  .popup-button {
    text-align: center;
    display: inline-block;
    color: #000000;
  }

  ::v-deep .popup-content-wrapper {
    padding: 30rpx;
    box-sizing: border-box;

    .title-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    .title-action-wrapper {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 5px;
      uni-button {
        margin: 0px;
      }
    }

    .title-search-wrapper {
      width: 100%;
      display: block;
      box-sizing: border-box;
      padding: 15rpx 0;
    }

    .content-list-wrapper {
      width: 100%;

      .selected-items {
        // 选中的项目样式
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        padding-bottom: 10px;
        gap: 10rpx;

        view {
          display: inline-block;
          align-self: flex-end;
          position: relative;
          text-align: center;
          &:last-of-type::after {
            content: '';
            display: inline-block;
            width: 80%;
            height: 4rpx;
            background-color: #ee0a24;
            position: absolute;
            right: 10%;
            bottom: -10rpx;
          }
        }
      }

      // 内容选择容器
      .content-select {
        position: relative;
      }

      // 复选框组
      .checkbox-group {
        width: 100%;
        display: inline-flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;

        // 内容项
        .content-item {
          height: 60rpx;
          line-height: 60rpx;
          display: flex;
          align-items: center;
          width: 100%;
          position: relative;

          // 复选框样式
          checkbox {
            transform: scale(0.7);
          }

          // 内容项标签
          &-label {
            box-sizing: border-box;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        }
      }
    }
  }
}
</style>
