import React, { useRef } from "react";
import { connect } from "dva";
import HandleSetTable from "@/components/HandleSetTable";
import DataTableBlock from "@/components/DataTableBlock";

const SysTradeSet = (props) => {
  const { sysTradeSet, loading } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: "行业名称",
      name: "userMobile1",
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: "行业名称",
      align: "center",
      dataIndex: "userId",
    },
    {
      title: "经营品类",
      align: "center",
      dataIndex: "phoneNumber",
    },
    {
      title: "关联店铺数",
      align: "center",
      dataIndex: "orderCount",
    },
    {
      title: "操作",
      dataIndex: "id",
      align: "center",
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
      dispatchType="sysTradeSet/fetchAppUserList"
      {...sysTradeSet}
    ></DataTableBlock>
  );
};

export default connect(({ sysTradeSet, loading }) => ({
  sysTradeSet,
  loading: loading.models.sysTradeSet,
}))(SysTradeSet);
