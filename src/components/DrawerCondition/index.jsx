import React, { useState } from 'react';
import { Drawer, Space, Skeleton, Button } from 'antd';

/**
 * 单纯的Drawer组件 Drawer + Skeleton 合并封装
 * 2021年1月14日 11:54:40
 * @visible 显示状态
 * @width 宽度 默认650
 * @onClose 关闭方法
 * @title 标题
 * @loading 额外Skeleton loading
 * @footer 底部按钮组
 * @afterCallBack 打开Drawer后回调函数
 * @children react 默认最高级传递组件
 */
const DrawerCondition = (props) => {
  const { visible, width = 650, onClose, title, loading, footer, afterCallBack, children } = props;

  // 骨架框显示
  const [skeletonType, setSkeletonType] = useState(true);

  const modalProps = {
    title,
    width,
    visible,
    onClose,
    maskClosable: true,
    destroyOnClose: true,
    bodyStyle: { paddingBottom: 80 },
    afterVisibleChange: (showEdit) => {
      if (showEdit) {
        setSkeletonType(false);
        afterCallBack && afterCallBack();
      } else {
        setSkeletonType(true);
      }
    },
  };

  // 检查底部按钮组个数
  const footerCheck = () => {
    const { children: cfooter = [] } = footer.props;
    let footerBlock = [cfooter];
    // 数组情况下为多个按钮
    if (Array.isArray(cfooter)) {
      footerBlock = cfooter;
    }
    // 根据按钮个数显示骨架框个数
    const sbutton = footerBlock.map((item, i) => <Skeleton.Button active key={i} />);
    return skeletonType || loading ? sbutton : footer;
  };

  return (
    <Drawer
      {...modalProps}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            {footer && footerCheck()}
          </Space>
        </div>
      }
    >
      <Skeleton loading={skeletonType || loading} active>
        {children}
      </Skeleton>
    </Drawer>
  );
};

export default DrawerCondition;
