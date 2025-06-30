<template>
  <view class="radio-image-option-item-wrapper">
    <view class="radio-image-option-item" @click.stop="handleItemClick" :class="{ 
        selected: isSelected,
        disabled: item.disabled 
      }">
      <!-- 图片区域 -->
      <view class="radio-image-container">
        <image 
          v-if="item.image" 
          :src="item.image" 
          class="radio-option-image"
          mode="aspectFit"
          @error="handleImageError"
        />
        <view v-else class="radio-image-placeholder">
          <text class="placeholder-text">暂无图片</text>
        </view>
        
        <!-- 选中状态指示器 -->
        <view v-if="isSelected" class="selected-indicator">
          <text class="checkmark">✓</text>
        </view>
      </view>

      <!-- 标题区域 -->
      <view class="radio-option-title">
        {{ item.text || item.label }}
      </view>

      <!-- 右侧操作区域 -->
      <view v-if="item.tooltip || item.exampleImage" class="radio-option-actions">
        <!-- tooltip问号图标 -->
        <view v-if="item.tooltip" class="tooltip-icon" @click.stop="handleTooltipClick">
          ?
        </view>

        <!-- 示例图按钮 -->
        <view v-if="item.exampleImage" class="example-image-btn" @click.stop="handleImagePreview">
          示例图
        </view>
      </view>
    </view>

    <!-- tooltip提示文字 -->
    <view v-if="item.tooltip && tooltipVisible" class="tooltip-content">
      {{ item.tooltip }}
    </view>
  </view>
</template>

<script setup>
import { ref } from '../../utils/vueBuilder.js'

const props = defineProps({
  // 选项数据
  item: {
    type: Object,
    required: true
  },
  // 是否选中
  isSelected: {
    type: Boolean,
    default: false
  },
  // tooltip是否展开
  tooltipVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'item-click',
  'tooltip-toggle', 
  'image-preview'
])

// 处理选项点击
const handleItemClick = () => {
  if (props.item.disabled) return
  emit('item-click', props.item)
}

// 处理tooltip点击
const handleTooltipClick = () => {
  emit('tooltip-toggle', props.item)
}

// 处理示例图预览
const handleImagePreview = () => {
  emit('image-preview', props.item)
}

// 处理图片加载错误
const handleImageError = () => {
  console.warn('图片加载失败:', props.item.image)
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
.radio-image-option-item-wrapper {
  width:100%;
}

.radio-image-option-item {
  padding: 10rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background-color: #fff;
  flex-shrink:0;

  &:hover {
    border-color: #EEC23D;
    box-shadow: 0 4rpx 12rpx rgba(238, 194, 61, 0.2);
  }

  &.selected {
    border-color: #EEC23D;
    background-color: #fff6da;
    box-shadow: 0 4rpx 12rpx rgba(238, 194, 61, 0.3);

    .radio-option-title {
      color: #EEC23D;
      font-weight: 600;
    }
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      border-color: #e5e5e5;
      box-shadow: none;
    }
  }
}

.radio-image-container {
  position: relative;
  width: 100%;
  height: 200rpx;
  margin-bottom: 20rpx;
  border-radius: 8rpx;
  overflow: hidden;
  background-color: #f8f8f8;
}

.radio-option-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.radio-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border: 2rpx dashed #ddd;
}

.placeholder-text {
  color: #999;
  font-size: 28rpx;
}

.selected-indicator {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: #EEC23D;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

.checkmark {
  color: white;
  font-size: 24rpx;
  font-weight: bold;
}

.radio-option-title {
  text-align: center;
  color: #333;
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 10rpx;
  line-height: 1.4;
}

.radio-option-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
}

.tooltip-icon {
  width: 40rpx;
  height: 40rpx;
  background-color: #EEC23D;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
}

.example-image-btn {
  color:  #FED752;
  font-size: 26rpx;
  cursor: pointer;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  transition: background-color 0.2s;
  border: 1px solid #EEC23D;

  &:hover {
    background-color: #f0f8ff;
  }
}

.tooltip-content {
  padding: 20rpx;
  background-color: #f9f9f9;
  color: #666;
  font-size: 26rpx;
  border-left: 6rpx solid #EEC23D;
  margin-top: 10rpx;
  border-radius: 0 8rpx 8rpx 0;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>