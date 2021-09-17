import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import debounce from 'lodash/debounce';
import { OPEN_ADVERT } from '@/common/imgRatio';
import { OPEN_ADVERT_TYPE } from '@/common/constant';
import { NativeFormSet } from '@/components/FormListCondition';
import FormCondition from '@/components/FormCondition';

const OpenAdForm = (props) => {
  const { detail = {}, form, tabKey, dispatch, loading } = props;

  const [mediaType, setMediaType] = useState('image');
  const [selectList, setSelectList] = useState([]);

  useEffect(() => {
    setMediaType(detail.mediaType);
    setSelectList([]);
    if (detail.platformMomentId) {
      fetchGetSearch(detail.platformMomentId);
    }
  }, []);

  // 搜索
  const fetchGetSearch = debounce((content) => {
    if (!content.replace(/'/g, '') || content.replace(/'/g, '').length < 2) return;
    dispatch({
      type: 'videoAdvert/fetchVideoAdvertSearch',
      payload: {
        title: content.replace(/'/g, ''),
      },
      callback: setSelectList,
    });
  }, 500);

  const formItems = [
    {
      label: '广告主名',
      name: 'launchOwner',
      maxLength: 20,
    },
    {
      label: '广告类型',
      type: 'radio',
      name: 'mediaType',
      select: tabKey === 'user' ? OPEN_ADVERT_TYPE : { image: '图片广告' },
      onChange: (e) => setMediaType(e.target.value),
    },
    {
      label: '广告上传',
      type: 'upload',
      name: 'url',
      maxFile: 1,
      visible: mediaType === 'image',
      imgRatio: OPEN_ADVERT,
    },
    {
      label: '选择视频',
      loading,
      type: 'select',
      select: selectList,
      name: 'platformMomentId',
      placeholder: '请输入视频名称搜索',
      visible: mediaType === 'video',
      onSearch: fetchGetSearch,
    },
    {
      label: '广告说明',
      type: 'textArea',
      visible: mediaType === 'image',
      name: 'launchDesc',
      maxLength: 200,
    },
    {
      label: '展示时间',
      visible: mediaType === 'image',
      name: 'activeDate',
      type: 'rangePicker',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      type: 'noForm',
      visible: mediaType === 'image',
      formItem: <NativeFormSet form={form} detail={detail} port={tabKey}></NativeFormSet>,
    },
  ];

  return <FormCondition initialValues={detail} formItems={formItems} form={form} />;
};

export default connect(({ loading }) => ({
  loading: loading.effects['videoAdvert/fetchVideoAdvertSearch'],
}))(OpenAdForm);
