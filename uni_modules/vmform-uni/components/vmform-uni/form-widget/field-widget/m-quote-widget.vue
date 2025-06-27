<template>
  <static-content-wrapper :designer="designer" :field="field" :design-state="designState" :display-style="field.options.displayStyle" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex"
                          :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId" style="padding:0px">
    <view class="quote-widget">
      <!-- 数量选择按钮 -->
      <view class="quantity-section field-label-with-desc">
        <view class="quantity-label">数量(本)</view>
        <view class="quantity-label">官网下单</view>
        <view class="quantity-label">人工接单</view>
      </view>

      <view class="quantity-section field-label-with-desc select-section" v-for="(qty,index) in visibleQuantities" :key="index">
        <view class="quantity-label" @click="selectQuantity(qty)">{{ qty }}</view>
        <view class="quantity-label">￥{{ officalOrderPrice[index] }}</view>
        <view class="quantity-label">￥{{ manualOrderPrice[index] }}</view>
      </view>
    </view>

    <!-- 数量输入框和立即算价按钮 -->
    <view class="quote-action-section">
      <uni-easyinput 
        v-model="inputQuantity" 
        type="number" 
        placeholder="50" 
        class="quantity-input"
        :inputBorder="false"
        @input="handleInputChange"
      />
      <button 
        type="primary" 
        class="vform-dark-button" 
        :loading="quoteLoading" 
        @click="handleQuote"
      >
        立即算价
      </button>
      <view v-if="quotePrice" class="price-display">
        ¥{{ quotePrice }}
      </view>
    </view>
  </static-content-wrapper>
</template>

<script setup>
import { reactive, onMounted, onBeforeUnmount, ref, computed } from '../../utils/vueBuilder';
import StaticContentWrapper from './static-content-wrapper';
import { useField } from './fieldMixin';

const props = defineProps({
  designState: {
    default: false,
    type: Boolean,
  },
  designer: {
    type: Object,
    default: () => {},
  },
  field: {
    type: Object,
    default: () => {},
  },
  indexOfParentList: {
    type: Number,
    default: 0,
  },
  parentList: {
    type: Array,
    default: () => [],
  },
  parentWidget: {
    type: Object,
    default: () => {},
  },
  subFormColIndex: {
    default: -1,
    type: Number,
  },
  subFormRowId: {
    default: '',
    type: String,
  },
  subFormRowIndex: {
    default: -1,
    type: Number,
  },
});

const emit = defineEmits(['props-changed']);

// 初始化数据
const data = reactive({
  fieldModel: null,
});

// 使用fieldMixin
const fieldMixin = useField({
  componentType: 'FieldWidget',
  props,
  emit,
  widgetData: data,
});

const { methodObjs } = fieldMixin;

// 组件状态
const selectedQuantity = ref(null);
const selectedOrderType = ref('official');
const inputQuantity = ref('');
const quoteLoading = ref(false);
const quotePrice = ref('');

// 计算可见的数量按钮
const visibleQuantities = computed(() => {
  if (props.field.options.quantities && props.field.options.quantities.length > 0) {
    return props.field.options.quantities;
  }
  // 默认数量
  return [10, 20, 50, 200, 300];
});

const officalOrderPrice = computed(() => {
  return props.field.options.officalOrderPrice || new Array(visibleQuantities.value.length).fill('-')
})

const manualOrderPrice = computed(() => {
  return props.field.options.manualOrderPrice || new Array(visibleQuantities.value.length).fill('-')
})

// 选择数量
const selectQuantity = (qty) => {
  selectedQuantity.value = qty;
  inputQuantity.value = qty.toString();
};

// 选择订单类型
const selectOrderType = (type) => {
  selectedOrderType.value = type;
};

// 处理输入框变化
const handleInputChange = (value) => {
  inputQuantity.value = value;
};

// 处理报价请求
const handleQuote = async () => {
  if (!inputQuantity.value) {
    uni.showToast({
      title: '请输入数量',
      icon: 'none'
    });
    return;
  }

  quoteLoading.value = true;
  try {
    // 获取表单配置
    const formConfig = methodObjs.getFormConfig ? methodObjs.getFormConfig() : {};

    // 构建请求参数
    const params = {
      quantity: parseInt(inputQuantity.value),
      orderType: selectedOrderType.value,
      formConfig: formConfig,
      // 可以添加更多参数
    };

    // 调用后端API（这里需要根据实际API进行调整）
    const result = await new Promise((resolve, reject) => {
      uni.request({
        url: '/api/quote',
        method: 'POST',
        data: params,
        header: {
          'Content-Type': 'application/json',
        },
        success: (res) => {
          resolve(res.data);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });

    if (result.success) {
      quotePrice.value = result.price;
    } else {
      // 处理错误
      uni.showToast({
        title: result.message || '报价失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('报价请求失败:', error);
    uni.showToast({
      title: '网络请求失败',
      icon: 'none'
    });
  } finally {
    quoteLoading.value = false;
  }
};

// 生命周期
onMounted(() => {
  // 初始化默认选择
  if (props.field.options.showOfficialOrder) {
    selectedOrderType.value = 'official';
  } else if (props.field.options.showManualOrder) {
    selectedOrderType.value = 'manual';
  }
});

onBeforeUnmount(() => {
  // 清理工作
});

// 暴露给模板的变量和方法
var exposeObj = {};
// #ifdef VUE3
exposeObj = {
  data,
  methodObjs,
  selectedQuantity,
  selectedOrderType,
  inputQuantity,
  quoteLoading,
  quotePrice,
  visibleQuantities,
  officalOrderPrice,
  manualOrderPrice,
  selectQuantity,
  selectOrderType,
  handleQuote,
  handleInputChange,
};
// #endif
</script>

<style lang="scss" scoped>

.quote-widget {
  border-radius: 8px;
  background: #fff;
  display: flex;
  justify-content: flex-start;
  gap: 8rpx;
  padding-bottom: 8px;

  .quantity-section {
    width: 120px;
    flex-grow: 0;
    padding:0px;
    border-radius: 4px;
    border:solid 1px #e8e8e8;

    .quantity-label {
      font-size: 12px;
      color: #606266;
      background-color: #f3f3f3;
      display: inline-block;
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
    }

    &.select-section {
      .quantity-label:not(:last-child) {
        border-bottom: solid 1px #f3f3f3;
      }
      .quantity-label:first-of-type {
        background-color: white;
        border-top-left-radius:4px;
        border-top-right-radius:4px;
        cursor:pointer;
        font-size:16px;
        font-weight:bold;
        &:hover{
          background-color:#fafafafa;
        }
      }
      .quantity-label {
        background-color: #f8f8f8;
        font-size:14px;
        font-weight:bold;
      }
    }
  }
}
.quote-action-section {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 145px;
  gap: 0;
  
  .quantity-input {
    width: 200px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    border-right: none;
  }
  
  .vform-dark-button {
    background-color: #409eff;
    color: white;
    border: 1px solid #409eff;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    padding: 8px 16px;
    font-size: 14px;
    min-height: 40px;
    
    &:hover {
      background-color: #66b1ff;
      border-color: #66b1ff;
    }
  }
  
  .price-display {
    margin-left: 16px;
    font-size: 16px;
    font-weight: bold;
    color: #e6a23c;
  }
}
</style>