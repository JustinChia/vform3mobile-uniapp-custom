<template>
  <form-item-wrapper ref="fieldWrapper" :field="field" :design-state="designState" :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <ImagePreview class="imagePreview" :class="[inputAlignClass]" :images="methodObjs.uploaderFileList()" @removeFile="remove" @viewFile="vileFile" :disabled="methodObjs.fieldDisabled()" :limit="field.options.limit" :readonly="methodObjs.fieldReadonly()">
      <!-- 如果fileList无法刷新，需要修改uni-file-picker 的watch 加一个deep:true
	  uni-file-picker:
	  watch: {
	  	// #ifndef VUE3
	  	value: {
	  		handler(newVal, oldVal) {
	  			this.setValue(newVal, oldVal)
	  		},
	  		deep: true,
	  		immediate: true
	  	},
	  	// #endif
	  	// #ifdef VUE3
	  	modelValue: {
	  		handler(newVal, oldVal) {
	  			this.setValue(newVal, oldVal)
	  		},
	  		deep: true,
	  		immediate: true
	  	},
	  	// #endif
	  }, -->

      <!-- 关于文件上传数量限制，uni-file-picker组件设置最大的上传数手9 ，可以修改uni-file-picker 中的 limitLength
	  注释掉其中的：
	  // if (this.limit >= 9) {
	  // 	return 9
	  // }
	  uniapp官方1.4.27（2023-04-23）以上版本已修复
	   -->
      <uni-file-picker
        ref="fieldEditor"
        :value="getFileList()"
        :modelValue="getFileList()"
        file-mediatype="image"
        :file-extname="field.options.fileTypes"
        :limit="field.options.limit"
        :readonly="props.field.options.readonly"
        :disabled="props.field.options.disabled"
        :class="{ 'is-focus': methodObjs.isFocus() }"
        :disable-preview="true"
        :sourceType="uploadSourceType()"
        :autoUpload="false"
        mode="list"
        @input="setFileList"
        @select="select"
        @progress="progress"
        @success="success"
        @fail="fail"
        @delete="remove"
      >
        <view style="height: 100%; width: 100%; display: inline-flex; justify-content: center; align-items: center">
          <uni-icons type="plusempty" size="50" color="#f1f1f1"></uni-icons>
        </view>
      </uni-file-picker>
    </ImagePreview>
    <template #readmode>
      <ImagePreview :images="methodObjs.uploaderFileList()" :disabled="true" :readonly="true" @removeFile="remove" @viewFile="vileFile"></ImagePreview>
    </template>
  </form-item-wrapper>
</template>

<script setup>
import { useField } from './fieldMixin'

import FormItemWrapper from './form-item-wrapper'
import ImagePreview from './components/picturePreview.vue'
import { asyncUploadFile, deepClone } from '../../utils/util'
import { inject } from '../../utils/vueBuilder'

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

const select = e => {
  if (methodObjs.handleOverNum(fieldEditor, e.tempFiles) || methodObjs.handleAcceptTypes(fieldEditor, e.tempFiles) || methodObjs.handleOverSize(fieldEditor, e.tempFiles)) {
    return false
  }

  uni.showLoading({
    title: '正在上传',
  })

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
    asyncUploadFile({
      file: filePath,
      uploadURL: props.field.options.uploadURL,
      DSV: getGlobalDsv(),
      uploadHeader: data.uploadHeaders,
      uploadData: data.uploadData,
      progressCallBack: progress,
    })
      .then(result => {
        uploadSuccessCallBack(result, file)
        uni.hideLoading()
      })
      .catch(err => {
        uni.hideLoading()
        fail('上传失败，请检查网络')
      })
  })
}
// 获取上传进度
const progress = e => {
  console.log('上传进度：', e)
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

const vileFile = file => {
  uni.previewImage({
    urls: data.fileList.map(x => x.url),
    current: data.fileList.findIndex(x => x.url === file.url),
  })
}

const uploadSuccessCallBack = async (result, file) => {
  file.content = result.url
  file.progress = 100

  let fi = data.fileList.find(x => x.uuid == file.uuid)
  fi.url = result.url

  var customResult
  if (methodObjs.afterUpload) {
    customResult = await methodObjs.afterUpload(result, file)
  } else {
    // #ifdef H5 || APP-PLUS
    if (props.field.options.onUploadSuccess) {
      let func = new Function('result', 'file', 'fileList', props.field.options.onUploadSuccess)
      try {
        customResult = func.call(proxy, result, file, data.fileList)
        fi.url = customResult.url
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

const checkPack = () => {
  if (fieldEditor.value && !fieldEditor.value.delFileByUuid) {
    console.warn(`
      未找到上传组件的delFileByUuid方法, 上传组件没有提供通过uuid删除文件的方法，选择文件没有通过文件大小检查时无法把文件从上传列表中删除。
      需要在上传组件中添加以下代码：
      /**
			 * 删除文件
			 * @param {Object} index
			 */
			delFileByUuid(uuid) {
				let index = this.files.findIndex((item=>item.uuid===uuid))
				this.files.splice(index, 1)
				this.$nextTick(() => {
					this.setEmit()
				})
			}, `)
  }

  if (fieldEditor.value && !fieldEditor.value.setProgressByCustomUpload) {
    console.warn(`未找到上传组件的setProgressByCustomUpload方法
    如果需要显示上传进度，需要为uniapp的uni-file-picker组件添加以下代码：
    setProgressByCustomUpload(progress,uuid){
      const currentFile = this.files.find(item => item.uuid === uuid)  
      if (currentFile) {  
        currentFile.progress = progress  
      }  
    },
    可参考：https://ask.dcloud.net.cn/question/153368`)
  }
}

const getFileList = () => {
  return data.fileList
}
const setFileList = val => {
  Reflact.set(data, 'fileList', val)
}

const uploadSourceType = () => {
  if (!props.field.options.capture) {
    return ['album', 'camera']
  } else {
    return [props.field.options.capture]
  }
}

setTimeout(() => {
  checkPack()
}, 1000)
var exposeObj = {}
// #ifdef VUE3
exposeObj = {
  ...data,
  ...methodObjs,
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
@import '../styles/variables.scss';

.uni-file-picker {
  height: 100%;
}

::v-deep {
  .uni-file-picker {
    height: 100%;
  }

  .uni-file-picker__files {
    height: 100%;

    .files-button {
      height: 100%;
    }
  }

  .uni-file-picker__lists {
    display: none;
  }
}

.imagePreview {
  width: 100%;
  height: 100%;

  display: inline-flex;
  flex-wrap: wrap;

  .image-item {
    flex-shrink: 0;
  }

  &.input-align-right {
    ::v-deep .image-item-container {
      justify-content: flex-end;
    }
    :deep(.image-item-container) {
      justify-content: flex-end;
    }
  }
  &.input-align-center {
    ::v-deep .image-item-container {
      justify-content: center;
    }
    :deep(.image-item-container) {
      justify-content: center;
    }
  }
}
</style>
