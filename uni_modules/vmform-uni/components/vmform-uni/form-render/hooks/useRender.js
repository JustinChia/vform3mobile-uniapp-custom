import { ref, set, computed, provide, nextTick } from '../../utils/vueBuilder.js'
import { $message } from '../../utils/message.js'

import { useEmitter } from '../../utils/emitter'
import { generateId, deepClone, getAllContainerWidgets, getAllFieldWidgets, traverseFieldWidgets, getDSByName, runDataSourceRequest, getFieldWidgetByName, insertCustomCssToHead, insertGlobalFunctionsToHtml, overwriteObj, traverseFieldWidgetsOfContainer } from '../../utils/util'
import { containers, basicFields, advancedFields } from './widgetsConfig.js'

export const useRender = ({ data, props, emit }) => {
  const refList = data.widgetRefList

  const emitterMixin = useEmitter(data)

  const globalScripts = {}
  const getReadMode = () => data.readModeFlag
  const getGlobalDsv = () => props.globalDsv

  const getRefList = () => data.widgetRefList
  const getFormConfig = () => data.formJsonObj.formConfig
  const getOptionData = () => props.optionData
  const globalModel = () => {
    return {
      formModel: data.formDataModel,
    }
  }
  const getDSResultCache = () => data.dsResultCache
  const getSubFormFieldFlag = () => false
  const getSubFormName = () => ''
  const getGlobalScripts = () => globalScripts

  provide('refList', refList)
  provide('getRefList', getRefList)
  provide('sfRefList', data.subFormRefList) // 收集SubForm引用
  provide('getFormConfig', getFormConfig) /* 解决provide传递formConfig属性的响应式更新问题！！ */
  provide('getGlobalDsv', getGlobalDsv) // 全局数据源变量
  provide('globalOptionData', props.optionData)
  provide('getOptionData', getOptionData) /* 该方法用于在异步更新option-data之后重新获取到最新值 */
  provide('globalModel', globalModel)
  provide('getReadMode', getReadMode)
  provide('getSubFormFieldFlag', getSubFormFieldFlag)
  provide('getSubFormName', getSubFormName)
  provide('getDSResultCache', getDSResultCache)
  provide('getGlobalScripts', getGlobalScripts)

  // 当前组件的引用

  let proxy = null
  const renderForm = ref()
  const focusWidget = ref('')
  const formConfig = computed(() => {
    return data.formJsonObj.formConfig
  })

  const formStyle = computed(() => {
    return `background-color: ${data.formJsonObj.formConfig.background || '#FFFFFF'}; padding: ${(data.formJsonObj.formConfig.padding || 0) + 'px'};--form-field-radius: ${data.formJsonObj.formConfig.radius}px`
  })

  const methodObjs = {
    getRefList,
    getGlobalDsv,
    getFormConfig,
    getOptionData,
    globalModel,
    getReadMode,
    getDSResultCache,

    labelPosition: () => {
      if (!!formConfig.value && !!formConfig.value.labelPosition) {
        return formConfig.value.labelPosition
      }
      return 'left'
    },
    labelWidth: () => {
      if (formConfig.value.labelPosition === 'top') {
        return '100%'
      }
      if (!!formConfig.value && !!formConfig.value.labelWidth) {
        return Number(formConfig.value.labelWidth)
      }
      return 80
    },
    // formStyle: ()=>{
    // 	 // #ifdef H5 || APP-PLUS
    // 	    return `background-color: ${formConfig.value.background || '#FFFFFF'}; padding: ${(formConfig.value.padding || 0) + 'px'};--form-field-radius: ${formConfig.value.radius}px`
    // 	 // #endif

    // 	// #ifdef MP-WEIXIN
    // 	return {
    // 		backgroundColor: formConfig.value.background || '#FFFFFF',
    // 		padding: (formConfig.value.padding || 0) + 'px',
    // 		'--form-field-radius': formConfig.value.radius+'px'
    // 	}
    // 	// #endif

    // },
    customClass: () => {
      return !!formConfig.value && !!formConfig.value.customClass ? formConfig.value.customClass : ''
    },
    getNativeForm() {
      // 获取原生form引用
      return renderForm.value
    },
    getWidgetRef(widgetName, showError = false) {
      let foundRef = data.widgetRefList[widgetName]
      if (!foundRef && !!showError) {
        $message.error('未找到组件' + widgetName)
      }

      // #ifdef VUE3
      // 修复vue3.0 vite setup defineExpose无效 #3180
      // https://github.com/dcloudio/uni-app/issues/3180
      if (foundRef && foundRef.$ && foundRef.$.exposed) {
        Object.keys(foundRef.$.exposed).forEach(item => {
          Reflect.set(foundRef, item, foundRef.$.exposed[item])
        })
      }
      // #endif

      return foundRef
    },
    setFormJson: newFormJson => {
      if (newFormJson) {
        if (typeof newFormJson === 'string' || '[object Object]' === Object.prototype.toString.call(newFormJson)) {
          let newFormJsonObj = null
          if (typeof newFormJson === 'string') {
            newFormJsonObj = JSON.parse(newFormJson)
          } else {
            newFormJsonObj = newFormJson
          }

          if (!newFormJsonObj.formConfig || !newFormJsonObj.widgetList) {
            $message.error('Invalid format of form json.')
            return
          }

          /* formDataModel必须在widgetList赋值完成初始化，因为widgetList赋值意味着子组件开始创建！！！ */
          data.formDataModel = {} // 清空表单数据对象（有bug，会导致表单校验失败！！）
          methodObjs.clearFormDataModel() // 上行代码有问题，会导致表单校验失败，故保留原对象引用只清空对象属性！！
          methodObjs.buildFormModel(newFormJsonObj.widgetList)

          data.formJsonObj['formConfig'] = newFormJsonObj.formConfig
          if (!data.formJsonObj['widgetList']) data.formJsonObj['widgetList'] = []
          data.formJsonObj['widgetList'].splice(0)

          newFormJsonObj.widgetList.forEach(w => {
            data.formJsonObj['widgetList'].push(w)
          })

          // #ifdef H5 || APP-PLUS
          methodObjs.insertCustomStyleAndScriptNode() /* 必须先插入表单全局函数，否则VForm内部引用全局函数会报错！！！ */
          // #endif

          nextTick(() => {
            methodObjs.initFormObject(false)
            methodObjs.initDataSetRequest()
          })
        } else {
          $message.error('表单配置数据格式错误')
        }
      }
    },
    getFormJson: () => {
      return data.formJsonObj
    },
    
    /**
     * 设置简化的表单JSON配置，自动补全为完整配置
     * @param miniFormJson 简化的表单JSON配置
     */
    setMiniFormJson: (miniFormJson) => {
      if (miniFormJson) {
        const expandedFormJson = methodObjs.expandFormConfig(miniFormJson)
        console.log('expandedFormJson', expandedFormJson)
        methodObjs.setFormJson(expandedFormJson)
      }
    },
    
    /**
     * 获取简化的表单JSON配置
     */
    getMiniFormJson: () => {
      const fullFormJson = methodObjs.getFormJson()
      return methodObjs.compactFormConfig(fullFormJson)
    },
    setFormData: newFormData => {
      // 设置表单数据
      Object.keys(data.formDataModel).forEach(propName => {
        if (!!data.formDataModel && data.formDataModel.hasOwnProperty(propName)) {
          set(data.formDataModel, propName, deepClone(newFormData[propName]))
        }
      })
      // 通知SubForm组件：表单数据更新事件！！
      // emitterMixin.broadcast('ContainerItem', 'setFormData', data.formDataModel)
      // 通知FieldWidget组件：表单数据更新事件！！

      // uni.$emit('setFormData', data.formDataModel)
      // uni.$emit('setSubFormData', data.formDataModel)
      emitterMixin.broadcast('ContainerItem', 'setFormData', data.formDataModel)
      emitterMixin.broadcast('FieldWidget', 'setFormData', data.formDataModel)
    },
    getFormData: (needValidation = true) => {
      if (!needValidation) {
        return data.formDataModel
      }

      return new Promise((resolve, reject) => {
        renderForm.value
          .validate()
          .then(() => {
            resolve(data.formDataModel)
          })
          .catch(err => {
            console.error('校验失败')
            reject(data.formDataModel, '表单校验失败')
          })
      })
    },

    /**
     * 重新加载选项数据
     * @param widgetNames 指定重新加载的组件名称或组件名数组，不传则重新加载所有选项字段
     */
    reloadOptionData(widgetNames) {
      let eventParams = []
      if (!!widgetNames && typeof widgetNames === 'string') {
        eventParams = [widgetNames]
      } else if (!!widgetNames && Array.isArray(widgetNames)) {
        eventParams = [...widgetNames]
      }
      // uni.$emit('reloadOptionItems', eventParams)
      emitterMixin.broadcast('FieldWidget', 'reloadOptionItems', eventParams)
    },

    getSubFormValues(subFormName, needValidation = true) {
      let foundSFRef = data.subFormRefList[subFormName]
      return foundSFRef.getSubFormValues(needValidation)
    },

    /**
     * 校验表单
     * @param callback 回调函数
     */
    validateForm: callback => {
      renderForm.value
        .validate()
        .then(valid => {
          callback(valid)
        })
        .catch(err => {
          callback(false, data.formDataModel, '表单校验失败')
        })
    },
    getFieldValue: fieldName => {
      let fieldRef = methodObjs.getWidgetRef(fieldName)
      if (!!fieldRef && !!fieldRef.getValue) {
        return fieldRef.getValue()
      }

      if (!fieldRef) {
        // 如果是子表单字段
        let result = []
        methodObjs.findWidgetNameInSubForm(fieldName).forEach(wn => {
          let sw = methodObjs.getWidgetRef(wn)
          if (!!sw && !!sw.getValue) {
            result.push(sw.getValue())
          }
        })

        return result
      }
    },

    getComponentType() {
      return 'VmFormRender'
    },
    setFieldValue: (fieldName, fieldValue) => {
      let fieldRef = methodObjs.getWidgetRef(fieldName)
      if (!!fieldRef && !!fieldRef.setValue) {
        fieldRef.setValue(fieldValue)
      }

      if (!fieldRef) {
        // 如果是子表单字段
        methodObjs.findWidgetNameInSubForm(fieldName).forEach(wn => {
          let sw = methodObjs.getWidgetRef(wn)
          if (!!sw && !!sw.setValue) {
            sw.setValue(fieldValue)
          }
        })
      }
    },

    setSubFormValues(subFormName, subFormValues) {
      let foundSFRef = data.subFormRefList[subFormName]
      return foundSFRef.setSubFormValues(subFormValues)
    },

    insertCustomStyleAndScriptNode() {
      // #ifdef H5
      if (!!data.formJsonObj.formConfig && !!data.formJsonObj.formConfig.cssCode) {
        insertCustomCssToHead(data.formJsonObj.formConfig.cssCode, data.formId)
      }
      // #endif
      if (!!data.formJsonObj.formConfig && !!data.formJsonObj.formConfig.functions) {
        insertGlobalFunctionsToHtml(data.formJsonObj.formConfig.functions, data.formId, globalScripts)
      }
    },
    buildFormModel(widgetList) {
      if (!!widgetList && widgetList.length > 0) {
        widgetList.forEach(wItem => {
          methodObjs.buildDataFromWidget(wItem)
        })
      }
    },

    buildDataFromWidget(wItem) {
      if (wItem.category === 'container') {
        if (wItem.type === 'm-grid') {
          if (!!wItem.cols && wItem.cols.length > 0) {
            wItem.cols.forEach(childItem => {
              methodObjs.buildDataFromWidget(childItem)
            })
          }
        } else if (wItem.type === 'table') {
          if (!!wItem.rows && wItem.rows.length > 0) {
            wItem.rows.forEach(rowItem => {
              if (!!rowItem.cols && rowItem.cols.length > 0) {
                rowItem.cols.forEach(colItem => {
                  methodObjs.buildDataFromWidget(colItem)
                })
              }
            })
          }
        } else if (wItem.type === 'm-tab') {
          if (!!wItem.tabs && wItem.tabs.length > 0) {
            wItem.tabs.forEach(tabItem => {
              if (!!tabItem.widgetList && tabItem.widgetList.length > 0) {
                tabItem.widgetList.forEach(childItem => {
                  methodObjs.buildDataFromWidget(childItem)
                })
              }
            })
          }
        } else if (wItem.type === 'm-sub-form') {
          let gridSubFormName = wItem.options.name
          if (!props.formData.hasOwnProperty(gridSubFormName)) {
            let gsfFWList = []
            let fieldListFn = fw => {
              gsfFWList.push(fw)
            }
            traverseFieldWidgetsOfContainer(wItem, fieldListFn)

            let gridSubFormDataRow = {}
            if (wItem.options.showBlankRow) {
              gsfFWList.forEach(gridSubFormItem => {
                gridSubFormDataRow[gridSubFormItem.options.name] = gridSubFormItem.options.defaultValue
              })
              set(data.formDataModel, gridSubFormName, [gridSubFormDataRow])
            } else {
              set(data.formDataModel, gridSubFormName, [])
            }
          } else {
            let initialValue = props.formData[gridSubFormName]
            set(data.formDataModel, gridSubFormName, deepClone(initialValue))
          }
        } else if (wItem.type === 'm-grid-col' || wItem.type === 'table-cell') {
          if (!!wItem.widgetList && wItem.widgetList.length > 0) {
            wItem.widgetList.forEach(childItem => {
              methodObjs.buildDataFromWidget(childItem)
            })
          }
        } else {
          // 自定义容器组件
          if (!!wItem.widgetList && wItem.widgetList.length > 0) {
            wItem.widgetList.forEach(childItem => {
              methodObjs.buildDataFromWidget(childItem)
            })
          }
        }
      } else if (wItem.formItemFlag) {
        if (!props.formData.hasOwnProperty(wItem.options.name)) {
          // this.formDataModel[wItem.options.name] = '' //这种写法不支持对象属性响应式更新，必须用$set方法！！
          set(data.formDataModel, wItem.options.name, wItem.options.defaultValue) // 设置字段默认值
        } else {
          let initialValue = props.formData[wItem.options.name]
          set(data.formDataModel, wItem.options.name, deepClone(initialValue))
        }
      }
    },

    clearFormDataModel() {
      for (let pkey in data.formDataModel) {
        delete data.formDataModel[pkey]
      }
    },

    addFieldChangeEventHandler() {
      // 移除原有事件监听
      uni.$off('fieldChange')
      nextTick(() => {
        uni.$on('fieldChange', ([fieldName, newValue, oldValue, subFormName, subFormRowIndex]) => {
          methodObjs.handleFieldDataChange(fieldName, newValue, oldValue, subFormName, subFormRowIndex)
          emit('formChange', fieldName, newValue, oldValue, data.formDataModel, subFormName, subFormRowIndex)
        })
      })
    },
    addFieldValidateEventHandler() {
      // emitterMixin.off$('fieldValidation') // 移除原有事件监听
      // emitterMixin.on$('fieldValidation', (fieldName) => {
      //   if (renderForm.value) {
      //     renderForm.value.validate(fieldName).catch((err) => {})
      //   }
      // })
    },

    registerFormToRefList() {
      // H5 是 renderForm.value.$parent.$parent
      // 小程序是 renderForm.value.$parent
      // 用是否有getFormJson作为标志返回表单的引用
      const getRenderForm = el => {
        if (el.getFormJson) return el
        else return getRenderForm(el.$parent)
      }
      nextTick(() => {
        // 微信小程序中nextTick无法保证renderForm.value.$parent已经赋值，故采用定时器轮询的方式
        let clearHandler = setInterval(() => {
          if (renderForm.value && clearHandler) {
            data.widgetRefList['v_form_ref'] = getRenderForm(renderForm.value)
            clearInterval(clearHandler)
            clearHandler = null
          }
        }, 100)
      })
    },

    handleFieldDataChange(fieldName, newValue, oldValue, subFormName, subFormRowIndex) {
      uni.$emit('onFormDataChange', [fieldName, newValue, oldValue, subFormName, subFormRowIndex])
      // #ifdef H5 || APP-PLUS
      if (data.formJsonObj.formConfig.onFormDataChange) {
        let func = new Function('fieldName', 'newValue', 'oldValue', 'formModel', 'subFormName', 'subFormRowIndex', data.formJsonObj.formConfig.onFormDataChange)
        func.call(proxy, fieldName, newValue, oldValue, data.formDataModel, subFormName, subFormRowIndex)
      }
      // #endif
      methodObjs.triggerDynamicLogic(fieldName, newValue, oldValue, subFormName, subFormRowIndex)
    },

    handleOnCreated() {
      uni.$emit('onFormCreated')

      // #ifdef H5 || APP-PLUS
      if (data.formJsonObj.formConfig.onFormCreated) {
        let func = new Function(data.formJsonObj.formConfig.onFormCreated)
        func.call(proxy)
      }
      // #endif
    },

    handleOnMounted() {
      uni.$emit('onFormMounted')
      // #ifdef H5 || APP-PLUS
      if (data.formJsonObj.formConfig.onFormMounted) {
        // #ifdef APP-PLUS
        // APP端需要在timeout之后再运行，否则出现No Access错误
        setTimeout(() => {
          // #endif
          let func = new Function(data.formJsonObj.formConfig.onFormMounted)
          func.call(proxy)
          // #ifdef APP-PLUS
        }, 100)
        // #endif
      }
      // #endif
    },

    initFormObject(insertHtmlCodeFlag = true) {
      data.formId = 'vfRender' + generateId()
      if (insertHtmlCodeFlag) {
        // #ifdef H5
        methodObjs.insertCustomStyleAndScriptNode() /* 必须先插入表单全局函数，否则VForm内部引用全局函数会报错！！！ */
        // #endif
      }

      methodObjs.addFieldChangeEventHandler()
      methodObjs.addFieldValidateEventHandler()
      methodObjs.registerFormToRefList()
      methodObjs.handleOnCreated()

      nextTick(() => {
        methodObjs.handleOnMounted()
      })

      if (props.disabledMode) {
        // 禁止表单编辑
        nextTick(() => {
          methodObjs.disableForm()
        })
      }
    },

    findWidgetAndSetHidden(widgetName, hiddenFlag) {
      let foundW = methodObjs.getWidgetRef(widgetName)
      if (!!foundW && !!foundW.setHidden) {
        foundW.setHidden(hiddenFlag)
      } else if (!!foundW && foundW.options) {
        foundW.options.hidden = hiddenFlag
      } else {
        // 没找到，可能是子表单中的组件
        methodObjs.findWidgetOfSubFormAndSetHidden(widgetName, hiddenFlag)
      }
    },

    findWidgetOfSubFormAndSetHidden(widgetName, hiddenFlag) {
      // const widgetSchema = getFieldWidgetByName(data.formJsonObj.widgetList, widgetName, true)
      // if (!!widgetSchema && !!widgetSchema.options && widgetSchema.options.hasOwnProperty('hidden')) {
      //   widgetSchema.options.hidden = hiddenFlag
      // }

      methodObjs.findWidgetNameInSubForm(widgetName).forEach(wn => {
        let sw = methodObjs.getWidgetRef(wn)
        if (!!sw && !!sw.setDisabled) {
          sw.setHidden(hiddenFlag)
        }
      })
    },

    findWidgetNameInSubForm(widgetName) {
      let result = []
      let subFormName = null
      let handlerFn = (field, parent) => {
        if (!!field.options && field.options.name === widgetName) {
          subFormName = parent.options.name
        }
      }
      traverseFieldWidgets(data.formJsonObj.widgetList, handlerFn)

      Object.keys(data.subFormRefList).forEach(sfName => {
        const fwHandler = fw => {
          if (fw.options.name === widgetName) {
            subFormName = sfName
          }
        }

        const sfRef = data.subFormRefList[sfName]
        traverseFieldWidgetsOfContainer(sfRef.widget, fwHandler)
      })

      if (subFormName) {
        let subFormRef = methodObjs.getWidgetRef(subFormName)
        if (subFormRef) {
          let rowIds = subFormRef.getRowIdData()
          if (!!rowIds && rowIds.length > 0) {
            rowIds.forEach(rid => {
              result.push(widgetName + '@row' + rid)
            })
          }
        }
      }

      return result
    },

    disableForm() {
      let wNameList = Object.keys(data.widgetRefList)
      wNameList.forEach(wName => {
        let foundW = methodObjs.getWidgetRef(wName)
        if (foundW) {
          if (!!foundW.widget && foundW.widget.type === 'm-sub-form') {
            foundW.disableSubForm()
          } else {
            !!foundW.setDisabled && foundW.setDisabled(true)
          }
        }
      })
    },
    enableForm() {
      let wNameList = Object.keys(data.widgetRefList)
      wNameList.forEach(wName => {
        let foundW = methodObjs.getWidgetRef(wName)
        if (foundW) {
          if (!!foundW.widget && foundW.widget.type === 'm-sub-form') {
            foundW.enableSubForm()
          } else {
            !!foundW.setDisabled && foundW.setDisabled(false)
          }
        }
      })
    },
    resetForm() {
      // 重置表单
      let subFormNames = Object.keys(data.subFormRefList)
      subFormNames.forEach(sfName => {
        if (data.subFormRefList[sfName].resetSubForm) {
          data.subFormRefList[sfName].resetSubForm()
        }
      })

      let wNameList = Object.keys(data.widgetRefList)
      wNameList.forEach(wName => {
        let foundW = methodObjs.getWidgetRef(wName)
        if (!!foundW && foundW.subFormItemFlag && !foundW.subFormItemFlag() && !!foundW.resetField) {
          // 跳过子表单字段！！
          foundW.resetField()
        }
      })

      nextTick(() => {
        methodObjs.clearValidate() /* 清除resetField方法触发的校验错误提示 */
      })
    },
    clearValidate(widgetNames) {
      renderForm.value.clearValidate(widgetNames)
    },

    /**
     * 设置或取消设置表单为只读查看模式
     * @param readonlyFlag
     */
    setReadMode(readonlyFlag = true) {
      data.readModeFlag = readonlyFlag
    },
    disableWidgets(widgetNames) {
      if (widgetNames) {
        if (typeof widgetNames === 'string') {
          methodObjs.findWidgetAndSetDisabled(widgetNames, true)
        } else if (Array.isArray(widgetNames)) {
          widgetNames.forEach(wn => {
            methodObjs.findWidgetAndSetDisabled(wn, true)
          })
        }
      }
    },
    enableWidgets(widgetNames) {
      if (widgetNames) {
        if (typeof widgetNames === 'string') {
          methodObjs.findWidgetAndSetDisabled(widgetNames, false)
        } else if (Array.isArray(widgetNames)) {
          widgetNames.forEach(wn => {
            methodObjs.findWidgetAndSetDisabled(wn, false)
          })
        }
      }
    },

    findWidgetAndSetDisabled(widgetName, disabledFlag) {
      let foundW = this.getWidgetRef(widgetName)
      if (foundW) {
        foundW.setDisabled(disabledFlag)
      } else {
        // 没找到，可能是子表单中的组件
        methodObjs.findWidgetOfSubFormAndSetDisabled(widgetName, disabledFlag)
      }
    },

    findWidgetOfSubFormAndSetDisabled(widgetName, disabledFlag) {
      const widgetSchema = getFieldWidgetByName(data.formJsonObj.widgetList, widgetName)
      if (!!widgetSchema && !!widgetSchema.options && widgetSchema.options.hasOwnProperty('disabled')) {
        widgetSchema.options.disabled = disabledFlag
      }

      methodObjs.findWidgetNameInSubForm(widgetName).forEach(wn => {
        let sw = methodObjs.getWidgetRef(wn)
        if (sw) {
          sw.setDisabled(disabledFlag)
        }
      })
    },

    hideWidgets(widgetNames) {
      if (widgetNames) {
        if (typeof widgetNames === 'string') {
          methodObjs.findWidgetAndSetHidden(widgetNames, true)
        } else if (Array.isArray(widgetNames)) {
          widgetNames.forEach(wn => {
            methodObjs.findWidgetAndSetHidden(wn, true)
          })
        }
      }
    },
    showWidgets(widgetNames) {
      if (widgetNames) {
        if (typeof widgetNames === 'string') {
          methodObjs.findWidgetAndSetHidden(widgetNames, false)
        } else if (Array.isArray(widgetNames)) {
          widgetNames.forEach(wn => {
            methodObjs.findWidgetAndSetHidden(wn, false)
          })
        }
      }
    },
    /**
     * 获取所有字段组件
     * @param staticWidgetsIncluded 是否包含按钮等静态组件，默认不包含
     * @returns {*[]}
     */
    getFieldWidgets(staticWidgetsIncluded = false) {
      return getAllFieldWidgets(data.formJsonObj.widgetList, staticWidgetsIncluded)
    },

    /**
     * 获取所有容器组件
     * @returns {*[]}
     */
    getContainerWidgets() {
      return getAllContainerWidgets(data.formJsonObj.widgetList)
    },

    /**
     * 增加外部组件引用，可通过getEC()方法获取外部组件，以便在VForm内部调用外部组件方法
     * @param componentName 外部组件名称
     * @param externalComponent 外部组件实例
     */
    addEC(componentName, externalComponent) {
      data.externalComponents[componentName] = externalComponent
    },

    /**
     * 判断外部组件是否可获取
     * @param componentName 外部组件名称
     * @returns {boolean}
     */
    hasEC(componentName) {
      return data.externalComponents[componentName] !== null
    },

    /**
     * 获取外部组件实例
     * @param componentName
     * @returns {*}
     */
    getEC(componentName) {
      return data.externalComponents[componentName]
    },
    setFocus(widgetName, autoScroll = true) {
      focusWidget.value = widgetName
      if (autoScroll) {
        uni.pageScrollTo({
          duration: 300,
          selector: '.' + widgetName, // string 选择器
        })
      }
    },
    getFocus() {
      return focusWidget.value
    },
    /**
     * 执行数据源请求
     * @param dsName
     * @param localDsv
     */
    async executeDataSource(dsName, localDsv = {}) {
      let ds = getDSByName(data.formJsonObj.formConfig, dsName)
      let newDsv = new Object({})
      overwriteObj(newDsv, props.globalDsv)
      overwriteObj(newDsv, localDsv)
      return await runDataSourceRequest(ds, newDsv, proxy, false, $message)
    },
    initDataSetRequest() {
      let dsNameSet = new Set()
      methodObjs.getFieldWidgets().forEach(fw => {
        if (!!fw.field.options.dsEnabled && !!fw.field.options.dsName && !!fw.field.options.dataSetName) {
          dsNameSet.add(fw.field.options.dsName)
        }
      })

      if (dsNameSet.size > 0) {
        dsNameSet.forEach(async dsName => {
          let curDS = getDSByName(formConfig.value, dsName)
          if (curDS) {
            let localDsv = new Object({})
            overwriteObj(localDsv, props.globalDsv || {})
            let dsResult = null
            try {
              dsResult = await runDataSourceRequest(curDS, localDsv, proxy, false, $message)
              data.dsResultCache[dsName] = dsResult

              emitterMixin.broadcast('ContainerItem', 'loadOptionItemsFromDataSet', dsName)
              emitterMixin.broadcast('FieldWidget', 'loadOptionItemsFromDataSet', dsName)
            } catch (err) {
              console.log(err)
              $message.error(err.message)
            }
          }
        })
      }
    },

    triggerDynamicLogic(fieldName, newValue, oldValue, subFormName, subFormRowIndex) {
      // 统一的组件获取方法
      const getTargetFieldRef = targetFieldName => {
        if (targetFieldName.indexOf('.') > -1) {
          subFormName = targetFieldName.split('.')[0]
          targetFieldName = targetFieldName.split('.')[1]
        }
        // 首先尝试直接获取
        let targetFieldRef = methodObjs.getWidgetRef(targetFieldName)
        if (targetFieldRef) {
          return targetFieldRef
        }

        // 如果直接获取失败，尝试子表单方式获取
        if (subFormRowIndex !== undefined) {
          const subform = methodObjs.getWidgetRef(subFormName)
          targetFieldRef = subform.getWidgetRefOfSubForm(targetFieldName, subFormRowIndex)
          if (targetFieldRef) {
            return targetFieldRef
          }
        }

        return null
      }

      if (formConfig.value.dynamicLogicList && Array.isArray(formConfig.value.dynamicLogicList)) {
        formConfig.value.dynamicLogicList
          .filter(x => x.triggerFieldName === fieldName)
          .forEach(rule => {
            const triggerFieldRef = getTargetFieldRef(rule.triggerFieldName)
            const triggerValue = triggerFieldRef?.getValue()
            let conditionMet = false
            if (Array.isArray(rule.triggerFieldValues)) {
              conditionMet = rule.triggerFieldValues.includes(triggerValue)
            } else {
              conditionMet = rule.triggerFieldValues === triggerValue
            }

            // 执行动作的统一方法
            const executeAction = (action, isRevert = false) => {
              console.error('执行动作统一方法', fieldName)
              const targetFieldNames = Array.isArray(action.targetFieldName) ? action.targetFieldName : [action.targetFieldName]
              targetFieldNames.forEach(targetFieldName => {
                const targetFieldRef = getTargetFieldRef(targetFieldName)

                if (targetFieldRef) {
                  const actionValues = Array.isArray(action.value) ? [...action.value] : [action.value]
                  console.error('setOptionEnable', actionValues)

                  switch (action.type) {
                    case 'setVisibility':
                      actionValues.forEach(actionValue => {
                        targetFieldRef.setHidden(!actionValue) // setHidden(true) means hide
                      })
                      break
                    case 'setEnable':
                      actionValues.forEach(actionValue => {
                        targetFieldRef.setDisabled(!actionValue) // setDisabled(true) means disable
                      })
                      break
                    case 'setOptionVisibility': // For select, radio, checkbox
                      if (targetFieldRef.getOptions && targetFieldRef.setOptions) {
                        let options = targetFieldRef.getOptions()
                        const optionToModify = options.find(opt => opt.value === action.value.optionValue)
                        if (optionToModify) {
                          actionValues.forEach(actionValue => {
                            optionToModify.hidden = !actionValue.state
                          })
                          targetFieldRef.setOptions(options)
                          targetFieldRef.reloadOptions?.()
                        }
                      }
                      break
                    case 'setOptionEnable': // For select, radio, checkbox
                      if (targetFieldRef.disableOption && targetFieldRef.enableOption) {
                        actionValues.forEach(actionValue => {
                          if (actionValue.state) {
                            targetFieldRef.enableOption(actionValue.optionValue)
                          } else {
                            targetFieldRef.disableOption(actionValue.optionValue)
                          }
                        })
                      }
                      break
                  }
                } else {
                  console.warn(`Dynamic logic: Target field ${targetFieldName} not found.`)
                }
              })
            }

            // 根据条件执行相应的动作
            if (conditionMet) {
              // 条件满足时，执行actions
              rule.actions.forEach(action => {
                executeAction(action, false)
              })
            } else {
              // 条件不满足时，执行elseActions或恢复默认状态
              if (rule.elseActions && rule.elseActions.length > 0) {
                rule.elseActions.forEach(action => {
                  executeAction(action, false)
                })
              } else {
                // rule.actions.forEach(action => {
                //   executeAction(action, true)
                // })
              }
            }
          })
      }
    },
    
    /**
     * 创建组件配置映射表
     */
    createWidgetConfigMap() {
      const widgetMap = new Map()
      
      containers.forEach(con => {
        widgetMap.set(con.type, con)
      })
      
      basicFields.forEach(field => {
        widgetMap.set(field.type, field)
      })
      
      advancedFields.forEach(field => {
        widgetMap.set(field.type, field)
      })
      
      return widgetMap
    },
    
    /**
     * 展开表单配置，将简化配置补全为完整配置
     * @param formJson 简化的表单JSON配置
     */
    expandFormConfig(formJson) {
      const widgetMap = methodObjs.createWidgetConfigMap()
      const expandedFormJson = JSON.parse(JSON.stringify(formJson)) // 深拷贝
      
      function expandWidget(widget) {
        // 确保每个组件都有唯一的id和key
        if (!widget.id) {
          widget.id = widget.type.replace(/-/g, '') + generateId()
        }
        if (!widget.key) {
          widget.key = generateId()
        }
        
        if (widgetMap.has(widget.type)) {
          const defaultConfig = widgetMap.get(widget.type)
          
          // 合并默认配置和用户配置
          widget.options = { ...defaultConfig.options, ...widget.options }
          
          // 对optionItems进行特殊处理，确保每个选项都包含完整的属性
          if (widget.options.optionItems && Array.isArray(widget.options.optionItems) && 
              defaultConfig.options.optionItems && Array.isArray(defaultConfig.options.optionItems)) {
            const defaultOptionItem = defaultConfig.options.optionItems[0] || {}
            widget.options.optionItems = widget.options.optionItems.map(item => {
              // 为每个选项补全缺失的属性
              return {
                label: item.label || '',
                value: item.value,
                exampleImage: item.exampleImage !== undefined ? item.exampleImage : (defaultOptionItem.exampleImage || ''),
                tooltip: item.tooltip !== undefined ? item.tooltip : (defaultOptionItem.tooltip || ''),
                desc: item.desc !== undefined ? item.desc : (defaultOptionItem.desc || ''),
                image: item.image !== undefined ? item.image : (defaultOptionItem.image || ''),
                disabled: item.disabled !== undefined ? item.disabled : (defaultOptionItem.disabled || false)
              }
            })
          }
          
          // 设置默认的 icon 和 formItemFlag
          if (!widget.icon && defaultConfig.icon) {
            widget.icon = defaultConfig.icon
          }
          if (widget.formItemFlag === undefined && defaultConfig.formItemFlag !== undefined) {
            widget.formItemFlag = defaultConfig.formItemFlag
          }
        }
        
        // 处理容器组件的子组件
        if (widget.widgetList && Array.isArray(widget.widgetList)) {
          widget.widgetList.forEach(expandWidget)
        }
        
        // 处理网格组件的列
        if (widget.cols && Array.isArray(widget.cols)) {
          widget.cols.forEach(col => {
            // 确保网格列也有唯一的id和key
             if (!col.id) {
               col.id = col.type.replace(/-/g, '') + generateId()
             }
             if (!col.key) {
               col.key = generateId()
             }
            
            if (col.widgetList && Array.isArray(col.widgetList)) {
              col.widgetList.forEach(expandWidget)
            }
          })
        }
        
        // 处理标签页组件的标签页
        if (widget.tabs && Array.isArray(widget.tabs)) {
          widget.tabs.forEach(tab => {
            // 确保标签页也有唯一的id和key
             if (!tab.id) {
               tab.id = 'mtabpane' + generateId()
             }
             if (!tab.key) {
               tab.key = generateId()
             }
            
            if (tab.widgetList && Array.isArray(tab.widgetList)) {
              tab.widgetList.forEach(expandWidget)
            }
          })
        }
        
        // 处理表格组件的行和列
        if (widget.rows && Array.isArray(widget.rows)) {
          widget.rows.forEach(row => {
            if (row.cols && Array.isArray(row.cols)) {
              row.cols.forEach(col => {
                // 确保表格列也有唯一的id和key
                 if (!col.id) {
                   col.id = 'tablecell' + generateId()
                 }
                 if (!col.key) {
                   col.key = generateId()
                 }
                
                if (col.widgetList && Array.isArray(col.widgetList)) {
                  col.widgetList.forEach(expandWidget)
                }
              })
            }
          })
        }
      }
      
      if (expandedFormJson.widgetList && Array.isArray(expandedFormJson.widgetList)) {
        expandedFormJson.widgetList.forEach(expandWidget)
      }
      
      return expandedFormJson
    },
    
    /**
     * 压缩表单配置，移除与默认配置相同的属性
     * @param formJson 完整的表单JSON配置
     */
    compactFormConfig(formJson) {
      const widgetMap = methodObjs.createWidgetConfigMap()
      const compactedFormJson = JSON.parse(JSON.stringify(formJson)) // 深拷贝
      
      function compactWidget(widget) {
        if (widgetMap.has(widget.type)) {
          const defaultConfig = widgetMap.get(widget.type)
          
          // 移除与默认配置相同的属性
          Object.keys(widget.options).forEach(key => {
            // 对于optionItems，不进行简单的JSON比较，因为用户可能修改了其中的tooltip、exampleImage、image等属性
            if (key === 'optionItems') {
              return // 跳过optionItems的比较，始终保留用户的配置
            }
            
            if (defaultConfig.options && 
                defaultConfig.options[key] !== undefined && 
                JSON.stringify(widget.options[key]) === JSON.stringify(defaultConfig.options[key])) {
              delete widget.options[key]
            }
          })
          
          // 移除默认的 icon 和 formItemFlag
          if (widget.icon === defaultConfig.icon) {
            delete widget.icon
          }
          if (widget.formItemFlag === defaultConfig.formItemFlag) {
            delete widget.formItemFlag
          }
        }
        
        // 处理容器组件的子组件
        if (widget.widgetList && Array.isArray(widget.widgetList)) {
          widget.widgetList.forEach(compactWidget)
        }
        
        // 处理网格组件的列
        if (widget.cols && Array.isArray(widget.cols)) {
          widget.cols.forEach(col => {
            if (col.widgetList && Array.isArray(col.widgetList)) {
              col.widgetList.forEach(compactWidget)
            }
          })
        }
        
        // 处理标签页组件的标签页
        if (widget.tabs && Array.isArray(widget.tabs)) {
          widget.tabs.forEach(tab => {
            if (tab.widgetList && Array.isArray(tab.widgetList)) {
              tab.widgetList.forEach(compactWidget)
            }
          })
        }
        
        // 处理表格组件的行和列
        if (widget.rows && Array.isArray(widget.rows)) {
          widget.rows.forEach(row => {
            if (row.cols && Array.isArray(row.cols)) {
              row.cols.forEach(col => {
                if (col.widgetList && Array.isArray(col.widgetList)) {
                  col.widgetList.forEach(compactWidget)
                }
              })
            }
          })
        }
      }
      
      if (compactedFormJson.widgetList && Array.isArray(compactedFormJson.widgetList)) {
        compactedFormJson.widgetList.forEach(compactWidget)
      }
      
      return compactedFormJson
    },
  }

  const getProxy = () => {
    if (!proxy) {
      proxy = {
        renderForm,
        formConfig,
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
  }
  getProxy()

  // uni.$off();
  nextTick(() => {
    uni.$on('buttonClick', () => {
      emit('buttonClick')
    })
    uni.$on('appendButtonClick', () => {
      emit('appendButtonClick')
    })

    methodObjs.buildFormModel(!data.formJsonObj ? null : data.formJsonObj.widgetList)
    methodObjs.initFormObject()
    methodObjs.initDataSetRequest()
  })

  return {
    data,
    renderForm,
    formStyle,
    ...methodObjs,
  }
}
