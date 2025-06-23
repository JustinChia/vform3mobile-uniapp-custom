export const containers = [
  {
    category: 'container',
    icon: 'cell-group',
    options: {
      border: true,
      customClass: '', // 自定义css类名
      hidden: false,
      inset: false,
      label: 'group',
      name: '',
    },
    type: 'm-cell-group',
    widgetList: [],
  },

  {
    category: 'container',
    cols: [],
    icon: 'grid',
    options: {
      colHeight: null, // 栅格列统一高度属性，用于解决栅格列设置响应式布局浮动后被挂住的问题！！
      customClass: '', // 自定义css类名
      gutter: 0,
      hidden: false,
      name: '',
    },
    type: 'm-grid',
  },

  {
    category: 'container',
    icon: 'tab',
    options: {
      active: '',
      colorStyle: '#B0B0B0',
      customClass: '', // 自定义css类名
      displayType: 'border-card',
      hidden: false,
      name: '',
      onTabbarChange: '',
      textEllipsis: true,
    },
    tabs: [],
    type: 'm-tab',
  },

  {
    category: 'container',
    icon: 'tab-pane',
    internal: true,
    options: {
      active: false,
      customClass: '', // 自定义css类名
      disabled: false,
      hidden: false,
      label: '',
      name: '',
    },
    type: 'm-tab-pane',
    widgetList: [],
  },

  {
    category: 'container',
    icon: 'grid-col',
    internal: true,
    options: {
      customClass: '', // 自定义css类名
      hidden: false,
      name: '',
      offset: 0,
      span: 12,
    },
    type: 'm-grid-col',
    widgetList: [],
  },

  {
    category: 'container',
    icon: 'grid-sub-form',
    options: {
      actionColumnPosition: 'left', // 操作按钮列位置
      customClass: '', // 自定义css类名
      hidden: false,
      name: '',
      onSubFormRowAdd: '',
      onSubFormRowChange: '',
      onSubFormRowDelete: '',
      onSubFormRowInsert: '',
      showBlankRow: true,
      showRowNumber: true,
    },
    type: 'm-sub-form',
    widgetList: [],
  },
];

