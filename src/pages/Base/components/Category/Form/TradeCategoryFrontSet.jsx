import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { TRADESET_SELECT } from '@/common/constant';
import FormCondition from '@/components/FormCondition';
import TradeCategorySelect from './TradeCategorySelect';
import DrawerCondition from '@/components/DrawerCondition';
import { TreeSelectFn } from '@/utils/utils';
import aliOssUpload from '@/utils/aliOssUpload';

const TradeCategoryFrontSet = (props) => {
  const { dispatch, childRef, visible, onClose, loading, list } = props;
  const [checkType, setCheckType] = useState(); //关联后台类目
  const [selectList, setSelectList] = useState([]);

  const [form] = Form.useForm();
  const { show = false, status = 'add', detail = {} } = visible;
  const { ranking, type } = detail;
  // 提交表单
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      const { isDelete, picUrl, ...other } = values;
      const sImg = await aliOssUpload(picUrl);
      dispatch({
        type: { add: 'Category/fetchFrontCategoryAdd', edit: 'Category/fetchFrontCategoryEdit' }[
          status
        ],
        payload: {
          ...detail,
          ...other,
          isDelete: isDelete ? (isDelete == 1 ? 0 : 1) : 1,
          picUrl: sImg.toString(),
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '父级类目',
      name: 'parentName',
      visible: ['second', 'third'].includes(ranking),
      disabled: true,
    },
    {
      label: '一级类目名称',
      name: 'classifyName',
      visible: ranking === 'first',
      maxLength: 20,
    },
    {
      label: '二级类目名称',
      visible: ranking === 'second',
      name: 'classifyName',
      maxLength: 20,
    },
    {
      label: '三级类目名称',
      visible: ranking === 'third',
      name: 'classifyName',
      maxLength: 20,
    },
    {
      label: '类目图片',
      name: 'picUrl',
      type: 'upload',
      maxFile: 1,
      required: false,
      rules: [{ required: false }],
    },
    {
      label: '权重',
      name: 'sortValue',
    },
    {
      label: '关联后台类目',
      name: 'type',
      type: 'radio',
      visible: ranking !== 'first',
      select: TRADESET_SELECT,
      onChange: (e) => {
        setCheckType(e.target.value);
      },
    },
    {
      label: 'H5地址',
      name: 'clickPicUrl',
      visible: checkType === 'h5' && ranking !== 'first',
    },
    {
      label: '关联后台项目',
      type: 'formItem',
      name: 'classifyIdTagList',
      formItem: (
        <TradeCategorySelect
          form={form}
          list={selectList}
          checkType={checkType}
        ></TradeCategorySelect>
      ),
      required: true,
      visible: checkType === 'behind' && ranking !== 'first',
    },
    {
      label: '状态',
      name: 'isDelete',
      type: 'switch',
      required: true,
    },
  ];

  // 弹出窗属性
  const modalProps = {
    title: `${status === 'add' ? '新增类目' : '编辑类目'}`,
    visible: show,
    onClose,
    afterCallBack: () => {
      setCheckType(type);
      setSelectList(
        TreeSelectFn(list.list, 'classifyName', 'classifyId', 'classifyId', 'childList'),
      );
    },
    footer: (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
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

export default connect(({ Category, loading }) => ({
  list: Category.list,
  loading:
    loading.effects['Category/fetchFrontCategoryAdd'] ||
    loading.effects['Category/fetchFrontCategoryEdit'],
}))(TradeCategoryFrontSet);
