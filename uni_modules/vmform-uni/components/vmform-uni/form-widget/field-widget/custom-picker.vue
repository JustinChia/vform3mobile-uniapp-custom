<template>
  <view class="custom-picker" :class="{ disabled: disabled }">
    <!-- 显示区域 -->
    <view style="width:100%;display:flex;align-items:center;justify-content:flex-end">
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
          <view class="popup-button-wrapper" style="text-align:left"></view>
          <view class="popup-title">
            <slot name="title">{{ title || '请选择' }}</slot>
          </view>
          <!-- 显示圆形叉号图标 -->
          <view class="popup-button-wrapper" style="text-align:right">
            <view class="popup-button cancel" @click="cancel">
              <uni-icons type="closeempty" size="13" color="#FFFFFF"></uni-icons>
            </view>
          </view>
        </view>

        <view v-if="field?.options?.desc" class="popup-desc">
          {{field.options.desc}}
        </view>

        <!-- 内容区域 -->
        <view class="popup-content">
          <!-- 表单容器 -->
          <scroll-view scroll-y class="option-list">
            <uni-forms ref="popupForm" :model="popupFormData">
              <view :class="[field&&field.options.showImageSelect?'image-popup-content':'text-popup-content']">
                <view v-for="(item, index) in filteredOptions" :key="getItemKey(item, index)" @click.stop="()=>{}" style="width:100%">
                  <!-- 根据showImageSelect属性选择组件 -->
                  <RadioImageOptionItem v-if="field&& field.options && field.options.showImageSelect" :item="item" :is-selected="isSelected(item)" :tooltip-visible="tooltipExpanded[getItemKey(item, index)]" :selected-value="getSelectedValueForItem(item)" @item-click="handleItemClick"
                                        @tooltip-toggle="toggleTooltip" @image-preview="showImagePreview" />
                  <RadioOptionItem v-else :item="item" :is-selected="isSelected(item)" :tooltip-visible="tooltipExpanded[getItemKey(item, index)]" :selected-value="getSelectedValueForItem(item)" @item-click="handleItemClick" @tooltip-toggle="toggleTooltip" @image-preview="showImagePreview" />

                  <!-- 附加组件区域 -->
                  <additional-components v-if="item.additionalComponents && item.additionalComponents.length > 0" :item="item" :selectedValue="getSelectedValueForItem(item)" :additionalExpanded="additionalExpanded[getItemKey(item, index)]" @update-additional="updateAdditional" />
                </view>
              </view>
            </uni-forms>
          </scroll-view>
        </view>
      </view>
      <view class="popup-button-confirm-wrapper" v-if="haveSomeAdditionalExpanded">
        <view class="confirm" @click="confirm">确定</view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed, watch } from '../../utils/vueBuilder.js'
import AdditionalComponents from './additional-components.vue'
import RadioOptionItem from './radio-option-item.vue'
import RadioImageOptionItem from './radio-image-option-item.vue'
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

  // 初始化附加组件展开状态
  props.options.forEach(item => {
    additionalExpanded.value[getItemKey(item)] = getSelectedValueForItem(item)?.additional || false
  })

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

const updateAdditional = async (selectValue) => {
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

const haveSomeAdditionalExpanded= computed(()=>{
  return Object.values(additionalExpanded.value).some(value => value)
})

defineExpose({
  open: showPicker,
  close: () => popup.value?.close()
})
</script>

<style lang="scss" scoped>
.custom-picker {
  width: 100%;
  position: relative;

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}


.picker-display {
  padding: 0px;
  border: none 0px;
  background-color: #fff;
  color: #333;
  min-height: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
  width: 100%;
  box-sizing: border-box;

  &.is-placeholder {
    color: #999;
  }
}

.picker-icon {
  color: #c0c4cc;
  display: flex;
}
</style>