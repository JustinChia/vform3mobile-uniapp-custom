import { getCurrentInstance } from '@/uni_modules/vmform-uni/components/vmform-uni/utils/vueBuilder.js'
export function useEmitter(data = {}, _proxy) {
  const { proxy } = getCurrentInstance()
  data.vfEvents = {}

  const methods = {
    broadcast: function broadcast(componentName, eventName, params) {
      /* Vue3移除了$children属性，_broadcast方法已不能使用！！ */
      //_broadcast.call(this, componentName, eventName, params);
      if (proxy.widgetRefList) {
        //FormRender只需遍历自身的widgetRefList属性
        Object.keys(proxy.widgetRefList).forEach(refName => {
          if (!proxy.widgetRefList[refName] || !proxy.widgetRefList[refName].getComponentType) {
            console.log('未找到componentType', refName)
            return
          }
          let cmpName = proxy.widgetRefList[refName].getComponentType()
          if (cmpName === componentName) {
            let foundRef = proxy.widgetRefList[refName]
            if (foundRef && foundRef.emit$) {
              foundRef.emit$(eventName, params)
            } else {
              console.error('foundRef', foundRef)
            }
          }
        })
      }
    },

    dispatch: function dispatch(componentName, eventName, params) {
      let parent = proxy.$parent || proxy.$root
      let name = parent.$options.componentName

      let _parent = parent
      console.error(proxy)

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.getComponentType
        }
      }
      if (parent) {
        if (parent.emit$) {
          parent.emit$(eventName, params)

          if (componentName === 'VmFormRender') {
            parent.$emit(eventName, ...params) //执行原生$emit，以便可以用@进行声明式事件处理！！
          }
        }
      }
    },

    emit$(eventName, eventData) {
      if (data.vfEvents[eventName]) {
        data.vfEvents[eventName].forEach(fn => {
          fn(eventData)
        })
      }
    },

    off$(eventName, fn) {
      if (data.vfEvents[eventName]) {
        if (fn === undefined || fn === null) {
          data.vfEvents[eventName].length = 0
          return
        }

        for (let i = 0; i < data.vfEvents[eventName].length; i++) {
          if (data.vfEvents[eventName][i] === fn) {
            data.vfEvents[eventName].splice(i, 1)
            break
          }
        }
      }
    },

    on$(eventName, fn) {
      data.vfEvents[eventName] = data.vfEvents[eventName] || []
      data.vfEvents[eventName].push(fn)
    },
  }

  return {
    ...methods,
  }
}
