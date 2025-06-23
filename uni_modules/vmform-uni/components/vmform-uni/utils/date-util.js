import moment from 'moment'

export function formatDateTo(strValue, format, toFormat) {
  if (!strValue) {
    return null
  }
  return moment(strValue, formatToUpper(format) || 'YYYY-MM-DD').format(toFormat || format)
}

/// 把element-ui的yyyy-MM-dd 改成都是大写
export function formatToUpper(format) {
  return format.replace(/(yyyy|dd)/g, match => match.toUpperCase())
}
