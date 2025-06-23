<template>
  <view class="container">
    <view class="hello-text">
      <button type="primary" size="mini" style="margin-right: 5px" @click="showInput(0)">输入表单</button>
      <button type="primary" size="mini" style="margin-right: 5px" @click="showInput(1)">输入简化表单</button>
    </view>

    <view class="formContainer">
      <view style="line-height: 70rpx">
        <button type="primary" size="mini" style="margin-right: 5px" @click="getFormJson">获取表单json</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="getFormData">获取数据</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="getFormDataNoValidate">获取数据 不校验</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="hideAndShow">隐藏/显示</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="readAndWrite">字段只读</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="setFormReadMode">表单只读模式</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="setDisabled">禁用字段</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="disableForm">禁用表单</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="enableForm">启用表单</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="resetForm">重置表单</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="setHidden">隐藏字段</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="setRequired">设置字段为必填</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="setLabel">设置标签</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="setFormDataTest">设置数据</button>
        <button type="primary" size="mini" style="margin-right: 5px" @click="hideGrid">test</button>
      </view>
      <vm-form-render ref="vmformRender" :form-json="data.formJson" :form-data="{}" :option-data="data.optionData" :globalDsv="data.globalDsv">
        <template #mslot>
          <view>mslot 自定义插槽</view>
        </template>
        <template #m-slot62342>
          <view>m-slot62342 插槽内容</view>
        </template>
      </vm-form-render>
    </view>

    <uni-popup ref="popup" :mask-click="false" background-color="white">
      <view class="popup-container">
        <view class="input-container" style="height: 100%">
          <textarea class="input-box" type="textarea" style="width: 100%; height: 100%" v-model="inputValue" placeholder="请将表单json粘贴到此处" :maxlength="-1" />
        </view>

        <!-- 确定和取消 放到一行 -->
        <view class="popup-btns">
          <button class="uni-btn" type="default" style="width: 50%; margin: 0px; font-size: 12px" @click="popup.close()">取消</button>
          <button
            class="uni-btn"
            type="primary"
            style="width: 50%; margin: 0px; font-size: 12px"
            @click="confirm"
          >
            确定
          </button>
        </view>
      </view>
    </uni-popup>

    <outputs :log="log" @clear="clearOutput"></outputs>
  </view>
</template>
<script setup>
import { ref, nextTick, computed } from '@/utils/vue.js'
// 渲染器
import vmFormRender from '@/uni_modules/vmform-uni/components/vmform-uni/form-render/index.vue'

import { vmformRender } from '../../hooks/usePage'
import { useTestButtons } from '../../hooks/useTestButtons.js'
// 输出组件
import outputs from '../components/ouputs.vue'
import { useVformRenderHooks } from '../vformRender/hooks/vformRenderHooks.js'

// import formJsonDemo from "./formJson.js";
import {widgetList,formConfig} from './formJson.js'
const { log, output, clearOutput, vmFormRenderRef } = useVformRenderHooks()

const data = {
  formJson: {
    widgetList: [],
    formConfig: {},
  },
  formData: {},
  optionData: {},
  globalDsv: {
    API_SERVER: 'https://demo.test.srvcloud.cn',
  },
  popupHeight: 0,
}

const popup = ref()
const popupType= ref(0)
const showInput = (type) => {
  popupType.value=type;
  popup.value.open('top')
}

const defaultJson = {}

const inputValue = ref('')

uni.$off()
const setFormJson = () => {
  try {
    // var formJson = nullue.value === 'object' ? inputValue.value : JSON.parse(inputValue.value)

    var formJson = {formConfig,widgetList}
    nextTick(() => {
      vmformRender.value.setFormJson(formJson)
      // setFormDataTest()
      vmformRender.value.addEC('externalObject', {
        foo: 'bar',
      })

      // formJson = typeof inputVal
    })
  } catch (error) {
    uni.showToast({
      title: '表单json格式错误',
      icon: 'none',
    })
  }
}
nextTick(() => {
  // setFormJson()
})

const setFormDataTest = () => {
  var formData = {
    t_sex: '2',
    t_course: ['maths'],
    t_career: '2',
    t_week: ['3', '4'],
  }
  vmformRender.value.setFormData(formData)
}
const confirm = ()=>{
  if (popupType === 0) {
    setFormJson()
  } else if (popupType === 1) {
    setMiniFormJson()
  }
  popup.close()
}
const hideGrid = () => {
  vmformRender.value.getWidgetRef('t_bjType').setValue(['1'])
  vmformRender.value.getWidgetRef('mselect45944').setValue(1)

  // vmformRender.value.showWidgets(['mGridCol67747'])
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
  disableForm,
  enableForm,
  resetForm,
} = useTestButtons(output)
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}

.formContainer {
  padding: 0rpx;
  border: 1px solid #ccc;
}

.popup-container {
  padding: 20rpx;
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  // #ifdef H5 || APP-PLUS
  height: calc(100vh - 44px);
  // #endif
  // #ifdef MP-WEIXIN
  height: 100vh;
  // #endif
  box-sizing: border-box;
}

.popup-btns {
  margin-top: 20rpx;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
