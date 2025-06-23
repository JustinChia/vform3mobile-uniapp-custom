<template>
  <container-item-wrapper :widget="widget">
    <zb-tab :height="50" line-width="50px" :data="tabs" v-model="activeName" :displayType="widget.options.displayType" :lineColor="widget.options.colorStyle" @input="setActiveTableName" />
    <view v-for="(item, index) in tabs" :key="index" :class="['tab', activeName === item.value ? 'active' : '']">
      <view v-for="(subWidget, swIdx) in item.widgetList" :key="swIdx">
        <vmformComponent :comp="subWidget.type" :key="'t' + swIdx" :field="subWidget" :parent-list="widget.widgetList" :index-of-parent-list="swIdx" :parent-widget="props.widget" />
      </view>
    </view>
  </container-item-wrapper>
</template>

<script setup>
import { ref, computed, nextTick } from '../../utils/vueBuilder'
import ContainerItemWrapper from './container-item-wrapper'

import { useContainer } from './containerItemMixin'
import zbTab from '@/uni_modules/zb-tab/zb-tab'

// 修改样式需要扩展zbTab组件功能,在ref='tab'的元素中加入style
// ref="tab" :style="{
//  backgroundColor: (displayType=='border-card'&&activeIndex===index)?lineColor:'unset',
//  color: (displayType=='border-card'&&activeIndex===index)? '#FFFFFF' : '#000000',
// }"

// 在props里增加
// displayType: {
// 	type: String
// }

const props = defineProps({
  widget: {
    type: Object,
    default: () => {
      return {
        type: '',
        options: {},
      }
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

const { data, methodObjs } = useContainer({
  componentType: 'ContainerItem',
  props,
})

const tabs = computed(() => {
  return props.widget.tabs.map(item => {
    return {
      value: item.options.name,
      name: item.options.label,
      widgetList: item.widgetList,
    }
  })
})

const activeName = ref('')

const setActiveTableName = val => {
  activeName.value = val

  methodObjs.handleTabbarChange(val)
  nextTick(() => {
    // 通知其他组件tab切换事件
    // m-collapse-item 获取事件后执行resize,否则计算的高度为0
    uni.$emit('tab-change', val)
  })
}

// 直接使用props.widget.tabs 在eslint中提示 Getting a value from the `props` in root scope of `<script setup>` will cause the value to lose reactivity
const widgetTabs = computed(() => {
  return props.widget.tabs
})

var activeTab = widgetTabs.value.find(item => item.options.active === true)
if (!activeTab) {
  if (widgetTabs.value.length > 0) {
    activeName.value = widgetTabs.value[0].options.name
  }
} else {
  activeName.value = activeTab.options.name
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
.tab {
  display: none;

  &.active {
    display: block;
  }
}
</style>
