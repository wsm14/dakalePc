## EditorForm 富文本组件

---

富文本组件 [wangeditor v4](https://doc.wangeditor.com/) 二次封装

## API

### EditorForm

| 参数         | 说明                                      | 类型                 | 默认值 |
| ------------ | ----------------------------------------- | -------------------- | ------ |
| content      | 初始化富文本内容                          | string               | -      |
| contentClass | 富文本编辑区域类名                        | string               | -      |
| editClass    | 富文本外层容器的类名                      | string               | -      |
| editCallback | 富文本内容修改回调                        | function(html, text) | -      |
| maxLength    | 可输入文本最大长度 `计算text实际输入内容` | string               | -      |
| maxImgSize   | 单张图片大小限制 `单位 MB`                | number               | 1      |

## 更新日志

- ### 2021 年 2 月 7 日 12:43:04 Dong

组件重构

> - `editCallback` 替换 `setContent`
> - 升级依赖包 `3.1.1` 至 `4.6.6`
>   > - `editor.customConfig` 改为 `editor.config`
>   > - `maxImgSize` 参数配置计算由 单位 `kb`变更为 `mb`
>   > - `4.6.6` 支持自定义视频上传，暂未封装 [文档参考](https://doc.wangeditor.com/pages/07-%E4%B8%8A%E4%BC%A0%E8%A7%86%E9%A2%91/14-%E4%B8%8A%E4%BC%A0%E8%87%B3%E9%98%BF%E9%87%8C%E4%BA%91OSS.html)
> - 组件内方法重写，注释添加。
>   > - 自定义方法配置统一提取
>   > - 菜单配置 `editor.config.menu`(当前显示项) 配置改为 `editor.config.excludeMenus` (当前隐藏项) [所有可配置菜单](https://doc.wangeditor.com/pages/03-%E9%85%8D%E7%BD%AE%E8%8F%9C%E5%8D%95/01-%E8%87%AA%E5%AE%9A%E4%B9%89%E8%8F%9C%E5%8D%95.html)
