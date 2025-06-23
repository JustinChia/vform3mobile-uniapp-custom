<template>
  <container-item-wrapper :widget="widget">
    <view v-show="!widget.options.hidden" :key="widget.id" class="sub-form-container">
      <uni-row class="header-row" v-if="false">
        <view class="action-header-column">
          <text class="action-label">操作 </text>
          <button v-if="!isReadMode()" :disabled="data.actionDisabled || data.insertDisabled" type="default" size="mini" class="mini-button action-button" @click="addSubFormRow">新增</button>
        </view>
      </uni-row>
      <view v-for="(subFormRowId, sfrIdx) in data.rowIdData" :key="'sfrId' + subFormRowId" class="sub-form-row">
        <view class="sub-form-action-column hide-label">
          <view class="action-button-column" style="margin-top:10rpx;">
            <text v-if="widget.options.showRowNumber" class="row-number-text"> {{widget.options.itemtitle}}{{ sfrIdx + 1 }}</text>
          </view>
          <view class="action-button-wrapper">
            <!-- <button v-if="!isReadMode()" type="default" size="mini" :disabled="data.actionDisabled || data.insertDisabled" class="mini-button" @click="insertSubFormRow(sfrIdx + 1)">插入行</button> -->
            <uni-icons 
              v-if="!isReadMode()" 
              type="trash" 
              size="20" 
              color="#999"
              :class="{'disabled-icon': data.actionDisabled || data.deleteDisabled}"
              @click="!data.actionDisabled && !data.deleteDisabled && deleteSubFormRow(sfrIdx)"
            ></uni-icons>
          </view>
        </view>

        <view v-if="!leftActionColumn && widget.options.showRowNumber" class="row-no-column">
          <text v-if="widget.options.showRowNumber" class="row-number-span"> #{{ sfrIdx + 1 }} </text>
        </view>

        <view class="grid-sub-form-data-row">
          <view v-for="(subWidget, swIdx) in widget.widgetList" :key="'swIdx' + data.fieldSchemaData[sfrIdx][swIdx].id">
            <vmformComponent :comp="subWidget.type" :field="data.fieldSchemaData[sfrIdx][swIdx]" :parent-list="widget.widgetList" :index-of-parent-list="swIdx" :parent-widget="widget" :sub-form-row-id="subFormRowId" :sub-form-row-index="sfrIdx" :sub-form-col-index="swIdx" />
          </view>
        </view>
      </view>
      <view style="text-align:center;margin-top:20rpx;">
        <button v-if="!isReadMode()" :disabled="data.actionDisabled || data.insertDisabled" class="sub-form-add-button" type="primary" size="mini" style="width:50%" @click="addSubFormRow">新增{{widget.options.itemtitle}}</button>
      </view>
    </view>
  </container-item-wrapper>
</template>

<script setup>
import { computed, reactive, provide, inject, onMounted } from '../../utils/vueBuilder'
import ContainerItemWrapper from './container-item-wrapper'

import { useContainer } from './containerItemMixin'
import { useSubform } from './hooks/subform.hooks'

const props = defineProps({
  widget: {
    type: Object,
    default: () => {
      return {
        type: '',
        options: {},
      }
    },
  },
})

// const sfRefList = inject('sfRefList')
const getReadMode = inject('getReadMode')

provide('getSubFormFieldFlag', () => true)
provide('getSubFormName', () => props.widget.options.name)

const data = reactive({
  rowIdData: [],
  fieldSchemaData: [],
  actionDisabled: false,
  insertDisabled: false,
  deleteDisabled: false,
})

const isReadMode = () => {
  return getReadMode()
}

const { methodObjs } = useContainer({
  widgetData: data,
  props,
})

const {
  leftActionColumn,
  actionDisabled,
  insertDisabled,
  deleteDisabled,
  initRefList,
  registerSubFormToRefList,
  initRowIdData,
  initEventHandler,
  initFieldSchemaData,
  addSubFormRow,
  insertSubFormRow,
  deleteSubFormRow,
  disableSubFormRow,
  enableSubFormRow,
  getRowIdData,
  disableSubForm,
  enableSubForm,
  resetSubForm,
  getSubFormValues,
  setHidden,
  handleSubFormFirstRowAdd,
  setSubFormValues,
  setSubFormFieldValue,
} = useSubform({
  data,
  props,
  componentType: 'ContainerItem',
})

const setDisabled = flag => {
  if (flag) {
    disableSubForm()
  } else {
    enableSubForm()
  }
}

