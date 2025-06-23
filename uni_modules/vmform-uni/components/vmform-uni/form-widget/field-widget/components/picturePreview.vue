<template>
  <view class="image-item-container">
    <view v-for="(item, index) in images" :key="index" class="image-item">
      <view class="image-item-pic">
        <view class="remove-icon">
          <uni-icons type="clear" size="20" @click="remove(item)" v-if="!(props.disabled || props.readonly)" style="color: white"></uni-icons>
        </view>
        <image :src="item.url" mode="aspectFill" @click="viewFile(item)" style="height: 100%; width: 100%" />
      </view>
    </view>
    <view class="image-item">
      <view class="image-item-pic">
        <slot name="default"></slot>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  images: {
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
  emit('viewFile', item)
}
</script>
<style lang="scss" scoped>
.image-item-container {
  display: flex;
  width: 100%;
  height: 100%;
}
.image-item {
  position: relative;
  width: 33.3%;
  height: 0;
  padding-top: 33.33%;
  box-sizing: border-box;
  user-select: none;

  &-pic {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: 5px;
    border: 1px #eee solid;
    border-radius: 5px;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .remove-icon {
    font-size: 20px;
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 1;
  }
}
</style>
