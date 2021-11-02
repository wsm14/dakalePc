import React, { useState, useMemo } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';

const ConfigureFrawerSet = (props) => {
  const { visible, onClose, dispatch, loading, childRef } = props;
  const { show = false, type = 'add', detail = { type: 'bean' } } = visible;
  const [form] = Form.useForm();
  const [prizeType, setPrizeType] = useState();

  //保存
  const handleSave = () => {
    form.validateFields().then(async (values) => {
      const { winningImg, prizeImg, isParticipate, ...ohter } = values;
      // 上传图片到oss -> 提交表单
      const winningImgList = await aliOssUpload(winningImg);
      const prizeImgList = await aliOssUpload(prizeImg);

      dispatch({
        type: { add: 'prizeConfig/fetchBlindBoxAdd', edit: 'prizeConfig/fetchBlindBoxEdit' }[type],
        payload: {
          ...ohter,
          winningImg: winningImgList.toString(),
          prizeImg: prizeImgList.toString(),
          isParticipate: isParticipate ? Number(isParticipate) : 0,
          id: detail?.id,
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
      setPrizeType(detail.type);
    },
    footer: (
      <Button
        type="primary"
        onClick={handleSave}
        loading={
          loading.effects['prizeConfig/fetchBlindBoxAdd'] ||
          loading.effects['prizeConfig/fetchBlindBoxEdit']
        }
      >
        保存
      </Button>
    ),
  };
  const formItems = useMemo(
    () => [
      {
        label: '奖励类型',
        name: 'type',
        type: 'radio',
        select: { bean: '卡豆', commerce: '电商商品' },
        disabled: type === 'edit',
        onChange: (val) => {
          form.setFieldsValue({ prize: '', showName: '' });
          setPrizeType(val.target.value);
        },
      },
      {
        label: '商品名称',
        name: type === 'add' ? 'prize' : 'showName',
        disabled: type === 'edit',
        visible: prizeType === 'commerce',
      },
      {
        label: '卡豆数',
        name: 'prize',
        type: 'number',
        suffix: '卡豆',
        disabled: type === 'edit',
        visible: prizeType === 'bean',
      },
      {
        label: '盲盒展示名称',
        name: 'showName',
        visible: type === 'edit',
      },
      {
        label: '中奖图',
        type: 'upload',
        name: 'winningImg',
        maxFile: 1,
      },
      {
        label: '奖品图',
        type: 'upload',
        name: 'prizeImg',
        maxFile: 1,
      },
      {
        label: '是否真实奖品',
        name: 'isParticipate',
        type: 'switch',
      },
    ],
    [type, prizeType],
  );
  return (
    <DrawerCondition {...modalProps}>
      <FormComponents form={form} formItems={formItems} initialValues={detail}></FormComponents>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({ loading }))(ConfigureFrawerSet);
