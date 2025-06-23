var ref, watch, set, toRefs, reactive, isReactive, computed, nextTick, inject, provide, onMounted, onBeforeUnmount, defineEmits, getCurrentInstance
// #ifndef VUE3
import {
  ref as ref2,
  watch as watch2,
  set as set2,
  toRefs as toRefs2,
  reactive as reactive2,
  isReactive as isReactive2,
  computed as computed2,
  nextTick as nextTick2,
  inject as inject2,
  provide as provide2,
  onMounted as onMounted2,
  onBeforeUnmount as onBeforeUnmount2,
  getCurrentInstance as getCurrentInstance2,
} from '@vue/composition-api'

ref = ref2
watch = watch2
set = set2
toRefs = toRefs2
reactive = reactive2
isReactive = isReactive2
computed = computed2
nextTick = nextTick2
inject = inject2
provide = provide2
onMounted = onMounted2
onBeforeUnmount = onBeforeUnmount2
getCurrentInstance = getCurrentInstance2

// #endif
// #ifdef VUE3
import {
  ref as ref3,
  watch as watch3,
  toRefs as toRefs3,
  reactive as reactive3,
  isReactive as isReactive3,
  computed as computed3,
  nextTick as nextTick3,
  inject as inject3,
  provide as provide3,
  onMounted as onMounted3,
  onBeforeUnmount as onBeforeUnmount3,
  defineEmits as defineEmits3,
  getCurrentInstance as getCurrentInstance3,
} from 'vue'
ref = ref3
set = (obj, key, value) => {
  obj[key] = value
  // isReactive3(obj) ? (obj[key] = value) : (toRefs(obj)[key] = value);
}
watch = watch3
toRefs = toRefs3
reactive = reactive3
isReactive = isReactive3
computed = computed3
nextTick = nextTick3
inject = inject3
provide = provide3
onMounted = onMounted3
onBeforeUnmount = onBeforeUnmount3
defineEmits = defineEmits3
getCurrentInstance = getCurrentInstance3
// #endif

export { ref, watch, set, toRefs, reactive, isReactive, computed, nextTick, inject, provide, onMounted, onBeforeUnmount, defineEmits, getCurrentInstance }
