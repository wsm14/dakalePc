import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import { TABINDEX_VANE_TYPE } from '@/common/constant';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';

const CityDrawerSet = (props) => {
  const { visible, onClose, dispatch, loading, childRef, tabKey, version } = props;
  const { show = false, type = 'add', detail = { areaType: 'all' } } = visible;
  const [form] = Form.useForm();
  const [areaType, setAreaType] = useState();

  //保存
  const handleSave = () => {
    form.validateFields().then((values) => {
      const { areaCode, defaultTags = [], tags = [], ...ohter } = values;
      dispatch({
        type: 'walkingManage/fetchGetWindVaneManagementAdd',
        payload: {
          ...ohter,
          userOs: tabKey,
          version: version,
          areaCode: areaCode && areaCode[1],
          flag: {
            add: 'addCity',
            edit: 'updateTag',
          }[type],
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };
  const modalProps = {
    visible: show,
    title: type === 'edit' ? '编辑' : '新增',
    onClose,
    afterCallBack: () => {
      setAreaType(detail.areaType);
    },
    footer: (
      <Button
        type="primary"
        onClick={handleSave}
        loading={loading.effects['walkingManage/fetchGetWindVaneManagementAdd']}
      >
        保存
      </Button>
    ),
  };

  const formItems = [
    {
      label: '城市类型',
      name: 'areaType',
      type: 'radio',
      select: TABINDEX_VANE_TYPE,
      onChange: (val) => {
        setAreaType(val.target.value);
      },
    },
    {
      label: '城市',
      name: 'areaCode',
      type: 'cascader',
      cityType: 'city',
      visible: areaType === 'city',
    },
  ];

  return (
    <DrawerCondition {...modalProps}>
      <FormComponents form={form} formItems={formItems} initialValues={detail}></FormComponents>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading,
}))(CityDrawerSet);
