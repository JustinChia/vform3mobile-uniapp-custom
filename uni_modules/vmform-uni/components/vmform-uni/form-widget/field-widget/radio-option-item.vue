<template>
  <view class="radio-option-item-wrapper">
    <view class="radio-option-item" @click.stop="handleItemClick" :class="{ 
        selected: isSelected,
        disabled: item.disabled 
      }">
      <!-- 选项标签 -->
      <view class="radio-option-label">
        {{ item.text || item.label }}
      </view>

      <!-- 右侧操作区域 -->
      <view class="radio-option-actions">
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
</script>

<script>
export default {
  options: {
    styleIsolation: 'shared',
  },
}
</script>

<style lang="scss" scoped>
.radio-option-item-wrapper {
  border-bottom: 1rpx solid rgb(230, 230, 230);
}

.radio-option-item {
  padding: 15rpx 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: left;

  &:hover {
    background-color: #fff6da;
  }

  &.selected {
    background-color: #fff6da;

    .radio-option-label {
      color: #EEC23D;
      font-weight: 500;
    }
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.radio-option-label {
  flex: 1;
  color: #333;
  margin-left: 0;
}

.radio-option-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tooltip-icon {
  width: 20px;
  height: 20px;
  background-color: #EEC23D;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
}

.example-image-btn {
  color:  #FED752;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f8ff;
  }
}

.tooltip-content {
  padding: 10px 20px;
  background-color: #f9f9f9;
  color: #666;
  font-size: 14px;
  border-left: 3px solid #eec23d;
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