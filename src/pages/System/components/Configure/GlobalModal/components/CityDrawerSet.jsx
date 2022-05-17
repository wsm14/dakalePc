import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import { TABINDEX_VIDEO_TYPE } from '@/common/constant';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';

const CityDrawerSet = (props) => {
  const { visible, onClose, dispatch, loading, childRef, tabKey, version } = props;
  const { show = false, type = 'add', detail = { area: 'all' } } = visible;
  const [form] = Form.useForm();
  const [areaType, setAreaType] = useState();

  //保存
  const handleSave = () => {
    form.validateFields().then((values) => {
      const { cityCode, defaultTags = [], tags = [], ...other } = values;
      dispatch({
        type: 'marketConfigure/fetchGlobalPopUpAdd',
        payload: {
          ...other,
          userOs: tabKey,
          version: version,
          cityCode: cityCode && cityCode[1],
          flag: 'addCity',
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
      setAreaType(detail.area);
    },
    footer: (
      <Button
        type="primary"
        onClick={handleSave}
        loading={loading.effects['marketConfigure/fetchGlobalPopUpAdd']}
      >
        保存
      </Button>
    ),
  };

  const formItems = [
    {
      label: '城市类型',
      name: 'area',
      type: 'radio',
      select: TABINDEX_VIDEO_TYPE,
      onChange: (val) => {
        setAreaType(val.target.value);
      },
    },
    {
      label: '城市',
      name: 'cityCode',
      type: 'cascader',
      cityType: 'city',
      visible: areaType === 'detail',
    },
  ];

  return (
    <DrawerCondition {...modalProps}>
      <FormComponents form={form} formItems={formItems} initialValues={detail}></FormComponents>
    </DrawerCondition>
  );
};

export default connect(({ loading, globalConfig }) => ({
  loading: loading,
}))(CityDrawerSet);
