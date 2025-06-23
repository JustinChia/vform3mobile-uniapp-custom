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
  <view :class="[fieldStatusClass, methodObjs.isFocus() ? 'is-focus' : '', field.type]">
    <uni-forms-item
      v-if="!field.options.hidden"
      ref="fieldItemRef"
      :label="methodObjs.fieldLabel()"
      :label-align="methodObjs.labelAlign()"
      :label-position="methodObjs.labelPosition()"
      :labelWidth="methodObjs.fieldLabelWidth()"
      :name="validateName"
      :rules="methodObjs.getFieldRules()"
      :required="required"
    >
      <!-- 需要增加label-position属性  -->
      <slot v-if="!methodObjs.isReadMode()" />
      <slot v-else name="readmode" />
    </uni-forms-item>
  </view>
</template>
<script setup>
import { computed } from '../../utils/vueBuilder'
import { useField } from './fieldMixin'

const props = defineProps({
  field: {
    type: Object,
    default: () => {},
  },
  designer: {
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
  setRules,
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
