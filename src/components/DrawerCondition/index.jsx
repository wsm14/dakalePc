import React, { useState } from 'react';
import { Drawer, Space, Skeleton, Button } from 'antd';

/**
 * 单纯的Drawer组件 Drawer + Skeleton 合并封装
 * 2021年1月14日 11:54:40
 * @visible 显示状态
 * @width 宽度 默认650
 * @onClose 关闭方法
 * @title 标题
 * @closeLabel 取消按钮显示值
 * @loading 额外Skeleton loading
 * @footer 底部按钮组
 * @afterCallBack 打开Drawer后回调函数
 * @closeCallBack 关闭Drawer后回调函数
 * @maskClosable 点击蒙版关闭 true false
 * @destroyOnClose 关闭Drawer销毁子组件 true false
 * @bodyStyle Drawer bodyStyle
 * @zIndex Drawer z-index配置
 * @maskShow Drawer 遮罩透明 false
 * @children react 默认最高级传递组件
 */
const DrawerCondition = (props) => {
  const {
    visible,
    width = 650,
    bodyStyle = {},
    closeLabel = '取消',
    onClose,
    title,
    loading,
    footer,
    dataPage,
    afterCallBack,
    closeCallBack,
    maskClosable = true,
    destroyOnClose = true,
    maskShow = true,
    zIndex,
    children,
  } = props;

  // 骨架框显示
  const [skeletonType, setSkeletonType] = useState(true);

  // drawer 配置 props
  const modalProps = {
    title,
    width,
    visible,
    onClose,
    maskClosable,
    destroyOnClose,
    maskStyle: maskShow ? {} : { background: 'none' },
    zIndex,
    bodyStyle: { paddingBottom: 80, ...bodyStyle },
    afterVisibleChange: (showEdit) => {
      if (showEdit) {
        setSkeletonType(false);
        afterCallBack && afterCallBack();
      } else {
        setSkeletonType(true);
        closeCallBack && closeCallBack();
      }
    },
  };

  // 检查底部按钮组个数
  const footerCheck = () => {
    const { children: dom_footer = [] } = footer.props;
    let footerBlock = [dom_footer];
    // 数组情况下为多个按钮
    if (Array.isArray(dom_footer)) {
      footerBlock = dom_footer;
    }
    // 根据按钮个数显示骨架框个数
    const some_button = footerBlock.map((item, i) => <Skeleton.Button active key={`${i + 1}`} />);
    return skeletonType || loading ? some_button : footer;
  };

  return (
    <Drawer
      {...modalProps}
      footer={
        <div style={{ display: 'flex', justifyContent: dataPage ? 'space-between' : 'center' }}>
          {dataPage && (
            <Space>
              {dataPage.total > 1 && dataPage.total !== dataPage.current + 1 && (
                <Button onClick={() => dataPage.onChange(dataPage.current + 1)}>下一条</Button>
              )}
              {dataPage.current > 0 && (
                <Button onClick={() => dataPage.onChange(dataPage.current - 1)}>上一条</Button>
              )}
              <Button onClick={onClose}>{closeLabel}</Button>
            </Space>
          )}
          <Space>
            {!dataPage && <Button onClick={onClose}>{closeLabel}</Button>}
            {footer && footerCheck()}
          </Space>
        </div>
      }
    >
      {skeletonType || loading ? (
        <Skeleton loading={skeletonType || loading} active></Skeleton>
      ) : (
        children
      )}
    </Drawer>
  );
};

export default DrawerCondition;
