<template>
  <view class="uni-container">
    <view v-if="!hasLeftWin" class="uni-header-logo">
      <image class="uni-header-image" src="/static/logo.png" @click="clickIcon" />
    </view>
    <view v-if="!hasLeftWin" class="uni-hello-text">
      <text class="hello-text">vform mobile，展示样式仅供参考，文档详见：</text>
      <uni-link class="hello-link" :href="'https://www.yuque.com/vform-mobile/doc/'" :text="'https://www.yuque.com/vform-mobile/doc/'" :in-white-list="true" />
    </view>
    <view v-for="(item, index) in list" :key="item.id" class="uni-panel">
      <view v-if="item.id !== 'debug' || clickNum == 10" class="uni-panel-h" :class="item.open ? 'uni-panel-h-on' : ''" @click="triggerCollapse(index, item.id)">
        <text class="uni-panel-text">{{ item.name }}</text>
        <text class="uni-panel-icon uni-icon" :class="item.open ? 'uni-panel-icon-on' : ''">{{ item.pages ? '&#xe581;' : '&#xe470;' }}</text>
      </view>
      <view v-if="item.open" class="uni-panel-c">
        <view v-for="(item2, key) in item.pages" :key="key" :class="{ 'left-win-active': leftWinActive === (item2.url ? item2.url.split('/')[3] : item2) && hasLeftWin }" class="uni-navigate-item" @click="goDetailPage(item.id, item2)">
          <text class="uni-navigate-text">{{ item2.name ? item2.name : item2 }}</text>
          <text class="uni-navigate-icon uni-icon">&#xe470;</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    hasLeftWin: {
      type: Boolean,
    },
    leftWinActive: {
      type: String,
    },
  },
  data() {
    return {
      clickNum: 0,
      list: [
        {
          id: 'demo',
          name: '示例',
          open: false,
          pages: [
            { name: '单列表单', url: '/pages/demo/template/index?widget=single' },
            { name: '多列表单', url: '/pages/demo/template/index?widget=muilti' },
            { name: '折叠表单', url: '/pages/demo/template/index?widget=collapse' },
            { name: '标签页表单', url: '/pages/demo/template/index?widget=tab' },
            { name: '主从表单', url: '/pages/demo/template/index?widget=subform' },
            { name: '问卷调查表单', url: '/pages/demo/template/index?widget=ques' },
          ],
        },
        {
          id: 'view',
          name: '渲染器',
          open: false,
          pages: [
            { name: '渲染器属性', url: '/pages/demo/vformRender/props' },
            { name: '表单事件', url: '/pages/demo/vformRender/formEvents' },
            { name: '表单操作', url: '/pages/demo/vformRender/formActions' },
          ],
        },
        {
          id: 'content',
          name: '容器组件',
          open: false,
          pages: [
            { name: '分组', url: '/pages/demo/containers/index?widget=group' },
            { name: '栅格', url: '/pages/demo/containers/index?widget=grid' },
            { name: '标签页', url: '/pages/demo/containers/index?widget=tab' },
            { name: '子表单', url: '/pages/demo/containers/index?widget=subform' },
            { name: '折叠面板', url: '/pages/demo/containers/index?widget=collapse' },
          ],
        },
        {
          id: 'form',
          name: '表单组件',
          open: false,
          pages: [
            { name: 'input', url: '/pages/demo/widgets/index?widget=input' },
            { name: 'textarea', url: '/pages/demo/widgets/index?widget=textarea' },
            { name: 'number', url: '/pages/demo/widgets/index?widget=number' },
            { name: 'stepper', url: '/pages/demo/widgets/index?widget=stepper' },
            { name: 'radio', url: '/pages/demo/widgets/index?widget=radio' },
            { name: 'checkbox', url: '/pages/demo/widgets/index?widget=checkbox' },
            { name: 'select', url: '/pages/demo/widgets/index?widget=select' },
            { name: 'calendar', url: '/pages/demo/widgets/index?widget=calendar' },
            { name: 'date', url: '/pages/demo/widgets/index?widget=date' },
            { name: 'datetime', url: '/pages/demo/widgets/index?widget=datetime' },
            { name: 'daterange', url: '/pages/demo/widgets/index?widget=daterange' },
            { name: 'time', url: '/pages/demo/widgets/index?widget=time' },
            { name: 'switch', url: '/pages/demo/widgets/index?widget=switcher' }, // 避免关键字重复，使用swithcer
            { name: 'rate', url: '/pages/demo/widgets/index?widget=rate' },
            { name: 'slider', url: '/pages/demo/widgets/index?widget=slider' },
            { name: 'statictext', url: '/pages/demo/widgets/index?widget=statictext' },
            { name: 'htmltext', url: '/pages/demo/widgets/index?widget=htmltext' },
            { name: 'button', url: '/pages/demo/widgets/index?widget=vbutton' },
            { name: 'divider', url: '/pages/demo/widgets/index?widget=divider' },
            { name: 'pictureupload', url: '/pages/demo/widgets/index?widget=pictureupload' },
            { name: 'fileupload', url: '/pages/demo/widgets/index?widget=fileupload' },
            { name: 'cascader', url: '/pages/demo/widgets/index?widget=cascader' },
            { name: 'slot', url: '/pages/demo/widgets/index?widget=slot' },
            { name: 'alert', url: '/pages/demo/widgets/index?widget=alert' },
          ],
        },
        {
          id: 'custom',
          name: '自定义',
          open: false,
          pages: [{ name: '自定义json', url: '/pages/demo/json/index' }],
        },
        {
          id: 'debug',
          name: '调试',
          open: false,
          pages: [{ name: 'debug', url: '/pages/index/debug' }],
        },
      ],
    }
  },
  onShareAppMessage() {
    return {
      title: '欢迎体验uni-app',
      path: '/pages/tabBar/component/component',
    }
  },
  onNavigationBarButtonTap(e) {
    uni.navigateTo({
      url: '/pages/about/about',
    })
  },
  // #ifdef H5
  watch: {
    $route: {
      immediate: true,
      handler(newRoute) {
        if (newRoute.matched.length) {
          let path = newRoute.path.split('/')[3]
          for (const item of this.list) {
            if (Array.isArray(item.pages)) {
              for (const page of item.pages) {
                if (page === path || (page.url && page.url === newRoute.path)) {
                  item.open = true
                }
              }
            }
          }
        }
      },
    },
  },
  // #endif
  methods: {
    clickIcon() {
      this.clickNum++
      if (this.clickNum > 10) {
        this.clickNum = 0
      }
    },

    triggerCollapse(e, id) {
      if (!this.list[e].pages) {
        this.goDetailPage('', this.list[e].url)
        return
      }
      for (var i = 0; i < this.list.length; ++i) {
        if (e === i) {
          this.list[i].open = !this.list[i].open
        } else {
          this.list[i].open = false
        }
      }
    },
    goDetailPage(panel, e) {
      if (typeof e === 'string') {
        const url = '/pages/component/' + e + '/' + e
        if (this.hasLeftWin) {
          uni.reLaunch({
            url: url,
          })
        } else {
          uni.navigateTo({
            url: url,
          })
        }
      } else {
        if (this.hasLeftWin) {
          uni.reLaunch({
            url: e.url,
          })
        } else {
          uni.navigateTo({
            url: e.url,
          })
        }
      }
    },
  },
}
</script>
