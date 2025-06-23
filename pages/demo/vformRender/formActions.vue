<template>
  <view class="container">
    <view class="hello-text">
      <button type="primary" size="mini" style="margin-right: 5px" @click="setFormJson">设置表单json</button>
      <button type="primary" size="mini" style="margin-right: 5px" @click="getFormJson">获取表单json</button>

      <button type="primary" size="mini" style="margin-right: 5px" @click="setFormData">设置数据</button>
      <button type="primary" size="mini" style="margin-right: 5px" @click="getFormData">获取数据</button>
      <button type="primary" size="mini" style="margin-right: 5px" @click="resetForm">重置表单</button>
      <button type="primary" size="mini" style="margin-right: 5px" @click="validateForm">验证数据</button>

      <button type="primary" size="mini" style="margin-right: 5px" @click="getNativeForm">获取原生form</button>

      <button type="primary" size="mini" style="margin-right: 5px" @click="getWidgetRef('msubform56101')">获取字段引用</button>
      <button type="primary" size="mini" style="margin-right: 5px" @click="setFieldValue">设置字段数据</button>
      <button type="primary" size="mini" style="margin-right: 5px" @click="getFieldValue">获取字段数据</button>

      <button type="primary" size="mini" style="margin-right: 5px" @click="reloadOptionData">刷新选项</button>
      <button type="primary" size="mini" style="margin-right: 5px" @click="getSubFormValues">获取子表单数据</button>

      <button type="primary" size="mini" style="margin-right: 5px" @click="disableForm">禁用表单</button>
      <button type="primary" size="mini" style="margin-right: 5px" @click="enableForm">启用表单</button>

      <button type="primary" size="mini" style="margin-right: 5px" @click="setReadMode">只读模式</button>

      <button type="primary" size="mini" style="margin-right: 5px" @click="disableWidgets">禁用组件</button>
      <button type="primary" size="mini" style="margin-right: 5px" @click="enableWidgets">启用组件</button>

      <button type="primary" size="mini" style="margin-right: 5px" @click="hideWidgets">隐藏组件</button>
      <button type="primary" size="mini" style="margin-right: 5px" @click="showWidgets">显示组件</button>

      <button type="primary" size="mini" style="margin-right: 5px" @click="getFieldWidgets">返回所有字段Json</button>
      <button type="primary" size="mini" style="margin-right: 5px" @click="getContainerWidgets">返回所有容器Json</button>

      <button type="primary" size="mini" style="margin-right: 5px" @click="executeDataSource">执行数据源</button>
    </view>

    <div class="formContainer">
      <vm-form-render ref="vmFormRenderRef" :form-json="data.formJson" :form-data="{}" :option-data="optionData" :globalDsv="data.globalDsv"></vm-form-render>
    </div>
    <outputs :log="log" :clear="clearOutput"></outputs>
  </view>
</template>

<script setup>
import { ref } from '@/utils/vue.js'

import vmFormRender from '@/uni_modules/vmform-uni/components/vmform-uni/form-render/index.vue'

import { useVformRenderHooks } from './hooks/vformRenderHooks.js'
import { useFormActionHooks } from './hooks/formActionHooks.js'

import outputs from '../components/ouputs.vue'

//button 提示Do not use built-in or reserved HTML elements as component id: button，因此改为vButton
import widgetJson from '../../index/formJson/index.js'
const { formJson, input, select, select_ds, radio, checkbox, checkbox_ds, checkbox_ds2, statictext, subform } = widgetJson
import { data } from '@/pages/hooks/usePage'
import date from '../../index/formJson/date.js'
statictext.options.textContent = '请点击【设置表单json】'

data.formJson = formJson([statictext])

const { log, output, clearOutput, vmFormRenderRef } = useVformRenderHooks()

// 表单操作相关
const formActions = useFormActionHooks({ output, vmFormRenderRef })
const {
  getWidgetRef,
  getFormJson,
  getFormData,
  resetForm,
  validateForm,
  getNativeForm,
  getFieldValue,
  setFieldValue,
  optionData,
  reloadOptionData,
  getSubFormValues,
  disableForm,
  enableForm,
  setReadMode,
  disableWidgets,
  enableWidgets,
  hideWidgets,
  showWidgets,
  getFieldWidgets,
  getContainerWidgets,
  executeDataSource,
} = formActions

const setFormJson = () => {
  data.formJson = formActions.setFormJson(formJson([checkbox, checkbox_ds, checkbox_ds2, subform([input, select, select_ds, checkbox_ds2]), date, radio]))
}

const setFormData = () => {
  formActions.setFormData(data.formData)
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
