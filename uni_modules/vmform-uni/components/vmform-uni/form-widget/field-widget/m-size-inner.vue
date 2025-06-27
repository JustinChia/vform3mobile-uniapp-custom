<template>
  <view class="size-field-container">
    <uni-easyinput 
      ref="widthEditor" 
      :value="widthModel" 
      @input="emit('update:widthModel', $event)"
      :name="field.options.name + '_width'" 
      :disabled="fieldDisabled" 
      :readonly="field.options.readonly || isReadMode" 
      type="text"
      :placeholder="field.options.widthPlaceholder || '请输入宽度'" 
      :clearable="field.options.clearable" 
      :inputBorder="false"
      class="size-input"
      @focus="emit('focus:width')" 
      @blur="emit('blur:width')" 
      @change="emit('change:width', $event)" 
    />
    <view class="size-separator">×</view>
    <uni-easyinput 
      ref="heightEditor" 
      :value="heightModel" 
      @input="emit('update:heightModel', $event)"
      :name="field.options.name + '_height'" 
      :disabled="fieldDisabled" 
      :readonly="field.options.readonly || isReadMode" 
      type="text"
      :placeholder="field.options.heightPlaceholder || '请输入高度'" 
      :clearable="field.options.clearable" 
      :inputBorder="false"
      class="size-input"
      @focus="emit('focus:height')" 
      @blur="emit('blur:height')" 
      @change="emit('change:height', $event)" 
    />
  </view>
</template>
<script setup>
import { ref } from '../../utils/vueBuilder';

const props = defineProps({
  widthModel: String,
  heightModel: String,
  field: Object,
  fieldDisabled: Boolean,
  isReadMode: Boolean,
  size: String,
});

const emit = defineEmits([
  'update:widthModel',
  'update:heightModel',
  'focus:width',
  'blur:width',
  'change:width',
  'input:width',
  'focus:height',
  'blur:height',
  'change:height',
  'input:height',
]);

</script>
<style scoped lang="scss">

.size-field-container{
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.size-input {
  width: 150px;
  flex: 1;
}

.size-separator {
  font-size: 16px;
  font-weight: bold;
  color: #666;
  margin: 0 4px;
  flex-shrink: 0;
}

</style>