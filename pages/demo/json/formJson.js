export const formConfig = {
  dynamicLogicList: [
    {
      triggerFieldName: 'mradio40142',
      triggerFieldValues: [1],
      actions: [
        {
          targetFieldName: 'msubform52829.mselect83322',
          type: 'setEnable',
          value: true,
        },
        {
          targetFieldName: 'msubform52829.mselect83322',
          type: 'setOptionEnable',
          value: [
            { optionValue: '1', state: true },
            { optionValue: '2', state: false },
            { optionValue: '3', state: false },
          ],
        },
        {
          targetFieldName: 'msubform52829.minput54514',
          type: 'setVisibility',
          value: false,
        }
      ],
    },
    {
      triggerFieldName: 'mradio40142',
      triggerFieldValues: [2],
      actions: [
        {
          targetFieldName: 'msubform52829.mselect83322',
          type: 'setEnable',
          value: true,
        },
        {
          targetFieldName: 'msubform52829.mselect83322',
          type: 'setOptionEnable',
          value: [
            { optionValue: '1', state: false },
            { optionValue: '2', state: true },
            { optionValue: '3', state: true },
          ],
        },
        {
          targetFieldName: 'msubform52829.minput54514',
          type: 'setVisibility',
          value: true,
        }
      ],
    },
    {
      triggerFieldName: 'mradio40142',
      triggerFieldValues: [3],
      actions: [
        {
          targetFieldName: 'msubform52829.mselect83322',
          type: 'setEnable',
          value: false,
        },
        {
          targetFieldName: 'msubform52829.minput54514',
          type: 'setVisibility',
          value: true,
        }
      ],
    }
  ],
  background: '#EFEFEF',
  colon: false,
  cssCode: '',
  customClass: '',
  dataSources: [],
  functions: '',
  inputAlign: 'right',
  inputBorder: false,
  jsonVersion: -3,
  labelAlign: 'left',
  labelPosition: 'left',
  labelWidth: 80,
  layoutType: 'H5',
  modelName: 'formData',
  onFormCreated: '',
  onFormDataChange: '',
  onFormMounted: '',
  padding: 5,
  popupZIndex: 3000,
  radius: 4,
  refName: 'vForm',
  rulesName: 'rules',
  size: '',
  onFormValidate: '',
  customProps: [],
  formPadding: '14',
  formBackground: null,
  formName: '测试',
  formDes: '测试',
}

