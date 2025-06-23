<template>
  <view class="container">
    <text class="hello-text">渲染器的基本属性：form-json, form-data,option-data,global-dsv</text>
    <vm-form-render ref="vmformRender" :form-json="data.formJson" :form-data="data.formData" :option-data="data.optionData" :globalDsv="data.globalDsv"> </vm-form-render>
  </view>
</template>

<script setup>
//  import {  } from '@/utils/vue.js'

import vmFormRender from '@/uni_modules/vmform-uni/components/vmform-uni/form-render/index.vue'

import widgetJson from '../../index/formJson/index.js'
const { formJson, input, textarea, radio, select, checkbox, cascader } = widgetJson

import { data } from '@/pages/hooks/usePage'
data.formJson = formJson([input, textarea, radio, checkbox, select, cascader])

// 通过optionData 设置选项
data.optionData = {
  mradio62090: [
    { label: '支付宝', value: 'alipay' },
    { label: '微信', value: 'wechat' },
  ],
  mselect71411: [
    { label: 'optionData 1', value: 1 },
    { label: 'optionData 2', value: 2 },
    { label: 'optionData 3', value: 3 },
  ],
  mcheckbox90128: [
    { label: 'optionData 1', value: 1 },
    { label: 'optionData 2', value: 2 },
    { label: 'optionData 3', value: 3 },
  ],
  mcascader65951: [
    {
      label: '第一级',
      value: 1,
      children: [
        {
          label: '第一级 1-1',
          value: 11,
          children: [
            {
              label: '第一级 1-1-1',
              value: 111,
            },
            {
              label: '第一级 1-1-2',
              value: 112,
            },
          ],
        },
      ],
    },
    {
      label: '第二级',
      value: 2,
    },
    {
      label: '第三级',
      value: 3,
    },
  ],
}

// 设置的formData会覆盖组件中的默认值,注释掉formData可显示默认值
data.formData = {
  minput104177: 'input',
  mtextarea64275: 'textarea',
  mradio62090: 'alipay',
  mselect71411: 3,
  mcheckbox90128: [1, 2],
  mcascader65951: [1, 11, 111],
}

console.log('表单JSON', data.formJson)
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}
</style>
s
