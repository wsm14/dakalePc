import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';
import { GROUP_RULE, GROUP_RULE_WIN } from '@/common/constant';

const GroupRule = (props) => {
  const { visible, onClose, childRef, dispatch, onCloseF } = props;
  const { show = false, togetherGroupConfigList = [] } = visible;

  const [form] = Form.useForm();
  const formItems = [
    {
      label: '成团人数',
      name: ['togetherGroupRuleObject', 'totalUserNum'],
      type: 'radio',
      select: GROUP_RULE,
      onChange: (e) => {
        form.setFieldsValue({
          togetherGroupRuleObject: {
            winUserNum: GROUP_RULE_WIN[e.target.value],
          },
        });
      },
    },
    {
      label: '团中人数',
      name: ['togetherGroupRuleObject', 'winUserNum'],
      hidden: true,
    },
  ];

  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log(values);
      const { togetherGroupRuleObject = {} } = values;
      dispatch({
        type: 'groupGoods/fetchSaveTogetherGroupConfig',
        payload: {
          togetherGroupConfigList,
          togetherGroupRuleObject: {
            totalUserNum: Number(togetherGroupRuleObject.totalUserNum),
            winUserNum: Number(togetherGroupRuleObject.winUserNum),
          },
        },
        callback: () => {
          onClose();
          onCloseF();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const madleProps = {
    title: '选择成团人数',
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={handleSave}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...madleProps}>
      <FormComponents form={form} formItems={formItems}></FormComponents>
    </DrawerCondition>
  );
};

export default connect()(GroupRule);
