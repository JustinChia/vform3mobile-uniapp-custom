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

    <!-- desc信息弹窗 -->
    <uni-popup ref="descPopup" type="center" :mask-click="true">
      <view class="desc-popup-content">
        <view class="desc-popup-header">{{currentDescTitle}}</view>
        <view class="desc-popup-body">
          <text class="desc-text">{{ currentDescContent }}</text>
        </view>
        <view class="desc-popup-footer">
          <view class="desc-popup-close" @click="hideDescPopup">确定</view>
        </view>
      </view>
    </uni-popup>

    <!-- tooltip弹窗 -->
    <view class="tooltip-overlay" :class="{'show': tooltipPopupVisible}" v-if="tooltipPopupVisible" @click="closeTooltipPopup">
      <view class="tooltip-dialog">
        <view class="tooltip-content" v-if="currentTooltipOption?.tooltip">
          <view class="tooltip-label">{{ currentTooltipOption?.label }}</view>
          <view>{{ currentTooltipOption?.tooltip }}</view>
        </view>
        <view class="tooltip-content" v-if="currentTooltipOption?.exampleImage">
          <image :src="currentTooltipOption?.exampleImage" mode="widthFix" style="max-height: 240rpx;max-width:180rpx;" @click.stop="showImagePreview(currentTooltipOption?.exampleImage)" />
        </view>
      </view>
    </view>

    <!-- 图片预览弹窗 -->
    <view v-if="imagePreviewVisible" class="image-preview-modal" @click="closeImagePreview">
      <image :src="previewImageUrl" mode="widthFix" style="height:80vw;border-radius:16rpx;" />
      <view class="close-btn" @click="closeImagePreview">
        <uni-icons type="closeempty" size="18" color="#FFFFFF"></uni-icons>
      </view>
    </view>

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
  setup (props, { emit }) {
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
      currentDescContent: '', // 当前显示的desc内容
      currentDescTitle: '', // 当前显示的desc标题
      
      // tooltip弹窗相关
      tooltipPopupVisible: false,
      currentTooltipOption: null,
      
      // 图片预览相关
      imagePreviewVisible: false,
      previewImageUrl: ''
    })


    // desc弹窗相关
    const descPopup = ref(null)

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


    // 显示desc弹窗
    const showDescPopup = (field) => {
      if (field && field.options && field.options.desc) {
        data.currentDescContent = field.options.desc
        data.currentDescTitle = field.options.label
        if (descPopup.value) {
          descPopup.value.open()
        }
      }
    }

    // 隐藏desc弹窗
    const hideDescPopup = () => {
      if (descPopup.value) {
        descPopup.value.close()
      }
      data.currentDescTitle = ''
    }

    // 显示tooltip弹窗
    const showTooltipPopup = (option) => {
      if (option && (option.tooltip || option.exampleImage)) {
        data.currentTooltipOption = option
        data.tooltipPopupVisible = true
        // 5秒后自动关闭
        setTimeout(() => {
          data.tooltipPopupVisible = false
        }, 5000)
      }
    }

    // 关闭tooltip弹窗
    const closeTooltipPopup = () => {
      data.tooltipPopupVisible = false
      data.currentTooltipOption = null
    }

    // 显示图片预览
    const showImagePreview = (imageUrl) => {
      if (imageUrl) {
        data.previewImageUrl = imageUrl
        data.imagePreviewVisible = true
      }
    }

    // 关闭图片预览
    const closeImagePreview = () => {
      data.imagePreviewVisible = false
      data.previewImageUrl = ''
    }

    // 监听全局事件
    uni.$on('openDescPopup', showDescPopup)
    uni.$on('openTooltipPopup', showTooltipPopup)
    uni.$on('openImagePreview', showImagePreview)
    return {
      ...toRefs(data),

      descPopup,
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

      showDescPopup,
      hideDescPopup,
      showTooltipPopup,
      closeTooltipPopup,
      showImagePreview,
      closeImagePreview
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

    .uni-forms-item__error {
      transform: translateY(-60%);
      left: 10px;
    }
  }
  // #endif

  // .field-item-view{
  //   &:first-of-type {
  //     border: none;
  //     .uni-forms-item {
  //       border: none;
  //     }
  //   }
  // }

  :deep(.label-position-left) {
    .uni-forms-item {
      flex-direction: row;
      align-items: center;
      border-top: solid 2rpx #efefef;
    }
  }
  :deep(.label-position-top) {
    .uni-forms-item {
      flex-direction: column;
      align-items: center;
      padding-top:0px;

      .uni-forms-item__content {
        width: 100%;
      }

      .field-label {
        width:100%;
        text-align: center;
        margin-bottom:5rpx;

        .label-text {
          display: inline-block;
          padding: 0rpx 0rpx 0rpx 30rpx;

          background-color: white;
          z-index: 1;
          position:relative;
        }
        .label-desc{
          background-color: white;
          padding-right:30rpx;
        }
        &::before {
          content: '';
          height: 1rpx;
          border-radius: 50%;
          position: absolute;
          background-color: #efefef;
          left: 0;
          right: 0;
          top: 50%;
          z-index:0;
          transform: translateY(-50%);
        }
      }
    }
  }

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

// desc弹窗样式
.desc-popup-content {
  width: 300px;
  max-width: 90vw;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  .desc-popup-header {
    display: inline-block;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    text-align: center;
    width: 100%;
  }

  .desc-popup-body {
    padding: 20px;
    max-height: 300px;
    overflow-y: auto;
  }

  .desc-text {
    font-size: 14px;
    line-height: 1.6;
    color: #666;
    word-wrap: break-word;
    white-space: pre-wrap;
  }

  .desc-popup-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20rpx 20px;
    border-top: 1px solid #f0f0f0;
  }

  .desc-popup-close {
    color: $primary-color;
    font-size: 30rpx;
    font-weight: 500;
    border: none;
    outline: none;
    min-width: 80px;
    text-align: center;
  }
}

/* tooltip弹窗样式 */
.tooltip-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 9999;
  padding-top: 40rpx;
  pointer-events: none;
}

.tooltip-dialog {
  width: 90%;
  background-color: rgba(30, 30, 30, 0.6);
  border-radius: 20rpx;
  padding: 20rpx;
  color: #fff;
  font-size: 28rpx;
  line-height: 1.5;
  display: inline-flex;
  justify-content:center;
  box-sizing: border-box;
  transform: translateY(-100%);
  transition: transform 0.3s ease-out;
  pointer-events: auto;
}

.tooltip-overlay.show .tooltip-dialog {
  transform: translateY(0);
}

.tooltip-content {
  &:first-of-type{
    width:65%;
  }
  &:last-of-type{
    width:35%;
    text-align: center;
  }
  flex:1;
  margin-bottom: 10rpx;
}

.tooltip-label {
  text-align: left;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.tooltip-content:last-child {
  margin-bottom: 0;
}

/* 图片预览弹窗样式 */
.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  width: 30px;
  height: 30px;
  background-color: rgba(128, 128, 128, 0.5);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}
</style>
