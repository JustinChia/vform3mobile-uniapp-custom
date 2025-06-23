<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <!-- 默认 default -->
    <view class="field select-wrapper" :class="[inputAlignClass, inputBorder ? 'border' : '']">
      <!-- <view @click="showSelect" style="width: 100%">
        {{data.selectedIndex}}
        <uni-easyinput
          :value="methodObjs.optionItemDisplayValue()"
          :inputBorder="false"
          :suffixIcon="!inputBorder && !methodObjs.showClearable() ? 'forward' : ''"
          :placeholder="field.options.placeholder"
          :disabled="true"
          :clearable="false"
          :class="{ 'no-border': !inputBorder }"
          style="pointer-events: none"
        />
      </view>
      <text class="uni-icons uniui-clear content-clear-icon" v-show="methodObjs.showClearable()" @tap="clearFieldModel"> </text> -->
      <template v-if="!props.field.options.disabled">
	      <uni-data-picker v-model="data.fieldModel" class="no-border" :localdata="methodObjs.getOptions()" @change="handleSelectedChanged" style="width:100%"></uni-data-picker>
      </template>
      <template v-else>
        <div class="fieldDisabled">
          {{ methodObjs.optionItemDisplayValue() }}
        </div>
      </template>
    </view>
    <template #readmode>
      {{ methodObjs.optionItemDisplayValue() }}
    </template>
    <uni-popup ref="popup" type="bottom" style="height: 35hv" background-color="#fff">
      <view class="action-wrapper">
        <view class="popup-button" @click="cancelSelected">取消</view>
        <view class="popup-button" @click="confirmSelected">确定</view>
      </view>
      <view class="search-wrapper" v-if="props.field.options.filterable">
        <uni-easyinput suffixIcon="search" :value="data.searchVal" class="search-input" :focus="true" :inputBorder="false" :clearable="true" confirmType="搜索" @input="searchValChanged" @iconClick="onSearch" @clear="clearSearchVal" />
      </view>
      <view class="select-picker-view">
        <template v-if="props.field.options.multiple">
          <checkbox-group class="checkbox-group" @change="checkboxGroupChanged">
            <picker-view ref="fieldEditor" :value="[data.selectedIndex]" class="picker-view">
              <picker-view-column>
                <view class="picker-item" v-for="(item, index) in methodObjs.getOptions()" :key="index">
                  <checkbox :value="item.value" :checked="checkboxChecked(item)">{{ item.text }}</checkbox>
                </view>
              </picker-view-column>
            </picker-view>
          </checkbox-group>
        </template>
        <template v-else>
          <!-- <picker-view ref="fieldEditor" :value="[data.selectedIndex]" class="picker-view" @change="handleSelectedChanged">
            <picker-view-column>
              <view class="picker-item" v-for="(item, index) in methodObjs.getOptions()" :key="index">
                {{ item.text }}
              </view>
            </picker-view-column>
          </picker-view> -->        
        </template>
      </view>
    </uni-popup>
  </form-item-wrapper>
</template>

<script setup>
import { computed, ref } from '../../utils/vueBuilder.js'
import { useField } from './fieldMixin'

import FormItemWrapper from './form-item-wrapper'
import uniIcons from '@/uni_modules/uni-icons/components/uni-icons/uni-icons'
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
const actions = {}
const popup = ref(null)
const widgetData = {
  searchVal: '',
  selectedIndex: -1,
  checkedValues: [],
  copyOfOptionItems: null,
}
const fieldMixin = useField({
  componentType: 'FieldWidget',
  props,
  emit,
  actions,
  widgetData,
})
const { data, methodObjs, fieldWrapper, fieldEditor, inputBorder, inputAlignClass } = fieldMixin

const mode = computed(() => {
  return props.field.options.direction === 'horizontal' ? 'default' : 'list'
})

actions.setFieldModel = newValue => {
  data.fieldModel = newValue
  data.checkedValues = newValue

  // 如果是单选方式，则给data.selectedIndex赋值
  if (!props.field.options.multiple) {
    data.selectedIndex = props.field.options.optionItems.findIndex(x => x[props.field.options.valueKey] === newValue)
  } else if (newValue && newValue.length > 0) {
    data.selectedIndex = props.field.options.optionItems.findIndex(x => x[props.field.options.valueKey] === newValue[0])
  }
}