export const widgetList = [{
		"key": 36028,
		"category": "container",
		"icon": "grid-sub-form",
		"options": {
			"actionColumnPosition": "left",
			"customClass": [],
			"hidden": false,
			"name": "msubform52829",
      "itemtitle": "内页",
			"onSubFormRowAdd": "",
			"onSubFormRowChange": "",
			"onSubFormRowDelete": "",
			"onSubFormRowInsert": "",
			"showBlankRow": true,
			"showRowNumber": true
		},
		"type": "m-sub-form",
		"widgetList": [{
			"key": 115477,
			"formItemFlag": true,
			"icon": "select-field",
			"options": {
				"customClass": "",
				"defaultValue": "",
				"disabled": false,
				"dsEnabled": false,
				"dsName": "",
				"filterable": false,
				"hidden": false,
				"label": "材料",
				"labelAlign": "",
				"labelHidden": false,
				"labelIconPosition": "rear",
				"labelKey": "label",
				"labelTooltip": null,
				"labelWidth": null,
				"multiple": false,
				"name": "mselect57138",
				"onChange": "",
				"onCreated": "",
				"onMounted": "",
				"onValidate": "",
				"optionItems": [{
					"label": "铜版纸128克",
					"value": 1
				}, {
					"label": "铜版纸105克",
					"value": 2
				}, {
					"label": "铜版纸250克",
					"value": 3
				}],
				"placeholder": "",
				"readonly": false,
				"remote": false,
				"required": false,
				"requiredHint": "",
				"size": "",
				"valueKey": "value"
			},
			"type": "m-select",
			"id": "mselect57138"
		}, {
			"key": 29474,
			"formItemFlag": true,
			"icon": "radio-field",
			"options": {
				"customClass": [],
				"defaultValue": 1,
				"direction": "horizontal",
				"disabled": false,
				"dsEnabled": false,
				"dsName": "",
				"hidden": false,
				"iconSize": "20",
				"label": "印面",
				"labelAlign": "",
				"labelHidden": false,
				"labelIconPosition": "rear",
				"labelKey": "label",
				"labelTooltip": null,
				"labelWidth": null,
				"name": "mradio40142",
				"onChange": "",
				"onCreated": "",
				"onMounted": "",
				"onValidate": "",
				"optionItems": [{
					"label": "双面",
					"value": 1
				}, {
					"label": "单面",
					"value": 2
				}, {
					"label": "不印",
					"value": 3
				}],
				"readonly": false,
				"required": false,
				"requiredHint": "",
				"valueKey": "value"
			},
			"type": "m-radio",
			"id": "mradio40142"
		}, {
			"key": 115477,
			"formItemFlag": true,
			"icon": "select-field",
			"options": {
				"customClass": "",
				"defaultValue": "彩色",
				"disabled": false,
				"dsEnabled": false,
				"dsName": "",
				"filterable": false,
				"hidden": false,
				"label": "印色",
				"labelAlign": "",
				"labelHidden": false,
				"labelIconPosition": "rear",
				"labelKey": "label",
				"labelTooltip": null,
				"labelWidth": null,
				"multiple": false,
				"name": "mselect83322",
				"onChange": "",
				"onCreated": "",
				"onMounted": "",
				"onValidate": "",
				"optionItems": [{
					"label": "彩色",
					"value": "1"
				}, {
					"label": "单黑",
					"value": "2"
				}, {
					"label": "四色加1专",
					"value": "3"
				}],
				"placeholder": "",
				"readonly": false,
				"remote": false,
				"required": false,
				"requiredHint": "",
				"size": "",
				"valueKey": "value"
			},
			"type": "m-select",
			"id": "mselect83322"
		}, {
			"key": 79368,
			"formItemFlag": true,
			"icon": "text-field",
			"options": {
				"appendButton": false,
				"appendButtonDisabled": false,
				"appendButtonIcon": "search",
				"appendButtonLabel": "",
				"appendButtonType": "primary",
				"clearable": true,
				"customClass": "",
				"defaultValue": "",
				"disabled": false,
				"hidden": false,
				"inputAlign": "left",
				"label": "P数",
				"labelAlign": "",
				"labelHidden": false,
				"labelWidth": null,
				"leftIcon": "",
				"maxLength": null,
				"name": "minput54514",
				"onAppendButtonClick": "",
				"onBlur": "",
				"onCreated": "",
				"onFocus": "",
				"onInput": "",
				"onMounted": "",
				"onValidate": "",
				"placeholder": "",
				"readonly": false,
				"required": false,
				"requiredHint": "",
				"rightIcon": "",
				"showWordLimit": false,
				"size": "",
				"type": "text",
				"validation": "",
				"validationHint": ""
			},
			"type": "m-input",
			"id": "minput54514"
		}, {
			"key": 47989,
			"formItemFlag": true,
			"icon": "radio-field",
			"options": {
				"customClass": [],
				"defaultValue": null,
				"direction": "horizontal",
				"disabled": false,
				"dsEnabled": false,
				"dsName": "",
				"hidden": false,
				"iconSize": "20",
				"label": "内容一样",
				"labelAlign": "",
				"labelHidden": false,
				"labelIconPosition": "rear",
				"labelKey": "label",
				"labelTooltip": null,
				"labelWidth": null,
				"name": "mradio102178",
				"onChange": "",
				"onCreated": "",
				"onMounted": "",
				"onValidate": "",
				"optionItems": [{
					"label": "是",
					"value": 1
				}, {
					"label": "否",
					"value": 2
				}],
				"readonly": false,
				"required": false,
				"requiredHint": "",
				"valueKey": "value"
			},
			"type": "m-radio",
			"id": "mradio57852"
		}, {
			"key": 47989,
			"formItemFlag": true,
			"icon": "radio-field",
			"options": {
				"customClass": [],
				"defaultValue": 2,
				"direction": "horizontal",
				"disabled": false,
				"dsEnabled": false,
				"dsName": "",
				"hidden": false,
				"iconSize": "20",
				"label": "工艺",
				"labelAlign": "",
				"labelHidden": false,
				"labelIconPosition": "rear",
				"labelKey": "label",
				"labelTooltip": null,
				"labelWidth": null,
				"name": "mradio68036",
				"onChange": "",
				"onCreated": "",
				"onMounted": "",
				"onValidate": "",
				"optionItems": [{
					"label": "现调纸",
					"value": 1
				}, {
					"label": "头对尾",
					"value": 2
				}, {
					"label": "头对头",
					"value": 3
				}],
				"readonly": false,
				"required": false,
				"requiredHint": "",
				"valueKey": "value"
			},
			"type": "m-radio",
			"id": "mradio20099"
		}],
		"id": "msubform52829"
	}, {
		"key": 36028,
		"category": "container",
		"icon": "grid-sub-form",
		"options": {
			"actionColumnPosition": "left",
			"customClass": [],
			"hidden": false,      
      "itemtitle": "拉页",
			"name": "msubform102859",
			"onSubFormRowAdd": "",
			"onSubFormRowChange": "",
			"onSubFormRowDelete": "",
			"onSubFormRowInsert": "",
			"showBlankRow": true,
			"showRowNumber": true
		},
		"type": "m-sub-form",
		"widgetList": [{
			"key": 44021,
			"formItemFlag": true,
			"icon": "text-field",
			"options": {
				"appendButton": false,
				"appendButtonDisabled": false,
				"appendButtonIcon": "search",
				"appendButtonLabel": "",
				"appendButtonType": "primary",
				"clearable": true,
				"customClass": [],
				"defaultValue": "",
				"disabled": false,
				"hidden": false,
				"inputAlign": "left",
				"label": "材料",
				"labelAlign": "",
				"labelHidden": false,
				"labelWidth": null,
				"leftIcon": "",
				"maxLength": null,
				"name": "minput9136",
				"onAppendButtonClick": "",
				"onBlur": "",
				"onCreated": "",
				"onFocus": "",
				"onInput": "",
				"onMounted": "",
				"onValidate": "",
				"placeholder": "",
				"readonly": false,
				"required": false,
				"requiredHint": "",
				"rightIcon": "",
				"showWordLimit": false,
				"size": "",
				"type": "text",
				"validation": "",
				"validationHint": ""
			},
			"type": "m-input",
			"id": "minput9136"
		}, {
			"key": 47989,
			"formItemFlag": true,
			"icon": "radio-field",
			"options": {
				"customClass": "",
				"defaultValue": null,
				"direction": "horizontal",
				"disabled": false,
				"dsEnabled": false,
				"dsName": "",
				"hidden": false,
				"iconSize": "20",
				"label": "印面",
				"labelAlign": "",
				"labelHidden": false,
				"labelIconPosition": "rear",
				"labelKey": "label",
				"labelTooltip": null,
				"labelWidth": null,
				"name": "mradio69580",
				"onChange": "",
				"onCreated": "",
				"onMounted": "",
				"onValidate": "",
				"optionItems": [{
					"label": "radio 1",
					"value": 1
				}, {
					"label": "radio 2",
					"value": 2
				}, {
					"label": "radio 3",
					"value": 3
				}],
				"readonly": false,
				"required": false,
				"requiredHint": "",
				"valueKey": "value"
			},
			"type": "m-radio",
			"id": "mradio69580"
		}, {
			"key": 111515,
			"formItemFlag": true,
			"icon": "select-field",
			"options": {
				"customClass": "",
				"defaultValue": "",
				"disabled": false,
				"dsEnabled": false,
				"dsName": "",
				"filterable": false,
				"hidden": false,
				"label": "印数",
				"labelAlign": "",
				"labelHidden": false,
				"labelIconPosition": "rear",
				"labelKey": "label",
				"labelTooltip": null,
				"labelWidth": null,
				"multiple": false,
				"name": "mselect91834",
				"onChange": "",
				"onCreated": "",
				"onMounted": "",
				"onValidate": "",
				"optionItems": [{
					"label": "select 1",
					"value": 1
				}, {
					"label": "select 2",
					"value": 2
				}, {
					"label": "select 3",
					"value": 3
				}],
				"placeholder": "",
				"readonly": false,
				"remote": false,
				"required": false,
				"requiredHint": "",
				"size": "",
				"valueKey": "value"
			},
			"type": "m-select",
			"id": "mselect91834"
		}, {
			"key": 111515,
			"formItemFlag": true,
			"icon": "select-field",
			"options": {
				"customClass": "",
				"defaultValue": "",
				"disabled": false,
				"dsEnabled": false,
				"dsName": "",
				"filterable": false,
				"hidden": false,
				"label": "P数",
				"labelAlign": "",
				"labelHidden": false,
				"labelIconPosition": "rear",
				"labelKey": "label",
				"labelTooltip": null,
				"labelWidth": null,
				"multiple": false,
				"name": "mselect70335",
				"onChange": "",
				"onCreated": "",
				"onMounted": "",
				"onValidate": "",
				"optionItems": [{
					"label": "select 1",
					"value": 1
				}, {
					"label": "select 2",
					"value": 2
				}, {
					"label": "select 3",
					"value": 3
				}],
				"placeholder": "",
				"readonly": false,
				"remote": false,
				"required": false,
				"requiredHint": "",
				"size": "",
				"valueKey": "value"
			},
			"type": "m-select",
			"id": "mselect70335"
		}, {
			"key": 47989,
			"formItemFlag": true,
			"icon": "radio-field",
			"options": {
				"customClass": "",
				"defaultValue": null,
				"direction": "horizontal",
				"disabled": false,
				"dsEnabled": false,
				"dsName": "",
				"hidden": false,
				"iconSize": "20",
				"label": "工艺",
				"labelAlign": "",
				"labelHidden": false,
				"labelIconPosition": "rear",
				"labelKey": "label",
				"labelTooltip": null,
				"labelWidth": null,
				"name": "mradio36386",
				"onChange": "",
				"onCreated": "",
				"onMounted": "",
				"onValidate": "",
				"optionItems": [{
					"label": "radio 1",
					"value": 1
				}, {
					"label": "radio 2",
					"value": 2
				}, {
					"label": "radio 3",
					"value": 3
				}],
				"readonly": false,
				"required": false,
				"requiredHint": "",
				"valueKey": "value"
			},
			"type": "m-radio",
			"id": "mradio36386"
		}, {
			"key": 47989,
			"formItemFlag": true,
			"icon": "radio-field",
			"options": {
				"customClass": "",
				"defaultValue": null,
				"direction": "horizontal",
				"disabled": false,
				"dsEnabled": false,
				"dsName": "",
				"hidden": false,
				"iconSize": "20",
				"label": "内容一样",
				"labelAlign": "",
				"labelHidden": false,
				"labelIconPosition": "rear",
				"labelKey": "label",
				"labelTooltip": null,
				"labelWidth": null,
				"name": "mradio37490",
				"onChange": "",
				"onCreated": "",
				"onMounted": "",
				"onValidate": "",
				"optionItems": [{
					"label": "radio 1",
					"value": 1
				}, {
					"label": "radio 2",
					"value": 2
				}, {
					"label": "radio 3",
					"value": 3
				}],
				"readonly": false,
				"required": false,
				"requiredHint": "",
				"valueKey": "value"
			},
			"type": "m-radio",
			"id": "mradio37490"
		}],
		"id": "msubform102859"
	}, {
		"key": 36028,
		"category": "container",
		"icon": "grid-sub-form",
		"options": {
			"actionColumnPosition": "left",
			"customClass": [],
			"hidden": false,
      "itemtitle": "护封",
			"name": "msubform41618",
			"onSubFormRowAdd": "",
			"onSubFormRowChange": "",
			"onSubFormRowDelete": "",
			"onSubFormRowInsert": "",
			"showBlankRow": true,
			"showRowNumber": true
		},
		"type": "m-sub-form",
		"widgetList": [{
			"key": 44021,
			"formItemFlag": true,
			"icon": "text-field",
			"options": {
				"appendButton": false,
				"appendButtonDisabled": false,
				"appendButtonIcon": "search",
				"appendButtonLabel": "",
				"appendButtonType": "primary",
				"clearable": true,
				"customClass": "",
				"defaultValue": "",
				"disabled": false,
				"hidden": false,
				"inputAlign": "left",
				"label": "材料",
				"labelAlign": "",
				"labelHidden": false,
				"labelWidth": null,
				"leftIcon": "",
				"maxLength": null,
				"name": "minput41228",
				"onAppendButtonClick": "",
				"onBlur": "",
				"onCreated": "",
				"onFocus": "",
				"onInput": "",
				"onMounted": "",
				"onValidate": "",
				"placeholder": "",
				"readonly": false,
				"required": false,
				"requiredHint": "",
				"rightIcon": "",
				"showWordLimit": false,
				"size": "",
				"type": "text",
				"validation": "",
				"validationHint": ""
			},
			"type": "m-input",
			"id": "minput41228"
		}, {
			"key": 47989,
			"formItemFlag": true,
			"icon": "radio-field",
			"options": {
				"customClass": "",
				"defaultValue": null,
				"direction": "horizontal",
				"disabled": false,
				"dsEnabled": false,
				"dsName": "",
				"hidden": false,
				"iconSize": "20",
				"label": "印面",
				"labelAlign": "",
				"labelHidden": false,
				"labelIconPosition": "rear",
				"labelKey": "label",
				"labelTooltip": null,
				"labelWidth": null,
				"name": "mradio33063",
				"onChange": "",
				"onCreated": "",
				"onMounted": "",
				"onValidate": "",
				"optionItems": [{
					"label": "radio 1",
					"value": 1
				}, {
					"label": "radio 2",
					"value": 2
				}, {
					"label": "radio 3",
					"value": 3
				}],
				"readonly": false,
				"required": false,
				"requiredHint": "",
				"valueKey": "value"
			},
			"type": "m-radio",
			"id": "mradio33063"
		}, {
			"key": 44021,
			"formItemFlag": true,
			"icon": "text-field",
			"options": {
				"appendButton": false,
				"appendButtonDisabled": false,
				"appendButtonIcon": "search",
				"appendButtonLabel": "",
				"appendButtonType": "primary",
				"clearable": true,
				"customClass": "",
				"defaultValue": "",
				"disabled": false,
				"hidden": false,
				"inputAlign": "left",
				"label": "展开尺寸",
				"labelAlign": "",
				"labelHidden": false,
				"labelWidth": null,
				"leftIcon": "",
				"maxLength": null,
				"name": "minput110844",
				"onAppendButtonClick": "",
				"onBlur": "",
				"onCreated": "",
				"onFocus": "",
				"onInput": "",
				"onMounted": "",
				"onValidate": "",
				"placeholder": "",
				"readonly": false,
				"required": false,
				"requiredHint": "",
				"rightIcon": "",
				"showWordLimit": false,
				"size": "",
				"type": "text",
				"validation": "",
				"validationHint": ""
			},
			"type": "m-input",
			"id": "minput110844"
		}, {
			"key": 47989,
			"formItemFlag": true,
			"icon": "radio-field",
			"options": {
				"customClass": "",
				"defaultValue": null,
				"direction": "horizontal",
				"disabled": false,
				"dsEnabled": false,
				"dsName": "",
				"hidden": false,
				"iconSize": "20",
				"label": "印色",
				"labelAlign": "",
				"labelHidden": false,
				"labelIconPosition": "rear",
				"labelKey": "label",
				"labelTooltip": null,
				"labelWidth": null,
				"name": "mradio19011",
				"onChange": "",
				"onCreated": "",
				"onMounted": "",
				"onValidate": "",
				"optionItems": [{
					"label": "radio 1",
					"value": 1
				}, {
					"label": "radio 2",
					"value": 2
				}, {
					"label": "radio 3",
					"value": 3
				}],
				"readonly": false,
				"required": false,
				"requiredHint": "",
				"valueKey": "value"
			},
			"type": "m-radio",
			"id": "mradio19011"
		}],
		"id": "msubform41618"
	}]