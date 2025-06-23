const message = {}

;['success', 'warning', 'primary', 'info', 'error'].forEach(type => {
  message[type] = options => {
    if (typeof options === 'string') {
      options = {
        title: options,
        icon: 'none',
      }
    } else {
      options = {
        icon: type.replace('warning', 'error').replace('primary', 'none').replace('info', 'none'),
        title: options ? options.title || '提示' : '提示',
        duration: options ? options.duration || 2000 : 2000,
      }
    }
    options.type = type.replace('warning', 'error').replace('primary', 'none').replace('info', 'none')
    uni.showToast(options)
  }
})

export const $message = message
