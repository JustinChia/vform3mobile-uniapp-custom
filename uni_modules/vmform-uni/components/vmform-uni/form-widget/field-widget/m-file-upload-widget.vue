<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <!-- #ifndef APP-PLUS -->
    <view style="width: 100%" :class="[inputAlignClass]">
      <template v-if="!(methodObjs.fieldDisabled() || methodObjs.fieldReadonly())">
        <uni-file-picker
          ref="fieldEditor"
          :value="methodObjs.uploaderFileList()"
          :class="{ 'is-focus': methodObjs.isFocus() }"
          file-mediatype="all"
          :file-extname="field.options.fileTypes"
          :limit="field.options.limit"
          :disabled="methodObjs.fieldDisabled() || methodObjs.fieldReadonly()"
          mode="list"
          :autoUpload="false"
          @select="select"
          @progress="setProgress"
          @success="success"
          @fail="fail"
          @delete="remove"
        />
      </template>
      <template v-else>
        <view style="text-align: left">
          <button type="primary" size="mini" :disabled="methodObjs.fieldDisabled() || methodObjs.fieldReadonly()">选择文件</button>
        </view>
      </template>
      <FilePreview :files="data.fileList" @removeFile="remove" @viewFile="viewFile" :disabled="methodObjs.fieldDisabled()" :readonly="methodObjs.fieldReadonly()"></FilePreview>
    </view>
    <!-- #endif -->
    <!-- #ifdef APP-PLUS -->
    <view style="width: 100%" :class="[inputAlignClass]">
      <template v-if="!(methodObjs.fieldDisabled() || methodObjs.fieldReadonly())">
        <lsj-upload
          ref="lsjUpload0"
          childId="upload1"
          :width="lsjFile.width"
          :height="lsjFile.height"
          :option="lsjFile.option"
          :count="field.options.limit"
          :formats="field.options.fileTypes.join(',')"
          :debug="lsjFile.debug"
          :instantly="lsjFile.instantly"
          @change="lsjFile.onChange"
          @progress="lsjFile.onProgress"
          @uploadEnd="lsjFile.onUploadEnd"
        >
          <button type="primary" size="mini">选择文件</button>
        </lsj-upload>
      </template>
      <template v-else>
        <button type="primary" size="mini" :disabled="methodObjs.fieldDisabled() || methodObjs.fieldReadonly()">选择文件</button>
      </template>
      <FilePreview :files="data.fileList" @removeFile="remove" @viewFile="viewFile" :disabled="methodObjs.fieldDisabled()" :readonly="methodObjs.fieldReadonly()"></FilePreview>
    </view>
    <!-- #endif -->
    <template #readmode>
      <FilePreview :files="data.fileList" :disabled="true" :readonly="true" @viewFile="viewFile"></FilePreview>
    </template>
  </form-item-wrapper>
</template>

<script setup>
import { useField } from './fieldMixin'

