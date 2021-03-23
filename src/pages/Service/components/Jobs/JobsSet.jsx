import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { EDUCATION_JSOBS_STATUS } from '@/common/constant';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const JobsSet = (props) => {
  const { dispatch, cRef, jobsClasslist, visible, onClose, loading } = props;

  const { show = false, type = 'add', detail = {} } = visible;
  const [form] = Form.useForm();

  // 获取招聘职位信息
  const fetchJobsClass = () => {
    dispatch({
      type: 'solicitJobs/fetchJobsClassList',
    });
  };

  // 提交
  const fetchGetFormData = (status) => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'solicitJobs/fetchJobsSet',
        payload: {
          talentRecruitmentId: detail.talentRecruitmentId,
          status, // 状态 0-草稿 1-已发布 2-下架
          ...values,
        },
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '职位名称',
      name: 'jobName',
    },
    {
      label: '职位类别',
      type: 'select',
      name: 'jobTypeId',
      select: jobsClasslist,
      fieldNames: { label: 'jobType', value: 'jobTypeId' },
    },
    {
      label: '学历要求',
      type: 'select',
      name: 'education',
      select: EDUCATION_JSOBS_STATUS,
    },
    {
      label: '经验要求',
      name: 'experience',
    },
    {
      label: '职位描述',
      type: 'textArea',
      name: 'jobDescription',
      maxLength: 500,
      rows: 6,
    },
    {
      label: '职位要求',
      type: 'textArea',
      name: 'jobClaim',
      maxLength: 500,
      rows: 6,
    },
  ];

  const modalProps = {
    title: type === 'edit' ? '编辑' : '新增',
    visible: show,
    onClose,
    afterCallBack: () => fetchJobsClass(),
    footer: (
      <>
        <Button onClick={() => fetchGetFormData(0)} type="primary" loading={loading}>
          保存草稿
        </Button>
        <Button onClick={() => fetchGetFormData(1)} type="primary" loading={loading}>
          立即发布
        </Button>
      </>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition initialValues={detail} formItems={formItems} form={form} />
    </DrawerCondition>
  );
};

export default connect(({ solicitJobs, loading }) => ({
  jobsClasslist: solicitJobs.jobsClasslist,
  loading: loading.effects['solicitJobs/fetchJobsSet'],
}))(JobsSet);
