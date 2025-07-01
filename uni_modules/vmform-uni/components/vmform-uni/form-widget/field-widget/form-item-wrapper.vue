<!--
/**
 * author: vformAdmin
 * email: vdpadmin@163.com
 * website: https://www.vform666.com
 * date: 2021.08.18
 * remark: 如果要分发VForm源码，需在本文件顶部保留此文件头信息！！
 */
-->

<template>
  <!-- 这个view删除后会导致验证错误 -->
  <!-- checkbox 强制 labelWidth 为100% labelPosition为top 在fieldMixin.js里定义的-->
  <view :class="[fieldStatusClass, methodObjs.isFocus() ? 'is-focus' : '', field.type,'label-position-'+methodObjs.labelPosition()]">
    <uni-forms-item v-if="!field.options.hidden" ref="fieldItemRef" :label-align="methodObjs.labelAlign()" :label-position="methodObjs.labelPosition()" :labelWidth="methodObjs.fieldLabelWidth()" :name="validateName" :rules="methodObjs.getFieldRules()" :required="required">
      <template #label>
        <view class="field-label" :class="{required: field.options.required}">
          <view class="label-text">{{ methodObjs.fieldLabel() }}</view>
          <view class="label-desc" v-if="field.options.desc" @click="showDescPopup">
            <uni-icons type="help" size="18" color="#999"></uni-icons>
          </view>
        </view>
      </template>
      <!-- 需要增加label-position属性  -->
      <slot v-if="!methodObjs.isReadMode()" />
      <slot v-else name="readmode" />
    </uni-forms-item>

  </view>
</template>
<script setup>
import { computed, ref } from '../../utils/vueBuilder'
import { useField } from './fieldMixin'


const props = defineProps({
  field: {
    type: Object,
    default: () => { },
  },
  designer: {
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

// const getFormConfig = inject('getFormConfig')
// const globalModel = inject('globalModel')

const fieldMixin = useField({
  props,
})
const { data, methodObjs, fieldItemRef } = fieldMixin


// 显示desc弹窗
const showDescPopup = () => {
  // 如果本地弹窗不可用，则触发全局事件
  uni.$emit('openDescPopup', props.field)
}

const subFormName = computed(() => {
  return props.parentWidget ? props.parentWidget.options.name : ''
})

const subFormItemFlag = computed(() => {
  return props.parentWidget ? props.parentWidget.type === 'm-sub-form' : false
})

const validateName = computed(() => {
  if (subFormItemFlag.value) {
    return subFormName.value + '.' + props.subFormRowIndex + '.' + props.field.options.name
  } else {
    return props.field.options.name
  }
})

const { setReadMode } = methodObjs

const customClass = computed(() => {
  return props.field.options.customClass ? props.field.options.customClass.join(' ') : ''
})

const required = computed(() => {
  return !!data.rules.find(x => x.required)
})

const setRules = rules => {
  methodObjs.setRules(rules)
}

// 根据字段的只读和禁用状态设置样式
const fieldStatusClass = computed(() => {
  if (!props.field.options.disabled && !props.field.options.readonly) {
    return 'enable'
  } else if (!props.field.options.disabled && props.field.options.readonly) {
    return 'fieldReadonly'
  } else if (props.field.options.disabled) {
    return 'fieldDisabled'
  }
})

defineExpose({
  setReadMode,
  setRules
})
</script>
<script>
export default {
  options: {
    styleIsolation: 'shared',
  },
}
</script>

<style lang="scss">
@import '../styles/globalField.scss';

.field-wrapper {
  position: relative;
  //margin-bottom:2px;

  .field-action {
    position: absolute;
    bottom: 0;
    right: -2px;
    height: 22px;
    line-height: 22px;
    z-index: 9;

    i {
      font-size: 14px;
      color: #fff;
      margin: 0 5px;
      cursor: pointer;
    }
  }
}
.field-label {
  height: 50rpx;
  line-height: 50rpx;
  font-size: 24rpx;
  color: #999;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .label-text {
    display: inline-block;
  }
  .label-desc {
    display: inline-block;
    z-index: 1;
  }
  &.required:before {
    content: '*';
    color: red;
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.label-desc {
  display: inline;
  margin-left: 2rpx;
  cursor: pointer;
  transition: all 0.2s ease;
}

.static-content-item {
  min-height: 20px;
  display: flex;
  /* 垂直居中 */
  align-items: center;
  /* 垂直居中 */

  :deep(.el-divider--horizontal) {
    margin: 0;
  }
}
.label-position-top.m-checkbox {
  .uni-forms-item {
    flex-direction: column;
  }
}

// #ifndef MP-WEIXIN
::v-deep .uni-forms-item__content {
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
}

// #endif
</style>
<style>
.uni-forms-item {
  background-color: #ffffff;

  padding: 5rpx 30rpx;
  box-sizing: border-box;
}

.uni-forms-item__content {
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
