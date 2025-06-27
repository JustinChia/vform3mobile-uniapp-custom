<template>
  <view class="field-item-view">
    <!-- 微信小程序is方式创建动态组件，也不支持v-bind绑定属性，需要逐个增加 -->
    <template v-if="props.comp === 'm-sub-form'">
      <m-sub-form-item :widget="comprops.field" />
    </template>
    <template v-if="props.comp === 'm-cell-group'">
      <m-cellgroup-item
        :widget="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
      />
    </template>
    <template v-if="props.comp === 'm-grid'">
      <m-grid-item
        :widget="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
      />
    </template>
    <template v-if="props.comp === 'collapse'">
      <m-collapse-item
        :widget="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
      />
    </template>
    <template v-if="props.comp === 'm-tab'">
      <m-tab-item
        :widget="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
      />
    </template>
    <template v-if="props.comp === 'm-input'">
      <m-input-widget
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-size'">
      <m-size-widget
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-quote'">
      <m-quote-widget
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-textarea'">
      <m-textarea-widget
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-number'">
      <m-number-widget
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-stepper'">
      <m-stepper-widget
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-radio'">
      <m-radio-widget
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-checkbox'">
      <m-checkbox-widget
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-select'">
      <m-select-widget
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-date'">
      <m-date-widget
        :name="comprops.name"
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-date-range'">
      <m-daterange-widget
        :name="comprops.name"
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-datetime'">
      <m-datetime-widget
        :name="comprops.name"
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-time'">
      <m-time-widget
        :name="comprops.name"
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-switch'">
      <m-switch-widget
        :name="comprops.name"
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-rate'">
      <m-rate-widget
        :name="comprops.name"
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-slider'">
      <m-slider-widget
        :name="comprops.name"
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-static-text'">
      <m-static-text-widget
        :name="comprops.name"
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-html-text'">
      <m-html-text-widget
        :name="comprops.name"
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-button'">
      <m-button-widget
        :name="comprops.name"
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-divider'">
      <m-divider-widget
        :name="comprops.name"
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-calendar'">
      <m-calendar-widget
        :name="comprops.name"
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'alert'">
      <m-alert-widget
        :name="comprops.name"
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-cascader'">
      <m-cascader-widget
        :name="comprops.name"
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      />
    </template>
    <template v-if="props.comp === 'm-picture-upload'">
      <m-picture-upload-widget
        :name="comprops.name"
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      >
        <template #[comprops.field.options.name]>
          <!-- #ifdef H5 || APP-PLUS -->
          <slot :name="field.options.name" />
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <slot name="{{field.options.name}}" />
          <!-- #endif -->
        </template>
      </m-picture-upload-widget>
    </template>
    <template v-if="props.comp === 'm-file-upload'">
      <m-file-upload-widget
        :name="comprops.name"
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      >
        <template #[comprops.field.options.name]>
          <!-- <slot name="mslot54180"></slot> -->
          <!-- #ifdef H5 || APP-PLUS -->
          <slot :name="comprops.field.options.name" />
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <slot name="{{comprops.field.options.name}}" />
          <!-- #endif -->
        </template>
      </m-file-upload-widget>
    </template>
    <template v-if="props.comp === 'm-slot'">
      <m-slot-widget
        :name="comprops.name"
        :field="comprops.field"
        :parent-widget="comprops.parentWidget"
        :parent-list="comprops.parentList"
        :index-of-parent-list="comprops.indexOfParentList"
        :designer="comprops.designer"
        :design-state="comprops.designState"
        :sub-form-row-id="comprops.subFormRowId"
        :sub-form-row-index="comprops.subFormRowIndex"
        :sub-form-col-index="comprops.subFormColIndex"
        @props-changed="propsChangeHandler"
      >
        <template #[comprops.field.options.name]>
          <!-- #ifndef VUE3 -->
          <!-- #ifdef H5 || APP-PLUS -->
          <slot :name="field.options.name" />
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <slot name="{{field.options.name}}" />
          <!-- #endif -->
          <!-- #endif -->

          <!-- #ifdef VUE3 -->
          <slot :name="field.options.name" />
          <!-- #endif -->
        </template>
      </m-slot-widget>
    </template>
  </view>
</template>

<script setup>
import { ref, set, reactive, computed } from '../utils/vueBuilder.js'

const emit = defineEmits(['props-changed'])
const props = defineProps({
  comp: {
    type: String,
    default: '',
  },
  field: {
    type: Object,
    default: () => {},
  },
  parentWidget: {
    type: Object,
    default: () => {},
  },
  parentList: {
    type: Array,
    default: () => [],
  },
  indexOfParentList: {
    type: Number,
    default: -1,
  },
  designer: {
    type: Object,
    default: () => {},
  },

  designState: {
    type: Boolean,
    default: false,
  },

  subFormRowIndex: {
    /* 子表单组件行索引，从0开始计数 */
    type: Number,
    default: -1,
  },
  subFormColIndex: {
    /* 子表单组件列索引，从0开始计数 */
    type: Number,
    default: -1,
  },
  subFormRowId: {
    /* 子表单组件行Id，唯一id且不可变 */
    type: String,
    default: '',
  },
})

const comprops = reactive({
  name: props.comp,
  field: props.field,
  parentWidget: props.parentWidget,
  parentList: props.parentList,
  indexOfParentList: props.indexOfParentList,
  designer: props.designer,
  designState: props.designState,
  subFormRowId: props.subFormRowId,
  subFormRowIndex: props.subFormRowIndex,
  subFormColIndex: props.subFormColIndex,
})

const keyRef = ref(new Date().valueOf())
const propsChangeHandler = field => {
  comprops.field = field
  keyRef.value = new Date().valueOf()

  emit('props-changed', field)
}
</script>

<style scoped>
.field-item-view {
  width: 100%;
}
</style>
