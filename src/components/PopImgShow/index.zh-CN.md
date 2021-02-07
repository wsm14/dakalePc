## 图片展示组件

----

### 涉及 antd 组件文档

- [Drawer 抽屉](https://ant.design/components/popover-cn/)
  

### API

| 参数    | 说明         | 类型     | 默认值 |
| ------- | ------------ | -------- | ------ |
| url     | 图片Url `必填`     | string   | -      |
| onClick | 图片点击事件 `可选` | function | -      |


### onClick，图片点击事件存在处理方式eg：

```
    <>
      {onClick ? (
        imgDiv
      ) : url ? (
        <Popover placement="right" content={<img src={url} alt="" style={{ maxWidth: 400 }} />}>
          {imgDiv}
        </Popover>
      ) : (
        ''
      )}
    </>
```
