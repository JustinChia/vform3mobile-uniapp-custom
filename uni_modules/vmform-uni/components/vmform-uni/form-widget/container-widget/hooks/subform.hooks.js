import { set, computed, inject, nextTick } from '../../../utils/vueBuilder'
import { deepClone, generateId, traverseFieldWidgetsOfContainer } from '../../../utils/util'
import { useContainer } from '../containerItemMixin'
import { useEmitter } from '../../../utils/emitter'
import { $message } from '../../../utils/message'
export function useSubform({ data, props, componentType }) {
  const refList = inject('refList')
  const sfRefList = inject('sfRefList')
  const globalModel = inject('globalModel')

  // 当前组件的引用
  let proxy = null

  const { methodObjs: containerMethods } = useContainer({ data, props })

  const emitter = useEmitter(data)
  const formModel = computed({
    cache: false,
    get: () => {
      return globalModel().formModel
    },
  })

  const leftActionColumn = computed(() => {
    return (props.widget.options.actionColumnPosition || 'left') === 'left'
  })

  const subformMethods = {
    initRefList() {
      if (refList !== null && !!props.widget.options.name) {
        refList[props.widget.options.name] = proxy

        Object.keys(subformMethods).forEach(item => {
          Reflect.set(refList[props.widget.options.name], item, subformMethods[item])
        })
      }
    },

    initEventHandler() {
      // 子表单的onSetFormData事件被子组件覆盖了，原因未知，走单独的事件
      // uni.$on('setSubFormData', newFormData => {
      emitter.on$('setFormData', newFormData => {
        subformMethods.initRowIdData(false)
        subformMethods.initFieldSchemaData()
        let subFormData = newFormData[props.widget.options.name] || []
        setTimeout(() => {
          // 延时触发SubFormRowChange事件, 便于更新计算字段！！
          subformMethods.handleSubFormRowChange(subFormData)
        }, 800)
      })
    },

    buildEvnetArgs(obj, eventName) {
      const eventObj = {
        formRef: containerMethods.getFormRef(),
        widgetRef: refList[props.widget.options.name],
        triggerName: props.widget.options.name,
        triggerField: props.widget,
        eventName,
      }

      Object.keys(obj).forEach(key => {
        if (obj[key]) set(eventObj, key, obj[key])
      })

      return eventObj
    },

    handleSubFormFirstRowAdd() {
      if (props.widget.type !== 'm-sub-form') {
        return
      }

      if (!!props.widget.options.showBlankRow && data.rowIdData.length === 1) {
        let oldSubFormData = formModel.value[props.widget.options.name] || []

        // 确认组件创建成功后触发事件!!
        setTimeout(() => {
          subformMethods.handleSubFormRowAdd(oldSubFormData, data.rowIdData[0])
        }, 200)
      }
    },

    handleSubFormRowChange(subFormData) {
      const eventName = 'onSubFormRowChange'
      uni.$emit(eventName, subformMethods.buildEvnetArgs({ subFormData }, eventName))
      uni.$emit(props.widget.options.name + '_' + eventName, subformMethods.buildEvnetArgs({ subFormData }, props.widget.options.name + '_' + eventName))

      // #ifndef MP-WEIXIN
      if (props.widget.options.onSubFormRowChange) {
        let customFunc = new Function('subFormData', props.widget.options.onSubFormRowChange)
        customFunc.call(proxy, subFormData)
      }
      // #endif
    },
    handleSubFormRowAdd(subFormData, newRowId) {
      const eventName = 'onSubFormRowAdd'

      uni.$emit(eventName, subformMethods.buildEvnetArgs({ subFormData, newRowId }, eventName))
      uni.$emit(props.widget.options.name + '_' + eventName, subformMethods.buildEvnetArgs({ subFormData, newRowId }, props.widget.options.name + '_' + eventName))

      // #ifndef MP-WEIXIN
      if (props.widget.options.onSubFormRowAdd) {
        let customFunc = new Function('subFormData', 'newRowId', props.widget.options.onSubFormRowAdd)
        customFunc.call(proxy, subFormData, newRowId)
      }
      // #endif
    },

    handleSubFormRowInsert(subFormData, newRowId, rowIndex) {
      const eventName = 'onSubFormRowInsert'

      uni.$emit(eventName, subformMethods.buildEvnetArgs({ subFormData, newRowId, rowIndex }, eventName))
      uni.$emit(props.widget.options.name + '_' + eventName, subformMethods.buildEvnetArgs({ subFormData, newRowId, rowIndex }, props.widget.options.name + '_' + eventName))

      // #ifndef MP-WEIXIN
      if (props.widget.options.onSubFormRowInsert) {
        let customFunc = new Function('subFormData', 'newRowId', props.widget.options.onSubFormRowInsert)
        customFunc.call(proxy, subFormData, newRowId)
      }
      // #endif
    },

    handleSubFormRowDelete(subFormData, deletedDataRow, deletedRowIndex) {
      const eventName = 'onSubFormRowDelete'

      uni.$emit(eventName, subformMethods.buildEvnetArgs({ subFormData, deletedDataRow, deletedRowIndex }, eventName))
      uni.$emit(props.widget.options.name + '_' + eventName, subformMethods.buildEvnetArgs({ subFormData, deletedDataRow, deletedRowIndex }, props.widget.options.name + '_' + eventName))

      // #ifndef MP-WEIXIN
      if (props.widget.options.onSubFormRowDelete) {
        let customFunc = new Function('subFormData', 'deletedDataRow', 'deletedRowIndex', props.widget.options.onSubFormRowDelete)
        customFunc.call(proxy, subFormData, deletedDataRow, deletedRowIndex)
      }
      // #endif
    },

    registerSubFormToRefList: () => {
      if (props.widget.type === 'm-sub-form' && componentType === 'ContainerItem') {
        sfRefList[props.widget.options.name] = proxy
        refList[props.widget.options.name] = proxy
      }
    },

    unregisterFromRefList: () => {
      // 销毁容器组件时注销组件ref
      if (refList !== null && !!props.widget.options.name && componentType === 'ContainerItem') {
        let oldRefName = props.widget.options.name
        delete refList[oldRefName]
      }
    },

    initRowIdData: initFlag => {
      if (props.widget.type === 'm-sub-form') {
        data.rowIdData.splice(0, data.rowIdData.length) // 清除数组必须用splice，length=0不会响应式更新！！
        let subFormModel = formModel.value[props.widget.options.name]

        if (!!subFormModel && subFormModel.length > 0) {
          subFormModel.forEach(() => {
            data.rowIdData.push('id' + generateId())
          })

          if (initFlag) {
            // 注意：事件触发需延期执行，SumFormDataChange事件处理代码中可能存在尚未创建完成的组件！！
            setTimeout(() => {
              subformMethods.handleSubFormRowChange(subFormModel)
            }, 800)
          }
        }
      }
    },

    disableSubForm: () => {
      traverseFieldWidgetsOfContainer(props.widget, fw => {
        fw.options.disabled = true
      })
      if (data.rowIdData.length > 0) {
        data.rowIdData.forEach((dataRow, rIdx) => {
          subformMethods.disableSubFormRow(rIdx)
        })
      }

      // 禁用3个操作按钮
      data.actionDisabled = true
    },

    enableSubForm: () => {
      traverseFieldWidgetsOfContainer(props.widget, fw => {
        fw.options.disabled = false
      })

      if (data.rowIdData.length > 0) {
        data.rowIdData.forEach((dataRow, rIdx) => {
          subformMethods.enableSubFormRow(rIdx)
        })
      }

      // 启用3个操作按钮
      data.actionDisabled = false
    },

    resetSubForm() {
      // 重置subForm数据为空
      if (props.widget.type === 'm-sub-form') {
        let subFormModel = formModel.value[props.widget.options.name]
        if (subFormModel) {
          subFormModel.splice(0, subFormModel.length)
          data.rowIdData.splice(0, data.rowIdData.length)
        }

        if (props.widget.options.showBlankRow) {
          subformMethods.addSubFormRow()
        }
      }
    },

    getWidgetRef(widgetName, showError = false) {
      let foundRef = refList[widgetName]
      if (!foundRef && !!showError) {
        $message.error('未找到组件' + widgetName)
      }
      return foundRef
    },

    getComponentType() {
      return 'ContainerItem'
    },

    setHidden(flag = true) {
      props.widget.options.hidden = flag

      /* 容器被隐藏后，需要同步清除容器内部字段组件的校验规则 */
      let clearRulesFn = fieldWidget => {
        let fwName = fieldWidget.options.name
        let fwRef = subformMethods.getWidgetRef(fwName)
        if (flag && !!fwRef && !!fwRef.clearFieldRules) {
          fwRef.clearFieldRules()
        }

        if (!flag && !!fwRef && !!fwRef.buildFieldRules) {
          fwRef.buildFieldRules()
        }
      }

      traverseFieldWidgetsOfContainer(props.widget, clearRulesFn)
    },
    addToRowIdData: () => {
      const rowId = 'id' + generateId()
      data.rowIdData.push('id' + generateId())
      subformMethods.handleSubFormRowAdd(formModel.value[props.widget.options.name], rowId)
      subformMethods.handleSubFormRowChange(formModel.value[props.widget.options.name])
    },
    insertToRowIdData: rowIndex => {
      const rowId = 'id' + generateId()
      data.rowIdData.splice(rowIndex, 0, rowId)
      subformMethods.handleSubFormRowInsert(formModel.value[props.widget.options.name], rowId, rowIndex)
      subformMethods.handleSubFormRowChange(formModel.value[props.widget.options.name])
    },
    deleteFromRowIdData: rowIndex => {
      const deletedRow = data.rowIdData.splice(rowIndex, 1)
      subformMethods.handleSubFormRowDelete(formModel.value[props.widget.options.name], deletedRow, rowIndex)
      subformMethods.handleSubFormRowChange(formModel.value[props.widget.options.name])
    },

    disableSubFormRow: rowIndex => {
      props.widget.widgetList.forEach(subWidget => {
        let swRefName = subWidget.options.name + '@row' + data.rowIdData[rowIndex]
        let foundSW = subformMethods.getWidgetRef(swRefName)
        if (foundSW) {
          foundSW.setDisabled(true)
        }
      })
    },

    enableSubFormRow: rowIndex => {
      props.widget.widgetList.forEach(subWidget => {
        let swRefName = subWidget.options.name + '@row' + data.rowIdData[rowIndex]
        let foundSW = subformMethods.getWidgetRef(swRefName)
        if (foundSW) {
          foundSW.setDisabled(false)
        }
      })
    },

    getRowIdData: () => {
      return data.rowIdData
    },    

		getWidgetRefOfSubForm(widgetName, rowIndex) {
			let realWidgetName = widgetName + "@row" + this.rowIdData[rowIndex];
			return this.getWidgetRef(realWidgetName);
		},

    initFieldSchemaData() {
      // 初始化fieldSchemaData！！！
      let rowLength = data.rowIdData.length
      data.fieldSchemaData.splice(0, data.fieldSchemaData.length) // 清除数组必须用splice，length=0不会响应式更新！！
      if (rowLength > 0) {
        for (let i = 0; i < rowLength; i++) {
          let fieldSchemas = []
          props.widget.widgetList.forEach(swItem => {
            fieldSchemas.push(subformMethods.cloneFieldSchema(swItem))
          })
          data.fieldSchemaData.push(fieldSchemas)
        }

        if (data.actionDisabled) {
          nextTick(() => {
            subformMethods.disableSubForm()
          })
        }
      }
    },
    deleteFromFieldSchemaData(rowIndex) {
      data.fieldSchemaData.splice(rowIndex, 1)
    },
    cloneFieldSchema(fieldWidget) {
      let newFieldSchema = deepClone(fieldWidget)
      newFieldSchema.id = fieldWidget.type + generateId()
      return newFieldSchema
    },

    addToFieldSchemaData: rowIndex => {
      let fieldSchemas = []
      props.widget.widgetList.forEach(swItem => {
        fieldSchemas.push(subformMethods.cloneFieldSchema(swItem))
      })

      if (rowIndex === undefined) {
        data.fieldSchemaData.push(fieldSchemas)
      } else {
        data.fieldSchemaData.splice(rowIndex, 0, fieldSchemas)
      }
    },

    addSubFormRow: () => {
      let newSubFormDataRow = {}
      props.widget.widgetList.forEach(subFormItem => {
        if (subFormItem.formItemFlag) {
          newSubFormDataRow[subFormItem.options.name] = subFormItem.options.defaultValue
        }
      })

      let oldSubFormData = formModel.value[props.widget.options.name] || []
      oldSubFormData.push(newSubFormDataRow)

      subformMethods.addToRowIdData()
      subformMethods.addToFieldSchemaData()
    },

    insertSubFormRow: beforeFormRowIndex => {
      let newSubFormDataRow = {}
      props.widget.widgetList.forEach(subFormItem => {
        if (subFormItem.formItemFlag) {
          newSubFormDataRow[subFormItem.options.name] = subFormItem.options.defaultValue
        }
      })

      let oldSubFormData = formModel.value[props.widget.options.name] || []
      oldSubFormData.splice(beforeFormRowIndex, 0, newSubFormDataRow)
      subformMethods.insertToRowIdData(beforeFormRowIndex)
      subformMethods.addToFieldSchemaData(beforeFormRowIndex)
    },
    deleteSubFormRow: formRowIndex => {
      uni.showModal({
        title: '确认删除',
        content: '是否要删除这一行？',
        success: function (res) {
          if (res.confirm) {
            let oldSubFormData = formModel.value[props.widget.options.name] || []
            // let deletedDataRow = deepClone(oldSubFormData[formRowIndex])
            oldSubFormData.splice(formRowIndex, 1)
            subformMethods.deleteFromRowIdData(formRowIndex)
            subformMethods.deleteFromFieldSchemaData(formRowIndex)
          } else if (res.cancel) {
            // 用户点击了取消按钮
            console.log('用户点击了取消按钮')
          }
        },
      })
    },
    getSubFormValues: (needValidation = true) => {
      if (props.widget.type === 'm-sub-form') {
        // TODO: 逐行校验子表单！暂未实现！！
        return formModel.value[props.widget.options.name]
      } else {
        $message.error('组件类型不是子表单')
      }
    },
    setDisabled(flat) {
      if (flat) {
        subformMethods.disableSubForm()
      } else {
        subformMethods.enableSubForm()
      }
    },

    /**
     * 单独给子表单赋值
     * 注意：该方法仅触发组件的onChange事件以及子表单的onFormRowChange事件，不会触发表单的onFormDataChange等其他事件！！
     * @param subFormValues
     */
    setSubFormValues(subFormValues) {
      formModel.value[props.widget.options.name] = subFormValues
      subformMethods.initRowIdData(false)
      subformMethods.initFieldSchemaData()

      setTimeout(() => {
        //延时触发SubFormRowChange事件, 便于更新计算字段！！
        subformMethods.handleSubFormRowChange(subFormValues)
      }, 800)
    },

    /**
     * 设置单行子表单是否禁止新增、插入记录
     * @param flag
     */
    setInsertDisabled(flag) {
      data.insertDisabled = flag
    },

    /**
     * 设置单行子表单是否禁止删除记录
     * @param flag
     */
    setDeleteDisabled(flag) {
      data.deleteDisabled = flag
    },

    /**
     * 单独为子表单某行的字段组件赋值
     * @param fieldName
     * @param fieldValue
     * @param rowIndex
     */
    setSubFormFieldValue(fieldName, fieldValue, rowIndex) {
      const subFormData = formModel.value[props.widget.options.name]
      subFormData[rowIndex][fieldName] = fieldValue

      subformMethods.handleSubFormRowChange(subFormData)
    },
    ...emitter,
  }

  const getProxy = () => {
    if (!proxy) {
      proxy = { formModel, leftActionColumn }
      Object.keys(data).forEach(item => {
        Reflect.set(proxy, item, data[item])
      })
      Object.keys(props).forEach(item => {
        Reflect.set(proxy, item, props[item])
      })
      Object.keys(subformMethods).forEach(item => {
        Reflect.set(proxy, item, subformMethods[item])
      })
    }
  }
  getProxy()

  return {
    leftActionColumn,
    ...subformMethods,
  }
}
