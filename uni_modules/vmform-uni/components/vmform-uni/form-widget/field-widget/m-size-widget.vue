<template>
  <form-item-wrapper
    ref="fieldWrapper"
    :designer="designer"
    :field="field"
    :design-state="designState"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :sub-form-row-index="subFormRowIndex"
    :sub-form-col-index="subFormColIndex"
    :sub-form-row-id="subFormRowId"
  >
    <view class="size-input-container">
      <mSizeInner
        v-model:widthModel="data.widthModel"
        v-model:heightModel="data.heightModel"
        :field="field"
        :fieldDisabled="methodObjs.fieldDisabled()"
        :isReadMode="methodObjs.fieldReadonly()"
        :size="size"
        @focus:width="handleWidthFocus"
        @blur:width="handleWidthBlur"
        @change:width="handleWidthChange"
        @input:width="handleWidthInput"
        @focus:height="handleHeightFocus"
        @blur:height="handleHeightBlur"
        @change:height="handleHeightChange"
        @input:height="handleHeightInput"
      ></mSizeInner>
    </view>
    <template #readmode>
      <view class="size-readonly">
        {{ data.fieldModel.width }} × {{ data.fieldModel.height }}
      </view>
    </template>
  </form-item-wrapper>
</template>

<script setup>
import { reactive, watch, onMounted, onBeforeUnmount } from '../../utils/vueBuilder';
import { useField } from './fieldMixin';
import FormItemWrapper from './form-item-wrapper';
import mSizeInner from './m-size-inner.vue';

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

// 使用fieldMixin
const fieldMixin = useField({
  componentType: 'FieldWidget',
  props,
  emit,
  widgetData: data,
});

const { methodObjs, fieldWrapper, fieldEditor, setFieldWrapper } = fieldMixin;

// 更新字段模型
const updateFieldModel = () => {
  data.fieldModel = {
    width: data.widthModel,
    height: data.heightModel
  };
};

// 初始化字段模型
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

// 事件处理
const handleWidthFocus = () => {
  methodObjs.handleFocusCustomEvent();
};

const handleWidthBlur = () => {
  methodObjs.handleBlurCustomEvent();
};

const handleWidthChange = () => {
  updateFieldModel();
  methodObjs.handleChangeEvent(data.fieldModel);
};

const handleWidthInput = (value) => {
  data.widthModel = value;
  updateFieldModel();
  methodObjs.handleInputCustomEvent();
};

const handleHeightFocus = () => {
  methodObjs.handleFocusCustomEvent();
};

const handleHeightBlur = () => {
  methodObjs.handleBlurCustomEvent();
};

const handleHeightChange = () => {
  updateFieldModel();
  methodObjs.handleChangeEvent(data.fieldModel);
};

const handleHeightInput = (value) => {
  data.heightModel = value;
  updateFieldModel();
  methodObjs.handleInputCustomEvent();
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
var exposeObj = {};
// #ifdef VUE3
exposeObj = {
  data,
  methodObjs,
  handleWidthFocus,
  handleWidthBlur,
  handleWidthChange,
  handleWidthInput,
  handleHeightFocus,
  handleHeightBlur,
  handleHeightChange,
  handleHeightInput,
};
// #endif
</script>

<style scoped lang="scss">
.size-input-container {
  display: flex;
  align-items: center;
  background-color:white;
  gap: 8px;
}

.size-input-container .van-field {
  flex: 1;
}

.size-readonly {
  color: #606266;
  font-size: 14px;
  padding: 8px 0;
}
</style>