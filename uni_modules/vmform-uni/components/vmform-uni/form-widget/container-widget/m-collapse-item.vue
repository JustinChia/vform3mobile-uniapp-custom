<template>
  <container-item-wrapper :widget="widget">
    <uni-collapse ref="collapse" class="demo-uni-row" :gutter="widget.options.gutter">
      <uni-collapse-item v-for="(subWidget, swIdx) in widget.widgetList" :key="swIdx" :open="subWidget.options.expand" :disabled="subWidget.options.disabled || subWidget.options.readonly">
        <template v-slot:title>
          <view class="collapse-title">{{ subWidget.options.title }}</view>
          <view class="collapse-subtitle" v-if="subWidget.options.label">{{ subWidget.options.label }}</view>
        </template>
        <view v-for="(targetWidget, targetIdx) in subWidget.widgetList" :key="'t' + targetIdx">
          <vmformComponent
            :comp="targetWidget.type"
            :key="'tc' + targetIdx"
            :field="targetWidget"
            :parent-list="subWidget.widgetList"
            :index-of-parent-list="targetIdx"
            :parent-widget="props.widget"
            :sub-form-row-id="subFormRowId"
            :sub-form-row-index="subFormRowIndex"
            :sub-form-col-index="subFormColIndex"
            @props-changed="propChanged"
          />
        </view>
      </uni-collapse-item>
    </uni-collapse>
  </container-item-wrapper>
</template>

<script setup>
import { ref, nextTick, onMounted } from '../../utils/vueBuilder'
import ContainerItemWrapper from './container-item-wrapper'

import { useContainer } from './containerItemMixin'

const props = defineProps({
  widget: {
    type: Object,
    default: () => {
      return { type: '', options: {} }
    },
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

const collapse = ref(null)

const { data, methodObjs } = useContainer({ componentType: 'ContainerItem', props })
const update = () => {
  collapse.value.resize()
}

uni.$on('tab-change', val => {
  update()
})

const propChanged = () => {
  nextTick(() => {
    update()
  })
}

onMounted(() => {
  nextTick(() => {
    props.widget.widgetList.forEach((item, itemIdx) => {
      let updateState = []
      if (item.options.readonly) updateState.push('readonly')
      if (item.options.disabled) updateState.push('disabled')
      methodObjs.updateWidgetState(item, updateState, true)
    })
  })
})

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
.uni-group {
  border-radius: 0px;
}
.uni-group-noborder {
  box-shadow: none;
}
.collapse-title {
  padding: 0 30rpx;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60rpx;
  line-height: 60rpx;
  background-color: #fff;
  color: #303133;
  font-weight: 500;
  cursor: pointer;
  outline: none;

  flex: 1;
  font-size: 28rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.collapse-subtitle {
  padding: 0 30rpx;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 40rpx;
  line-height: 40rpx;
  background-color: #fff;
  color: #888888;
  cursor: pointer;
  outline: none;

  flex: 1;
  font-size: 24rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
