import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import CITYJSON from '@/common/city';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const ManageCitySet = (props) => {
  const { dispatch, childRef, visible, onClose, loading } = props;
  const { show = false, initialValues = { provinceCode: '33', provinceName: '浙江省' } } = visible;

  const [form] = Form.useForm();
  const cityList = CITYJSON.filter((item) => item.value === initialValues.provinceCode)[0].children;
  // 新增
  const fetchCityManageSet = () => {
    form.validateFields().then((values) => {
      const { backgroundImg, cityCode } = values;
      aliOssUpload(backgroundImg).then((res) => {
        dispatch({
          type: 'manageCity/fetchCityManageSet',
          payload: {
            ...initialValues,
            ...values,
            cityName: cityList.filter((i) => i.value === cityCode)[0].label,
            backgroundImg: res.toString(),
          },
          callback: () => {
            onClose();
            childRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const formItems = [
    {
      label: '城市',
      type: 'select',
      name: 'cityCode',
      select: cityList,
      fieldNames: { label: 'label' },
    },
    {
      label: '背景图',
      type: 'upload',
      name: 'backgroundImg',
      maxFile: 1,
    },
    {
      label: '城市文案',
      name: 'cityDesc',
      type: 'textArea',
      maxLength: 20,
    },
  ];
  const modalProps = {
    title: `城市设置 - ${initialValues.provinceName}`,
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={() => fetchCityManageSet()} loading={loading}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={initialValues}
      ></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.manageCity,
}))(ManageCitySet);
