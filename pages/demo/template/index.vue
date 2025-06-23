<template>
  <view class="container">
    <view class="formContainer">
      <vm-form-render ref="vmformRender" :form-json="data.formJson" :form-data="{}" :globalDsv="data.globalDsv"> </vm-form-render>
    </view>
  </view>
</template>
<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref, nextTick, computed } from '@/utils/vue.js'
// 渲染器
import vmFormRender from '@/uni_modules/vmform-uni/components/vmform-uni/form-render/index.vue'

import { vmformRender } from '../../hooks/usePage'

const data = {
  formJson: {
    widgetList: [],
    formConfig: {},
  },
  formData: {},
  optionData: {},
  globalDsv: {},
}

const setFormJson = val => {
  try {
    var formJson = val
    vmformRender.value.setFormJson(formJson)
  } catch (error) {
    uni.showToast({
      title: '表单json格式错误',
      icon: 'none',
    })
  }
}

uni.$off()
var w = ref('')
onLoad(option => {
  w.value = option.widget

  var fileName = ''
  switch (w.value) {
    case 'single':
      fileName = 'json1.json'
      break
    case 'muilti':
      fileName = 'json2.json'
      break
    case 'collapse':
      fileName = 'json3.json'
      break
    case 'tab':
      fileName = 'json4.json'
      break
    case 'subform':
      fileName = 'json5.json'
      break
    case 'ques':
      fileName = 'json6.json'
      break
    default:
      ''
  }

  if (!fileName) return

  uni.showLoading({
    title: '数据加载中',
  })
  uni.request({
    url: `https://vform2022.ks3-cn-beijing.ksyuncs.com/vform-mobile-templates/${fileName}`,
    success: ({ data }) => {
      setFormJson(data)

      uni.hideLoading()
    },
    fail() {
      uni.hideLoading()
    },
  })
})
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
