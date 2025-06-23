import { ref } from '@/utils/vue.js'
import { $message } from '@/uni_modules/vmform-uni/components/vmform-uni/utils/message.js'

export const useFormActionHooks = ({ output, vmFormRenderRef }) => {
  const optionData = ref({})
  const getWidgetRef = (widgetName = 'minput104177', showError = true) => {
    const widgetRef = vmFormRenderRef.value.getWidgetRef(widgetName, showError)
    if (widgetRef) {
      console.log('widgetRef', widgetRef)
      output(`组件uid:${widgetRef._uid},更多数据请在控制台查看输出`)
    }
    return widgetRef
  }

  const setFormJson = formJson => {
    vmFormRenderRef.value.setFormJson(formJson)
  }
  const getFormJson = () => {
    const formJson = vmFormRenderRef.value.getFormJson()
    output(vmFormRenderRef.value.getFormJson())
  }

  const setFormData = formData => {
    vmFormRenderRef.value.setFormData(formData)
  }
  const getFormData = () => {
    vmFormRenderRef.value.getFormData().then(data => {
      output({ ...data })
    })
  }

  const resetForm = () => {
    console.log('proxy', vmFormRenderRef.value)
    vmFormRenderRef.value.resetForm()
  }

  const getNativeForm = () => {
    const nativeFormRef = vmFormRenderRef.value.getNativeForm()
    console.log('nativeFormRef', nativeFormRef)
    output(`组件uid:${nativeFormRef._uid},更多数据请在控制台查看输出`)
  }

  const validateForm = () => {
    vmFormRenderRef.value.validateForm(success => {
      output(success ? '校验通过' : '校验失败')
    })
  }

  const getFieldValue = () => {
    const widgetRef = getWidgetRef('minput104177', true)
    output(vmFormRenderRef.value.getFieldValue('minput104177'))
  }
  const setFieldValue = () => {
    const widgetRef = getWidgetRef('minput104177', true)
    vmFormRenderRef.value.setFieldValue('minput104177', '设置的值')
  }

  const reloadOptionData = () => {
    optionData.value['mselect71411'] = [
      { label: '选项 1', value: 'OPTION1' },
      { label: '选项 2', value: 'OPTION1' },
      { label: '选项 3', value: 'OPTION3' },
    ]
    optionData.value['mradio62090'] = [
      { label: '选项 1', value: 'OPTION1' },
      { label: '选项 2', value: 'OPTION1' },
      { label: '选项 3', value: 'OPTION3' },
    ]
    vmFormRenderRef.value.reloadOptionData()
  }
  const getSubFormValues = () => {
    try {
      const subformData = vmFormRenderRef.value.getSubFormValues('msubform56101')
      console.log(subformData)
      output(subformData)
    } catch (e) {
      $message.error('请先点击设置表单json')
    }
  }
  const disableForm = () => {
    vmFormRenderRef.value.disableForm()
  }
  const enableForm = () => {
    vmFormRenderRef.value.enableForm()
  }
  var readMode = true
  const setReadMode = () => {
    vmFormRenderRef.value.setReadMode(readMode)
    readMode = !readMode
  }
  const disableWidgets = () => {
    vmFormRenderRef.value.disableWidgets(['minput104177'])
  }
  const enableWidgets = () => {
    vmFormRenderRef.value.enableWidgets(['minput104177'])
  }
  const hideWidgets = () => {
    vmFormRenderRef.value.hideWidgets(['minput104177'])
  }
  const showWidgets = () => {
    vmFormRenderRef.value.showWidgets(['minput104177'])
  }
  const getFieldWidgets = () => {
    const widgets = vmFormRenderRef.value.getFieldWidgets()
    console.log('widgets', widgets)
    output(widgets)
  }
  const getContainerWidgets = () => {
    const widgets = vmFormRenderRef.value.getContainerWidgets()
    console.log('widgets', widgets)
    output(widgets)
  }

  const executeDataSource = () => {
    vmFormRenderRef.value.executeDataSource('dsTest').then(data => {
      console.log('dsData', data)
      output(data)
    })
  }

  return {
    optionData,
    setFormJson, //设置表单json
    getFormJson, //获取表单json
    resetForm, //重置表单

    getWidgetRef, //获取字段组件实例

    setFormData, //设置表单数据
    getFormData, //获取表单数据
    validateForm, //校验表单

    getNativeForm, //获取原生表单对象

    setFieldValue, //设置字段值
    getFieldValue, //获取字段值

    reloadOptionData, //重新加载选项数据
    getSubFormValues, //获取子表单数据

    disableForm, //禁用表单
    enableForm, //启用表单
    setReadMode, //设置表单为只读模式

    disableWidgets, //禁用字段
    enableWidgets, //启用字段
    hideWidgets, //隐藏字段
    showWidgets, //显示字段

    getFieldWidgets, //获取所有字段组件实例
    getContainerWidgets, //获取所有容器组件实例

    executeDataSource, //执行数据源
  }
}
