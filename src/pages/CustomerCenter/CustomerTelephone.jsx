import React, { useRef } from "react";
import { connect } from "dva";
import HandleSetTable from "@/components/HandleSetTable";
import DataTableBlock from "@/components/DataTableBlock";

const CustomerTelephone = (props) => {
  const { customerTelephone, loading } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: "客服电话",
      name: "userMobile1s",
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: "客服电话",
      dataIndex: "userId",
    },
    {
      title: "客服人员",
      align: "center",
      dataIndex: "phoneNumber",
    },
    {
      title: "服务时间",
      align: "left",
      dataIndex: "orderCount",
    },
    {
      title: "客服类别",
      align: "left",
      dataIndex: "orderTotal",
      render: (val) => `￥${val}`,
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
              type: "edit",
              //   click: () => setShowCoach(record),
            },
            {
              type: "del",
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
      dispatchType="customerTelephone/fetchAppUserList"
      {...customerTelephone}
    ></DataTableBlock>
  );
};

export default connect(({ customerTelephone, loading }) => ({
  customerTelephone,
  loading: loading.models.customerTelephone,
}))(CustomerTelephone);
