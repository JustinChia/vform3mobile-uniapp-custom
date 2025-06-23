<template>
  <view v-if="showField" ref="fieldWrapper" class="field-wrapper" :class="[field.options.name, customClass]" :style="{ display: displayStyle }">
    <view class="static-content-item" :style="{ display: displayStyle }">
      <!-- 需要增加label-position属性  -->
      <slot v-if="!methodObjs.isReadMode()" />
      <slot v-else name="readmode" />
    </view>
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

  displayStyle: {
    type: String,
    default: 'block',
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

const fieldMixin = useField({ props })
const { methodObjs, fieldWrapper } = fieldMixin

const { setReadMode } = methodObjs

const customClass = computed(() => {
  return props.field.options.customClass ? props.field.options.customClass.join(' ') : ''
})

const showField = computed(() => {
  // 如果是只读模式的按钮，不显示
  if (methodObjs.isReadMode() && props.field.type === 'm-button') return false
  return !props.field.options.hidden
})

defineExpose({
  setReadMode,
})
</script>
<script>
export default {
  options: {
    styleIsolation: 'shared',
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/global.scss';

.design-time-bottom-margin {
  margin-bottom: 5px;
}

.field-wrapper {
  position: relative;

  .field-action {
    position: absolute;
    //bottom: -24px;
    bottom: 0;
    right: -2px;
    height: 22px;
    line-height: 22px;
    background: $--color-primary;
    z-index: 9;

    i {
      font-size: 14px;
      color: #fff;
      margin: 0 5px;
      cursor: pointer;
    }
  }

  .drag-handler {
    position: absolute;
    top: 0;
    //bottom: -22px;  /* 拖拽手柄位于组件下方，有时无法正常拖动，原因未明？？ */
    left: -1px;
    height: 20px;
    line-height: 20px;
    //background: $--color-primary;
    z-index: 9;

    i {
      font-size: 12px;
      font-style: normal;
      color: #fff;
      margin: 4px;
      cursor: move;
    }

    &:hover {
      //opacity: 1;
      background: $--color-primary;
    }
  }
}

.static-content-item {
  min-height: 20px;
  padding: 9px 18px;
  display: flex; /* 垂直居中 */
  align-items: center; /* 垂直居中 */
  background-color: white;

  :deep(.el-divider--horizontal) {
    margin: 0;
  }
}

.el-form-item.selected,
.static-content-item.selected {
  outline: 2px solid $--color-primary;
}
</style>
