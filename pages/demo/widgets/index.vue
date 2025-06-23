<template>
  <view class="container">
    <view class="hello-text">
      <button type="primary" size="mini" style="margin-right: 5px" @click="getFormRef">表单引用</button>
      <button type="primary" size="mini" style="margin-right: 5px" @click="getWidgetRef">字段引用</button>
      <button type="primary" size="mini" style="margin-right: 5px" @click="getFormData">获取表单数据</button>

      <button type="primary" size="mini" style="margin-right: 5px" v-if="isReady && showIfNotWidget(['statictext', 'htmltext', 'vbutton', 'divider', 'slot', 'alert'])" @click="setValue">设置数据</button>
      <button type="primary" size="mini" style="margin-right: 5px" v-if="isReady && showIfNotWidget(['statictext', 'htmltext', 'vbutton', 'divider', 'slot', 'alert'])" @click="getValue">获取数据</button>
      <button type="primary" size="mini" style="margin-right: 5px" v-if="isReady && showIfNotWidget(['statictext', 'htmltext', 'vbutton', 'divider', 'slot', 'alert'])" @click="resetField">重置字段</button>

      <button type="primary" size="mini" style="margin-right: 5px" v-if="isReady && showIfNotWidget(['statictext', 'htmltext', 'vbutton', 'divider', 'slot', 'alert'])" @click="setReadonly">设置只读</button>
      <button type="primary" size="mini" style="margin-right: 5px" v-if="isReady && showIfNotWidget(['statictext', 'htmltext', 'divider', 'slot', 'alert'])" @click="setReadMode">只读模式</button>

      <button type="primary" size="mini" style="margin-right: 5px" v-if="isReady && showIfNotWidget(['statictext', 'htmltext', 'divider', 'slot', 'alert'])" @click="setDisabled">禁用字段</button>

      <button type="primary" size="mini" style="margin-right: 5px" v-if="isReady && showIfWidget('input')" @click="setAppendButtonVisible">附加按钮可见</button>
      <button type="primary" size="mini" style="margin-right: 5px" v-if="isReady && showIfWidget('input')" @click="setAppendButtonDisabled">附加按钮禁用</button>

      <button type="primary" size="mini" style="margin-right: 5px" @click="setHidden">字段隐藏</button>

      <button type="primary" size="mini" style="margin-right: 5px" v-if="isReady && showIfNotWidget(['statictext', 'htmltext', 'vbutton', 'divider', 'slot', 'alert'])" @click="setRequired">字段必填</button>
      <button type="primary" size="mini" style="margin-right: 5px" v-if="isReady && showIfNotWidget(['statictext', 'htmltext', 'vbutton', 'divider', 'slot', 'alert'])" @click="setLabel">字段标签</button>

      <button type="primary" size="mini" style="margin-right: 5px" v-if="isReady && showIfWidget(['select', 'radio', 'checkbox', 'cascader'])" @click="loadOptions">加载选择项</button>
      <button type="primary" size="mini" style="margin-right: 5px" v-if="isReady && showIfWidget(['select', 'radio', 'checkbox', 'cascader'])" @click="getOptions">返回选择项</button>
      <button type="primary" size="mini" style="margin-right: 5px" v-if="isReady && showIfWidget(['select', 'radio', 'checkbox', 'cascader'])" @click="disableOption">禁用选择项</button>
      <button type="primary" size="mini" style="margin-right: 5px" v-if="isReady && showIfWidget(['select', 'radio', 'checkbox', 'cascader'])" @click="enableOption">启用选择项</button>

      <button type="primary" size="mini" style="margin-right: 5px" v-if="isReady && showIfWidget(['pictureupload', 'fileupload'])" @click="setUploadHeader">设置上传请求头</button>
      <button type="primary" size="mini" style="margin-right: 5px" v-if="isReady && showIfWidget(['pictureupload', 'fileupload'])" @click="setUploadData">设置上传参数</button>

      <button type="primary" size="mini" style="margin-right: 5px" v-if="isReady && showIfNotWidget(['slot', 'alert'])" @click="setWidgetOption">设置组件属性</button>
      <button type="primary" size="mini" style="margin-right: 5px" v-if="isReady && showIfNotWidget(['statictext', 'htmltext', 'divider', 'vbutton', 'time', 'alert', 'slot', 'switch'])" @click="getFieldEditor">获取原生组件</button>
    </view>

    <div class="formContainer">
      <vm-form-render ref="vmFormRenderRef" :form-json="data.formJson" :form-data="{}" :globalDsv="data.globalDsv">
        <template #mslot54180>
          <view>mslot54180 自定义插槽</view>
        </template>
      </vm-form-render>
    </div>
    <outputs :log="log" @clear="clearOutput"></outputs>
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

