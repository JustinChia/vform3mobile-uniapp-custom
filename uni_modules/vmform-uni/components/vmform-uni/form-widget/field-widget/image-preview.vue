<template>
  <view v-if="visible" class="image-preview-modal" @click="handleModalClick">
    <view class="image-container" 
          @touchstart="onTouchStart" 
          @touchmove="onTouchMove" 
          @touchend="onTouchEnd"
          :style="containerStyle">
      <image 
        :src="imageUrl" 
        mode="aspectFit" 
        class="preview-image"
        :style="imageStyle"
        @load="onImageLoad" />
    </view>
    <view class="close-btn" @click="handleClose">
      <uni-icons type="closeempty" size="18" color="#FFFFFF"></uni-icons>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from '../../utils/vueBuilder.js'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

// 图片和容器状态
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const imageWidth = ref(0)
const imageHeight = ref(0)

// 触摸状态
const touching = ref(false)
const lastTouchTime = ref(0)
const touchStartDistance = ref(0)
const touchStartScale = ref(1)
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchStartTranslateX = ref(0)
const touchStartTranslateY = ref(0)
const touchCount = ref(0)

// 计算样式
const containerStyle = computed(() => {
  return {
    transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
    transition: touching.value ? 'none' : 'transform 0.3s ease-out'
  }
})

const imageStyle = computed(() => {
  return {
    width: '100vw',
    height: '100vh',
    borderRadius: '16rpx'
  }
})

// 重置状态
const resetTransform = () => {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

// 监听visible变化，重置状态
watch(() => props.visible, (newVal) => {
  if (newVal) {
    resetTransform()
  }
})

// 图片加载完成
const onImageLoad = (e) => {
  imageWidth.value = e.detail.width
  imageHeight.value = e.detail.height
}

// 计算两点间距离
const getDistance = (touch1, touch2) => {
  const dx = touch1.clientX - touch2.clientX
  const dy = touch1.clientY - touch2.clientY
  return Math.sqrt(dx * dx + dy * dy)
}

// 计算两点中心
const getCenter = (touch1, touch2) => {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2
  }
}

// 触摸开始
const onTouchStart = (e) => {
  touching.value = true
  touchCount.value = e.touches.length
  
  if (e.touches.length === 1) {
    // 单指拖动
    touchStartX.value = e.touches[0].clientX
    touchStartY.value = e.touches[0].clientY
    touchStartTranslateX.value = translateX.value
    touchStartTranslateY.value = translateY.value
    
    // 检测双击
    const now = Date.now()
    if (now - lastTouchTime.value < 300) {
      // 双击缩放
      if (scale.value > 1) {
        resetTransform()
      } else {
        scale.value = 2
      }
    }
    lastTouchTime.value = now
  } else if (e.touches.length === 2) {
    // 双指缩放
    touchStartDistance.value = getDistance(e.touches[0], e.touches[1])
    touchStartScale.value = scale.value
    
    const center = getCenter(e.touches[0], e.touches[1])
    touchStartX.value = center.x
    touchStartY.value = center.y
    touchStartTranslateX.value = translateX.value
    touchStartTranslateY.value = translateY.value
  }
}

// 触摸移动
const onTouchMove = (e) => {
  e.preventDefault()
  
  if (e.touches.length === 1 && touchCount.value === 1) {
    // 单指拖动
    const deltaX = e.touches[0].clientX - touchStartX.value
    const deltaY = e.touches[0].clientY - touchStartY.value
    
    translateX.value = touchStartTranslateX.value + deltaX
    translateY.value = touchStartTranslateY.value + deltaY
  } else if (e.touches.length === 2) {
    // 双指缩放
    const distance = getDistance(e.touches[0], e.touches[1])
    const scaleRatio = distance / touchStartDistance.value
    const newScale = touchStartScale.value * scaleRatio
    
    // 限制缩放范围
    scale.value = Math.max(0.5, Math.min(4, newScale))
    
    // 计算缩放中心偏移
    const center = getCenter(e.touches[0], e.touches[1])
    const deltaX = center.x - touchStartX.value
    const deltaY = center.y - touchStartY.value
    
    translateX.value = touchStartTranslateX.value + deltaX
    translateY.value = touchStartTranslateY.value + deltaY
  }
}

// 触摸结束
const onTouchEnd = (e) => {
  touching.value = false
  touchCount.value = e.touches.length
  
  // 边界检查和回弹
  const maxTranslateX = (scale.value - 1) * 150
  const maxTranslateY = (scale.value - 1) * 150
  
  if (Math.abs(translateX.value) > maxTranslateX) {
    translateX.value = translateX.value > 0 ? maxTranslateX : -maxTranslateX
  }
  
  if (Math.abs(translateY.value) > maxTranslateY) {
    translateY.value = translateY.value > 0 ? maxTranslateY : -maxTranslateY
  }
  
  // 如果缩放过小，重置
  if (scale.value < 0.8) {
    resetTransform()
  }
}

// 处理模态框点击
const handleModalClick = (e) => {
  // 只有点击背景区域才关闭
  if (e.target === e.currentTarget) {
    handleClose()
  }
}

// 关闭预览
const handleClose = () => {
  emit('close')
}
</script>

<script>
export default {
  options: {
    styleIsolation: 'shared',
  },
}
</script>

<style lang="scss" scoped>
.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.image-container {
  transform-origin: center center;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  display: inline-block;
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
  z-index: 10000;
}

.close-btn:active {
  background-color: rgba(128, 128, 128, 0.8);
}
</style>