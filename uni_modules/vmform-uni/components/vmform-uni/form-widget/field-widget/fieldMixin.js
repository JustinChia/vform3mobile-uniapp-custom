import { deepClone, getDSByName, overwriteObj, runDataSourceRequest, translateOptionItems } from '../../utils/util'
import FormValidators, { getRegExp } from '../../utils/validators'
import moment from 'moment'
import { useEmitter } from '../../utils/emitter'
import { $message } from '../../utils/message'
import { formatToUpper } from '../../utils/date-util'
import { inject, ref, set, nextTick, reactive, computed, onBeforeUnmount, onMounted } from '../../utils/vueBuilder.js'

export function useField({ componentType, widgetData, props, actions, emit }) {
  const refList = inject('refList')
  const getRefList = inject('getRefList')
  const getFormConfig = inject('getFormConfig')
  // const globalOptionData = inject('globalOptionData')

  const globalModel = inject('globalModel')
  const getOptionData = inject('getOptionData')
  const getGlobalDsv = inject('getGlobalDsv')
  const getReadMode = inject('getReadMode')
  const getSubFormFieldFlag = inject('getSubFormFieldFlag')
  const getSubFormName = inject('getSubFormName')
  const getDSResultCache = inject('getDSResultCache')
  const getGlobalScripts = inject('getGlobalScripts')

  const data = reactive({
    fieldEditor: null,
    fieldWrapper: null,
    formItemRef: null,

    oldFieldValue: null, // field组件change之前的值
    fieldModel: null,
    rules: [],
    noChangeEventFlag: true, // van-field组件没有change事件！！
    fieldValidateResultHint: '',
    formValidateResult: true,
  })

  if (widgetData) {
    Object.keys(widgetData).forEach(key => {
      set(data, key, widgetData[key])
    })
  }

  const emitter = useEmitter(data)
  let proxy = {}

  const formModel = computed({
    cache: false,
    get() {
      return globalModel().formModel
    },
  })

  const fieldReadModeFlag = ref(false)
  const dataSetLoadedFlag = ref(false)

  const subFormItemFlag = () => {
    return getSubFormFieldFlag ? getSubFormFieldFlag() : false
  }

  const safeNextTick = fn => {
    // #ifdef MP-WEIXIN
    var clearHandler = setInterval(() => {
      if (methodObjs.getFormRef() != null && 
		  (
			subFormItemFlag()&& refList[props.field.options.name + '@row' + props.subFormRowId]
			||
			!subFormItemFlag() && refList[props.field.options.name]
		  )
	  ){
        if (clearHandler) {
          clearInterval(clearHandler)
          clearHandler = null
          fn()
        }
      }
    }, 100)
    // #endif
    // #ifdef APP-PLUS || H5
    nextTick(fn)
    // #endif
  }

  const fieldWrapper = computed({
    get() {
      return data.fieldWrapper
    },
    set(val) {
      data.fieldWrapper = val
    },
  })
  const fieldEditor = computed({
    get() {
      return data.fieldEditor
    },
    set(val) {
      data.fieldEditor = val
    },
  })
  const fieldItemRef = computed({
    get() {
      return data.fieldItemRef
    },
    set(val) {
      data.fieldItemRef = val
    },
  })

  const inputBorder = computed(() => {
    return getFormConfig().inputBorder == undefined ? true : getFormConfig().inputBorder
  })

  const inputAlignClass = computed(() => {
    return 'input-align-' + (props.field.options.inputAlign || getFormConfig().inputAlign)
  })

  const appendTextButton = computed(() => {
    return props.field.options.appendButtonLabel || props.field.options.textForAppend
  })

  const methodObjs = {
    showClearable: () => {
      // 未禁用、未只读、显示clearable 且 有数据 才显示clearable
      return props.field.options.disabled === false && props.field.options.readonly === false && (props.field.options.clearable === undefined || props.field.options.clearable == true) && data.fieldModel != '' && data.fieldModel != null
    },
    fieldLabel: () => {
      return props.field.options.labelHidden ? '' : props.field.options.label
    },

    fieldLabelWidth: () => {
      if (methodObjs.formConfig().labelPosition === 'top') {
        return '100%'
      }
      if(props.field.type=='m-checkbox'){
        return '100%'
      }
      if (props.field.options.labelWidth) {
        return Number(props.field.options.labelWidth)
      }

      if (getFormConfig().labelWidth) {
        return Number(getFormConfig().labelWidth)
      }
      return 80
    },

    labelAlign: () => {
      if (props.field.options.labelAlign) {
        return props.field.options.labelAlign
      }
      return methodObjs.formConfig().labelAlign || 'left'
    },

    labelPosition: () => {
      if (props.field.options.labelPosition) {
        return props.field.options.labelPosition
      }
      if (methodObjs.formConfig().labelPosition) {
        return methodObjs.formConfig().labelPosition
      }

      return 'left'
    },

    formConfig: () => {
      return getFormConfig()
    },

    subFormName: () => {
      return getSubFormName ? getSubFormName() : ''
    },

    subFormItemFlag,

    formModel,

    isReadMode: () => {
      // 特殊字段没有只读模式
      if (['m-static-text', 'm-html-text', 'm-divider'].find(x => x == props.field.type)) {
        return false
      }
      return !!getReadMode() || fieldReadModeFlag.value
    },

    fieldReadonly: () => {
      return props.field.options.readonly || false
    },

    optionLabel: () => {
      if (data.fieldModel === null) {
        return '--'
      } else {
        let resultContent = '--'
        if (props.field.options.optionItems) {
          props.field.options.optionItems.forEach(oItem => {
            if (oItem.value === data.fieldModel || methodObjs.findInArray(data.fieldModel, oItem.value) !== -1) {
              resultContent = resultContent === '--' ? oItem.label : resultContent + ' ' + oItem.label
            }
          })
        }

        return resultContent
      }
    },

    size: () => {
      if (props.field.options.size) return props.field.options.size
      return methodObjs.formConfig().size || ''
    },

    disabledInDesign: () => {
      return !!props.designState
    },

    fieldDisabled: () => {
      return props.field.options.disabled || methodObjs.isReadMode()
    },
    appendButtonDisabled: () => {
      return props.field.options.disabled || methodObjs.isReadMode() || props.field.options.appendButtonDisabled
    },
    uploaderFileList: () => {
      return data.fileList
    },
    validateFieldError: () => {
      return data.formValidateResult === false
    },
    isFocus: () => {
      return false

      //   let formRef = methodObjs.getFormRef()
      //   if (formRef) {
      //     // return formRef.getFocus() === methodObjs.getPropName();
      //   } else {
      //     return false
      //   }
    },
    optionItemDisplayValue: () => {
      if (!props.field.options.optionItems || data.fieldModel === null) return ''
      let checkedItems = props.field.options.optionItems.filter(item => {
        return Array.isArray(data.fieldModel) ? data.fieldModel.indexOf(item.value) >= 0 : data.fieldModel === item.value
      })
      return checkedItems ? checkedItems.map(item => item.label).join(',') : ''
    },
    getSelectedOptionText: () => {
      if (!props.field.options.optionItems || data.fieldModel === null) return ''
      const selectedItem = props.field.options.optionItems.find(item => item.value === data.fieldModel)
      return selectedItem ? selectedItem.label : ''
    },
    switchDisplayValue: () => {
      return data.fieldModel === (props.field.options.activeValue || true) ? props.field.options.activeLabel || '是' : props.field.options.inactiveLabel || '否'
    },
    maxSize: () => {
      return (props.field.options.fileMaxSize || 5) * 1048576 // MBytes
    },

    acceptTypes: () => {
      if (!!props.field.options.fileTypes && props.field.options.fileTypes.length > 0) {
        let resultTypes = []
        props.field.options.fileTypes.forEach(ft => {
          let newType = ft.startsWith('.') ? ft : '.' + ft
          resultTypes.push(newType)
        })
        return resultTypes
      }
      return []
    },

    options: () => {
      if (!props.field.options.optionItems) return
      return props.field.options.optionItems.map(item => {
        return {
          value: item.value,
          text: item.label,
          disable: item.disable ?? false,
        }
      })
    },

    findInArray(arrayObject, element) {
      if (!Array.isArray(arrayObject)) {
        return -1
      }

      let foundIdx = -1
      arrayObject.forEach((aItem, aIdx) => {
        if (aItem === element) {
          foundIdx = aIdx
        }
      })

      return foundIdx
    },

    // --------------------- 组件内部方法 begin ------------------//
    // 获取组件的名称
    getPropName() {
      if (subFormItemFlag() && !props.designState) {
        return methodObjs.subFormName() + '.' + props.subFormRowIndex + '.' + props.field.options.name + ''
      } else {
        return props.field.options.name
      }
    },

    getComponentType() {
      return componentType
    },

    initFieldModel() {
      if (!props.field.formItemFlag) {
        return
      }

      if (!!subFormItemFlag() && !props.designState) {
        // SubForm子表单组件需要特殊处理！！
        let subFormData = formModel.value[methodObjs.subFormName()]

        if ((subFormData === undefined || subFormData[props.subFormRowIndex] === undefined || subFormData[props.subFormRowIndex][props.field.options.name] === undefined) && props.field.options.defaultValue !== undefined) {
          data.fieldModel = props.field.options.defaultValue
          subFormData[props.subFormRowIndex][props.field.options.name] = props.field.options.defaultValue
        } else if (subFormData[props.subFormRowIndex][props.field.options.name] === undefined) {
          data.fieldModel = null
          subFormData[props.subFormRowIndex][props.field.options.name] = null
        } else {
          data.fieldModel = subFormData[props.subFormRowIndex][props.field.options.name]
        }

        /* 主动触发子表单内field-widget的onChange事件！！ */
        setTimeout(() => {
          // 延时触发onChange事件, 便于更新计算字段！！
          methodObjs.handleOnChangeForSubForm(data.fieldModel, data.oldFieldValue, subFormData, props.subFormRowId)
        }, 800)
        data.oldFieldValue = deepClone(data.fieldModel)

        methodObjs.initFileList() // 处理图片上传、文件上传字段
        return
      }

      if (formModel.value && formModel.value[props.field.options.name] === undefined && props.field.options.defaultValue !== undefined) {
        data.fieldModel = props.field.options.defaultValue
      } else if (!!formModel.value && formModel.value[props.field.options.name] === undefined) {
        // 如果formModel为空对象，则初始化字段值为null!!
        formModel.value[props.field.options.name] = null
      } else {
        data.fieldModel = formModel.value[props.field.options.name]
      }
      data.oldFieldValue = deepClone(data.fieldModel)
      methodObjs.initFileList() // 处理图片上传、文件上传字段
    },
    initFileList() {
      // 初始化上传组件的已上传文件列表
      if ((props.field.type !== 'm-picture-upload' && props.field.type !== 'm-file-upload') || props.designState === true) {
        return
      }
      if (data.fieldModel) {
        if (Array.isArray(data.fieldModel)) {
          data.fileList = deepClone(data.fieldModel)
          if (actions && actions.updateFileList) {
            actions.updateFileList(data.fileList)
          }
          data.uploadBtnHidden = data.fileList.length >= props.field.options.limit
        } else {
          data.fileList.splice(0, 0, deepClone(data.fieldModel))
          if (actions && actions.updateFileList) {
            actions.updateFileList(data.fileList)
          }
          data.uploadBtnHidden = props.field.options.limit <= 1
        }
      }
    },
    initEventHandler() {
      emitter.on$('setFormData', newFormData => {
        if (!subFormItemFlag()) {
          methodObjs.setValue(newFormData[props.field.options.name])
        }
      })
      // uni.$on('setFormData', newFormData => {
      //   if (!subFormItemFlag()) {
      //     methodObjs.setValue(newFormData[props.field.options.name])
      //   }
      // })

      /* 监听重新加载选项事件 */
      emitter.on$('reloadOptionItems', widgetNames => {
        if (widgetNames.length === 0 || widgetNames.indexOf(props.field.options.name) > -1) {
          methodObjs.initOptionItems(true)
        }
      })
    },

    handleOnCreated() {
      methodObjs.handleEmitEvent({}, 'onCreated')

      // #ifdef H5 || APP-PLUS
      if (props.field.options.onCreated) {
        console.log('handleOnCreated', props.Afield.type, props.field.options.onCreated)
        let func = new Function(props.field.options.onCreated)
        func.call(proxy)
      }
      // #endif
    }, 

    handleOnMounted() {
      methodObjs.handleEmitEvent({}, 'onMounted')
      // #ifdef H5 || APP-PLUS
      if (props.field.options.onMounted) {
        try {
          let func = new Function(props.field.options.onMounted)
          func.call(proxy)
        } catch (err) {
          console.log('error', err)
        }
      }
      // #endif
	  // if(props.field.options.name==='mradio40142'){
	  // console.error("handleOnMounted",props.field.options.name, data.fieldModel, data.oldFieldValue, methodObjs.subFormName(), props.subFormRowIndex)
	  methodObjs.getFormRef().triggerDynamicLogic(props.field.options.name, data.fieldModel, data.oldFieldValue, methodObjs.subFormName(), props.subFormRowIndex)
	  // }
    },

    clearFieldRules() {
      if (!props.field.formItemFlag) {
        return
      }
      data.rules.splice(0) // 清空已有
    },
    getFieldRules() {
      if (!data.rules || data.rules.length == 0) {
        return []
      }
      return data.rules
    },
    buildFieldRules() {
      if (!props.field.formItemFlag) {
        return
      }
      data.rules.splice(0, data.rules.length) // 清空已有

      let validateName = ''
      if (subFormItemFlag.value) {
        validateName = subFormName.value + '.' + props.subFormRowIndex + '.' + props.field.id
      } else {
        validateName = props.field.id
      }
      if (props.field.options.required) {
        data.rules.push({
          required: true,
          // trigger: ['blur', 'change'],
          trigger: 'onBlur' /* 去掉change事件触发校验，change事件触发时formModel数据尚未更新，导致radio/checkbox必填校验出错！！ */,
          label: validateName,
          errorMessage: props.field.options.requiredHint || props.field.options.label + '必填',
        })
      }
      if (props.field.options.validation) {
        let vldName = props.field.options.validation
        if (FormValidators[vldName]) {
          data.rules.push({
            pattern: getRegExp(vldName),
            trigger: 'onBlur',
            label: validateName,
            errorMessage: props.field.options.validationHint,
          })
        } else {
          data.rules.push({
            pattern: props.field.options.validation,
            trigger: 'onChange',
            regExp: vldName,
            label: validateName,
            errorMessage: props.field.options.validationHint,
          })
        }
      }

      if (props.field.options.onValidate) {
        // #ifdef MP-WEIXIN
        console.warn('受小程序限制，不能使用自定义验证')
        // #endif
        // #ifndef MP-WEIXIN
        let customFn = (rule, value, data, callback) => {
          let tmpFunc = new Function('rule', 'value', 'data', 'callback', props.field.options.onValidate)
          return tmpFunc.call(proxy, rule, value, data, callback)
        }
        data.rules.push({
          validateFunction: customFn,
          trigger: ['blur', 'change'],
          label: validateName,
        })
        // #endif
      }
    },
    registerToRefList(oldRefName) {
      if (componentType !== 'FieldWidget') return

      if (refList !== null && !!props.field.options.name) {
        if (subFormItemFlag() && !props.designState) {
          // 处理子表单元素（且非设计状态）
          if (oldRefName) {
            delete refList[oldRefName + '@row' + props.subFormRowId]
          }
          refList[props.field.options.name + '@row' + props.subFormRowId] = proxy

          Object.keys(methodObjs).forEach(item => {
            Reflect.set(refList[props.field.options.name + '@row' + props.subFormRowId], item, methodObjs[item])
          })
        } else {
          if (oldRefName) {
            delete refList[oldRefName]
          }
          refList[props.field.options.name] = proxy
          Object.keys(methodObjs).forEach(item => {
            Reflect.set(refList[props.field.options.name], item, methodObjs[item])
          })
        }
      }
    },
    unregisterFromRefList() {
      // 销毁组件时注销组件ref
      if (refList !== null && !!props.field.options.name) {
        let oldRefName = props.field.options.name
        if (subFormItemFlag() && !props.designState) {
          // 处理子表单元素（且非设计状态）
          delete refList[oldRefName + '@row' + props.subFormRowId]
        } else {
          delete refList[oldRefName]
        }
        uni.$off('setFormData')
      }
    },
    // 更新表单数据
    syncUpdateFormModel(value) {
      if (subFormItemFlag()) {
        let subFormData = formModel.value[methodObjs.subFormName()] || [{}]
        let subFormDataRow = subFormData[props.subFormRowIndex]
        if (subFormDataRow) {
          // 重置表单后subFormDataRow为undefined，应跳过！！
          subFormDataRow[props.field.options.name] = value
        }
      } else {
        Reflect.set(globalModel().formModel, props.field.options.name, value)
        // globalModel().formModel[props.field.options.name]= value
      }
    },

    getFormRef() {
      /* 获取VFrom引用，必须在VForm组件created之后方可调用 */
      return getRefList()['v_form_ref']
    },

    getGlobalDsv() {
      return getGlobalDsv()
    },

    getNativeForm() {
      return methodObjs.getFormRef().getNativeForm()
    },

    getWidgetRef(widgetName, showError) {
      console.log('keys', Object.keys(getRefList()))
      let foundRef = getRefList()[widgetName]
      if (!foundRef && !!showError) {
        $message.error('未找到组件' + widgetName)
      }
      return foundRef
    },

    getFieldEditor() {
      // 获取内置的原生表单组件
      return data.fieldEditor
    },

    setValue(newValue) {
      const setUploadValue = newValue => {
        data.fileList.splice(0)
        if (newValue)
          newValue.forEach(file => {
            file.extname = file.name.split('.').pop()
            data.fileList.push(file)
          })
      }

      if (props.field.formItemFlag) {
        let oldValue = deepClone(data.fieldModel)
        if (actions && actions.setFieldModel) {
          actions.setFieldModel(newValue)
        } else {
          data.fieldModel = newValue
        }
        if (props.field.type === 'm-picture-upload' || props.field.type === 'm-file-upload') {
          setUploadValue(newValue)
        }

        methodObjs.syncUpdateFormModel(newValue)
        data.oldFieldValue = oldValue
        methodObjs.emitFieldDataChange(newValue, oldValue)
      }
    },

    getValue() {
      /* if ((props.field.type === 'picture-upload') || (props.field.type === 'file-upload')) {
			  return this.fileList
			} else */
      {
        return data.fieldModel
      }
    },
    resetField() {
      if (subFormItemFlag()) {
        // 跳过子表单组件
        return
      }
      let defaultValue = props.field.options.defaultValue
      methodObjs.setValue(defaultValue)

      // 清空上传组件文件列表
      if (props.field.type === 'm-picture-upload' || props.field.type === 'm-file-upload') {
        // this.$refs['fieldEditor'].clearFiles()
        data.fileList.splice(0, data.fileList.length)
      }
    },
    setWidgetOption(optionName, optionValue) {
      // 通用组件选项修改API
      if (props.field.options.hasOwnProperty(optionName)) {
        console.log('set option', optionName, optionValue)
        set(props.field.options, optionName, optionValue)

        emit('props-changed', props.field)
        // props.field.options[optionName] = optionValue
        // TODO: 是否重新构建组件？？有些属性修改后必须重新构建组件才能生效，比如字段校验规则。
      }
    },
    getWidgetOption(optionName) {
      return props.field.options[optionName]
    },
    setReadonly(flag) {
      set(props.field.options, 'readonly', flag)
      emit('props-changed', props.field)
    },
    setReadMode(readonlyFlag = true) {
      if (componentType === 'FieldWidget' && data.fieldWrapper) {
        data.fieldWrapper.setReadMode(readonlyFlag)
      } else {
        fieldReadModeFlag.value = readonlyFlag
      }
    },

    setDisabled(flag = true) {
      set(props.field.options, 'disabled', flag)
      emit('props-changed', props.field)
    },

    setAppendButtonVisible(flag) {
      set(props.field.options, 'appendButton', flag)
      emit('props-changed', props.field)
    },

    getAppendButtonVisible() {
      return props.field.options.appendButton
    },

    setAppendButtonDisabled(flag) {
      set(props.field.options, 'appendButtonDisabled', flag)
      emit('props-changed', props.field)
    },

    setHidden(flag = true) {
      set(props.field.options, 'hidden', flag)
      emit('props-changed', props.field)

      if (flag) {
        // 清除组件校验规则
        methodObjs.clearFieldRules()
      } else {
        // 重建组件校验规则
        methodObjs.buildFieldRules()
      }
    },
    // 后期调用字段 setRules改变校验的方法
    setRules(rules) {
      data.rules = rules
      if (componentType === 'FieldWidget' && data.fieldWrapper) {
        // 如果字段隐藏或者字段没有被fieldWrapper包裹，fieldWrapper可能不存在
        if (data.fieldWrapper && data.fieldWrapper.setRules) {
          // 设置字段的data.rules
          data.fieldWrapper.setRules(data.rules)
        }
      } else {
        if (data.fieldItemRef) {
          data.fieldItemRef.setRules(rules)
        }
      }
    },

    setRequired(flag = true) {
      if (componentType === 'FieldWidget' && data.fieldWrapper) {
        set(props.field.options, 'required', flag)
        emit('props-changed', props.field)
        methodObjs.buildFieldRules()
        methodObjs.setRules(data.rules)
      }
      if (!flag) {
        // 清除必填校验提示
        methodObjs.clearValidate()
      }
    },

    /**
     * 清除字段校验提示
     */
    clearValidate() {
      data.rules.splice(0)
      methodObjs.setRules(data.rules)
      methodObjs.getFormRef().getNativeForm().clearValidate(methodObjs.getPropName())
    },

    setLabel(newLabel) {
      set(props.field.options, 'label', newLabel)
      emit('props-changed', props.field)
    },

    focus(autoSroll = true) {
      const formRef = methodObjs.getFormRef()
      if (formRef) {
        formRef.setFocus(methodObjs.getPropName(), autoSroll)
      }
    },
    blur() {
      const formRef = methodObjs.getFormRef()
      if (formRef) formRef.setFocus(null, false)
    },

    async initOptionItems(keepSelected) {
      if (props.field.type === 'm-radio' || props.field.type === 'm-checkbox' || props.field.type === 'm-select' || props.field.type === 'm-cascader') {
        /* 首先处理数据源选项加载 */
        if (props.field.options.dsEnabled) {
          props.field.options.optionItems.splice(0, props.field.options.optionItems.length) // 清空原有选项
          let curDSName = props.field.options.dsName
          let curDSetName = props.field.options.dataSetName
          let curDS = getDSByName(methodObjs.formConfig(), curDSName)
          if (!!curDS && !curDSetName) {
            let gDsv = getGlobalDsv() || {}
            let localDsv = new Object({})
            overwriteObj(localDsv, gDsv)
            localDsv['widgetName'] = props.field.options.name
            let dsResult = null
            try {
              dsResult = await runDataSourceRequest(curDS, localDsv, methodObjs.getFormRef(), false, $message)
              methodObjs.loadOptions(dsResult)
            } catch (err) {
              $message.error(err.message)
            }
          } else if (!!curDS && !!curDSetName && !dataSetLoadedFlag.value) {
            emitter.on$('loadOptionItemsFromDataSet', dsName => {
              methodObjs.loadOptionItemsFromDataSet(dsName)
              dataSetLoadedFlag.value = true
            })
            methodObjs.loadOptionItemsFromDataSet(curDSName)
          }

          return
        }

        /* 异步更新option-data之后globalOptionData不能获取到最新值，改用provide的getOptionData()方法 */
        const newOptionItems = getOptionData()

        if (!!newOptionItems && newOptionItems.hasOwnProperty(props.field.options.name)) {
          if (keepSelected) {
            methodObjs.reloadOptions(newOptionItems[props.field.options.name])
          } else {
            methodObjs.loadOptions(newOptionItems[props.field.options.name])
          }
        }
      }
    },

    loadOptionItemsFromDataSet(dsName) {
      if (props.designState) {
        return
      }

      if (props.field.type !== 'm-radio' && props.field.type !== 'm-checkbox' && props.field.type !== 'm-select' && props.field.type !== 'm-cascader') {
        return
      }

      if (!props.field.options.dsEnabled || !props.field.options.dsName || !props.field.options.dataSetName || props.field.options.dsName !== dsName) {
        return
      }

      const dataCache = getDSResultCache()
      const dSetName = props.field.options.dataSetName
      if (!!dataCache && !!dataCache[dsName] && !!dataCache[dsName][dSetName]) {
        props.field.options.optionItems.splice(0, props.field.options.optionItems.length) // 清空原有选项
        methodObjs.loadOptions(dataCache[dsName][dSetName])
      }
    },

    /**
     * 加载选项，并清空字段值
     * @param options
     */
    loadOptions(options) {
      /*
			props.field.options.optionItems = deepClone(options)
			this.clearSelectedOptions()  //清空已选选项
			 */
      set(props.field.options, 'optionItems', translateOptionItems(options, props.field.type, props.field.options.labelKey || 'label', props.field.options.valueKey || 'value'))
      if (actions && actions.afterLoadOptions) actions.afterLoadOptions()
      emit('props-changed', props.field)
    },

    setUploadHeader(name, value) {
      data.uploadHeaders[name] = value
    },

    setUploadData(name, value) {
      data.uploadData[name] = value
    },

    /**
     * 重新加载选项，不清空字段值
     * @param options
     */
    reloadOptions(options) {
      props.field.options.optionItems = translateOptionItems(options, props.field.type, props.field.options.labelKey || 'label', props.field.options.valueKey || 'value')

      console.error('reloadOptions', props.field.options.optionItems)
      if (actions && actions.afterLoadOptions) actions.afterLoadOptions()
    },

    setOptions(options) {
      // Added to match useRender.js usage
      methodObjs.reloadOptions(options)
    },

    remoteDataSourceQuery() {
      const searchPromise = methodObjs.getFormRef().executeDataSource(props.field.options.dsName, { search: data.searchVal })
      searchPromise.then(data => {
        let curDSetName = props.field.options.dataSetName
        let searchResult = []
        if (curDSetName) {
          searchResult = data[curDSetName]
        } else {
          searchResult = data
        }
        if (!Array.isArray(searchResult)) {
          console.error('remoteDataSourceQuery返回值必须是数组')
          return
        }
        props.field.options.optionItems = searchResult.map(x => ({ label: x[props.field.options.labelKey || 'label'], value: x[props.field.options.valueKey || 'value'] }))
      })
    },
    remoteQuery(keyword) {
      if (props.designState) {
        //设计状态不触发事件
        return
      }

      if (props.field.options.onRemoteQuery) {
        let remoteFn = new Function('keyword', props.field.options.onRemoteQuery)
        remoteFn.call(proxy, keyword)
      }
    },

    /**
     * 返回radio/checkbox/select/cascader的选项数据
     * @returns 选择项数组
     */
    getOptions() {
      return props.field.options.optionItems.map(item => {
        return {
          ...item,
          value: item.value,
          text: item.label,
          disable: item.disabled,
          tooltip: item.tooltip,
          exampleImage: item.exampleImage,
          additionalComponents: item.additionalComponents,
          additionalComponentsMultiple: item.additionalComponentsMultiple,
          maxAdditionalComponents: item.maxAdditionalComponents,
          image:item.image
        }
      })
    },
    getOptionItems() {
      return this.getOptions()
    },

    disableOption(optionValue) {
      methodObjs.disableOptionOfList(props.field.options.optionItems, optionValue)
    },

    enableOption(optionValue) {
      console.log('enableOption', optionValue)
      methodObjs.enableOptionOfList(props.field.options.optionItems, optionValue, props.field.options.valueKey)
    },

    disableOptionOfList(optionList, optionValue) {
      if (!!optionList && optionList.length > 0) {
        optionList.forEach(opt => {
          console.warn(opt.value, '=', optionValue)
          if (opt.value === optionValue) {
            Reflect.set(opt, 'disabled', true)
          }
          // Do not change other options' disable status
        })
      }
      methodObjs.reloadOptions(optionList) // Reload to apply changes
    },

    enableOptionOfList(optionList, optionValue) {
      if (!!optionList && optionList.length > 0) {
        optionList.forEach(opt => {
          if (opt.value === optionValue) {
            Reflect.set(opt, 'disabled', false)
          }
        })
      }
    },
    handleOverNum(filePicker, selectFiles) {
      if (props.field.options.limit > 0 && data.fileList.length + selectFiles.length > props.field.options.limit) {
        $message.error('文件不能超过' + props.field.options.limit + '个')
        selectFiles.forEach(file => {
          if (filePicker.value.delFileByUuid) {
            filePicker.value.delFileByUuid(file.uuid)
          }
        })
        return true
      } else {
        return false
      }
    },

    handleOverSize(filePicker, selectFiles) {
      let overSize = false
      selectFiles.forEach(file => {
        if (file.size > methodObjs.maxSize()) {
          if (filePicker.value.delFileByUuid) {
            filePicker.value.delFileByUuid(file.uuid)
          }
          overSize = true
        }
      })
      if (overSize) {
        $message.error('文件大小不能超过' + (props.field.options.fileMaxSize || 5) + 'M')
      }
      return overSize
    },

    handleAcceptTypes(filePicker, selectFiles) {
      let decline = false
      selectFiles.forEach(file => {
        if (!methodObjs.acceptTypes().includes('.' + file.extname)) {
          if (filePicker.value.delFileByUuid) {
            filePicker.value.delFileByUuid(file.uuid)
          }
          $message.error('文件类型不支持')
          decline = true
        }
      })
      return decline
    },

    buildEvnetArgs(obj, eventName) {
      const eventObj = {
        formRef: methodObjs.getFormRef(),
        widgetRef: refList[props.field.options.name],
        triggerName: props.field.options.name,
        triggerField: props.field,
        eventName,
      }

      Object.keys(obj).forEach(key => {
        if (obj[key]) set(eventObj, key, obj[key])
      })

      return eventObj
    },

    emitFieldDataChange(newValue, oldValue) {
      uni.$emit('field-value-changed', [props.field.options.name, newValue, oldValue, methodObjs.subFormName(), props.subFormRowIndex])
      /* 必须用dispatch向指定父组件派发消息！！ */
      uni.$emit('fieldChange', [props.field.options.name, newValue, oldValue, methodObjs.subFormName(), props.subFormRowIndex])

      if (componentType === 'FieldWidget') {
        if (subFormItemFlag()) {
          let subFormData = formModel.value[methodObjs.subFormName()]
          methodObjs.handleOnChangeForSubForm(newValue, oldValue, subFormData, props.subFormRowId)
        } else {
          methodObjs.handleOnChange(newValue, oldValue)
        }
      }
    },
    // 所有onChange都通过这里来触发事件
    handleChangeEvent(event) {
      data.fieldModel = event
      methodObjs.syncUpdateFormModel(data.fieldModel)
      methodObjs.handleEmitEvent(
        {
          value: data.fieldModel,
          oldValue: data.oldFieldValue,
        },
        'onChange'
      )
      methodObjs.emitFieldDataChange(data.fieldModel, data.oldFieldValue)
      // number组件一般不会触发focus事件，故此处需要手工赋值oldFieldValue！！
      data.oldFieldValue = deepClone(data.fieldModel) /* oldFieldValue需要在initFieldModel()方法中赋初值!! */
    },

    handleButtonClickEvent(event) {
      methodObjs.handleEmitEvent(event, 'buttonClick')
      methodObjs.handleEmitEvent(event, 'onClick')

      // #ifdef H5 || APP-PLUS
      if (props.field.options.onClick) {
        let func = new Function(props.field.options.onClick)
        func.call(proxy)
      }
      // #endif
    },

    handleOnChange(val, oldVal) {
      // 自定义onChange事件
      methodObjs.handleEmitEvent(
        {
          val,
          oldVal,
        },
        'handleOnChange'
      )
      // #ifdef H5 || APP-PLUS
      if (props.field.options.onChange) {
        let func = new Function('value', 'oldValue', props.field.options.onChange)
        func.call(proxy, val, oldVal)
      }
      // #endif
    },

    handleOnChangeForSubForm(val, oldVal, subFormData, rowId) {
      // 子表单自定义onChange事件
      methodObjs.handleEmitEvent(
        {
          val,
          oldVal,
          subFormData,
          rowId,
        },
        'handleOnChangeForSubForm'
      )

      // #ifdef H5 || APP-PLUS
      if (props.field.options.onChange) {
        let func = new Function('value', 'oldValue', 'subFormData', 'rowId', props.field.options.onChange)
        func.call(proxy, val, oldVal, subFormData, rowId)
      }
      // #endif
    },

    handleAppendButtonClickEvent(event) {
      methodObjs.handleEmitEvent(event, 'appendButtonClick')
      methodObjs.handleEmitEvent(event, 'onAppendButtonClick')

      // #ifdef H5 || APP-PLUS
      if (props.field.options.onAppendButtonClick) {
        let func = new Function(props.field.options.onAppendButtonClick)
        func.call(proxy)
      }
      // #endif
    },
    handleFocusCustomEvent(event) {
      safeNextTick(() => {
        data.oldFieldValue = deepClone(data.fieldModel) // 保存修改change之前的值
        methodObjs.focus(false)
        methodObjs.handleEmitEvent(
          {
            value: null,
          },
          'onFocus'
        )
      })
      // #ifdef H5 || APP-PLUS
      if (props.field.options.onFocus) {
        let func = new Function('event', props.field.options.onFocus)
        func.call(proxy, event)
      }
      // #endif
    },

    handleBlurCustomEvent(event) {
      methodObjs.blur(false)
      methodObjs.handleEmitEvent(
        {
          value: null,
        },
        'onBlur'
      )
      // #ifdef H5 || APP-PLUS
      if (props.field.options.onBlur) {
        let func = new Function('event', props.field.options.onBlur)
        func.call(proxy, event)
      }
      // #endif
    },
    handleInputEvent(value) {
      methodObjs.handleInputCustomEvent(value)
    },

    handleInputCustomEvent(value) {
      methodObjs.syncUpdateFormModel(value)
      methodObjs.handleEmitEvent(
        {
          value,
        },
        'onInput'
      )
      // #ifdef H5 || APP-PLUS
      if (props.field.options.onInput) {
        let func = new Function('value', props.field.options.onInput)
        func.call(proxy, value)
      }
      // #endif
    },
    handleCascaderChange(event) {
      let value = event.detail.value.map(x => x.value)
      methodObjs.setValue(value)
      methodObjs.handleChangeEvent(value)
    },
    handleDatePickerSelectEvent(value, type) {
      methodObjs.handleEmitEvent(
        {
          value: value,
        },
        'onConfirm'
      )
      methodObjs.handleChangeEvent(value)
    },
    handleRadioSelectEvent(event) {
      const { value } = event.detail
      methodObjs.handleChangeEvent(value)
    },
    handlePickerChangeEvent(event) {
      const { value } = event.detail
      const options = methodObjs.getOptions()
      if (options && options[value]) {
        methodObjs.handleChangeEvent(options[value].value)
      }
    },
    handleCustomPickerChange(value) {
      methodObjs.handleChangeEvent(value)
    },
    handleCheckboxCheckedEvent(event) {
      const { value } = event.detail
      methodObjs.handleChangeEvent(value)
    },
    handleEmitEvent(event, eventName) {
      if (componentType === 'FieldWidget') {
        uni.$emit(eventName, methodObjs.buildEvnetArgs(event, eventName))
        uni.$emit(props.field.options.name + '_' + eventName, methodObjs.buildEvnetArgs(event, props.field.options.name + '_' + eventName))
      }
    },
    beforeUpload: null,
    afterUpload: null,
    setBeforeUploadHandler(handler) {
      methodObjs.beforeUpload = handler
    },
    setAfterUploadHandler(handler) {
      methodObjs.afterUpload = handler
    },
    ...emitter,
  }

  const getProxy = () => {
    proxy = {
      fieldWrapper,
      fieldEditor,
      fieldItemRef,
      ...getGlobalScripts(),
    }
    Object.keys(data).forEach(item => {
      Reflect.set(proxy, item, data[item])
    })
    Object.keys(props).forEach(item => {
      Reflect.set(proxy, item, props[item])
    })
    Object.keys(methodObjs).forEach(item => {
      Reflect.set(proxy, item, methodObjs[item])
    })
  }
  getProxy()
  if (componentType === 'FieldWidget') {
    methodObjs.registerToRefList()
    methodObjs.initFieldModel()
    methodObjs.initEventHandler()
    safeNextTick(() => {
      methodObjs.handleOnCreated()
      methodObjs.buildFieldRules()
      if (actions && actions.buildFieldRules) {
        actions.buildFieldRules(data.rules)
      }
      methodObjs.setRules(data.rules)
    })
  } else {
    methodObjs.buildFieldRules()
    if (actions && actions.buildFieldRules) {
      actions.buildFieldRules(data.rules)
    }
    methodObjs.setRules(data.rules)
  }

  onMounted(() => {
    if (componentType === 'FieldWidget') {
      safeNextTick(() => {
        methodObjs.handleOnMounted()
      })
    }
  })

  onBeforeUnmount(() => {
    methodObjs.unregisterFromRefList()
  })
  return {
    data,
    proxy,
    formItemRef: data.formItemRef,
    $message,
    methodObjs,
    fieldWrapper,
    fieldEditor,
    fieldItemRef,
    inputBorder,
    inputAlignClass,
    appendTextButton,
  }
}
