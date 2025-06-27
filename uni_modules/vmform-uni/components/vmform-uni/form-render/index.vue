<template>
  <view class="render-vmform" :class="[customClass, readModeFlag ? 'readonly-mode-form' : '']" :style="formStyle">
    <!-- 小程序中 uni-forms无法设置class，因此设置到外部 -->
    <uni-forms ref="renderForm" :model="formDataModel" :label-position="labelPosition()" :label-width="labelWidth()">
      <vmformComponent v-for="(widget, index) in widgetList" :key="widget.id" :comp="widget.type" :field="widget" :form-model="formDataModel" :designer="null" :parent-list="widgetList" :index-of-parent-list="index" :parent-widget="null">
        <template #[widget.options.name]>
          <!-- #ifndef VUE3 -->
          <!-- #ifdef H5 || APP-PLUS -->
          <slot :name="widget.options.name" />
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <slot name="{{widget.options.name}}" />
          <!-- #endif -->
          <!-- #endif -->

          <!-- #ifdef VUE3 -->
          <slot :name="widget.options.name" />
          <!-- #endif -->
        </template>
      </vmformComponent>
    </uni-forms>
  </view>
</template>

<script>
import { reactive, computed, ref, toRefs, watch } from '../utils/vueBuilder.js'

import { useRender } from './hooks/useRender'

import { buildDefaultFormJson, getDefaultFormConfig } from '../utils/util'

export default {
  name: 'VmFormRender',
  componentName: 'VmFormRender',
  props: {
    formJson: {
      // prop传入的表单JSON配置
      type: Object,
      default: () => buildDefaultFormJson(),
    },
    formData: {
      // prop传入的表单数据
      type: Object,
      default: () => ({}),
    },
    optionData: {
      // prop传入的选项数据
      type: Object,
      default: () => ({}),
    },
    previewState: {
      // 是否表单预览状态
      type: Boolean,
      default: false,
    },
    disabledMode: {
      // 表单禁止编辑模式
      type: Boolean,
      default: false,
    },
    renderConfig: {
      // 渲染配置对象
      type: Object,
      default: () => {
        return {
          languageName: 'zh-CN', // 界面语言，默认显示中文
        }
      },
    },
    globalDsv: {
      // 全局数据源变量
      type: Object,
      default: () => ({}),
    },
    parentForm: {
      type: Object,
      default: null,
    },
    dynamicCreation: {
      // 是否弹窗、抽屉动态创建的VmFormRender
      type: Boolean,
      default: false,
    },
  },
  options: {
    styleIsolation: 'shared',
  },
  setup(props, { emit }) {
    const data = reactive({
      test: '',
      formJsonObj: {},
      formDataModel: {},

      widgetRefList: {},
      subFormRefList: {},
      formId: null, // 表单唯一Id，用于区分页面上的多个v-form-render组件！！

      externalComponents: {}, // 外部组件实例集合
      readModeFlag: false, // 是否只读查看模式
      dialogOrDrawerRef: null, // 保存子级VmFormRender的包裹弹窗组件或抽屉组件的ref
      childFormRef: null, // 保存子级VmFormRender组件的ref

      dsResultCache: {}, // 数据源请求结果缓存
    })

    const {
      renderForm,
      clearValidate,
      setFormJson,
      getFormJson,
      setFormData,
      setMiniFormJson,
      getFormData,
      resetForm,
      validateForm,
      getFieldValue,
      setFieldValue,
      labelPosition,
      labelWidth,
      formStyle,
      customClass,
      getNativeForm,
      getWidgetRef,
      getComponentType,
      getFocus,
      setFocus,
      reloadOptionData,
      getSubFormValues,
      setSubFormValues,
      disableForm,
      enableForm,
      setReadMode,
      disableWidgets,
      enableWidgets,
      hideWidgets,
      showWidgets,
      getFieldWidgets,
      triggerDynamicLogic,
      getContainerWidgets,
      executeDataSource,
      addEC,
      getEC,
      hasEC,
    } = useRender({ data, props, emit })

    const slots = computed(() => {
      if (renderForm.value) {
        return Object.keys(renderForm.value.$parent.$slots)
      } else {
        return []
      }
    })

    // 解决初始化表单时，用户传来空对象问题
    if (props.formJson) {
      const formJson = ref(props.formJson)
      if (!formJson.value.widgetList) formJson.value.widgetList = []
      if (!formJson.value.formConfig) formJson.value.formConfig = getDefaultFormConfig()
      data.formJsonObj = formJson.value
    }
    return {
      ...toRefs(data),
      renderForm,
      clearValidate,
      slots,
      formStyle,
      setFormJson,
      getFormJson,
      setMiniFormJson,
      setFormData,
      getFormData,
      resetForm,

      setFieldValue,
      getFieldValue,
      validateForm,

      labelPosition,
      labelWidth,
      customClass,

      readModeFlag: data.readModeFlag,
      widgetList: data.formJsonObj.widgetList,

      getNativeForm,
      getWidgetRef,
      getFieldWidgets,
      getComponentType,
      setFocus,
      getFocus,

      reloadOptionData,
      getSubFormValues,
      setSubFormValues,

      disableForm,
      enableForm,
      setReadMode,
      triggerDynamicLogic,

      disableWidgets,
      enableWidgets,

      hideWidgets,
      showWidgets,

      getContainerWidgets,
      executeDataSource,

      addEC,
      getEC,
      hasEC,
    }
  },
}
</script>
<style lang="scss" scoped>
@import '../form-widget/styles/globalField.scss';

