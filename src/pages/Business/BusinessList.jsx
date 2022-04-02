import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { BUSINESS_ACCOUNT_STATUS, BUSINESS_DO_STATUS, BUSINESS_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import ExtraButton from '@/components/ExtraButton';
import excelProps from './components/BusinessList/ExcelProps';
import TableDataBlock from '@/components/TableDataBlock';
import BusinessDetailShow from './components/BusinessList/BusinessDetailShow';
import BusinessQrCode from './components/BusinessList/QrCode/BusinessQrCode';
import BusinessEdit from './components/BusinessList/BusinessEdit';
import BusinessQrCodeBag from './components/BusinessList/BusinessQrCodeBag';
import BusinessVerificationCodeSet from './components/BusinessList/BusinessVerificationCodeSet';
import ReteDrawerSet from './components/RateDrawerSet';
import ShareImg from './components/BusinessList/Form/ShareImg';
import { checkCityName } from '@/utils/utils';

const BusinessListComponent = (props) => {
  const { businessList, tradeList, hubData, loading, dispatch } = props;
  const { list } = businessList;

  const childRef = useRef();

  const [visibleDetail, setVisibleDetail] = useState(false); // 详情
  const [visibleQrcode, setVisibleQrcode] = useState(''); // 二维码
  const [visibleEdit, setVisibleEdit] = useState(''); // 编辑
  const [hubSelect, setHubSelect] = useState(true); // 商圈搜索选择
  const [visibleCodeSet, setVisibleCodeSet] = useState(false); // 设置商家验证码
  const [sceneList, setSceneList] = useState(false); // 场景checkbox列表
  const [qrCodeBag, setQrCodeBag] = useState({ show: false }); // 二维码背景图
  const [visibleRate, setVisibleRate] = useState(false);
  const [visibleShare, setVisibleShare] = useState(false); // 分享配置

  // 搜索参数
  const searchItems = [
    {
      label: '店铺名称',
      name: 'merchantName',
    },
    {
      label: '店铺账号',
      name: 'account',
    },
    {
      label: '经营类目',
      type: 'cascader',
      name: 'topCategoryId',
      changeOnSelect: true,
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'categoryIdString', children: 'categoryDTOList' },
      valuesKey: ['topCategoryId', 'categoryId'],
      placeholder: '选择经营类目',
    },
    {
      label: '账号状态',
      name: 'bankStatus',
      type: 'select',
      select: BUSINESS_ACCOUNT_STATUS,
    },
    {
      label: '所属集团',
      name: 'groupId',
      type: 'group',
    },
    {
      label: '店铺类型',
      name: 'groupFlag',
      type: 'select',
      select: ['单店', '子门店'],
    },
    {
      label: '地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
      handle: (form) => ({
        onChange: (val) => {
          // 必须选到区级才可选择商圈
          form.setFieldsValue({ businessHubId: undefined });
          if (val.length === 3) fetchGetHubSelect({ districtCode: val[2] });
          else {
            setHubSelect(true);
            return;
          }
          setHubSelect(false);
        },
      }),
    },
    {
      label: '所属商圈',
      name: 'businessHubId',
      type: 'select',
      loading: loading.models.baseData,
      disabled: hubSelect,
      allItem: false,
      select: hubData,
      fieldNames: { label: 'businessHubName', value: 'businessHubIdString' },
    },
    {
      label: '经营状态',
      name: 'businessStatus',
      type: 'select',
      select: BUSINESS_DO_STATUS,
    },
    {
      label: '店铺状态',
      name: 'status',
      type: 'select',
      select: BUSINESS_STATUS,
    },
    {
      label: '入驻时间',
      type: 'rangePicker',
      name: 'settleTimeStart',
      end: 'settleTimeEnd',
    },
    {
      label: '激活时间',
      type: 'rangePicker',
      name: 'activationTimeStart',
      end: 'activationTimeEnd',
    },
    {
      label: '营业执照号',
      name: 'socialCreditCode',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '店铺',
      fixed: 'left',
      dataIndex: 'coverImg',
      width: 350,
      render: (val, row) => (
        <PopImgShow url={val}>
          <Ellipsis tooltip lines={2}>
            {row.merchantName}
          </Ellipsis>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 5, color: '#888888' }}>
            <Ellipsis length={15} tooltip>
              {row.mobile}
            </Ellipsis>
            <Tag style={{ marginLeft: 5 }}>{row.groupId ? '子门店' : '单店'}</Tag>
          </div>
          <div>{row?.userMerchantIdString}</div>
        </PopImgShow>
      ),
    },
    {
      title: '经营类目',
      align: 'center',
      dataIndex: 'topCategoryName',
      render: (val, row) => (
        <>
          <Tag color="blue">{val}</Tag>
          <p></p>
          <Tag color="blue">{row.categoryName}</Tag>
        </>
      ),
    },
    {
      title: '商圈/地址',
      dataIndex: 'businessHub',
      render: (val, row) => (
        <div>
          {val}
          <div style={{ fontSize: 13 }}>
            {checkCityName(row.districtCode)}
            <div style={{ color: '#888888' }}>
              <Ellipsis length={20} tooltip>
                {row.address}
              </Ellipsis>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '入驻/激活时间',
      align: 'center',
      dataIndex: 'settleTime',
      render: (val, row) => `${val || '--'}\n${row.activationTime || '--'}`,
    },
    {
      title: '所属集团',
      align: 'center',
      dataIndex: 'groupName',
    },
    {
      title: '状态',
      fixed: 'right',
      align: 'center',
      dataIndex: 'status',
      render: (val, row) =>
        `${row.bankStatus === '3' ? '已激活' : '未激活'}\n${
          BUSINESS_DO_STATUS[row.businessStatus]
        }\n${BUSINESS_STATUS[val]}`,
    },
    {
      type: 'handle',
      width: 150,
      dataIndex: 'userMerchantIdString',
      render: (val, record, index) => [
        {
          type: 'qrCode',
          click: () => setVisibleQrcode(record),
        },
        {
          type: 'info',
          click: () => fetchGetDetail(index),
        },
        {
          type: 'edit',
          click: () =>
            fetchGetDetail(index, (info) => setVisibleEdit({ show: true, type: 'edit', info })),
        },
        {
          type: 'diary',
          click: () => fetchGetLogData({ type: 'merchant', identificationId: val }),
        },
        {
          type: 'rate',
          title: '费率',
          click: () => fetchGetRate({ type: 'merchant', record }),
          visible: record.bankStatus === '3' && !record.groupId,
        },
        // {
        //   title: '分享配置',
        //   type: 'shareImg',
        //   click: () => fetchShareImg(record),
        // },
      ],
    },
  ];

  // 分享配置
  const fetchShareImg = (record) => {
    const { userMerchantIdString, merchantName } = record;
    dispatch({
      type: 'businessList/fetchMerchantDetail',
      payload: { merchantId: userMerchantIdString },
      callback: (val) => {
        const { shareImg, friendShareImg, customTitle } = val;
        const initialValues = {
          shareImg,
          friendShareImg,
          customTitle,
        };
        setVisibleShare({
          show: true,
          merchantName,
          userMerchantIdString,
          initialValues,
        });
      },
    });
  };

  // 费率
  const fetchGetRate = (payload) => {
    const { type, record = {} } = payload;
    const { userMerchantIdString: ownerId } = record;
    // setVisibleRate({ type, show: true, initialValues: { ...record } });
    dispatch({
      type: 'businessList/fetchAllOwnerRate',
      payload: {
        ownerType: type,
        ownerId,
      },
      callback: (detail) => {
        const initialValues = { ...record, ...detail, listPayload: payload };
        setVisibleRate({ type, show: true, initialValues });
      },
    });
  };

  // 获取日志信息
  const fetchGetLogData = (payload) => {
    dispatch({
      type: 'baseData/fetchGetLogDetail',
      payload,
    });
  };

  // 获取商圈
  const fetchGetHubSelect = (payload) => {
    dispatch({
      type: 'baseData/fetchGetHubData',
      payload,
    });
  };

  // 经营类目
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  // 场景列表
  const fechSceneList = (categoryId) => {
    dispatch({
      type: 'sysTradeList/fetchSceneListById',
      payload: { categoryId },
      callback: (val) => {
        setSceneList(val);
      },
    });
  };

  // 获取商家详情
  const fetchGetDetail = (index, callback) => {
    const { userMerchantIdString: merchantId, topCategoryIdString: categoryId } = list[index];
    dispatch({
      type: 'businessList/fetchMerchantDetail',
      payload: { merchantId },
      callback: (info) =>
        callback ? callback(info) : handleShowUserDetail({ ...info, index }, categoryId),
    });
  };

  // 设置商家端登录验证码
  const handleVCodeSet = () => {
    setVisibleCodeSet(true);
  };

  // 店铺详情展示
  const handleShowUserDetail = (initialValues, categoryId) => {
    fechSceneList(categoryId);
    setVisibleDetail(initialValues);
  };

  useEffect(() => {
    fetchTradeList();
  }, []);

  // 额外按钮
  const extraBtn = [
    {
      text: '设置商家验证码',
      auth: 'setMreCord',
      onClick: handleVCodeSet,
    },
    {
      text: '上传二维码背景图',
      auth: 'qrCode',
      onClick: () => setQrCodeBag({ ...qrCodeBag, show: true }),
    },
  ];

  return (
    <>
      <TableDataBlock
        cardProps={{ title: <ExtraButton list={extraBtn}></ExtraButton> }}
        cRef={childRef}
        btnExtra={({ get }) => [
          {
            type: 'excel',
            dispatch: 'businessList/fetchMerchantGetExcel',
            data: get(),
            exportProps: excelProps,
          },
        ]}
        loading={
          loading.effects['businessList/fetchGetList'] ||
          loading.effects['businessList/fetchMerchantDetail'] ||
          loading.effects['businessList/fetchMerchantGetExcel'] ||
          loading.effects['baseData/fetchGetLogDetail']
        }
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userMerchantIdString}`}
        dispatchType="businessList/fetchGetList"
        {...businessList}
      ></TableDataBlock>
      {/* 店铺编辑 */}
      <BusinessEdit
        cRef={childRef}
        visible={visibleEdit}
        initialValues={visibleEdit.info}
        onClose={() => setVisibleEdit(false)}
      ></BusinessEdit>
      {/* 店铺详情 */}
      <BusinessDetailShow
        cRef={childRef}
        visible={visibleDetail}
        sceneList={sceneList}
        total={list.length}
        getDetail={fetchGetDetail}
        onClose={() => setVisibleDetail(false)}
      ></BusinessDetailShow>
      {/* 店铺二维码 */}
      <BusinessQrCode
        qrCodeBag={qrCodeBag}
        visible={visibleQrcode}
        onClose={() => setVisibleQrcode('')}
      ></BusinessQrCode>
      {/* 店铺验证码 */}
      <BusinessVerificationCodeSet
        visible={visibleCodeSet}
        childRef={childRef}
        onClose={() => setVisibleCodeSet(false)}
      ></BusinessVerificationCodeSet>
      {/* 设置二维码背景图片 */}
      <BusinessQrCodeBag visible={qrCodeBag} onOk={setQrCodeBag}></BusinessQrCodeBag>
      {/* 费率设置 */}
      <ReteDrawerSet
        visible={visibleRate}
        fetchGetRate={fetchGetRate}
        onClose={() => setVisibleRate(false)}
      ></ReteDrawerSet>
      {/* 分享配置 */}
      <ShareImg visible={visibleShare} onClose={() => setVisibleShare(false)}></ShareImg>
    </>
  );
};

export default connect(({ businessList, baseData, sysTradeList, loading }) => ({
  businessList,
  hubData: baseData.hubData,
  tradeList: sysTradeList.list.list,
  loading,
}))(BusinessListComponent);
