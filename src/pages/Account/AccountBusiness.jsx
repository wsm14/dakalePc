import React, { useRef } from "react";
import { connect } from "dva";
import HandleSetTable from "@/components/HandleSetTable";
import DataTableBlock from "@/components/DataTableBlock";

const AccountBusinessList = (props) => {
  const { accountBusinessList, loading } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: "商户ID",
      name: "userMobile1s",
    },
    {
      label: "商家名称",
      name: "userMosbile1s",
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: "商户ID",
      dataIndex: "userId",
    },
    {
      title: "商家名称",
      align: "center",
      dataIndex: "phoneNumber",
    },
    {
      title: "累计收益（卡豆）",
      align: "left",
      dataIndex: "orderCount",
    },
    {
      title: "累计收益（金额）",
      align: "left",
      dataIndex: "orderTotal",
      render: (val) => `￥${val}`,
    },
    {
      title: "累计充值",
      align: "left",
      dataIndex: "parkName",
      render: (val) => val || "-",
    },
    {
      title: "累计提现",
      align: "center",
      dataIndex: "addTimeStamp",
    },
    {
      title: "当前余额（金额）",
      align: "center",
      dataIndex: "addTimeStamp",
    },
    {
      title: "当前余额（卡豆）",
      align: "center",
      dataIndex: "addTimeStamp",
    },
    {
      title: "操作",
      dataIndex: "id",
      fixed: 'right',
      align: "right",
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: "own",
              title: "卡豆明细",
              //   click: () => setShowCoach(record),
            },
            {
              type: "own",
              title: "提现记录",
              //   click: () => setShowCoach(record),
            },
            {
              type: "own",
              title: "充值记录",
              //   click: () => setShowCoach(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.userId}`}
      dispatchType="accountBusinessList/fetchAppUserList"
      {...accountBusinessList}
    ></DataTableBlock>
  );
};

export default connect(({ accountBusinessList, loading }) => ({
  accountBusinessList,
  loading: loading.models.accountBusinessList,
}))(AccountBusinessList);
