## HandleSetTable Table 操作按钮

---

## API

### HandleSetTable

| 参数      | 说明         | 类型                                | 默认值 |
| --------- | ------------ | ----------------------------------- | ------ |
| formItems | 按钮参数对象 | <a href="#formItems">formType[]</a> | -      |

### <a id="formItems">formItems</a>

#### 组件默认 type `del` `send` `up` `down`，会展示二次弹框确认

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 类型 `text button`，与权限相关映射`@/common/roleConstant` 文件 | string | button |
| auth | 按钮权限配置`any | true`，auth 默认 false/不存在 情况使用`type`做权限校验 | `string | boolean` | false |
| title | `可选` 按钮显示文字，配置则优先显示，不配置则权限相关从 `ROLE_BUTTON_TYPE` 映射 | string | 按钮 |
| pop | 是否配置二次弹框确认 | boolean | false |
| click | 按钮点击事件，若 `pop` 为 true 则为弹窗确认事件 | function | - |
| popText | 二次弹框显示的提示内容 | string | `确认${title}？` |
| visible | 是否展示 | boolean | true |

## 更新日志

- ### 2021 年 2 月 22 日 17:44:02 Dong

组件重构

> - 移除 type `own` 类型，使用 `title` 直接显示配置按钮文案
>   > - 会影响原本使用`own`做配置 自定义标题的地方
> - 方法重写