// 表单Json
//button 提示Do not use built-in or reserved HTML elements as component id: button，因此改为vButton
import widgetJson from '../../index/formJson/index.js'
const { formJson } = widgetJson

// 表单数据
import { data } from '@/pages/hooks/usePage'

const { log, output, clearOutput, vmFormRenderRef } = useVformRenderHooks()

const safeSetFormJson = () => {
  var clearHandler = setInterval(() => {
    if (vmFormRenderRef.value != null) {
      console.log('formJson', formJson([widgetJson[w.value]]))
      vmFormRenderRef.value.setFormJson(formJson([widgetJson[w.value]]))
      if (clearHandler) {
        clearInterval(clearHandler)
        clearHandler = null
      }
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
    // 以下两个事件未实现
    // onValidate
    // onBeforeUpload
    { name: 'onCreated', handler: p => eventHandler(`receive ${p.triggerName} onCreated`, p) },
    { name: 'onMounted', handler: p => eventHandler(`receive ${p.triggerName} onMounted`, p) },
    { name: 'onChange', handler: p => eventHandler(`receive ${p.triggerName} onChange`, p) },
    { name: 'minput104177_onCreated', handler: p => eventHandler(`receive ${p.triggerName} minput104177_onCreated`, p) },
    { name: 'minput104177_onMounted', handler: p => eventHandler(`receive ${p.triggerName} minput104177_onMounted`, p) },
    { name: 'minput104177_onChange', handler: p => eventHandler(`receive ${p.triggerName} minput104177_onChange`, p) },
    { name: 'onClick', handler: p => eventHandler(`receive ${p.triggerName} onClick`, p) },
    { name: 'onClose', handler: p => eventHandler(`receive ${p.triggerName} onClose`, p) },
    { name: 'onConfirm', handler: p => eventHandler(`receive ${p.triggerName} onConfirm`, p) },
    { name: 'onBlur', handler: p => eventHandler(`receive ${p.triggerName} onBlur`, p) },
    { name: 'onFocus', handler: p => eventHandler(`receive ${p.triggerName} onFocus`, p) },
    { name: 'onAppendButtonClick', handler: p => eventHandler(`receive ${p.triggerName} onAppendButtonClick`, p) },
    { name: 'onUploadSuccess', handler: p => eventHandler(`receive ${p.triggerName} onUploadSuccess`, p) },
    { name: 'onUploadError', handler: p => eventHandler(`receive ${p.triggerName} onUploadError`, p) },
    { name: 'onFileRemove', handler: p => eventHandler(`receive ${p.triggerName} onFileRemove`, p) },
  ]
  // Register event listeners
  eventListeners.forEach(({ name, handler }) => uni.$on(name, handler))
})

// 获取组件引用
const getWidgetRef = (showOutput = true) => {
  const widgetRef = vmFormRenderRef.value.getWidgetRef(widgetJson[w.value].options.name)
  if (showOutput) {
    // #ifndef APP
    console.log('widgetRef', widgetRef)
    // #endif
    // #ifdef APP
    console.log('widgetRef', widgetRef._uid || widgetRef.$.uid)
    // #endif
    output(`组件uid:${widgetRef._uid || widgetRef.$.uid},更多数据请在控制台查看输出`)
  }
  return widgetRef
}

// 获取表单引用
const getFormRef = () => {
  const widgetRef = vmFormRenderRef.value.getWidgetRef(widgetJson[w.value].options.name)
  const formRef = widgetRef.getFormRef()
  // #ifndef APP
  console.log('formRef', formRef)
  // #endif
  // #ifdef APP
  console.log('formRef', formRef._uid || formRef.$.uid)
  // #endif
  output(`组件uid:${formRef._uid || formRef.$.uid},更多数据请在控制台查看输出`)
  return formRef
}

const getFormData = () => {
  const widgetRef = vmFormRenderRef.value.getWidgetRef(widgetJson[w.value].options.name)
  const formRef = widgetRef.getFormRef()
  formRef.getFormData().then(data => {
    console.log('formData', data)
    output(`获取到的组件数据` + JSON.stringify(data))
  })
}

const setValue = () => {
  const widgetRef = getWidgetRef(false)
  widgetRef.setValue(data.formData[widgetJson[w.value].options.name])
}
const getValue = () => {
  const widgetRef = getWidgetRef(false)
  const value = widgetRef.getValue()
  console.log('组件数据', value)
  output(`组件数据:${JSON.stringify(value)}`)
}
const resetField = () => {
  const widgetRef = getWidgetRef(false)
  widgetRef.resetField()
}
var readonly = true
const setReadonly = () => {
  const widgetRef = getWidgetRef(false)
  widgetRef.setReadonly(readonly)
  readonly = !readonly
}

var readmode = true
const setReadMode = () => {
  const widgetRef = getWidgetRef(false)
  widgetRef.setReadMode(readmode)
  readmode = !readmode
}

var disabled = true
const setDisabled = () => {
  const widgetRef = getWidgetRef(false)
  widgetRef.setDisabled(disabled)
  disabled = !disabled
}

var appendButtonVisible = true
const setAppendButtonVisible = () => {
  const widgetRef = getWidgetRef(false)
  widgetRef.setAppendButtonVisible(appendButtonVisible)
  appendButtonVisible = !appendButtonVisible
}

var appendButtonDisabled = true
const setAppendButtonDisabled = () => {
  const widgetRef = getWidgetRef(false)
  widgetRef.setAppendButtonDisabled(appendButtonDisabled)
  appendButtonDisabled = !appendButtonDisabled
}

var hidden = true
const setHidden = () => {
  const widgetRef = getWidgetRef(false)
  widgetRef.setHidden(hidden)
  hidden = !hidden
}

var required = true
const setRequired = () => {
  const widgetRef = getWidgetRef(false)
  widgetRef.setRequired(required)
  required = !required
}

const setLabel = () => {
  const widgetRef = getWidgetRef(false)
  widgetRef.setLabel(widgetJson[w.value].options.label + ' 新label')
}

const focus = () => {
  const widgetRef = getWidgetRef(false)
  widgetRef.focus()
}

var isLoadoptions = false
const loadOptions = () => {
  const widgetRef = getWidgetRef()
  widgetRef.loadOptions([
    { label: '语文', value: 'chinese' },
    { label: '数学', value: 'match' },
  ])
  isLoadoptions = true
}

const getOptions = () => {
  const widgetRef = getWidgetRef(false)
  const options = widgetRef.getOptions()
  console.log('组件选项', options)
  output(`组件选项:${JSON.stringify(options)}`)
}

const disableOption = () => {
  const widgetRef = getWidgetRef(false)
  widgetRef.disableOption(isLoadoptions ? 'chinese' : 1)
  output('已禁用')
}

const enableOption = () => {
  const widgetRef = getWidgetRef(false)
  widgetRef.enableOption(isLoadoptions ? 'chinese' : 1)
  output('已启用')
}

const setWidgetOption = () => {
  const widgetRef = getWidgetRef(false)

  console.log('value', w.value, widgetRef)

  if (w.value == 'statictext') {
    widgetRef.setWidgetOption('textContent', '静态文字改变')
  } else if (w.value == 'htmltext') {
    widgetRef.setWidgetOption('htmlContent', '<div>html文字改变</div>')
  } else {
    widgetRef.setWidgetOption('label', widgetJson[w.value].options.label + ' 新label')
    widgetRef.setWidgetOption('disabled', true)
  }
}

const getFieldEditor = () => {
  const widgetRef = getWidgetRef(false)
  const fieldEditor = widgetRef.getFieldEditor()
  console.log('原生组件', fieldEditor)
  output(`组件uid:${fieldEditor._uid || fieldEditor.$.uid},更多数据请在控制台查看输出`)
}

const isReady = computed(() => {
  return w != ''
})

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

const setUploadHeader = () => {
  const widgetRef = getWidgetRef(false)
  widgetRef.setUploadHeader('header', 'header-value')
}
const setUploadData = () => {
  const widgetRef = getWidgetRef(false)
  widgetRef.setUploadData('formdata', 'formdata-value')
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