.render-vmform {
  /* #ifdef MP-WEIXIN */
  ::v-deep vmform-component:first-of-type .uni-forms-item {
    ::v-deep .uni-forms-item {
      border-top-left-radius: var(--form-field-radius);
      border-top-right-radius: var(--form-field-radius);
    }
    :deep(.uni-forms-item) {
      border-top-left-radius: var(--form-field-radius);
      border-top-right-radius: var(--form-field-radius);
    }
  }
  ::v-deep vmform-component:last-of-type .uni-forms-item {
    ::v-deep .uni-forms-item {
      border-bottom-left-radius: var(--form-field-radius);
      border-bottom-right-radius: var(--form-field-radius);
    }
    :deep(.uni-forms-item) {
      border-bottom-left-radius: var(--form-field-radius);
      border-bottom-right-radius: var(--form-field-radius);
    }
  }
  /* #endif */

  // #ifdef APP-PLUS || H5
  .field-item-view:first-of-type {
    ::v-deep .uni-forms-item {
      border-top-left-radius: var(--form-field-radius);
      border-top-right-radius: var(--form-field-radius);
    }
    :deep(.uni-forms-item) {
      border-top-left-radius: var(--form-field-radius);
      border-top-right-radius: var(--form-field-radius);
    }
  }
  .field-item-view:last-of-type {
    ::v-deep .uni-forms-item {
      border-bottom-left-radius: var(--form-field-radius);
      border-bottom-right-radius: var(--form-field-radius);
    }
    :deep(.uni-forms-item) {
      border-bottom-left-radius: var(--form-field-radius);
      border-bottom-right-radius: var(--form-field-radius);
    }
  }
  /* #endif */

  // #ifdef VUE3
  :deep(.uni-forms-item) {
    padding: 0.45rem 0.9375rem;
    margin-bottom: 0rpx;
    border-bottom: solid 2rpx #efefef;
    .uni-forms-item__error {
      transform: translateY(-60%);
      left: 10px;
    }
  }
  // #endif

  // #ifndef VUE3
  ::v-deep .uni-forms-item {
    padding: 0.45rem 0.9375rem;
    margin-bottom: 0px;
    border-bottom: solid 2rpx #efefef;
    .uni-forms-item__error {
      transform: translateY(-60%);
      left: 10px;
    }
  }
  // #endif
}
</style>
