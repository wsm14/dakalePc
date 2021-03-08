import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const TradeSceneSet = (props) => {
  const { visible, dispatch, loading, onClose } = props;
  const { show = false, type, detail } = visible;

  const title = { add: '新增', edit: '编辑' }[type];
  const [form] = Form.useForm()

  const handleSceneUpdate =()=>{
      form.validateFields().then(values=>{

      })

  }

  const formItems = [
      {
        label: '适用场景',
        name: 'parentName',
        maxLength: 6,
        
      },
      {
        label: '图片',
        type:'upload',
        name: 'parentName',
      }
  ]

  // 弹出窗属性
  const modalProps = {
    title: `设置 - ${title}`,
    visible: show,
    onClose,
    footer: (
      <Button onClick={handleSceneUpdate} type="primary" loading={loading}>
        提交
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading,
  //   loading.effects['sysTradeList/fetchTradeBaseSet'] ||
  //   loading.effects['sysTradeList/fetchTradeSpecialSet'],
}))(TradeSceneSet);
