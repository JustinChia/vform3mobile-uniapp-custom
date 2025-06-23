<template>
  <view class="content">
    <view class="text-area">
      <view style="line-height: 70rpx">
        <button type="primary" size="mini" style="margin-right: 5px" @click="setDevelopedWidgets">已开发组件</button>

        <button type="primary" size="mini" style="margin-right: 5px" @click="getFormJson">获取表单json</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="getFormData">获取数据</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="getFormDataNoValidate">获取数据 不校验</button>
        <!-- <button type="primary" size="mini" style="margin-right: 5px" @click="clickHandler">表单校验</button> -->
        <button type="primary" size="mini" style="margin-right: 5px" @click="setFormData">写入数据</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="hideAndShow">隐藏/显示</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="readAndWrite">只读/可编辑</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="getFieldValue">获取字段值</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="setFieldValue">设置字段值</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="resetField">清空字段</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="setReadMode">字段只读模式</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="setFormReadMode">表单只读模式</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="setDisabled">禁用字段</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="setHidden">隐藏字段</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="setRequired">设置字段为必填</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="setLabel">设置标签</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="focus">字段聚焦</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="loadOptions">加载下拉选项</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="getOptions">获取下拉选项</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="disableOption">禁用选项</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="enableOption">启用选项</button>
      </view>
      <view style="padding: 10px; padding-right: 20px">
        <vm-form-render ref="vmformRender" :form-json="data.formJson" :form-data="data.formData" :option-data="data.optionData" :globalDsv="data.globalDsv">
          <template #mslot54180>
            <view style="font-size: 40rpx">SLOT插入值</view>
          </template>
        </vm-form-render>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick } from '@/utils/vue.js'

import vmFormRender from '@/uni_modules/vmform-uni/components/vmform-uni/form-render/index.vue'

let html = []

const getOptionProps = options => {
  let props = []

  Object.keys(options).forEach(key => {
    props.push(`:${key}="comprops.${key}"`)
  })

  return props.join(' ')
}

import widgetList from './formJson/index.js'
const { formJson } = widgetList
import { useTestButtons } from '../hooks/useTestButtons.js'

import { data, formData, vmformRender } from '../hooks/usePage'

data.formJson = formJson([])

// 设置事件监听
uni.$off()
nextTick(() => {
  // Define event listeners
  const eventListeners = [
    // 监听事件，通过参数区分触发事件的字段或者监听组件名_事件名

    { name: 'onCreated', handler: p => console.log(`receive onCreated`, p) },
    { name: 'onMounted', handler: p => console.log(`receive onMounted`, p) },
    { name: 'onChange', handler: p => console.log('receive onChange', p) },
    { name: 'minput104177_onChange', handler: p => console.log('receive minput104177_onChange', p) },
    { name: 'onClick', handler: p => console.log('receive onClick', p) },
    { name: 'onClose', handler: p => console.log('receive onClose', p) },
    { name: 'onConfirm', handler: p => console.log('receive onConfirm', p) },
    { name: 'onBlur', handler: p => console.log('receive onBlur', p) },
    { name: 'onFocus', handler: p => console.log('receive onFocus', p) },
    { name: 'onUploadSuccess', handler: p => console.log('receive onUploadSuccess', p) },
    { name: 'onUploadError', handler: p => console.log('receive onUploadError', p) },
    { name: 'onFileRemove', handler: p => console.log('receive onFileRemove', p) },
  ]

  // Register event listeners
  eventListeners.forEach(({ name, handler }) => uni.$on(name, handler))
})

const setBeforeUpload = e => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 2000)
  })
}

const setAfterUpload = e => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ url: 'https://img.yzcdn.cn/vant/cat.jpeg', name: '定义的文件名' })
    }, 2000)
  })
}

const {
  setDevelopedWidgets,
  setDevelopingWidgets,
  getFormData,
  setFormData,
  getFormJson,
  getFormDataNoValidate,
  hideAndShow,
  readAndWrite,
  globalDsv,
  getFieldValue,
  setFieldValue,
  resetField,
  setReadMode,
  setFormReadMode,
  setDisabled,
  setHidden,
  setRequired,
  setLabel,
  focus,
  loadOptions,
  getOptions,
  disableOption,
  enableOption,
} = useTestButtons()

setTimeout(() => {
  setDevelopingWidgets()

  setTimeout(() => {
    const uploader = vmformRender.value.getWidgetRef('mfileupload37776')
    if (uploader) {
      uploader.setBeforeUploadHandler(setBeforeUpload)
      uploader.setAfterUploadHandler(setAfterUpload)
    }
  }, 500)
}, 700)
</script>

<style></style>
