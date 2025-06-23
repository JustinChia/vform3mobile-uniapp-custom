<template>
  <view class="log-container">
    <view class="log-header">
      <view>输出：</view><view style="text-align: right"><button @click="clearOutputs" size="mini">清空</button> </view></view
    >
    <view class="log-item" v-for="(item, index) in log" :key="index" :class="{ active: isActive(index) }" @click="handleLogItemClick(index)">
      <view class="num">{{ index + 1 }}</view>
      <view class="text">{{ item }}</view>
      <view class="shrink"> > </view>
    </view>
  </view>
</template>
<script setup>
import { ref, set } from '@/utils/vue.js'

const emit = defineEmits(['clear'])
const props = defineProps({
  log: {
    type: Array,
    default: () => [],
  },
  clear: {
    type: Function,
    default: () => {},
  },
})

const show = ref({})

const isActive = index => {
  return !!show.value[index]
}
const handleLogItemClick = index => {
  set(show.value, index, !show.value[index])
}

const clearOutputs = () => {
  emit('clear')
}
</script>
<style scoped lang="scss">
.log-container {
  color: #555555;
  font-size: 28rpx;
  line-height: 30rpx;
  margin-top: 20rpx;
}
.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60rpx;
  width: 100%;
}
.log-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 10rpx;
  height: 60rpx;
  line-height: 60rpx;
  overflow: hidden;
  width: 100%;
  &:nth-child(odd) {
    background-color: #f1f1f1;
  }
  .num {
    width: 50rpx;
    text-align: center;
    display: inline-block;
    color: #999999;
    flex-shrink: 0;
    flex-grow: 0;
  }
  .text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-word;
  }
  .shrink {
    width: 40rpx;
    text-align: center;
    color: #999999;
    display: inline-block;

    flex-shrink: 0;
    flex-grow: 0;
    transform: rotate(90deg);
    transition: transform 0.3s;
  }

  &.active {
    height: auto;
    .text {
      white-space: normal;
    }
    .shrink {
      transform: rotate(-90deg);
    }
  }
}
</style>
