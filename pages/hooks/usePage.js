import { ref, reactive } from '@/utils/vue.js'

const formDataObj = {
  minput104177: 'inputvalue',
  mnumber53688: '4444',
  mstepper75345: 9,
  mcalendar98339: '2023年07月16日',
  mdate36197: '2023-07-21',
  mtime59299: '00时19分',
  mdatetime36197: '2023-07-19 05:13',
  daterange4812: ['2023年06月28日', '2023年06月29日'],
  mtextarea64275: 'mtextarea64275',
  mradio62090: 'wechat',
  mcheckbox90128: [2],
  mcheckbox90129: ['1', '2'],
  mcheckbox90130: ['1', '2', '3'],
  mcascader65951: [1, 11, 112],
  mselect71411: '2',
  mselect71412: '3',
  mswitch102117: true,
  mslider41067: 59,
  mrate27830: 4,
  mfileupload37776: [
    {
      name: 'test.docx',
      url: 'https://demo-api.vmform.srvcloud.cn/uploadfiles/test.docx',
      timestamp: '2023/7/6 5:13:27',
    },
  ],
  mpictureupload32034: [
    {
      name: 'demo-picture.png',
      url: 'https://demo-api.vmform.srvcloud.cn/uploadfiles/demo.png',
      timestamp: '2023/7/6 5:13:34',
    },
  ],
  msubform56101: [
    {
      minput104177: 'input1',
      mtextarea64275: 'textarea1',
      mnumber53688: '1',
      mstepper75345: 7,
      mselect71411: 1,
      mselect71412: '1',
      mcheckbox90129: ['1', '2'],
      mcheckbox90130: ['1', '3'],
      mcalendar98339: '2023年07月19日',
    },
    {
      minput104177: 'input2',
      mtextarea64275: 'textarea2',
      mnumber53688: '2',
      mstepper75345: 4,
      mselect71411: 2,
      mselect71412: '2',
      mcheckbox90129: ['2', '3'],
      mcheckbox90130: ['1', '2', '3'],
      mcalendar98339: '2023年07月20日',
    },
  ],
}

const rawdata = {
  formJson: {
    widgetList: [],
    formConfig: {},
  },
  formData: formDataObj,
  optionData: {},
  globalDsv: {
    token: 'token',
    api: 'https://demo-api.vmform.srvcloud.cn/',
  },
}

var dataRef, vmformRenderRef
dataRef = reactive(rawdata)
vmformRenderRef = ref()

export const data = dataRef
export const formData = formDataObj
export const vmformRender = vmformRenderRef