import FormItemWrapper from './form-item-wrapper'
import { asyncUploadFile, getRealUploadURL, deepClone } from '../../utils/util'
import { inject, ref } from '../../utils/vueBuilder'
import FilePreview from './components/filePreview.vue'
const props = defineProps({
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
    default: 0,
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

const actions = {}

const emit = defineEmits(['props-changed'])
const fieldMixin = useField({
  componentType: 'FieldWidget',
  props,
  emit,
  actions,
  widgetData: {
    fileList: [],
    uploadHeaders: {},
    uploadData: {},
  },
})
const { data, proxy, methodObjs, fieldWrapper, fieldEditor, $message, inputAlignClass } = fieldMixin

const getGlobalDsv = inject('getGlobalDsv')

const lsjUpload0 = ref(null)

const select = async e => {
  if (methodObjs.handleOverNum(fieldEditor, e.tempFiles) || methodObjs.handleAcceptTypes(fieldEditor, e.tempFiles) || methodObjs.handleOverSize(fieldEditor, e.tempFiles)) {
    return false
  }

  if (methodObjs.beforeUpload) {
    await methodObjs.beforeUpload(e)
  }

  e.tempFilePaths.forEach(async (fileItem, fileIndex) => {
    const file = e.tempFiles[fileIndex]
    var filePath = e.tempFilePaths[fileIndex]

    // #ifndef MP-WEIXIN
    if (props.field.options.onBeforeUpload) {
      try {
        let fn = new Function('file', props.field.options.onBeforeUpload)
        const tmpFile = await fn.call(proxy, file.file)
        if (tmpFile instanceof File) {
          filePath = URL.createObjectURL(tmpFile)
        }
      } catch (e) {
        console.error(e)
      }
    }
    // #endif

    data.fileList.push(file)
    uni.showLoading({
      title: '正在上传',
    })
    asyncUploadFile({
      file: filePath,
      uploadURL: props.field.options.uploadURL,
      DSV: getGlobalDsv(),
      uploadHeader: data.uploadHeaders,
      uploadData: data.uploadData,
      progressCallBack: fieldEditor.value.setProgressByCustomUpload ? obj => setProgress(obj, file.uuid) : undefined,
    })
      .then(result => {
        uploadSuccessCallBack(result, file)
        uni.hideLoading()
      })
      .catch(err => {
        uni.hideLoading()
        console.log(err)
        methodObjs.handleEmitEvent(
          {
            value: {
              fileModel: data.fieldModel,
              fileList: data.fileList,
            },
          },
          'onUploadError'
        )
        fail('上传失败，请检查网络')
      })
  })
}
// 获取上传进度
const setProgress = (e, uuid) => {
  let file = data.fileList.find(x => x.uuid === uuid)
  file.progress = e.progress
}

// 上传成功
const success = e => {
  console.log('上传成功')
}

// 上传失败
const fail = e => {
  $message.error(e)
}

const remove = e => {
  const idx = data.fileList.findIndex(item => item.url === e.tempFile.url)
  data.fileList.splice(idx, 1)
  handleFileDelete(e.tempFile, idx)
}

const viewFile = file => {
  let fileUrl = file.url

  uni.downloadFile({
    url: fileUrl,
    success: function (res) {
      var filePath = res.tempFilePath
      uni.openDocument({
        filePath: filePath,
        showMenu: true,
        success: function (res) {
          console.log('打开文档成功')
        },
        fail: function (res) {
          uni.showToast({
            title: '文件不支持预览',
            icon: 'none',
          })
        },
      })
    },
  })
}

const uploadSuccessCallBack = async (result, file) => {
  file.content = result.url
  file.progress = 100

  var customResult
  if (methodObjs.afterUpload) {
    customResult = await methodObjs.afterUpload(result, file)
  } else {
    // #ifdef H5 || APP-PLUS
    if (props.field.options.onUploadSuccess) {
      let func = new Function('result', 'file', 'fileList', props.field.options.onUploadSuccess)
      try {
        customResult = func.call(proxy, result, file, data.fileList)
      } catch (e) {
        uni.showToast({
          title: '自定义事件执行错误',
          icon: 'none',
        })
      }
    }
    // #endif
  }
  updateFieldModelAndEmitDataChangeForUpload(data.fileList, customResult, result)
}

// const uploadErrorCallBack = (error, file) => {
//   $message.error({
//     message: '上传错误' + error,
//     duration: 3000
//   })
// }

const updateFieldModelAndEmitDataChangeForUpload = (fileList, customResult, defaultResult) => {
  data.fieldModel = data.fieldModel || []
  let oldValue = deepClone(data.fieldModel)
  if (!!customResult && !!customResult.name && !!customResult.url) {
    data.fieldModel.push(customResult)
  } else if (!!defaultResult && !!defaultResult.name && !!defaultResult.url) {
    data.fieldModel.push(defaultResult)
  } else {
    data.fieldModel.push(defaultResult)
  }
  methodObjs.syncUpdateFormModel(data.fieldModel)
  methodObjs.emitFieldDataChange(data.fieldModel, oldValue)
  methodObjs.handleEmitEvent(
    {
      value: {
        fileModel: data.fieldModel,
        fileList,
      },
    },
    'onUploadSuccess'
  )
}

const handleFileDelete = (file, index) => {
  updateFieldModelAndEmitDataChangeForRemove(file, data.fileList, index)
}

const updateFieldModelAndEmitDataChangeForRemove = (file, fileList, deletedIndex) => {
  let oldValue = deepClone(data.fieldModel)
  if (deletedIndex > -1) {
    data.fieldModel.splice(deletedIndex, 1)
  }
  methodObjs.syncUpdateFormModel(data.fieldModel)
  methodObjs.emitFieldDataChange(data.fieldModel, oldValue)
  methodObjs.handleEmitEvent(
    {
      value: {
        file,
        fileList,
        deletedIndex,
      },
    },
    'onFileRemove'
  )
}

const lsjFile = {
  // 上传接口参数
  option: {
    // 上传服务器地址，需要替换为你的接口地址
    url: getRealUploadURL(props.field.options.uploadURL, getGlobalDsv()), // 该地址非真实路径，需替换为你项目自己的接口地址
    // 上传附件的key
    name: 'file',
    // 根据你接口需求自定义请求头,默认不要写content-type,让浏览器自适配
    header: data.uploadHeaders,
    // 根据你接口需求自定义body参数
    formData: data.uploadData,
  },
  // 选择文件后是否立即自动上传，true=选择后立即上传
  instantly: true,
  // 必传宽高且宽高应与slot宽高保持一致
  width: '220rpx',
  height: '70rpx',
  // 限制允许上传的格式，空串=不限制，默认为空
  formats: '',
  // 是否多选
  multiple: true,
  // 文件回显列表
  files: new Map(),
  fileArray: ref([]),
  // 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
  wxFiles: [],
  // 是否打印日志
  debug: true,
  // 演示用
  tabIndex: 0,
  list: [],
  onChange: files => {
    lsjFile.files = files
    if (Array.isArray(data.fileList)) {
      data.fileList.splice(0)
    }
    files.forEach((value, key) => {
      data.fileList.push(value)
    })
  },
  onProgress: item => {
    // 更新当前状态变化的文件
    lsjFile.files.set(item.name, item)
    let file = data.fileList.find(x => x.name == item.name)
    file.progress = item.progress
  },
  onUploadEnd: item => {
    if (item.responseText) {
      item.file = JSON.parse(item.responseText)
    }
    lsjFile.files.set(item.name, item)
    lsjFile.updateFieldModel(item)
  },
  updateFieldModel(item) {
    if (item.responseText) {
      uploadSuccessCallBack(JSON.parse(item.responseText), item.file)
    }
  },
}

var exposeObj = {}
// #ifdef VUE3
exposeObj = {
  ...data,
  ...methodObjs,
  lsjFile,
}
// #endif
defineExpose(exposeObj)
</script>
<script>
export default {
  options: {
    styleIsolation: 'shared',
  },
}
</script>

<style lang="scss" scoped>
.uni-file-picker__container {
  border-width: 1px;
  border-style: solid;
  border-color: rgb(238, 238, 238);
  border-radius: 5px;
  display: flex;
  width: 100%;
}

.uni-file-picker__item {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  padding-right: 5px;
  padding-left: 10px;
}

.files__name {
  flex: 1;
  font-size: 14px;
  color: #666;
  margin-right: 25px;
  word-break: break-all;
  word-wrap: break-word;
}

::v-deep {
  .uni-file-picker {
    height: 100%;
  }
  .uni-file-picker__lists {
    display: none;
  }
}
.input-align-center {
  text-align: center;
}
.input-align-right {
  text-align: right;
}
</style>