export const basicFields = [
  {
    formItemFlag: true,
    icon: 'text-field',
    options: {
      appendButton: false,
      appendButtonDisabled: false,
      appendButtonIcon: 'search',
      appendButtonLabel: '',
      appendButtonType: 'primary',
      clearable: true,
      // -------------------
      customClass: '', // 自定义css类名
      defaultValue: null,
      disabled: false,
      hidden: false,
      inputAlign: 'left',
      label: '',
      labelAlign: '',
      labelHidden: false,
      labelWidth: null,
      leftIcon: '',
      maxLength: null,
      name: '',
      onAppendButtonClick: '',
      onBlur: '',
      onChange: '',
      // -------------------
      onCreated: '',
      onFocus: '',
      onInput: '',
      onMounted: '',
      onValidate: '',
      placeholder: '',
      readonly: false,
      required: false,
      requiredHint: '',
      rightIcon: '',
      showWordLimit: false,
      size: '',
      type: 'text',
      validation: '',
      validationHint: '',
    },
    type: 'm-input',
  },

  {
    formItemFlag: true,
    icon: 'textarea-field',
    options: {
      // -------------------
      customClass: '', // 自定义css类名
      defaultValue: null,
      disabled: false,
      hidden: false,
      inputAlign: 'left',
      label: '',

      labelAlign: '',
      labelHidden: false,
      labelWidth: null,
      maxLength: null,
      // labelIconClass: null,
      // labelIconPosition: 'rear',
      // labelTooltip: null,
      minLength: null,
      name: '',
      onBlur: '',
      onChange: '',
      // -------------------
      onCreated: '',
      onFocus: '',
      onInput: '',
      onMounted: '',
      onValidate: '',
      placeholder: '',
      readonly: false,
      required: false,
      requiredHint: '',
      rows: 3,
      showWordLimit: false,
      size: '',
      validation: '',
      validationHint: '',
    },
    type: 'm-textarea',
  },

  {
    formItemFlag: true,
    icon: 'number-field',
    options: {
      closeButtonText: '',
      // -------------------
      customClass: '', // 自定义css类名
      defaultValue: '',
      disabled: false,
      hidden: false,
      label: '',
      labelAlign: '',
      labelHidden: false,
      //labelIconClass: null,
      labelIconPosition: 'rear',
      labelTooltip: null,
      labelWidth: null,
      name: '',
      onBlur: '',
      onChange: '',
      // -------------------
      onCreated: '',
      onFocus: '',
      onInput: '',
      onMounted: '',
      onValidate: '',
      placeholder: '',
      readonly: false,
      required: false,
      requiredHint: '',
      size: '',
      validation: '',
      validationHint: '',
    },
    type: 'm-number',
  },

  {
    formItemFlag: true,
    icon: 'stepper-field',
    options: {
      // -------------------
      customClass: '', // 自定义css类名
      defaultValue: '1',
      disabled: false,
      hidden: false,
      label: '',
      labelAlign: '',
      labelHidden: false,
      //labelIconClass: null,
      labelIconPosition: 'rear',
      labelTooltip: null,
      labelWidth: null,
      max: 100000000000,
      min: -100000000000,
      name: '',
      onBlur: '',
      onChange: '',
      // -------------------
      onCreated: '',
      onFocus: '',
      onMounted: '',
      onValidate: '',
      precision: 0,
      readonly: false,
      step: 1,
      stepButtonSize: '28',
      // required: false,
      // requiredHint: '',
      validation: '',
      validationHint: '',
    },
    type: 'm-stepper',
  },

  {
    formItemFlag: true,
    icon: 'radio-field',
    options: {
      // validation: '',
      // validationHint: '',
      // -------------------
      customClass: '', // 自定义css类名
      defaultValue: null,
      direction: 'horizontal',
      disabled: false,

      dsEnabled: false, // 是否使用数据源数据
      dsName: '', // 数据源名称
      hidden: false,
      iconSize: '20',
      label: '',
      labelAlign: '',
      labelHidden: false,
      //labelIconClass: null,
      labelIconPosition: 'rear',
      labelKey: 'label',
      labelTooltip: null,
      labelWidth: null,
      name: '',
      onChange: '',
      // -------------------
      onCreated: '',
      onMounted: '',
      onValidate: '',
      optionItems: [
        { label: 'radio 1', value: 1 },
        { label: 'radio 2', value: 2 },
        { label: 'radio 3', value: 3 },
      ],
      readonly: false,
      required: false,
      requiredHint: '',
      valueKey: 'value',
    },
    type: 'm-radio',
  },

  {
    formItemFlag: true,
    icon: 'checkbox-field',
    options: {
      // -------------------
      customClass: '', // 自定义css类名
      defaultValue: [],
      direction: 'horizontal',
      disabled: false,
      dsEnabled: false, // 是否使用数据源数据
      dsName: '', // 数据源名称
      hidden: false,
      iconSize: '20',
      label: '',
      labelAlign: '',
      labelHidden: false,
      //labelIconClass: null,
      labelIconPosition: 'rear',
      labelKey: 'label',
      labelTooltip: null,
      labelWidth: null,
      name: '',
      onChange: '',
      // -------------------
      onCreated: '',
      onMounted: '',
      onValidate: '',
      optionItems: [
        { label: 'check 1', value: 1 },
        { label: 'check 2', value: 2 },
        { label: 'check 3', value: 3 },
      ],
      readonly: false,
      required: false,
      requiredHint: '',
      valueKey: 'value',
    },
    type: 'm-checkbox',
  },

  {
    formItemFlag: true,
    icon: 'select-field',
    options: {
      clearable: true,
      // -------------------
      customClass: '', // 自定义css类名
      defaultValue: null,
      disabled: false,
      dsEnabled: false, // 是否使用数据源数据
      dsName: '', // 数据源名称
      filterable: false,
      hidden: false,
      label: '',
      labelAlign: '',
      labelHidden: false,
      //labelIconClass: null,
      labelIconPosition: 'rear',
      labelKey: 'label',
      labelTooltip: null,
      labelWidth: null,
      multiple: false,
      name: '',
      onBlur: '',
      onChange: '',
      // -------------------
      onCreated: '',
      onFocus: '',
      onMounted: '',
      onRemoteQuery: '',
      onValidate: '',
      optionItems: [
        { label: 'select 1', value: 1 },
        { label: 'select 2', value: 2 },
        { label: 'select 3', value: 3 },
      ],
      placeholder: '',
      readonly: false,
      remote: false,
      required: false,
      requiredHint: '',
      size: '',
      valueKey: 'value',
    },
    type: 'm-select',
  },

  {
    formItemFlag: true,
    icon: 'date-field',
    options: {
      clearable: true,
      // -------------------
      customClass: '', // 自定义css类名
      defaultValue: null,
      disabled: false,
      editable: false,

      format: 'YYYY-MM-DD', // 日期显示格式,后续版本加上
      hidden: false,
      label: '',
      labelAlign: '',
      labelHidden: false,
      //labelIconClass: null,
      labelIconPosition: 'rear',
      labelTooltip: null,
      labelWidth: null,
      maxDate: '',
      // valueFormat: 'YYYY-MM-DD',  //日期对象格式,后续版本加上
      minDate: '',
      name: '',
      onBlur: '',
      onChange: '',
      onConfirm: '',
      // -------------------
      onCreated: '',
      onFocus: '',
      onMounted: '',
      onValidate: '',
      placeholder: '',
      readonly: false,
      required: false,
      requiredHint: '',
      size: '',
      validation: '',
      validationHint: '',
    },
    type: 'm-calendar',
  },

  {
    formItemFlag: true,
    icon: 'date-field',
    options: {
      clearable: true,
      // -------------------
      customClass: '', // 自定义css类名
      defaultValue: null,
      disabled: false,
      editable: false,

      format: 'YYYY-MM-DD', // 日期显示格式,后续版本加上
      hidden: false,
      label: '',
      labelAlign: '',
      labelHidden: false,
      //labelIconClass: null,
      labelIconPosition: 'rear',
      labelTooltip: null,
      labelWidth: null,
      maxDate: '',
      // valueFormat: 'YYYY-MM-DD',  //日期对象格式,后续版本加上

      minDate: '',
      name: '',
      onBlur: '',
      onChange: '',
      onConfirm: '',
      // -------------------
      onCreated: '',
      onFocus: '',
      onMounted: '',
      onValidate: '',
      placeholder: '',
      readonly: false,
      required: false,
      requiredHint: '',
      size: '',
      validation: '',
      validationHint: '',
    },
    type: 'm-date',
  },

  {
    formItemFlag: true,
    icon: 'datetime-field',
    options: {
      clearable: true,
      // -------------------
      customClass: '', // 自定义css类名
      defaultValue: null,
      disabled: false,
      editable: false,
      format: 'YYYY-MM-DD HH:mm', // 日期时间显示格式
      hidden: false,
      label: '',
      labelAlign: '',
      labelHidden: false,
      //labelIconClass: null,
      labelIconPosition: 'rear',
      labelTooltip: null,
      labelWidth: null,
      maxDate: '',
      // valueFormat: 'YYYY-MM-DD HH:mm',  //日期时间对象格式
      minDate: '',
      name: '',
      onBlur: '',
      onChange: '',
      onConfirm: '',
      // -------------------
      onCreated: '',
      onFocus: '',
      onMounted: '',
      onValidate: '',
      placeholder: '',
      readonly: false,
      required: false,
      requiredHint: '',
      size: '',
      validation: '',
      validationHint: '',
    },
    type: 'm-datetime',
  },

  {
    formItemFlag: true,
    icon: 'time-field',
    options: {
      clearable: true,
      // -------------------
      customClass: '', // 自定义css类名
      defaultValue: null,
      disabled: false,
      editable: false,
      format: 'HH:mm', // 日期时间显示格式
      hidden: false,
      label: '',
      labelAlign: '',
      labelHidden: false,
      //labelIconClass: null,
      labelIconPosition: 'rear',
      labelTooltip: null,
      labelWidth: null,
      name: '',
      onBlur: '',
      onChange: '',
      onConfirm: '',
      // -------------------
      onCreated: '',
      onFocus: '',
      onMounted: '',
      onValidate: '',
      placeholder: '',
      readonly: false,
      required: false,
      requiredHint: '',
      size: '',
      validation: '',
      validationHint: '',
    },
    type: 'm-time',
  },

  {
    formItemFlag: true,
    icon: 'date-range-field',
    options: {
      clearable: true,
      // -------------------
      customClass: '', // 自定义css类名
      defaultValue: null,
      disabled: false,
      editable: false,
      endPlaceholder: '',
      format: 'YYYY-MM-DD', // 日期显示格式
      hidden: false,
      label: '',
      labelAlign: '',
      labelHidden: false,
      //labelIconClass: null,
      labelIconPosition: 'rear',
      labelTooltip: null,
      labelWidth: null,
      maxDate: '',
      // valueFormat: 'YYYY-MM-DD',  //日期对象格式
      minDate: '',
      name: '',
      onBlur: '',
      onChange: '',
      onConfirm: '',
      // -------------------
      onCreated: '',
      onFocus: '',
      onMounted: '',
      onValidate: '',
      readonly: false,
      required: false,
      requiredHint: '',
      size: '',
      startPlaceholder: '',
      validation: '',
      validationHint: '',
    },
    type: 'm-date-range',
  },

  {
    formItemFlag: true,
    icon: 'switch-field',
    options: {
      activeColor: null,
      activeText: '',
      activeValue: true,
      // -------------------
      customClass: '', // 自定义css类名
      defaultValue: false,
      disabled: false,
      hidden: false,
      inactiveColor: null,
      inactiveText: '',
      inactiveValue: false,
      label: '',
      labelAlign: '',
      labelHidden: false,
      //labelIconClass: null,
      labelIconPosition: 'rear',
      labelTooltip: null,
      labelWidth: null,
      name: '',
      onChange: '',
      // -------------------
      onCreated: '',
      onMounted: '',
      onValidate: '',
      readonly: false,
      switchSize: 24,
    },
    type: 'm-switch',
  },

  {
    formItemFlag: true,
    icon: 'rate-field',
    options: {
      allowHalf: false,
      // -------------------
      customClass: '', // 自定义css类名
      defaultValue: 0,
      disabled: false,
      hidden: false,
      label: '',
      labelAlign: '',
      labelHidden: false,
      //labelIconClass: null,
      labelIconPosition: 'rear',
      labelTooltip: null,
      labelWidth: null,
      max: 5,
      name: '',
      onChange: '',
      // -------------------
      onCreated: '',
      onMounted: '',
      onValidate: '',
      readonly: false,
      required: false,
      requiredHint: '',
      showScore: false,
      validation: '',
      validationHint: '',
    },
    type: 'm-rate',
  },

  {
    formItemFlag: true,
    icon: 'slider-field',
    options: {
      // -------------------
      customClass: '', // 自定义css类名
      defaultValue: null,
      disabled: false,
      // vertical: false,
      height: null,
      hidden: false,
      label: '',
      labelAlign: '',
      labelHidden: false,
      //labelIconClass: null,
      labelIconPosition: 'rear',
      labelTooltip: null,
      labelWidth: null,
      max: 100,
      min: 0,
      name: '',
      onChange: '',
      // -------------------
      onCreated: '',
      onMounted: '',
      onValidate: '',
      range: false,
      readonly: false,
      size: '',
      step: 10,
      validation: '',
      validationHint: '',
    },
    type: 'm-slider',
  },

  {
    formItemFlag: false,
    icon: 'static-text',
    options: {
      // -------------------
      customClass: '', // 自定义css类名
      fontSize: '13px',
      hidden: false,
      name: '',
      // -------------------
      onCreated: '',
      onMounted: '',
      textContent: 'static text',
    },
    type: 'm-static-text',
  },

  {
    formItemFlag: false,
    icon: 'html-text',
    options: {
      // -------------------
      customClass: '', // 自定义css类名

      hidden: false,
      htmlContent: '<b>html text</b>',
      name: '',
      // -------------------
      onCreated: '',
      onMounted: '',
    },
    type: 'm-html-text',
  },

  {
    formItemFlag: false,
    icon: 'button',
    options: {
      // -------------------
      customClass: '', // 自定义css类名
      disabled: false,
      displayStyle: 'block',
      hidden: false,
      icon: null,
      label: '',
      name: '',
      onClick: '',
      // -------------------
      onCreated: '',
      onMounted: '',
      plain: false,
      round: false,
      size: 'normal',
      type: 'default',
    },
    type: 'm-button',
  },

  {
    formItemFlag: false,
    icon: 'divider',
    options: {
      contentPosition: 'center',
      // -------------------
      customClass: '', // 自定义css类名

      dashed: false,
      hidden: false,
      label: '',
      name: '',
      // -------------------
      onCreated: '',
      onMounted: '',
    },
    type: 'm-divider',
  },

  //
];

