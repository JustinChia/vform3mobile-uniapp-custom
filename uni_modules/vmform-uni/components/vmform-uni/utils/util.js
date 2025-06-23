export function isNull(value) {
  return value === null || value === undefined
}

export function isNotNull(value) {
  return value !== null && value !== undefined
}

export function isEmptyStr(str) {
  // return (str === undefined) || (!str) || (!/[^\s]/.test(str));
  return str === undefined || (!str && str !== 0 && str !== '0') || !/[^\s]/.test(str)
}

export const generateId = function () {
  return Math.floor(Math.random() * 100000 + Math.random() * 20000 + Math.random() * 5000)
}

export const deepClone = function (origin) {
  if (origin === undefined) {
    return undefined
  }

  return JSON.parse(JSON.stringify(origin))
}

// 受到小程序限制对evalFN的功能进行简化，仅能提取字符串，和其中的dsv，vfr
export const evalFn = function (fn, DSV, VFR) {
  const str = fn // fn只能是一个包含DSV,VFR的字符串
  const regex = new RegExp('(?<!\\[)\\".*?\\"(?!\\])|(?<!\\[)\\\'.*?\\\'(?!\\])|((\\+|DSV|VFR|dsv|vfr).*?(\\+|$))', 'g')
  const matches = str.match(regex)

  const result = matches.map(match => {
    if (match.startsWith('+') || match.toUpperCase().startsWith('DSV') || match.toUpperCase().startsWith('VFR')) {
      const value2 = match.replace(/\+/g, '')
      var key = '',
        funcString = '',
        funcParams = []

      if (value2.indexOf('DSV') > -1) {
        key = value2.replace(/DSV|\.|\[|\'|\"|\]/g, '')
        return DSV[key.trim()]
      } else if (value2.indexOf('VFR') > -1) {
        key = value2.replace(/VFR|\.|\[|\'|\"|\]/g, '')
        return VFR[key.trim()]
      } else if (value2.indexOf('dsv') > -1) {
        funcString = value2.replace(/dsv|\(|\)/g, '').trim()
        funcParams = funcString.split(',').map(x => x.trim())
        if (funcParams.length == 0) {
          return ''
        } else {
          return dsvDefaultValue(DSV, funcParams[0].replace(/"|'/g, ''), funcParams.length == 2 ? funcParams[1] : '')
        }
      } else if (value2.indexOf('vfr') > -1) {
        funcString = value2.replace(/vfr|\(|\)/g, '').trim()
        funcParams = funcString.split(',').map(x => x.trim())
        if (funcParams.length == 0) {
          return ''
        } else {
          return vfrDefaultValue(DSV, funcParams[0].replace(/"|'/g, ''), funcParams.length == 2 ? funcParams[1] : '')
        }
      }
      return value2
    } else {
      return match.replace(/['"]+/g, '')
    }
  })
  return result.join('')
}

function dsvDefaultValue(DSV, dsvName, defaultValue = '') {
  if (DSV[dsvName] !== undefined && DSV[dsvName] !== null) {
    return DSV[dsvName]
  } else {
    return defaultValue
  }
}
function vfrDefaultValue(VFR, dsvName, defaultValue = '') {
  if (VFR[dsvName] !== undefined && VFR[dsvName] !== null) {
    return VFR[dsvName]
  } else {
    return defaultValue
  }
}

export const overwriteObj = function (obj1, obj2) {
  /* 浅拷贝对象属性，obj2覆盖obj1 */
  Object.keys(obj2).forEach(prop => {
    obj1[prop] = obj2[prop]
  })
}

export const addWindowResizeHandler = function (handler) {
  let oldHandler = window.onresize
  if (typeof window.onresize !== 'function') {
    window.onresize = handler
  } else {
    window.onresize = function () {
      oldHandler()
      handler()
    }
  }
}

export const insertCustomCssToHead = function (cssCode, formId = '') {
  let head = document.getElementsByTagName('head')[0]
  let oldStyle = document.getElementById('vform-custom-css')
  if (oldStyle) {
    head.removeChild(oldStyle) // 先清除后插入！！
  }
  if (formId) {
    oldStyle = document.getElementById('vform-custom-css' + '-' + formId)
    !!oldStyle && head.removeChild(oldStyle) // 先清除后插入！！
  }

  let newStyle = document.createElement('style')
  newStyle.type = 'text/css'
  newStyle.rel = 'stylesheet'
  newStyle.id = formId ? 'vform-custom-css' + '-' + formId : 'vform-custom-css'
  try {
    newStyle.appendChild(document.createTextNode(cssCode))
  } catch (ex) {
    newStyle.styleSheet.cssText = cssCode
  }

  head.appendChild(newStyle)
}

export const insertGlobalFunctionsToHtml = function (functionsCode, formId = '', globalScripts) {
  // #ifdef APP-PLUS
  try {
    let remoteFn = new Function('window', functionsCode)
    remoteFn.call(globalScripts, globalScripts)
  } catch (e) {
    console.log('exception', e)
    console.error('exception', e)
  }
  // #endif
  // #ifdef H5
  let bodyEle = document.getElementsByTagName('body')[0]
  let oldScriptEle = document.getElementById('v_form_global_functions')
  !!oldScriptEle && bodyEle.removeChild(oldScriptEle) // 先清除后插入！！
  if (formId) {
    oldScriptEle = document.getElementById('v_form_global_functions' + '-' + formId)
    !!oldScriptEle && bodyEle.removeChild(oldScriptEle) // 先清除后插入！！
  }

  let newScriptEle = document.createElement('script')
  newScriptEle.id = formId ? 'v_form_global_functions' + '-' + formId : 'v_form_global_functions'
  newScriptEle.type = 'text/javascript'
  newScriptEle.innerHTML = functionsCode
  bodyEle.appendChild(newScriptEle)
  // #endif
}

export const optionExists = function (optionsObj, optionName) {
  if (!optionsObj) {
    return false
  }

  return Object.keys(optionsObj).indexOf(optionName) > -1
}

export const loadRemoteScript = function (srcPath, callback) {
  /* 加载远程js，加载成功后执行回调函数 */
  let sid = encodeURIComponent(srcPath)
  let oldScriptEle = document.getElementById(sid)

  if (!oldScriptEle) {
    let s = document.createElement('script')
    s.src = srcPath
    s.id = sid
    document.body.appendChild(s)

    s.onload = s.onreadystatechange = function (_, isAbort) {
      /* 借鉴自ace.js */
      if (isAbort || !s.readyState || s.readyState === 'loaded' || s.readyState === 'complete') {
        s = s.onload = s.onreadystatechange = null
        if (!isAbort) {
          callback()
        }
      }
    }
  }
}

export function traverseFieldWidgets(widgetList, handler, parent = null) {
  widgetList.forEach(w => {
    if (w.formItemFlag) {
      handler(w, parent)
    } else if (w.type === 'm-grid') {
      w.cols.forEach(col => {
        traverseFieldWidgets(col.widgetList, handler, w)
      })
    } else if (w.type === 'm-tab') {
      w.tabs.forEach(tab => {
        traverseFieldWidgets(tab.widgetList, handler, w)
      })
    } else if (w.type === 'm-sub-form') {
      traverseFieldWidgets(w.widgetList, handler, w)
    } else if (w.category === 'container') {
      // 自定义容器
      traverseFieldWidgets(w.widgetList, handler, w)
    }
  })
}

export function traverseContainWidgets(widgetList, handler) {
  widgetList.forEach(w => {
    if (w.category === 'container') {
      handler(w)
    }

    if (w.type === 'm-grid') {
      w.cols.forEach(col => {
        traverseContainWidgets(col.widgetList, handler)
      })
    } else if (w.type === 'm-table') {
      w.rows.forEach(row => {
        row.cols.forEach(cell => {
          traverseContainWidgets(cell.widgetList, handler)
        })
      })
    } else if (w.type === 'm-tab') {
      w.tabs.forEach(tab => {
        traverseContainWidgets(tab.widgetList, handler)
      })
    } else if (w.type === 'm-sub-form') {
      traverseContainWidgets(w.widgetList, handler)
    } else if (w.category === 'container') {
      // 自定义容器
      traverseContainWidgets(w.widgetList, handler)
    }
  })
}

export function traverseAllWidgets(widgetList, handler) {
  widgetList.forEach(w => {
    handler(w)

    if (w.type === 'm-grid') {
      w.cols.forEach(col => {
        handler(col)
        traverseAllWidgets(col.widgetList, handler)
      })
    } else if (w.type === 'm-table') {
      w.rows.forEach(row => {
        row.cols.forEach(cell => {
          handler(cell)
          traverseAllWidgets(cell.widgetList, handler)
        })
      })
    } else if (w.type === 'm-tab') {
      w.tabs.forEach(tab => {
        traverseAllWidgets(tab.widgetList, handler)
      })
    } else if (w.type === 'm-sub-form') {
      traverseAllWidgets(w.widgetList, handler)
    } else if (w.category === 'container') {
      // 自定义容器
      traverseAllWidgets(w.widgetList, handler)
    }
  })
}

function handleWidgetForTraverse(widget, handler) {
  if (widget.category) {
    traverseFieldWidgetsOfContainer(widget, handler)
  } else if (widget.formItemFlag) {
    handler(widget)
  }
}

/**
 * 遍历容器内的字段组件
 * @param con
 * @param handler
 */
export function traverseFieldWidgetsOfContainer(con, handler) {
  if (con.type === 'm-grid') {
    con.cols.forEach(col => {
      col.widgetList.forEach(cw => {
        handleWidgetForTraverse(cw, handler)
      })
    })
  } else if (con.type === 'm-table') {
    con.rows.forEach(row => {
      row.cols.forEach(cell => {
        cell.widgetList.forEach(cw => {
          handleWidgetForTraverse(cw, handler)
        })
      })
    })
  } else if (con.type === 'm-tab') {
    con.tabs.forEach(tab => {
      tab.widgetList.forEach(cw => {
        handleWidgetForTraverse(cw, handler)
      })
    })
  } else if (con.type === 'm-sub-form') {
    con.widgetList.forEach(cw => {
      handleWidgetForTraverse(cw, handler)
    })
  } else if (con.category === 'container') {
    // 自定义容器
    con.widgetList.forEach(cw => {
      handleWidgetForTraverse(cw, handler)
    })
  }
  // else if (con.type === 'm-grid') {
  //   con.cols.forEach(cw => {
  //     handleWidgetForTraverse(cw, handler)
  //   })
  // }
}

function handleContainerTraverse(widget, fieldHandler, containerHandler) {
  if (!!widget.category && widget.category === 'container') {
    traverseWidgetsOfContainer(widget, fieldHandler, containerHandler)
  } else if (widget.formItemFlag) {
    fieldHandler(widget)
  }
}

/**
 * 遍历容器内部的字段组件和容器组件
 * @param con
 * @param fieldHandler
 * @param containerHandler
 */
export function traverseWidgetsOfContainer(con, fieldHandler, containerHandler) {
  if (con.type === 'm-grid') {
    con.cols.forEach(col => {
      col.widgetList.forEach(cw => {
        handleContainerTraverse(cw, fieldHandler, containerHandler)
      })
    })
  } else if (con.type === 'm-table') {
    con.rows.forEach(row => {
      row.cols.forEach(cell => {
        cell.widgetList.forEach(cw => {
          handleContainerTraverse(cw, fieldHandler, containerHandler)
        })
      })
    })
  } else if (con.type === 'm-tab') {
    con.tabs.forEach(tab => {
      tab.widgetList.forEach(cw => {
        handleContainerTraverse(cw, fieldHandler, containerHandler)
      })
    })
  } else if (con.type === 'm-sub-form') {
    con.widgetList.forEach(cw => {
      handleContainerTraverse(cw, fieldHandler, containerHandler)
    })
  } else if (con.category === 'container') {
    // 自定义容器
    con.widgetList.forEach(cw => {
      handleContainerTraverse(cw, fieldHandler, containerHandler)
    })
  }
}

/**
 * 获取所有字段组件
 * @param widgetList
 * @returns {[]}
 */
export function getAllFieldWidgets(widgetList) {
  let result = []
  let handlerFn = w => {
    result.push({
      type: w.type,
      name: w.options.name,
      field: w,
    })
  }
  traverseFieldWidgets(widgetList, handlerFn)

  return result
}

/**
 * 获取所有容器组件
 * @param widgetList
 * @returns {[]}
 */
export function getAllContainerWidgets(widgetList) {
  let result = []
  let handlerFn = w => {
    result.push({
      type: w.type,
      name: w.options.name,
      container: w,
    })
  }
  traverseContainWidgets(widgetList, handlerFn)

  return result
}

export function getFieldWidgetByName(widgetList, fieldName) {
  let foundWidget = null
  let handlerFn = widget => {
    if (widget.options.name === fieldName) {
      foundWidget = widget
    }
  }

  traverseFieldWidgets(widgetList, handlerFn)
  return foundWidget
}

export function getContainerWidgetByName(widgetList, containerName) {
  let foundContainer = null
  // let handlerFn = con => {
  //   if (con.options.name === containerName) {
  //     foundContainer = con
  //   }
  // }

  // traverseContainerWidgets(widgetList, handlerFn)
  return foundContainer
}

export function getContainerWidgetById(widgetList, containerId) {
  let foundContainer = null
  // let handlerFn = con => {
  //   if (con.id === containerId) {
  //     foundContainer = con
  //   }
  // }

  // traverseContainerWidgets(widgetList, handlerFn)
  return foundContainer
}

export function copyToClipboard(content, clickEvent, $message, successMsg, errorMsg) {}

export function getQueryParam(variable) {
  let query = window.location.search.substring(1)
  let vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=')
    if (pair[0] === variable) {
      return pair[1]
    }
  }

  return undefined
}

export function getDefaultFormConfig() {
  return {
    modelName: 'formData',
    refName: 'vForm',
    rulesName: 'rules',
    labelWidth: 80,
    // labelPosition: 'left',
    // size: '',
    labelAlign: 'left',
    colon: false,
    inputAlign: 'left',
    cssCode: '',
    customClass: '',
    functions: '', // 全局函数
    layoutType: 'H5',
    jsonVersion: -3, // -3代表VForm 3 Mobile
    dataSources: [], // 数据源集合
    popupZIndex: 3000,

    onFormCreated: '',
    onFormMounted: '',
    onFormDataChange: '',
  }
}

export function buildDefaultFormJson() {
  return {
    widgetList: [],
    formConfig: deepClone(getDefaultFormConfig()),
  }
}

export function cloneFormConfigWithoutEventHandler(formConfig) {
  let newFC = deepClone(formConfig)
  newFC.onFormCreated = ''
  newFC.onFormMounted = ''
  newFC.onFormDataChange = ''

  return newFC
}

/**
 * 转译选择项数据
 * @param rawData
 * @param widgetType
 * @param labelKey
 * @param valueKey
 * @returns {[]}
 */
export function translateOptionItems(rawData, widgetType, labelKey, valueKey) {
  if (widgetType === 'm-cascader') {
    // 级联选择不转译
    return deepClone(rawData)
  }

  let result = []
  if (!!rawData && rawData.length > 0) {
    rawData.forEach(ri => {
      result.push({
        label: ri[labelKey],
        value: ri[valueKey],
        disabled: ri.disabled,
      })
    })
  }

  return result
}

/**
 * 组装axios请求配置参数
 * @param arrayObj
 * @param DSV
 * @param VFR
 * @returns {{}}
 */
export function assembleAxiosConfig(arrayObj, DSV, VFR) {
  let result = {}
  if (!arrayObj || arrayObj.length <= 0) {
    return result
  }
  console.log('arrayObj', arrayObj)
  console.log('NO MAP')
  // arrayObj.map(ai => {
  arrayObj.forEach(ai => {
    if (ai.type === 'String') {
      result[ai.name] = String(ai.value)
    } else if (ai.type === 'Number') {
      result[ai.name] = Number(ai.value)
    } else if (ai.type === 'Boolean') {
      if (ai.value.toLowerCase() === 'false' || ai.value === '0') {
        result[ai.name] = false
      } else if (ai.value.toLowerCase() === 'true' || ai.value === '1') {
        result[ai.name] = true
      } else {
        result[ai.name] = null
      }
    } else if (ai.type === 'Variable') {
      console.log('Variable', ai.name)
      result[ai.name] = evalFn(ai.value, DSV, VFR)
      console.log('Variable result', result[ai.name])
    }
  })

  /* 需要注意：VFR.getWidgetRef()可能无法获取组件，因为组件尚未创建完成，跟数据源执行时机有关！！ */
  return result
}

function buildRequestConfig(dataSource, DSV, VFR, isSandbox) {
  let config = {}

  if (dataSource.requestURLType === 'String') {
    config.url = dataSource.requestURL
  } else {
    config.url = evalFn(dataSource.requestURL, DSV, VFR)
  }
  config.method = dataSource.requestMethod
  config.header = assembleAxiosConfig(dataSource.headers, DSV, VFR)
  config.params = assembleAxiosConfig(dataSource.params, DSV, VFR)
  const param = []
  Object.keys(config.params).forEach(key => {
    param.push(key + '=' + config.params[key])
  })
  config.url = config.url + (config.url.indexOf('?') > -1 ? '&' : '?') + param.join('&')

  config.data = assembleAxiosConfig(dataSource.data, DSV, VFR)
  console.log('config data', config.data)
  return config

  // let chFn = new Function('config', 'isSandbox', 'DSV', 'VFR', dataSource.configHandlerCode);
  // return chFn.call(null, config, isSandbox, DSV, VFR);
}

export async function runDataSourceRequest(dataSource, DSV, VFR, isSandbox, $message) {
  return new Promise((resolve, reject) => {
    let requestConfig = buildRequestConfig(dataSource, DSV, VFR, isSandbox)

    requestConfig.success = res => {
      console.log('success', res.data, dataSource)

      // #ifdef MP-WEIXIN
      resolve(res.data)
      // #endif

      // #ifndef MP-WEIXIN
      if (dataSource.dataHandlerCode) {
        let dhFn = new Function('result', 'isSandbox', 'DSV', 'VFR', dataSource.dataHandlerCode)
        console.log('app', res, dataSource.dataHandlerCode)
        const ret = dhFn.call(null, res, isSandbox, DSV, VFR)
        resolve(ret)
      } else {
        resolve(res.data)
      }
      // #endif
    }
    requestConfig.fail = res => {
      // #ifdef MP-WEIXIN
      reject(res)
      // #endif
      // #ifndef MP-WEIXIN
      if (dataSource.errorHandlerCode) {
        let dhFn = new Function('error', 'isSandbox', 'DSV', '$message', 'VFR', dataSource.errorHandlerCode)
        res.message = res.errMsg
        const ret = dhFn.call(null, res, isSandbox, DSV, $message, VFR)
        reject(ret || res)
      } else {
        reject(res.data)
      }
      // #endif
    }
    console.log('requestConfig', requestConfig)
    let result = uni.request(requestConfig)
    return result
  })
}

export function getDSByName(formConfig, dsName) {
  let resultDS = null
  if (!!dsName && !!formConfig.dataSources) {
    formConfig.dataSources.forEach(ds => {
      if (ds.uniqueName === dsName) {
        resultDS = ds
      }
    })
  }

  return resultDS
}

export function getRealUploadURL(uploadURL, DSV) {
  if (!!uploadURL && (uploadURL.indexOf('DSV.') > -1 || uploadURL.indexOf('DSV[') > -1)) {
    console.log('test DSV: ', DSV) // 为防止编译打包时DSV参数被剔除，本行代码不可注释，不可删除！！
    let url = evalFn(uploadURL, DSV)
    return url
  }

  return uploadURL
}

/* 异步上传文件或图片 */
export async function asyncUploadFile({ file, uploadURL, DSV = {}, uploadHeader = {}, uploadData = {}, progressCallBack }) {
  const realUploadURL = getRealUploadURL(uploadURL, DSV)
  return new Promise((resolve, reject) => {
    const uploadTask = uni.uploadFile({
      url: realUploadURL, // 附件上传的服务器接口地址，非真实的接口地址
      filePath: file, // 要上传文件资源的路径,不同的组件
      name: 'file', // 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容,即附件信息的接收字段名称
      header: uploadHeader,
      formData: uploadData,
      success: uploadFileRes => {
        // 回调方法
        if (uploadFileRes.statusCode === 200) {
          if (uploadFileRes && uploadFileRes.data) {
            // 判断uploadFileRes.data是否为字符串
            if (typeof uploadFileRes.data === 'string') {
              resolve(JSON.parse(uploadFileRes.data))
            } else {
              resolve(uploadFileRes.data)
            }
          } else {
            reject()
          }
        } else {
          reject()
        }
      },
      fail: err => {
        reject(err)
      },
    })

    if (progressCallBack) {
      // 通过uploadTask 监听上传进度
      uploadTask.onProgressUpdate(res => {
        progressCallBack(res)
      })
    }
  })
}

export function px2rem(px) {
  return px

  // 开启使用 rem 取消注释
  // let numPx;
  // if(typeof(px)=='string'){
  //   numPx=parseFloat(px.replace('px',''));
  // }else{
  //   numPx=px;
  // }

  // let em=numPx/37.5
  // return em+'rem'
}
