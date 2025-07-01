<template>
  <form-item-wrapper ref="fieldWrapper" :designer="designer" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex"
                     :sub-form-row-id="subFormRowId">
    <view class="size-input-container" :class="{ 'is-disabled': methodObjs.fieldDisabled() }">
      <view class="size-display" :class="{ 'is-placeholder': !hasValue, 'is-readonly': methodObjs.fieldReadonly() }" @click="handleDisplayClick">
        {{ displayValue }}
      </view>

      <!-- 右侧图标 -->
      <view class="picker-icon">
        <text class="uni-icons uniui-forward"></text>
      </view>
    </view>

    <uni-popup ref="fieldEditor" type="bottom" class="popup-content" background-color="#fff" border-radius="10px 10px 0 0">
      <view class="popup-wrapper">
        <view class="popup-header">
          <view class="popup-button-wrapper" style="text-align:left"></view>
          <view class="popup-title">
            <slot name="title">{{ field.options.label || '尺寸' }}</slot>
          </view>
          <view class="popup-button-wrapper" style="text-align:right">
            <view class="popup-button cancel" @click="cancel">
              <uni-icons type="closeempty" size="13" color="#FFFFFF"></uni-icons>
            </view>
          </view>
        </view>
        <view v-if="field?.options?.desc" class="popup-desc">
          {{ field.options.desc }}
        </view>
        <view class="popup-content">
          <uni-forms ref="popupForm" :model="popupFormData" label-position="left">
            <view class="size-input-group">
              <view class="size-input-item">
                <uni-forms-item :label="widthLabel" :labelWidth="80" name="width" :rules="createSizeRules('width')">
                  <view class="input-wrapper">
                    <uni-easyinput type="number" v-model="tempWidthModel" :placeholder="widthPlaceholder" :clearable="true" :inputBorder="false" @input="handleTempWidthInput" />
                  </view>
                </uni-forms-item>
              </view>
              <view class="size-input-item">
                <uni-forms-item :label="heightLabel" :labelWidth="80" name="height" :rules="createSizeRules('height')">
                  <view class="input-wrapper">
                    <uni-easyinput type="number" v-model="tempHeightModel" :placeholder="heightPlaceholder" :clearable="true" :inputBorder="false" @input="handleTempHeightInput" />
                  </view>
                </uni-forms-item>
              </view>
            </view>
          </uni-forms>
        </view>
      </view>
      
      <view class="popup-button-confirm-wrapper">
        <view class="confirm" @click="confirmSelected">确定</view>
      </view>
    </uni-popup>

    <template #readmode>
      <view class="size-readonly">
        {{ readModeDisplayValue }}
      </view>
    </template>
  </form-item-wrapper>
</template>

<script setup>
import { reactive, computed, ref, watch, onMounted, onBeforeUnmount } from '../../utils/vueBuilder';
import { useField } from './fieldMixin';
import FormItemWrapper from './form-item-wrapper';

