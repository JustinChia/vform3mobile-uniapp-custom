## VForm Mobile Uniapp渲染器(vmform-uniapp)

### 介绍

vmform-uniapp是 vform mobile 低代码表单的uniapp渲染器，使用uniapp组件库和扩展组件库，支持vue2和vue3。它可以在小程序、h5、app平台上直接渲染 vmform 的json格式。无需使用webview。

### 功能特点

- **支持Vue2和Vue3**：vmform-uniapp支持两种Vue版本，使得您可以根据项目需求灵活选择。
- **多平台支持**：vmform-uniapp可以在小程序、h5、app等平台上运行，使您的应用程序具有更广泛的覆盖面。
- **易于使用**：vmform-uniapp兼容大部分vmform的API 和属性，使您能够轻松集成到现有项目中。


### 应用场景
需要直接渲染表单，而不使用webview的情况。

### 如何获得
无需单独购买，随vform mobile版一起发布。

**[订阅vform mobile](https://www.yuque.com/vform-mobile/doc/subscribe "订阅vform mobile")**

### 演示地址
`演示项目中，上传的图片和文件未实际保存到服务器，请放心使用。`

H5：https://demo.vmform.srvcloud.cn/

APP(android)： https://demo.vmform.srvcloud.cn/vmform-uniapp-demo.apk

微信小程序：

![image](https://github.com/vformteam/variant-form-mobile-uniapp/assets/15101959/7264d259-a8cb-4c21-83bb-3bfe2fa82261)




### 如何使用
1. 下载本项目(含示例和vmform-uniapp)
2. 将uni_modules中的组件复制到目标项目中(vmform-uniapp和依赖组件)
3. 合并项目文件
   - package.json: 把依赖复制过去，并使用npm install 安装。
	主要有两个：momentjs 和 @vue/composition-api（vue2项目需要安装）
  - pages.json: 在目标项目pages.json文件里配置easycom(参考示例项目)
  - global.scss 复制文件到 项目的styles目录，如果有冲突可以仅复制里面的样式
4. 在main.js 中引入vmformComponent 并注册
``` js
import App from './App'
import vmformComponent from "@/uni_modules/vmform-uni/components/vmform-uni/form-widget/wxComponent.vue";
// import 'default-passive-events' 消除chrome控制台警告
// #ifndef VUE3
import './composition-api'
import Vue from 'vue'
Vue.component('vmformComponent', vmformComponent)

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'


export function createApp() {
  const app = createSSRApp(App)
  app.component('vmformComponent', vmformComponent)
  return {
    app
  }
}
// #endif

```
5. 在页面中使用渲染器
``` VUE
<vm-form-render ref="vmFormRenderRef" :form-json="data.formJson" :form-data="{}" :globalDsv="data.globalDsv">
  <template #mslot54180>
    <view>mslot54180 自定义插槽</view>
  </template>
</vm-form-render>
```



### 注意事项
1.  使用受限
  > 由于微信小程序不允许执行动态脚本，因此无法执行自定义函数和自定义样式，逻辑交互需要写在uniapp中，大部分API和属性都得到了支持，请参考兼容性列表(待整理)。
  
2.  事件机制
>  事件改用uni.$emit / uni.$on 方式。
您可以在项目中通过监听 `on事件名` 或 `组件名_on事件名` 来响应事件。
例如：onChange 或 input66666_onChange，事件的参数都是一样的：
``` js
{
	formRef: 表单引用
	widgetRef: 组件引用
	triggerName: 组件名称,
	triggerField: 组件的json配置,
	eventName: 事件名称
}
```
3. 上传文件组件
> 由于uni-file-picker 缺少部分功能，需要在uni-file-picker.vue中添加部分代码。<br>
**选择文件后，如果文件超出限制大小，把文件从上传列表中删除需要添加如下代码。需要在uni-file-picker组件中添加以下代码：**
```js
/**
* 删除文件
* @param {Object} index
*/
delFileByUuid(uuid) {
	let index = this.files.findIndex((item=>item.uuid===uuid))
	this.files.splice(index, 1)
	this.$nextTick(() => {
		this.setEmit()
	})
},
```

**如果需要显示上传文件进度，需要为uni-file-picker.vue组件添加以下代码 (可参考：https://ask.dcloud.net.cn/question/153368`)**

```js
setProgressByCustomUpload(progress,uuid){
	const currentFile = this.files.find(item => item.uuid == uuid)
	if (currentFile) {
		currentFile.progress = progress
	}
},
```

### 第三方插件
vmform-uniapp除了使用uniapp组件和扩展组件外，也使用了部分插件市场的组件，请遵守组件的开源协议，插件问题请与原作者联系。

| 名称  | 协议 | 说明 |
| ------------ | ------------ | ------------ |
| [zb-tab ](https://ext.dcloud.net.cn/search?q=zb-tab "zb-tab ") |  MIT |  Tab 标签页 选项卡组件  |
| [mp-html ](https://ext.dcloud.net.cn/plugin?id=805 "mp-html ") |  MIT  | 富文本组件 |
| [reion-slider](https://ext.dcloud.net.cn/plugin?id=5093 "reion-slider")  |  MIT  | 双向滑动条 |


### 联系方式
订阅咨询:

<img src="https://github.com/vformteam/variant-form-mobile-uniapp/assets/15101959/03c2cedf-3ba3-4387-8eff-b6423e0a96fb" width="240px">


如有问题或需要进一步帮助，也可以请通过以下方式联系我们：

论坛：

http://pay.chat.vform666.com/

GitHub(私有仓库，订阅后加入)：

https://github.com/vformteam/variant-form-mobile-uniapp 


### 感谢您的关注和使用vform系列产品！
