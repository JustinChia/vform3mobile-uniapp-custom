<template>
  <view class="uploadFileList" v-if="files.length > 0">
    <view v-for="(item, index) in files" :key="index" class="uploadFileItem">
      <view class="fileName" @click="viewFile(item)">{{ item.name }}</view>
      <uni-icons type="clear" size="20" @click="remove(item)" v-if="!(props.disabled || props.readonly)"></uni-icons>
      <view style="position: absolute; left: 0px; right: 0px; bottom: 0px" v-if="item.progress && item.progress != 100">
        <progress :percent="item.progress || 5" stroke-width="3" />
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  files: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['removeFile', 'viewFile'])
const remove = item => {
  uni.showModal({
    title: '提示',
    content: '您确定要删除吗？',
    success: function (res) {
      if (res.confirm) {
        emit('removeFile', { tempFile: item })
      }
    },
  })
}
const viewFile = item => {
  if (!item.url) item.url = item.path
  emit('viewFile', item)
}
</script>

<style lang="scss" scoped>
.uploadFileList {
  width: 100%;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(238, 238, 238);
  border-radius: 5px;
}
.uploadFileItem {
  display: flex;
  position: relative;
  width: 100%;
  height: 70rpx;
  line-height: 70rpx;
  justify-content: space-between;
  align-items: center;
  padding: 0 15rpx;
  box-sizing: border-box;

  border-bottom: solid 1px rgb(238, 238, 238);
  &:last-of-type {
    border-bottom: none 0px;
  }

  .fileName {
    flex: 1;
    overflow: hidden;
    font-size: 14px;
    color: #666;
    margin-right: 30px;
    word-break: break-all;
  }
}
</style>
