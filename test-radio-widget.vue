<template>
  <view class="test-container">
    <view class="test-title">Radio Widget 测试页面</view>
    
    <view class="test-section">
      <text class="section-title">基础单选测试</text>
      <m-radio-widget
        :field="testField"
        :designer="null"
        :parent-widget="null"
        :parent-list="null"
        :index-of-parent-list="-1"
        :sub-form-row-index="-1"
        :sub-form-col-index="-1"
        :sub-form-row-id="''"
      />
    </view>
    
    <view class="test-section">
      <text class="section-title">当前选中值:</text>
      <text class="value-display">{{ JSON.stringify(currentValue, null, 2) }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import MRadioWidget from './uni_modules/vmform-uni/components/vmform-uni/form-widget/field-widget/m-radio-widget.vue'

const currentValue = ref(null)

const testField = reactive({
  type: 'radio',
  options: {
    name: 'testRadio',
    label: '测试单选框',
    placeholder: '请选择选项',
    optionItems: [
      {
        label: '选项1',
        value: 'option1',
        tooltip: '这是选项1的提示信息',
        exampleImage: 'https://via.placeholder.com/300x200?text=Example1',
        additionalComponents: [
          {
            type: 'input',
            id: 'component1',
            name: 'component1',
            label: '附加输入框',
            placeholder: '请输入内容',
            defaultValue: ''
          },
          {
            type: 'select',
            id: 'component2',
            name: 'component2',
            label: '附加选择框',
            placeholder: '请选择',
            options: [
              { label: '选择项A', value: 'option_a' },
              { label: '选择项B', value: 'option_b' }
            ],
            defaultValue: ''
          }
        ],
        additionalComponentsMultiple: true,
        maxAdditionalComponents: 3
      },
      {
        label: '选项2',
        value: 'option2',
        tooltip: '这是选项2的提示信息',
        exampleImage: 'https://via.placeholder.com/300x200?text=Example2'
      },
      {
        label: '选项3',
        value: 'option3'
      }
    ]
  },
  id: 'testRadio',
  formItemFlag: true
})

// 监听字段值变化
watch(() => testField.options.defaultValue, (newValue) => {
  currentValue.value = newValue
}, { deep: true })
</script>

<style scoped>
.test-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.test-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.test-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  display: block;
}

.value-display {
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
  color: #666;
  white-space: pre-wrap;
  display: block;
}
</style>