export const advancedFields = [
  {
    formItemFlag: true,
    icon: 'picture-upload-field',
    options: {
      capture: '',
      // -------------------
      customClass: '', // 自定义css类名
      customRule: '',
      customRuleHint: '',
      disabled: false,
      fileMaxSize: 5, // MB
      fileTypes: ['jpg', 'jpeg', 'png'],
      hidden: false,
      label: '',
      labelAlign: '',
      labelHidden: false,
      //labelIconClass: null,
      labelIconPosition: 'rear',
      labelTooltip: null,
      labelWidth: null,
      limit: 3,
      multipleSelect: false,
      name: '',
      onBeforeUpload: '',
      // -------------------
      onCreated: '',
      onFileRemove: '',
      onMounted: '',
      onUploadError: '',
      onUploadSuccess: '',
      onValidate: '',
      required: false,
      requiredHint: '',
      uploadTip: '',
      // -------------------
      uploadURL: '',
      withCredentials: false,
      // onFileChange: '',
    },
    type: 'm-picture-upload',
  },

  {
    formItemFlag: true,
    icon: 'file-upload-field',
    options: {
      // headers: [],
      // -------------------
      customClass: '', // 自定义css类名
      customRule: '',
      customRuleHint: '',
      disabled: false,
      fileMaxSize: 5, // MB
      fileTypes: ['doc', 'docx', 'xls', 'xlsx'],
      hidden: false,
      label: '',

      labelAlign: '',
      labelHidden: false,
      //labelIconClass: null,
      labelIconPosition: 'rear',
      labelTooltip: null,
      labelWidth: null,
      limit: 3,
      multipleSelect: false,
      name: '',
      onBeforeUpload: '',
      // -------------------
      onCreated: '',
      onFileRemove: '',
      onMounted: '',
      onUploadError: '',
      onUploadSuccess: '',
      onValidate: '',
      required: false,
      requiredHint: '',
      uploadButtonText: '',
      uploadTip: '',
      // -------------------
      uploadURL: '',
      withCredentials: false,
      // onFileChange: '',
    },
    type: 'm-file-upload',
  },

  {
    formItemFlag: true,
    icon: 'cascader-field',
    options: {
      childrenKey: 'children',
      clearable: true,
      // -------------------
      customClass: '', // 自定义css类名
      customRule: '',
      customRuleHint: '',
      defaultValue: [],
      disabled: false,
      dsEnabled: false, // 是否使用数据源数据

      dsName: '', // 数据源名称
      hidden: false,
      label: '',
      labelAlign: '',
      labelHidden: false,
      //labelIconClass: null,
      labelIconPosition: 'rear',
      labelKey: 'label',
      labelTooltip: null,
      labelWidth: null,
      multiple: false,
      name: '',
      onChange: '',
      // -------------------
      onCreated: '',
      onMounted: '',
      onValidate: '',
      optionItems: [
        { children: [{ label: 'child 1', value: 11 }], label: 'select 1', value: 1 },
        { label: 'select 2', value: 2 },
        { label: 'select 3', value: 3 },
      ],
      placeholder: '',
      readonly: false,
      required: false,
      requiredHint: '',
      size: '',
      valueKey: 'value',
    },
    type: 'm-cascader',
  },
  {
    formItemFlag: false,
    icon: 'slot-field',
    options: {
      customClass: '', // 自定义css类名
      label: '',
      name: '',
    },
    type: 'm-slot',
  },
];

export const customFields = [];

export function addContainerWidgetSchema(containerSchema) {
  containers.push(containerSchema);
}

export function addBasicFieldSchema(fieldSchema) {
  basicFields.push(fieldSchema);
}

export function addAdvancedFieldSchema(fieldSchema) {
  advancedFields.push(fieldSchema);
}

export function addCustomWidgetSchema(widgetSchema) {
  customFields.push(widgetSchema);
}