initRefList()

registerSubFormToRefList()

initRowIdData(true)
initFieldSchemaData()

initEventHandler()

onMounted(() => {
  handleSubFormFirstRowAdd()
  setDisabled(props.widget.options.disabled)
})

var exposeObj = {}
// #ifdef VUE3
exposeObj = {
  ...data,
  ...methodObjs,
  getRowIdData,
  setDisabled,
  disableSubForm,
  enableSubForm,
  resetSubForm,
  setHidden,
  disableSubFormRow,
  enableSubFormRow,
  getSubFormValues,
  setSubFormValues,
  setSubFormFieldValue,
}
// #endif
defineExpose(exposeObj)
</script>

<style lang="scss" scoped>
.sub-form-container {
  margin-bottom: 8px;

  .uni-row.header-row {
    background-color: red;
    padding: 0;
    display: flex;
  }

  .sub-form-row {
    padding: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    border: 0px none;

    .row-number-span {
      margin-right: 10px;
      font-size: 14px;
    }
  }
}

.action-header-column {
  display: inline-flex;
  //width: 120px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border: 1px solid #e1e2e3;
  background: #f1f2f3;
  padding: 8px;
  box-sizing: border-box;

  .action-label {
    margin-right: 12px;
    font-size: 14px;
  }

  .action-button {
    padding-left: 8px;
    padding-right: 8px;
    margin: 0px;
  }
}

.action-button-wrapper {
  display: inline-flex;
  align-items: center;

  .mini-button {
    margin-left: 4px;
    margin-right: 4px;
    padding: 0 6px;
    margin-right: 4px;
    font-size: 12px;
    line-height: 67rpx;

    &:last-of-type {
      margin-right: 0px;
    }
  }
}

.field-header-column {
  display: inline-block;
  //overflow: hidden;
  //white-space: nowrap;  //文字超出长度不自动换行
  //text-overflow: ellipsis;  //文字超出长度显示省略号
  border: 1px solid #e1e2e3;
  background: #f1f2f3;
  padding: 8px;

  span.custom-label i {
    margin: 0 3px;
  }
}

.field-header-column.is-required:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

.label-center-left {
  text-align: left;
}

.label-center-align {
  text-align: center;
}

.label-right-align {
  text-align: right;
}

.row-number-text{
  display:inline-block;
  padding: 0px 8rpx;
  font-size:28rpx;
  color: orange;
  padding-bottom: 4rpx;
  border-bottom:solid 4rpx orange;
}
.sub-form-action-column {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  // width: 120px;
  width: 100%;
  background-color: #ffffff;
  padding: 4px 10px;
}

.grid-sub-form-data-row {
  display: inline-block;
  width: 100%;
  padding: 0rpx;
  background-color: #ffffff;
}

.sub-form-action-column.hide-label {
  ::v-deep .el-form-item__label {
    display: none;
  }

  ::v-deep .round-button {
    width: 24px;
    height: 24px;
    line-height: 24px;
  }
}

.row-no-column {
  display: flex;
  align-items: center;
  width: 50px;
  border-radius: 10px;
  background: #f1f2f3;
  padding: 5px 0;
  margin: 0 6px;
}

.sub-form-table-column {
  display: inline-block;
  border: 1px solid #e1e2e3;
  padding: 8px;

  ::v-deep .el-form-item {
    margin-left: 4px;
    margin-right: 4px;
    margin-bottom: 0;
  }

  ::v-deep .el-form-item__content {
    margin-left: 0 !important;
  }
}

.sub-form-table-column.hide-label {
  ::v-deep .el-form-item__label {
    display: none;
  }
}

.sub-form-add-button{
   /* 基本样式 */
  display: inline-block;
  padding: 4rpx 20rpx; /* 内边距，调整按钮大小 */
  font-size: 28rpx; /* 字体大小 */
  color: #2ecc71; /* 文字颜色（浅绿色） */
  background-color: transparent; /* 背景透明 */
  border: 2rpx solid #2ecc71; /* 边框：2像素宽，浅绿色 */
  line-height:50rpx;
  border-radius: 25px; /* 圆角半径，使按钮呈椭圆形 */
  cursor: pointer; /* 鼠标悬停时显示手型光标 */
  transition: all 0.3s ease; /* 添加过渡效果，使动画更平滑 */

  /* 可选：点击时的样式 */
  &:active {
    transform: scale(0.98); /* 点击时稍微缩小 */
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); /* 内阴影效果 */
  }
}
</style>
