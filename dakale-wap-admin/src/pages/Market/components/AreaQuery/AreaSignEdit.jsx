import React, { useState } from 'react';
import { connect } from 'umi';
import { createForm } from 'rc-form';
import { List, InputItem, SegmentedControl, DatePicker, ImagePicker, Calendar } from 'antd-mobile';
import { Checkbox } from '@/components/FormCondition/formModule';
import { Button } from 'antd';
import { PHONE_PATTERN } from '@/common/regExp';
import CITYJSON from '@/common/cityJson';
import aliOssUpload from '@/utils/aliOssUpload';
import DrawerCondition from '@/components/DrawerCondition';
import './style.less';

const AreaSignEdit = (props) => {
  const { dispatch, childRef, visible, onClose, loading, form } = props;

  const { getFieldProps, validateFields, getFieldError } = form;

  const { show = false, detail = {} } = visible;
  const { id, level } = detail;

  const checkIdType = { 2: 'pid', 3: 'id' }[level];

  const [tabKey, setTabKey] = useState(0);
  const [fileLists, setFileLists] = useState([]);
  const [calendar, setCalendar] = useState({ show: false, config: {} });

  const tabItem = ['定金', '签约'];
  const tabItemFom = ['付定', '签约'];

  // 新增
  const fetchCityManageSet = () => {
    validateFields().then((error, values) => {
      console.log(values);
      console.log(error);
      if (error) return;
      // const { backgroundImg } = values;
      // aliOssUpload(backgroundImg).then((res) => {
      //   dispatch({
      //     type: 'manageCity/fetchCityManageSet',
      //     payload: {
      //       ...detail,
      //       ...values,
      //       backgroundImg: res.toString(),
      //     },
      //     callback: () => {
      //       onClose();
      //       childRef.current.fetchGetData();
      //     },
      //   });
      // });
    });
  };

  const modalProps = {
    title: detail.name,
    visible: show,
    onClose,
    afterCallBack: () => {
      setTabKey(0);
    },
    footer: (
      <Button type="primary" onClick={fetchCityManageSet} loading={loading}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <SegmentedControl values={['定金', '签约']} selectedIndex={tabKey} onChange={setTabKey} />
      <List>
        <InputItem
          clear
          {...getFieldProps('account', {
            rules: [{ required: true, message: '请输入' }],
          })}
          error={!!getFieldError('account')}
          placeholder="手机号/邮箱/会员名"
        >
          客户姓名
        </InputItem>
        <InputItem
          type="phone"
          {...getFieldProps('acc2ount', {
            rules: [{ required: true, message: '请输入' }],
          })}
          clear
          error={!!getFieldError('acc2ount')}
          placeholder="手机号"
        >
          客户手机号
        </InputItem>
        <InputItem
          type="money"
          {...getFieldProps('price', {
            rules: [{ required: true, message: '请输入' }],
          })}
          error={!!getFieldError('price')}
          placeholder="0.00"
          clear
          extra="元"
        >
          定金金额
        </InputItem>
        <div class="am-list-item am-input-item am-list-item-middle" style={{ height: 'auto' }}>
          <div class="am-list-line" style={{ padding: '10px 0' }}>
            <div class="am-input-label am-input-label-5">签约区县</div>
            <div class="am-input-control">
              <Checkbox
                select={level ? CITYJSON.filter((i) => i[checkIdType] === id) : []}
                fieldNames={{ label: 'name', value: 'id' }}
                disabled={detail.Keyname && tabKey === 1}
              />
            </div>
          </div>
        </div>
        <DatePicker
          mode="date"
          title="付定日期"
          {...getFieldProps('date', {
            rules: [{ required: true, message: '请选择' }],
          })}
          error={!!getFieldError('date')}
          extra="选择日期"
        >
          <List.Item arrow="horizontal">付定日期</List.Item>
        </DatePicker>
        <List.Item
          arrow="horizontal"
          extra={'选择日期'}
          onClick={() => {
            document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
            setCalendar({ ...calendar, show: true });
          }}
        >
          合同期限
        </List.Item>
        <div class="am-list-item am-input-item am-list-item-middle" style={{ height: 'auto' }}>
          <div class="am-list-line">
            <div class="am-input-label am-input-label-5">上传凭证</div>
            <div class="am-input-control">
              <ImagePicker
                files={fileLists}
                onChange={setFileLists}
                selectable={fileLists.length < 1}
                multiple={false}
              />
            </div>
          </div>
        </div>
      </List>
      <Calendar
        {...calendar.config}
        visible={calendar.show}
        onCancel={() => setCalendar({ ...calendar, show: false })}
        onConfirm={(s, e) => console.log(s, e)}
        defaultDate={new Date()}
      />
    </DrawerCondition>
  );
};

const EditHeaderWrapper = createForm()(AreaSignEdit);

export default connect(({ loading }) => ({
  loading: loading.models.manageCity,
}))(EditHeaderWrapper);
