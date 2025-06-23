import widgetList from '../index/formJson/index.js'
const {
  alert,
  button,
  calendar,
  cascader,
  cellgroup,
  checkbox,
  collapse,
  collapseItem,
  date,
  daterange,
  datetime,
  divider,
  fileupload,
  formJson,
  grid,
  gridCol,
  htmltext,
  input,
  number,
  pictureupload,
  radio,
  rate,
  select,
  slider,
  slot,
  statictext,
  stepper,
  subform,
  switcher,
  tab,
  tabItem,
  textarea,
  time,
} = widgetList

import { vmformRender, formData } from './usePage.js'

export const useTestButtons = output => {
  const allWidget = [subform([input, textarea]), input, textarea, number, stepper, calendar, date, time, datetime, daterange, rate]

  const tabItem2 = JSON.parse(JSON.stringify(tabItem([date, cascader, radio, checkbox, select])))
  tabItem2.options.name = 'tab2'
  tabItem2.options.label = 'tab xx 2'
  tabItem2.widgetList.push(time)

  if (output) {
    console.log = (arg1, arg2, arg3, arg4, arg5) => {
      let x = []
      ;[arg1, arg2, arg3, arg4, arg5].forEach(arg => {
        if (arg) {
          x.push(JSON.stringify(arg))
        }
      })
      output(x.join('\t'))
    }
  }

  // const devWidget = [tab([tabItem([date, cascader]), tabItem2])];
  const devWidget = [
    input,
    cascader,
    number,
    stepper,
    calendar,
    date,
    time,
    datetime,
    daterange,
    textarea,
    radio,
    checkbox,
    select,
    slot,
    button,
    slot,
    statictext,
    htmltext,
    switcher,
    slider,
    divider,
    rate,
    alert,
    fileupload,
    pictureupload,
    tab([tabItem([date, cascader]), tabItem2]),
    subform([input, textarea]),
    cellgroup([number, stepper, calendar, date, time, radio, checkbox]),
    grid([gridCol([input, textarea, radio, checkbox, select]), gridCol([number, stepper, calendar, date, time])]),
    collapse([collapseItem([input, textarea]), collapseItem([number, stepper, calendar, date, time])]),
  ]

  const setDevelopedWidgets = () => {
    const setFormJson = formJson(allWidget)
    console.log('myTestFilter setFormJson', setFormJson)
    vmformRender.value.setFormJson(setFormJson)
  }

  const setDevelopingWidgets = () => {
    const setFormJson = formJson(devWidget)
    console.log('myTestFilter setFormJson develop', setFormJson)
    vmformRender.value.setFormJson(setFormJson)
  }

  const getFormJson = () => {
    console.log('myTestFilter getFormJson', vmformRender.value.getFormJson())
  }

  const getFormData = () => {
    const data = vmformRender.value
      .getFormData()
      .then(data => {
        console.log('myTestFilter getFormData', data)
      })
      .catch(err => {
        console.log('myTestFilter getFormData err', err)
      })
  }

  const setFormData = () => {
    console.log('formData', formData)
    vmformRender.value.setFormData(formData)
  }

  const getFormDataNoValidate = () => {
    const data = vmformRender.value.getFormData(false)
    console.log('myTestFilter getFormDataNoValidate', data)
  }

  let isHidden = false
  let isReadonly = false
  let isReadmode = false
  let isRequired = false
  const readAndWrite = () => {
    const fieldWidgets = vmformRender.value.getFieldWidgets()
    fieldWidgets.forEach(({ field }) => {
      const wgt = field
      const wgtRef = vmformRender.value.getWidgetRef(wgt.options.name)

      if (!wgtRef || !wgtRef.setReadonly) {
        console.log('容器字段', wgt.options.name, '没有setReadonly方法')
        return
      }

      if (isReadonly) {
        wgtRef.setReadonly(false)
      } else {
        wgtRef.setReadonly(true)
      }
    })
    isReadonly = !isReadonly
  }
  const hideAndShow = () => {
    forEachDevWidget((wgt, wgtRef) => {
      console.log('隐藏', wgt.options.name, 'wgtRef', wgtRef)
      if (isHidden) {
        wgtRef.setHidden(false)
      } else {
        wgtRef.setHidden(true)
      }
    })

    isHidden = !isHidden
  }
  const setHidden = () => {
    isHidden = !isHidden
    forEachDevWidget((wgt, wgtRef) => {
      wgtRef.setHidden(isHidden)
    })
  }
  const getFieldValue = () => {
    const fieldWidgets = vmformRender.value.getFieldWidgets()
    fieldWidgets.forEach(({ field }) => {
      const wgt = field

      const wgtRef = vmformRender.value.getWidgetRef(wgt.options.name)
      const wgtValue = wgtRef.getValue()
      console.log('获取', wgt.options.name, '的值', wgtValue)
    })
  }
  const setFieldValue = () => {
    const fieldWidgets = vmformRender.value.getFieldWidgets()
    fieldWidgets.forEach(({ field }) => {
      const wgt = field

      const wgtRef = vmformRender.value.getWidgetRef(wgt.options.name)
      const wgtValue = wgtRef.setValue(formData[wgt.options.name])
      console.log('获取', wgt.options.name, '的值', wgtValue)
    })
  }
  const resetField = () => {
    const fieldWidgets = vmformRender.value.getFieldWidgets()
    fieldWidgets.forEach(({ field }) => {
      const wgt = field

      const wgtRef = vmformRender.value.getWidgetRef(wgt.options.name)
      wgtRef.resetField()
    })
  }

  const forEachDevWidget = callback => {
    const fieldWidgets = vmformRender.value.getFieldWidgets()
    fieldWidgets.forEach(({ field }) => {
      const wgt = field

      var wgtRef = vmformRender.value.getWidgetRef(wgt.options.name)

      if (wgtRef) {
        callback(wgt, wgtRef)
      }
    })

    const containerWidgets = vmformRender.value.getContainerWidgets()
    containerWidgets.forEach(({ container }) => {
      const wgt = container
      var wgtRef = vmformRender.value.getWidgetRef(wgt.options.name)
      if (wgtRef) {
        callback(wgt, wgtRef)
      }
    })
  }
  const setReadMode = () => {
    forEachDevWidget((wgt, wgtRef) => {
      if (wgtRef) {
        if (wgtRef.setReadMode) {
          wgtRef.setReadMode(!isReadmode)
        } else {
          console.log(wgtRef, '没有setReadMode方法')
        }
      }
    })
    isReadmode = !isReadmode
  }
  const setFormReadMode = () => {
    isReadmode = !isReadmode
    vmformRender.value.setReadMode(isReadmode)
  }
  const disableForm = () => {
    vmformRender.value.disableForm()
  }
  const enableForm = () => {
    vmformRender.value.enableForm()
  }
  const resetForm = () => {
    vmformRender.value.resetForm()
  }
  const setDisabled = () => {
    forEachDevWidget((wgt, wgtRef) => {
      wgtRef.setDisabled()
    })
  }
  const setRequired = () => {
    forEachDevWidget((wgt, wgtRef) => {
      if (wgtRef) {
        if (wgtRef.setRequired) {
          wgtRef.setRequired(!isRequired)
        } else {
          console.log(wgtRef, '没有setRequired方法')
        }
      }
    })
    isRequired = !isRequired
  }
  const setLabel = () => {
    forEachDevWidget((wgt, wgtRef) => {
      wgtRef.setLabel((wgt.options.label || wgt.options.name) + 'label')
    })
  }
  const focus = () => {
    let i = 0
    const fieldWidgets = vmformRender.value.getFieldWidgets()
    let handler = setInterval(() => {
      let wgt = fieldWidgets[i].field
      i++
      const wgtRef = vmformRender.value.getWidgetRef(wgt.options.name)
      if (wgtRef) wgtRef.focus()
      if (i == fieldWidgets.length) {
        clearInterval(handler)
      }
    }, 1000)
  }
  const loadOptions = () => {
    const optionItems = [
      { label: '语文', value: 'chinese' },
      { label: '数学', value: 'math' },
    ]

    forEachDevWidget((wgt, wgtRef) => {
      wgt.options.labelKey = 'label'
      wgt.options.valueKey = 'value'
      wgtRef.loadOptions(optionItems)
    })
  }
  const getOptions = () => {
    forEachDevWidget((wgt, wgtRef) => {
      const options = wgtRef.getOptions()
      console.log('获取', wgt.options.name, '的options', options)
    })
  }
  const disableOption = () => {
    forEachDevWidget((wgt, wgtRef) => {
      wgtRef.disableOption('chinese')
    })
  }
  const enableOption = () => {
    forEachDevWidget((wgt, wgtRef) => {
      wgtRef.enableOption('chinese')
    })
  }

  return {
    setDevelopedWidgets,
    setDevelopingWidgets,
    getFormJson,
    getFormData,
    getFormDataNoValidate,
    disableForm,
    enableForm,
    resetForm,
    hideAndShow,
    readAndWrite,
    getFieldValue,
    setFieldValue,
    resetField,
    setFormData,
    setReadMode,
    setFormReadMode,
    setDisabled,
    setRequired,
    setHidden,
    setLabel,
    focus,
    loadOptions,
    getOptions,
    disableOption,
    enableOption,
  }
}
