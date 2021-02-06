## 操作按钮组件,Table操作按钮配置

-----
 
 ### 涉及到的组件
- [ AuthConsumer ](@/layouts/AuthConsumer) 页面内组件位置 `@/layouts/AuthConsumer`
  

 ## API

 | 参数                               | 说明         | 类型      | 默认值 |
 | ---------------------------------- | ------------ | --------- | ------ |
 | <a href="#formItems">formItems</a> | 按钮参数对象 | Object [] | -      |


 ### <a id="formItems">formItems</a>


  | 参数    | 说明                                                                                                                       | 类型               | 默认值             |
  | ------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------ |
  | type    | 类型， 比如`info, edit`等                                                                                                  | string             | -                  |
  | auth    | 按钮权限配置`info, edit | true` auth没有值的时候，默认 `auth = auth || type`等                                             | `string | boolean` | -                  |
  | title   | 按钮显示值 `可选，没有内容可以从 ROLE_BUTTON_TYPE文件映射title, title | btnText = ROLE_BUTTON_TYPE[type]`  btnText===title | `string `          | -                  |
  | click   | 按钮点击事件                                                                                                               | function           | -                  |
  | popText | 二次弹框显示的提示内容                                                                                                     | string             | `确认${btnText}？` |
  | visible | 是否展示                                                                                                                   | boolean            | true               |
  
  

  ### 组件默认 `'del', 'send', 'up', 'down'`,会展示二次弹框确认


- ### 2021-2-06