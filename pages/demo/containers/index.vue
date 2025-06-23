<template>
  <view class="container">
    <view class="hello-text">
      <button type="primary" size="mini" style="margin-right: 5px" @click="getFormRef">表单引用</button>
      <button type="primary" size="mini" style="margin-right: 5px" @click="getWidgetRef">字段引用</button>

      <button type="primary" size="mini" style="margin-right: 5px" @click="setFormData">设置数据</button>
      <button type="primary" size="mini" style="margin-right: 5px" @click="getFormData">获取数据</button>
      <button type="primary" size="mini" style="margin-right: 5px" @click="setHidden">隐藏容器</button>

      <template v-if="isReady && showIfWidget('tab')">
        <!-- 暂不支持tab操作 -->
        <!-- <button type="primary" size="mini" style="margin-right: 5px" @click="activeTab">激活tab2</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="disableTab">禁用tab2</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="enableTab">启用tab2</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="hideTab">隐藏tab2</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="showTab">显示tab2</button> -->
      </template>

      <template v-if="isReady && showIfWidget('subform')">
        <button type="primary" size="mini" style="margin-right: 5px" @click="disableSubFormRow">禁用子表单行1</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="enableSubFormRow">启用子表单行1</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="disableSubForm">禁用子表单</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="enableSubForm">启用子表单</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="resetSubForm">重置表单</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="getSubFormValues">获取表单数据</button>
      </template>
    </view>

    <div class="formContainer">
      <vm-form-render ref="vmFormRenderRef" :form-json="data.formJson" :form-data="{}" :globalDsv="data.globalDsv"> </vm-form-render>
    </div>
    <outputs :log="log" :clear="clearOutput"></outputs>
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref, nextTick, computed } from '@/utils/vue.js'

var w = ref('')

// 渲染器
import vmFormRender from '@/uni_modules/vmform-uni/components/vmform-uni/form-render/index.vue'
// 输出组件
import outputs from '../components/ouputs.vue'

import { useVformRenderHooks } from '../vformRender/hooks/vformRenderHooks.js'
// import { useWidgetActionHooks } from './hooks/widgetActionHooks.js';

// 表单Json
//button 提示Do not use built-in or reserved HTML elements as component id: button，因此改为vButton
import widgetJson from '../../index/formJson/index.js'
const { formJson } = widgetJson

const { input, textarea, number, stepper, calendar, date, time, datetime, daterange, radio, checkbox, select, switcher, divider, slider, slot, statictext, htmltext, vbutton, rate, alert, cascader, fileupload, pictureupload } = widgetJson
const { cellgroup, collapse, collapseItem, tab, tabItem, grid, gridCol, subform } = widgetJson

// 表单数据
import { data } from '@/pages/hooks/usePage'

const { log, output, clearOutput, vmFormRenderRef } = useVformRenderHooks()

let widgetList = []
const safeSetFormJson = () => {
  const clearHandler = setInterval(() => {
    if (vmFormRenderRef.value != null) {
      clearInterval(clearHandler)
      const allWidgets = [input, textarea, number, stepper, calendar, date, time, datetime, daterange, radio, checkbox, select, switcher, divider, slider, slot, statictext, htmltext, vbutton, rate, alert, cascader, fileupload, pictureupload]
      if (w.value === 'group') {
        widgetList = [cellgroup(allWidgets)]
      } else if (w.value === 'grid') {
        widgetList = [grid([gridCol([input, textarea, number, stepper, calendar, date, time, datetime, daterange]), gridCol([radio, checkbox, select, switcher, divider, slider, slot, statictext, htmltext, vbutton, rate, alert, cascader, fileupload, pictureupload])])]
      } else if (w.value === 'collapse') {
        widgetList = [collapse([collapseItem([input, textarea, number, stepper, calendar, date, time, datetime, daterange]), collapseItem([radio, checkbox, select, switcher, divider, slider, slot, statictext, htmltext, vbutton, rate, alert, cascader, fileupload, pictureupload])])]
      } else if (w.value === 'tab') {
        const tabItem1 = tabItem([input, textarea, number, stepper, calendar, date, time, datetime, daterange])
        tabItem1.id = 'm-tab-pane-1'
        tabItem1.options.label = 'tab1'
        tabItem1.options.name = 'tab1'
        const tabItem2 = tabItem([radio, checkbox, select, switcher, divider, slider, slot, statictext, htmltext])
        tabItem2.id = 'm-tab-pane-2'
        tabItem2.options.label = 'tab2'
        tabItem2.options.name = 'tab2'
        const tabItem3 = tabItem([vbutton, rate, alert, cascader, fileupload, pictureupload])
        tabItem3.id = 'm-tab-pane-3'
        tabItem3.options.label = 'tab3'
        tabItem3.options.name = 'tab3'

        widgetList = [tab([tabItem1, tabItem2, tabItem3])]
      } else if (w.value === 'subform') {
        widgetList = [subform([input, textarea, number, stepper, calendar])]
      }
      const json = formJson(widgetList)
      console.log('json', json)
      vmFormRenderRef.value.setFormJson(json)
    }
  }, 100)
}

