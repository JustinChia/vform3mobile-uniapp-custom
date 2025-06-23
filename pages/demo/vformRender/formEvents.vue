<template>
  <view class="container">
    <view class="hello-text">原生事件 buttonClick, appendButtonClick, formChange </view>
    <view class="hello-text">交互事件 onFormCreated, onFormMounted, onFormDataChange </view>
    <vm-form-render ref="vmformRender" :form-json="data.formJson" :form-data="data.formData" :option-data="data.optionData" :globalDsv="data.globalDsv" @buttonClick="handleButtonClick" @appendButtonClick="handleAppendButtonClick" @formChange="handleFormChange"></vm-form-render>

    <view>
      输出：
      <view class="hello-text" v-for="(item, index) in output" :key="index">{{ item }} </view>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick } from '@/utils/vue.js'

import vmFormRender from '@/uni_modules/vmform-uni/components/vmform-uni/form-render/index.vue'

import widgetJson from '../../index/formJson/index.js'
const { formJson, vbutton, input } = widgetJson

import { data } from '@/pages/hooks/usePage'
data.formJson = formJson([vbutton, input])

console.log('表单JSON', data.formJson)

const output = ref([])
const handleButtonClick = () => {
  output.value.push('buttonClick')
}
const handleAppendButtonClick = () => {
  output.value.push('appendButtonClick')
}

const handleFormChange = (fieldName, newValue, oldValue, formModel, subFormName, subFormRowIndex) => {
  output.value.push(`formChange fieldName:${fieldName}, newValue:${newValue}, oldValue:${oldValue}, formModel:${formModel}, subFormName:${subFormName}, subFormRowIndex:${subFormRowIndex}`)
}

uni.$off()
nextTick(() => {
  uni.$on('onFormCreated', () => {
    console.log('onFormCreated')
    output.value.push('onFormCreated')
  })
  uni.$on('onFormMounted', () => {
    console.log('onFormMounted')
    output.value.push('onFormMounted')
  })
  uni.$on('onFormDataChange', () => {
    console.log('onFormDataChange')
    output.value.push('onFormDataChange')
  })
})
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}
</style>
s
