import { ref, toRefs } from '@/utils/vue.js'
export const useVformRenderHooks = () => {
  const vmFormRenderRef = ref(null)
  const log = ref([])
  const output = str => {
    log.value.push(str)
  }

  const clearOutput = () => {
    log.value.splice(0)
  }

  return {
    log,
    output,
    clearOutput,
    vmFormRenderRef,
  }
}
