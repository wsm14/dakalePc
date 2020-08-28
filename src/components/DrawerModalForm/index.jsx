import React from 'react';
import { connect } from 'umi';
import { Drawer, Modal, Button, Space, Form } from 'antd';
import DescriptionsCondition from '../DescriptionsCondition';
import FormCondition from '../FormCondition';

/**
 *
 * form 弹窗表单结构
 * 2020年8月4日 11:40:01 Dong
 * 2020年8月13日 10:47:55 Dong
 *
 * @type  弹窗类型 Drawer / Modal
 * @showType  表单类型 info / form
 * @title 弹窗标题
 * @width 弹窗宽度
 * @visible 弹窗显示隐藏
 * @formItems form表单内容
 * @okText 确认按钮文字
 * @cancelText 取消按钮文字
 * @initialValues form表单参数默认值
 * @imgFileList upload默认参数
 * @loadingModels 请求监听的model名
 * @maskClosable 点击蒙版是否关闭
 * @footerShow 底部额外按钮显示隐藏
 * @footerBtn 底部额外按钮数组方法 返回loading
 * @onFinish 确认提交参数方法
 * @onClose 关闭弹窗方法
 *
 */

const DrawerModalForm = ({
  dispatch,
  type = 'Drawer',
  showType = 'form',
  title = '标题',
  width = 560,
  visible = false,
  formItems = [],
  okText = '确认',
  cancelText = '取消',
  initialValues = [],
  imgFileList = [],
  loadingModels,
  loading,
  maskClosable = true,
  footerShow = true,
  footerBtn = () => [],
  onFinish = () => {},
  onClose,
}) => {
  const [form] = Form.useForm();

  const loadings = loading.models[loadingModels];

  // 弹出层统一配置
  const modalProps = {
    title,
    width,
    visible,
    maskClosable,
    destroyOnClose: true,
  };

  // 关闭窗口
  const handleClose = () => dispatch({ type: 'drawerForm/close' });

  // 确认提交
  const handleFinish = () =>
    form.validateFields().then((values) => {
      onFinish(values);
    });

  // 获取表单展示形式
  const getInfoShow = {
    form: (
      <FormCondition
        imgFileList={imgFileList}
        initialValues={initialValues}
        formItems={formItems}
        form={form}
      ></FormCondition>
    ),
    info: <DescriptionsCondition formItems={formItems} initialValues={initialValues} />,
  }[showType];

  // 获取窗口类型
  const getDefineMoudle = {
    Drawer: (
      <Drawer
        {...modalProps}
        onClose={onClose || handleClose}
        bodyStyle={{ paddingBottom: 80 }}
        zIndex={1005}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={onClose || handleClose}>{cancelText}</Button>
              {footerShow &&
                {
                  false: (
                    <Button onClick={handleFinish} type="primary" loading={loadings}>
                      {okText}
                    </Button>
                  ),
                  true: footerBtn(loadings)
                    .filter((item) => {
                      if (item && item.btn) {
                        const { visible = true, btn } = item;
                        if (visible) return btn;
                        else return false;
                      } else return item;
                    })
                    .map((item) => {
                      if (item && item.btn) {
                        return item.btn;
                      } else return item;
                    }),
                  null: '',
                }[!!footerBtn().length]}
            </Space>
          </div>
        }
      >
        {getInfoShow}
      </Drawer>
    ),
    Modal: (
      <Modal
        {...modalProps}
        okText={okText}
        onOk={handleFinish}
        onCancel={onClose || handleClose}
        confirmLoading={loadings}
      >
        {getInfoShow}
      </Modal>
    ),
  }[type];

  return getDefineMoudle;
};

export default connect(({ drawerForm, loading }) => ({
  ...drawerForm,
  loading,
}))(DrawerModalForm);
