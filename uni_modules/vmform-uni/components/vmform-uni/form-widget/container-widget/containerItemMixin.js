import { inject, set, reactive, computed, onBeforeUnmount } from '../../utils/vueBuilder.js'
import { traverseFieldWidgetsOfContainer, traverseFieldWidgets } from '../../utils/util'
import { useEmitter } from '../../utils/emitter'
import { $message } from '../../utils/message'
export function useContainer({ componentType, widgetData, props }) {
  const refList = inject('refList')
  const getRefList = inject('getRefList')
  const getReadMode = inject('getReadMode')

  const data = reactive({
    fieldEditor: null,
    fieldWrapper: null,
  })

  if (widgetData)
    Object.keys(widgetData).forEach(key => {
      set(data, key, widgetData[key])
    })

  const emitter = useEmitter(data)
  // 当前组件的引用
  let proxy = null

  const methodObjs = {
    initRefList() {
      if (refList !== null && !!props.widget.options.name) {
        refList[props.widget.options.name] = proxy
      }
    },

    getComponentType() {
      return componentType
    },

    getWidgetRef(widgetName, showError = false) {
      let foundRef = refList[widgetName]
      if (!foundRef && !!showError) {
        $message.error('未找到组件' + widgetName)
      }
      return foundRef
    },

    getFormRef() {
      /* 获取VFrom引用，必须在VForm组件created之后方可调用 */
      return refList['v_form_ref']
    },
    registerWidgetToRefList(widgetName, widgetRef) {
      refList[widgetName] = widgetRef
    },

    /* 该方法用于组件重名检查！！ */
    registerToRefList(oldRefName) {
      if (!componentType) return
      if (refList !== null && !!props.widget.options.name) {
        if (oldRefName) {
          delete refList[oldRefName]
        }
        refList[props.widget.options.name] = proxy
      }
    },

    unregisterFromRefList() {
      // 销毁容器组件时注销组件ref
      if (refList !== null && !!props.widget.options.name) {
        let oldRefName = props.widget.options.name
        delete refList[oldRefName]
      }
    },

    setHidden(flag = true) {
      props.widget.options.hidden = flag

      /* 容器被隐藏后，需要同步清除容器内部字段组件的校验规则 */
      let clearRulesFn = fieldWidget => {
        let fwName = fieldWidget.options.name
        let fwRef = methodObjs.getWidgetRef(fwName)
        if (flag && !!fwRef && !!fwRef.clearFieldRules) {
          fwRef.clearFieldRules()
        }

        if (!flag && !!fwRef && !!fwRef.buildFieldRules) {
          fwRef.buildFieldRules()
        }
      }

      traverseFieldWidgetsOfContainer(props.widget, clearRulesFn)
    },

    /**
     * 动态增加自定义css样式
     * @param className
     */
    addCssClass: className => {
      if (!props.widget.options.customClass) {
        props.widget.options.customClass = [className]
      } else {
        props.widget.options.customClass.push(className)
      }
    },

    /**
     * 动态移除自定义css样式
     * @param className
     */
    removeCssClass: className => {
      if (!props.widget.options.customClass) {
        return
      }

      let foundIdx = -1
      props.widget.options.customClass.map((cc, idx) => {
        if (cc === className) {
          foundIdx = idx
        }
      })
      if (foundIdx > -1) {
        props.widget.options.customClass.splice(foundIdx, 1)
      }
    },

    handleTabbarChange: value => {
      const index = props.widget.tabs.findIndex(x => x.options.name === value)
      const title = props.widget.tabs[index].options.label

      // #ifdef H5 || APP-PLUS
      if (props.widget.options.onTabbarChange) {
        let customFunc = new Function('index', 'name', 'title', props.widget.options.onTabbarChange)
        customFunc.call(proxy, index, value, title)
      }
      // #endif
    },
    updateWidgetState: (widget, stateName, flag) => {
      const formRef = methodObjs.getFormRef()
      let stateNames = Array.isArray(stateName) ? stateName : [stateName]
      // 设置collapseItem的属性状态
      stateNames.forEach(state => {
        Reflect.set(widget.options, state, flag)
      })

      traverseFieldWidgets(widget.widgetList, item => {
        const widgetRef = methodObjs.getWidgetRef(item.options.name)
        stateNames.forEach(state => {
          let stateFuncName = 'set' + state.substring(0, 1).toUpperCase() + state.substring(1)
          widgetRef[stateFuncName](flag)
        })

        if (flag) {
          widgetRef.clearFieldRules()
        } else {
          widgetRef.buildFieldRules()
        }
      })
      formRef.clearValidate(widget.widgetList.map(x => x.options.name))
    },
    setCollapseItemDisabled: (itemIndex, flag) => {
      let widget = props.widget.widgetList[itemIndex]
      methodObjs.updateWidgetState(widget, 'disabled', flag)
    },
    setCollapseItemReadonly: (itemIndex, flag) => {
      let widget = props.widget.widgetList[itemIndex]
      methodObjs.updateWidgetState(widget, 'readonly', flag)
    },
    ...emitter,
  }

  const getProxy = () => {
    if (!proxy) {
      proxy = {}
      if (data) {
        Object.keys(data).forEach(item => {
          Reflect.set(proxy, item, data[item])
        })
      }
      if (props) {
        Object.keys(props).forEach(item => {
          Reflect.set(proxy, item, props[item])
        })
      }
      Object.keys(methodObjs).forEach(item => {
        Reflect.set(proxy, item, methodObjs[item])
      })
    }
  }
  getProxy()

  methodObjs.registerToRefList()

  onBeforeUnmount(() => {
    methodObjs.unregisterFromRefList()
  })

  return {
    data,
    methodObjs,
    ...methodObjs,
  }
}