actions.afterLoadOptions = () => {
  data.copyOfOptionItems = [...props.field.options.optionItems]
}

methodObjs.initOptionItems()

const showSelect = () => {
  if (props.field.options.disabled || props.field.options.readonly) return
  onSearch()
  popup.value.open()
}
const searchValChanged = val => {
  data.searchVal = val
  onSearch()
}
const onCancel = () => {
  clearSearchVal()
}
const onSearch = () => {
  // 开启筛选，没有开启远程搜索
  if (props.field.options.remote) {
    let isMp = false // 是否是小程序端
    // #ifdef MP-WEIXIN
    isMp = true
    // #endif
    if (!!props.field.options.onRemoteQuery && !isMp) {
      methodObjs.remoteQuery(data.searchVal)
    } else {
      methodObjs.remoteDataSourceQuery(data.searchVal)
    }
  } else {
    if (data.copyOfOptionItems == null) {
      data.copyOfOptionItems = [...props.field.options.optionItems]
    }
    let filterOptionItems = data.copyOfOptionItems.filter(x => {
      return x.label.toString().indexOf(data.searchVal) > -1
    })
    props.field.options.optionItems.splice(0, props.field.options.optionItems.length)
    filterOptionItems.forEach(x => {
      props.field.options.optionItems.push(x)
    })
  }
}

const clearSearchVal = () => {
  data.searchVal = ''
  data.fieldModel = ''
}

const cancelSelected = () => {
  popup.value.close()
}

const confirmSelected = () => {
  if (props.field.options.multiple) {
    data.fieldModel = data.checkedValues
  } else {
    data.fieldModel = methodObjs.getOptions()[data.selectedIndex].value
  }
  popup.value.close()
  methodObjs.handleChangeEvent(data.fieldModel)
}

const handleSelectedChanged = event => {
  if (!props.field.options.multiple) {
    // 当组件为单选时记录选择的值
    const value = event.detail.value[0].value;
    const index = props.field.options.optionItems.findIndex(x => x.value === value);
    const optionItem = props.field.options.optionItems[index];
    if(optionItem.disabled)
      return;   

    data.selectedIndex = index
  }
}

const checkboxGroupChanged = event => {
  data.checkedValues = event.detail.value
}
const checkboxChecked = item => {
  return !!data.checkedValues.find(x => x === item.value)
}
const clearFieldModel = () => {
  methodObjs.setValue(null)
  data.checkedValues = []
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
.select-wrapper {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;

  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  min-height: 35px;
  line-height: 35px;

  ::v-deep .input-value-border{
    border: none;
  }
 
  &.input-align-left{
    ::v-deep .selected-list,
    ::v-deep .placeholder{
      justify-content: flex-start;
    }
  } 
  &.input-align-center{
    ::v-deep .selected-list,
    ::v-deep .placeholder{
      justify-content: center;
    }
  }
  &.input-align-right{
    ::v-deep .selected-list,
    ::v-deep .placeholder{
      justify-content: flex-end;
    }
  }

  
}
.render-vmform .enable {
  .search-wrapper {
    .uni-easyinput__content {
      background-color: #f7f8fa !important;
      border-radius: 8rpx;
    }
  }
}

.action-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 20rpx;
  padding-bottom: 20rpx;
  box-sizing: border-box;

  .popup-button {
    font-size: 28rpx;
  }
}
.search-wrapper {
  width: 100%;
  display: block;
  padding: 0rpx 20rpx;
  box-sizing: border-box;
}

.select-picker-view {
  height: 35vh;
  background-color: white;
  padding: 0rpx 20rpx;
  box-sizing: border-box;
  .checkbox-group {
    height: 100%;
    width: 100%;
  }

  .picker-view {
    height: 100%;

    .picker-item {
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .uni-checkbox-input {
      height: 30rpx;
      width: 30rpx;
      margin-right: 10rpx;
    }
  }
}
</style>
