import subform from './subform'
import input from './input'
import textarea from './textarea'
import number from './number'
import stepper from './stepper'
import calendar from './calendar'
import date from './date'
import time from './time'
import datetime from './datetime'
import daterange from './daterange'
import radio from './radio'
import checkbox from './checkbox'
import checkbox_ds from './checkbox_ds'
import checkbox_ds2 from './checkbox_ds2'
import select from './select'
import select_ds from './select_ds'
import divider from './divider'
import slider from './slider'
import statictext from './statictext'
import htmltext from './htmltext'
import button from './button'
import switcher from './switch'
import slot from './slot'
import rate from './rate'
import alert from './alert'
import cascader from './cascader'
import collapse from './collapse'
import collapseItem from './collapseItem'
import tab from './tab'
import tabItem from './tabItem'
import cellgroup from './cellgroup'
import grid from './grid'
import gridCol from './gridCol'

import fileupload from './fileupload'
import pictureupload from './pictureupload'

const formJson = types => {
  return {
    widgetList: types,
    formConfig: {
      modelName: 'formData',
      refName: 'vForm',
      rulesName: 'rules',
      labelWidth: 375,
      labelAlign: 'left',
      labelPosition: 'top',
      dataSources: [
        {
          dataSourceId: 'ds61571',
          uniqueName: 'search',
          requestURL: 'https://demo-api.vmform.srvcloud.cn/ValidId',
          requestURLType: 'String',
          requestMethod: 'get',
          description: '',
          headers: [],
          params: [
            {
              name: 'search',
              type: 'Variable',
              value: 'DSV.search',
            },
          ],
          data: [],
          configHandlerCode: '  return config',
          dataHandlerCode: '  return result.data.map(item=>{\n    return {\n      label: item.Key,\n      value: item.Value\n    }\n  });',
          errorHandlerCode: '  $message.error(error.message);',
          dataSetEnabled: false,
          dataSets: [],
        },
        {
          dataSourceId: 'ds100807',
          uniqueName: 'dsTest',
          requestURL: '"https://demo-api.vmform.srvcloud.cn/ValidId?token="+DSV.token',
          requestURLType: 'Variable',
          description: '',
          headers: [
            {
              name: 'token',
              type: 'Variable',
              value: "DSV['token']",
            },
            {
              name: 'deviceType',
              type: 'Number',
              value: '1',
            },
            {
              name: 'deviceName',
              type: 'String',
              value: 'h5',
            },
            {
              name: 'isTest',
              type: 'Boolean',
              value: 'true',
            },
          ],
          params: [
            {
              name: 'ptoken',
              type: 'Variable',
              value: "DSV['token']",
            },
            {
              name: 'pdeviceType',
              type: 'Number',
              value: '1',
            },
            {
              name: 'pdeviceName',
              type: 'String',
              value: 'h5',
            },
            {
              name: 'isTest',
              type: 'Boolean',
              value: 'true',
            },
          ],
        },
        {
          dataSourceId: 'ds100802',
          uniqueName: 'dsTest2',
          requestURL: '"https://demo-api.vmform.srvcloud.cn/ValidId/GetDataset?t=1&v="+DSV.token',
          requestURLType: 'Variable',
          requestMethod: 'post',
          description: '',
          headers: [
            {
              name: 'token',
              type: 'Variable',
              value: "DSV['token']",
            },
            {
              name: 'deviceType',
              type: 'Number',
              value: '1',
            },
            {
              name: 'deviceName',
              type: 'String',
              value: 'h5',
            },
            {
              name: 'isTest',
              type: 'Boolean',
              value: 'true',
            },
          ],
          params: [
            {
              name: 'ptoken',
              type: 'Variable',
              value: "DSV['token']",
            },
            {
              name: 'pdeviceType',
              type: 'Number',
              value: '1',
            },
            {
              name: 'pdeviceName',
              type: 'String',
              value: 'h5',
            },
            {
              name: 'isTest',
              type: 'Boolean',
              value: 'true',
            },
          ],
          dataSets: [
            {
              name: 'dataSet',
              remark: '',
            },
          ],
        },
      ],
      colon: false,
      inputAlign: 'top',
      cssCode: '',
      customClass: '',
      functions: '',
      layoutType: 'H5',
      jsonVersion: -2,
      onFormCreated: '',
      onFormMounted: '',
      onFormDataChange: '',
    },
  }
}

export default {
  input,
  textarea,
  number,
  stepper,
  calendar,
  date,
  time,
  datetime,
  daterange,
  radio,
  checkbox,
  checkbox_ds,
  checkbox_ds2,
  select,
  select_ds,
  switcher,
  divider,
  slider,
  slot,
  statictext,
  htmltext,
  vbutton: button,
  rate,
  alert,
  cascader,
  fileupload,
  pictureupload,
  collapse,
  collapseItem,
  tab,
  tabItem,
  cellgroup,
  grid,
  gridCol,
  subform,
  formJson,
}