onLoad(option => {
  w.value = option.widget
  safeSetFormJson()
})

// 设置事件监听
uni.$off()
nextTick(() => {
  // Define event listeners

  const eventHandler = (text, p) => {
    console.log(text, p)
    output(text)
  }
  const eventListeners = [
    { name: 'onSubFormRowAdd', handler: p => eventHandler(`receive ${p.triggerName} onSubFormRowAdd`, p) },
    { name: 'onSubFormRowInsert', handler: p => eventHandler(`receive ${p.triggerName} onSubFormRowInsert`, p) },
    { name: 'onSubFormRowDelete', handler: p => eventHandler(`receive ${p.triggerName} onSubFormRowDelete`, p) },
    { name: 'onSubFormRowChange', handler: p => eventHandler(`receive ${p.triggerName} onSubFormRowChange`, p) },
  ]
  // Register event listeners
  eventListeners.forEach(({ name, handler }) => uni.$on(name, handler))
})

// 获取组件引用
const getWidgetRef = (showOutput = true) => {
  const widgetName = widgetList[0].options.name
  const widgetRef = vmFormRenderRef.value.getWidgetRef(widgetName)

  if (showOutput) {
    console.log('widgetRef', widgetRef)
    output(`组件uid:${widgetRef._uid || widgetRef.$.uid},更多数据请在控制台查看输出`)
  }
  return widgetRef
}

// 获取表单引用
const getFormRef = () => {
  const widgetName = widgetList[0].options.name
  const widgetRef = vmFormRenderRef.value.getWidgetRef(widgetName)
  const formRef = widgetRef.getFormRef()
  console.log('formRef', formRef)
  output(`组件uid:${formRef._uid || formRef.$.uid},更多数据请在控制台查看输出`)
  return formRef
}

const setFormData = () => {
  vmFormRenderRef.value.setFormData(data.formData)
}

const getFormData = () => {
  vmFormRenderRef.value.getFormData().then(formData => {
    console.log('formData', formData)
    output(JSON.stringify(formData))
  })
}

var hidden = true
const setHidden = () => {
  const widgetName = widgetList[0].options.name
  const widgetRef = vmFormRenderRef.value.getWidgetRef(widgetName)
  widgetRef.setHidden(hidden)
  hidden = !hidden
}

const isReady = computed(() => {
  return w != ''
})

const disableSubFormRow = () => {
  const widgetName = widgetList[0].options.name
  const widgetRef = vmFormRenderRef.value.getWidgetRef(widgetName)
  widgetRef.disableSubFormRow(0)
}

const enableSubFormRow = () => {
  const widgetName = widgetList[0].options.name
  const widgetRef = vmFormRenderRef.value.getWidgetRef(widgetName)
  widgetRef.enableSubFormRow(0)
}

const disableSubForm = () => {
  const widgetName = widgetList[0].options.name
  const widgetRef = vmFormRenderRef.value.getWidgetRef(widgetName)
  widgetRef.disableSubForm()
}

const enableSubForm = () => {
  const widgetName = widgetList[0].options.name
  const widgetRef = vmFormRenderRef.value.getWidgetRef(widgetName)
  widgetRef.enableSubForm()
}

const resetSubForm = () => {
  const widgetName = widgetList[0].options.name
  const widgetRef = vmFormRenderRef.value.getWidgetRef(widgetName)
  widgetRef.resetSubForm()
}

const getSubFormValues = () => {
  const widgetName = widgetList[0].options.name
  const widgetRef = vmFormRenderRef.value.getWidgetRef(widgetName)
  const values = widgetRef.getSubFormValues()
  console.log('values', values)
  output(JSON.stringify(values))
}

const showIfWidget = widgetName => {
  if (typeof widgetName === 'string') return widgetName === w.value
  else if (Array.isArray(widgetName)) return widgetName.includes(w.value)
  else return false
}

const showIfNotWidget = widgetName => {
  if (typeof widgetName === 'string') return widgetName !== w.value
  else if (Array.isArray(widgetName)) return !widgetName.includes(w.value)
  else return false
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}
.formContainer {
  padding: 20rpx;
  border: 1px solid #ccc;
}
</style>