const props = defineProps({
  field: {
    type: Object,
    default: () => ({}),
  },
  parentWidget: {
    type: Object,
    default: () => ({}),
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
    default: () => ({}),
  },
  designState: {
    type: Boolean,
    default: false,
  },
  subFormRowIndex: {
    type: Number,
    default: -1,
  },
  subFormColIndex: {
    type: Number,
    default: -1,
  },
  subFormRowId: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['props-changed']);

// 初始化数据
const data = reactive({
  fieldModel: { width: '', height: '' },
  widthModel: '',
  heightModel: '',
});

// 临时数据（用于弹窗编辑）
const tempWidthModel = ref('');
const tempHeightModel = ref('');
const popupForm = ref(null);

// 使用fieldMixin
const fieldMixin = useField({
  componentType: 'FieldWidget',
  props,
  emit,
  widgetData: data,
});

const { methodObjs, fieldWrapper, fieldEditor } = fieldMixin;

// 计算属性
const hasValue = computed(() => {
  return data.fieldModel &&
    (data.fieldModel.width || data.fieldModel.height);
});

const displayValue = computed(() => {
  if (!hasValue.value) {
    return props.field?.placeholder || '请选择尺寸';
  }
  const width = data.fieldModel.width || '';
  const height = data.fieldModel.height || '';
  if (width && height) {
    return `${width} × ${height}`;
  } else if (width) {
    return `宽: ${width}`;
  } else if (height) {
    return `高: ${height}`;
  }
  return '请选择尺寸';
});

const readModeDisplayValue = computed(() => {
  if (!hasValue.value) {
    return '--';
  }
  const width = data.fieldModel.width || '--';
  const height = data.fieldModel.height || '--';
  return `${width} × ${height}`;
});

// 核心方法
const updateFieldModel = () => {
  const newModel = {
    width: data.widthModel,
    height: data.heightModel
  };
  data.fieldModel = newModel;
  methodObjs.handleChangeEvent(newModel);
};

const initSizeModel = () => {
  if (data.fieldModel && typeof data.fieldModel === 'object') {
    data.widthModel = data.fieldModel.width || '';
    data.heightModel = data.fieldModel.height || '';
  } else {
    data.fieldModel = { width: '', height: '' };
    data.widthModel = '';
    data.heightModel = '';
  }
};

const syncTempValues = () => {
  tempWidthModel.value = data.widthModel;
  tempHeightModel.value = data.heightModel;
};

// 弹窗表单数据
const popupFormData = computed(() => ({
  width: tempWidthModel.value,
  height: tempHeightModel.value
}));

// 标签和占位符
const widthLabel = computed(() => {
  return props.field?.options?.widthLabel || '宽度';
});

const heightLabel = computed(() => {
  return props.field?.options?.heightLabel || '高度';
});

const widthPlaceholder = computed(() => {
  return props.field?.options?.widthPlaceholder || '请输入宽度';
});

const heightPlaceholder = computed(() => {
  return props.field?.options?.heightPlaceholder || '请输入高度';
});

// 通用验证规则生成函数
const createSizeRules = (type) => {
  const rules = [];
  const fieldName = type === 'width' ? widthLabel.value : heightLabel.value;
  // const minKey = `${type}Min`;
  // const maxKey = `${type}Max`;

  // 必填验证
  if (props.field?.options?.required) {
    rules.push({
      required: true,
      errorMessage: `请输入${fieldName}`,
      trigger: ['blur', 'change']
    });
  }

  // 数值范围验证
  // if (props.field?.options?.[minKey] !== undefined || props.field?.options?.[maxKey] !== undefined) {
  //   const min = props.field?.options?.[minKey];
  //   const max = props.field?.options?.[maxKey];
  //   let message = fieldName;

  //   if (min !== undefined && max !== undefined) {
  //     message += `必须在${min}-${max}之间`;
  //   } else if (min !== undefined) {
  //     message += `不能小于${min}`;
  //   } else if (max !== undefined) {
  //     message += `不能大于${max}`;
  //   }

  //   rules.push({
  //     validator: (rule, value, callback) => {
  //       if (value === '' || value === null || value === undefined) {
  //         callback();
  //         return;
  //       }
  //       const numValue = Number(value);
  //       if (isNaN(numValue)) {
  //         callback(new Error('请输入有效的数字'));
  //         return;
  //       }
  //       if (min !== undefined && numValue < min) {
  //         callback(new Error(message));
  //         return;
  //       }
  //       if (max !== undefined && numValue > max) {
  //         callback(new Error(message));
  //         return;
  //       }
  //       callback();
  //     },
  //     trigger: ['blur', 'change']
  //   });
  // }

  return rules;
};

// 弹窗相关方法
const handleDisplayClick = () => {
  if (methodObjs.fieldDisabled() || methodObjs.fieldReadonly()) {
    return;
  }
  showPopup();
};

const showPopup = () => {
  syncTempValues();
  fieldEditor.value?.open();
  methodObjs.handleFocusCustomEvent();
};

const closePopup = () => {
  fieldEditor.value?.close();
  methodObjs.handleBlurCustomEvent();
};

const confirmSelected = async () => {
  try {
    // 表单验证
    if (popupForm.value) {
      await popupForm.value.validate();
    }

    // 更新实际数据
    data.widthModel = tempWidthModel.value;
    data.heightModel = tempHeightModel.value;
    updateFieldModel();
    closePopup();
  } catch (error) {
    console.log('表单验证失败:', error);
    // 验证失败，不关闭弹窗
  }
};

// 临时输入处理
const handleTempWidthInput = (value) => {
  tempWidthModel.value = value;
};

const handleTempHeightInput = (value) => {
  tempHeightModel.value = value;
};

// 监听fieldModel变化
watch(() => data.fieldModel, (newVal) => {
  if (newVal && typeof newVal === 'object') {
    data.widthModel = newVal.width || '';
    data.heightModel = newVal.height || '';
  }
}, { deep: true });

// 生命周期
onMounted(() => {
  initSizeModel();
});

onBeforeUnmount(() => {
  // 清理工作
});

// 重写初始化方法
methodObjs.initFieldModel = initSizeModel;

// 暴露给模板的变量和方法
const exposeObj = {
  data,
  methodObjs,
  hasValue,
  displayValue,
  readModeDisplayValue,
  tempWidthModel,
  tempHeightModel,
  popupForm,
  popupFormData,
  widthLabel,
  heightLabel,
  widthPlaceholder,
  heightPlaceholder,
  createSizeRules,
  handleDisplayClick,
  showPopup,
  closePopup,
  confirmSelected,
  handleTempWidthInput,
  handleTempHeightInput,
};

// #ifdef VUE3
defineExpose(exposeObj);
// #endif
</script>
<script>
export default {
  options: {
    styleIsolation: 'shared',
  },
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';
.size-input-container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 60rpx;
  flex-grow: 1;
  transition: border-color 0.2s;

  &.is-disabled {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    cursor: not-allowed;

    .size-display {
      color: #c0c4cc;
      cursor: not-allowed;
    }
  }
}
.picker-icon {
  font-size: 14px;
  font-family: uniicons;
  text-decoration: none;
  width: 40rpx;
  color: #c0c4cc;
  font-size: 24px;
  height: 48rpx;
  line-height: 48rpx;
  z-index: 2;
  flex-shrink: 0;
  text-align: center;
  &::before {
    content: '\e6ba';
  }
}

.size-display {
  flex: 1;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  text-align: right;
  height: 60rpx;
  width: 100%;
  line-height: 60rpx;

  &.is-placeholder {
    color: #999;
  }

  &.is-readonly {
    cursor: default;
  }
}

.popup-content-wrapper {
  width: 100%;
  max-height: 80vh;
  .popup-content{    
    padding:0px 30rpx;
    box-sizing:border-box;
  }
}


.size-input-item {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  :deep(.uni-forms-item) {
    width: 100%;
    padding: 10rpx 20rpx;
    flex: 1;
    width: 100%;
    border-bottom:$border;

    .uni-easyinput__content-input {
      text-align: right;
    }
  }
}

.input-label {
  width: 60px;
  font-size: 14px;
  color: #606266;
  text-align: left;
}

.input-wrapper {
  flex: 1;
}

.size-readonly {
  color: #606266;
  padding: 8px 0;
  min-height: 40px;
  display: flex;
  align-items: center;
}

.popup-desc {
  background-color: #f5f5f5;
  text-align: center;
  padding: 10px;
  color: #666;
  font-size: 24rpx;
}

::v-deep .popup-content-wrapper {
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;

  .title-wrapper {
    padding: 15rpx 20rpx;
    height: 45rpx;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: $border;

    .popup-button {
      color: white;
      width: 60rpx;
      height: 45rpx;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;

      &.cancel {
        color: #666;
      }

      &.confirm {
        color: $primary-color;
        font-weight: 500;
      }
    }
  }
}
</style>