<template>
  <container-item-wrapper :widget="widget">
    <uni-row class="demo-uni-row" :gutter="widget.options.gutter" v-if="!widget.options.hidden">
      <uni-col v-for="(subWidget, swIdx) in displayCols()" :key="swIdx" :span="subWidget.options.span" :offset="subWidget.options.offset">
        <view v-for="(targetWidget, targetIdx) in displayWidgetList(subWidget.widgetList)" :key="'t' + targetIdx">
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
          />
        </view>
      </uni-col>
    </uni-row>
  </container-item-wrapper>
</template>

<script setup>
import { onMounted } from '../../utils/vueBuilder'
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

const { data, methodObjs } = useContainer({ componentType: 'ContainerItem', props })

const register = (widgetName, subWidget) => {
  methodObjs.registerWidgetToRefList(widgetName, subWidget)
}

onMounted(() => {
  props.widget.cols.forEach(subWidget => {
    register(subWidget.options.name, subWidget)
  })
})

const displayCols = () => {
  return props.widget.cols.filter(col => !col.options.hidden)
}

// 只显示非隐藏的组件
const displayWidgetList = widgetList => {
  return widgetList //.filter(w => !w.options.hidden)
}

const isShowCol = widget => {
  return !widget.options.hidden
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
.uni-group {
  border-radius: 0px;
}
.uni-group-noborder {
  box-shadow: none;
}
</style>
