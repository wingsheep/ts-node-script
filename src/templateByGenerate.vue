<script lang="ts" setup>
import { ref } from 'vue'
const columns = ref([
  {
    label: '订单号',
    prop: 'orderCode',
    slot: 'orderCode',
    isShow: true,
  }, {
    label: '业务单号',
    prop: 'selfOrder',
    slot: 'selfOrder',
    isShow: processModeListMap?.selfOrder,
  }, {
    label: 'FBA编号',
    prop: 'fbaNumber',
    slot: 'fbaNumber',
    isShow: true,
  }, {
    label: '运输单号',
    prop: 'transportCode',
    slot: 'transportCode',
    isShow: isPacked || isShipping || isReceipted || isAll,
  }, {
    label: '客户账号',
    prop: 'customerBizKey',
    slot: 'customerBizKey',
    isShow: true,
  }, {
    label: '目的地',
    prop: 'dstId',
    slot: 'dstId',
    isShow: true,
  }, {
    label: '运输方式',
    prop: 'channelTypeId',
    slot: 'channelTypeId',
    isShow: true,
  }, {
    label: '渠道',
    prop: 'planId',
    slot: 'planId',
    isShow: true,
  }, {
    label: '头程运输状态',
    prop: 'transportStatusCondition',
    slot: 'transportStatusCondition',
    isShow: isShipping || isReceipted || isAll,
  }, {
    label: '收件类型',
    prop: 'receiverType',
    slot: 'receiverType',
    isShow: true,
  }, {
    label: '收件人姓名',
    prop: 'receiverKeyword',
    slot: 'receiverKeyword',
    isShow: conditions.receiverType,
  }, {
    label: '所属仓库',
    prop: 'warehouseId',
    slot: 'warehouseId',
    isShow: true,
  }, {
    label: '订单归属人员',
    prop: 'orderBelonging',
    slot: 'orderBelonging',
    isShow: true,
  }, {
    label: '业务日期',
    prop: 'businessTimeRange',
    slot: 'businessTimeRange',
    isShow: true,
  }, {
    label: '建单时间',
    prop: 'createTimeRange',
    slot: 'createTimeRange',
    isShow: true,
  }, {
    label: '核单时间',
    prop: 'checkedTimeRange',
    slot: 'checkedTimeRange',
    isShow: isPrePayment || isAll,
  }, {
    label: '放单时间',
    prop: 'paymentTimeRange',
    slot: 'paymentTimeRange',
    isShow: isPreShipping || isAll,
  }, {
    label: '装箱时间',
    prop: 'packedTimeRange',
    slot: 'packedTimeRange',
    isShow: isPacked || isAll,
  }, {
    label: '发货时间',
    prop: 'shippingTimeRange',
    slot: 'shippingTimeRange',
    isShow: isShipping || isReceipted || isAll,
  }, {
    label: '签收时间',
    prop: 'confirmReceiptRange',
    slot: 'confirmReceiptRange',
    isShow: isReceipted || isAll,
  }, {
    label: '退件时间',
    prop: 'cancelTimeRange',
    slot: 'cancelTimeRange',
    isShow: isCanceled || isAll,
  }])
</script>

<template>
  <BaseConditionsForm :columns="columns">
    <template #orderCode>
      <SearchInput
        v-model="conditions.orderCode"
        type="orderCode"
        :order-type="0"
        :status="currentStatusValue"
      />
    </template>
    <template #selfOrder>
      <SearchInput
        v-model="conditions.selfOrder"
        type="selfOrder"
        :status="currentStatusValue"
      />
    </template>
    <template #fbaNumber>
      <ElInput
        v-model="conditions.fbaNumber"
        placeholder="请输入FBA编号"
      />
    </template>
    <template #transportCode>
      <ElInput
        v-model="conditions.transportCode"
        placeholder="请输入运输单号"
        maxlength="50"
        clearable
      />
    </template>
    <template #customerBizKey>
      <CustomerEditor v-model="conditions.customerBizKey" />
    </template>
    <template #dstId>
      <ElSelect
        v-model="conditions.dstId"
        placeholder="请选择目的地"
        filterable
        clearable
      >
        <ElOption label="全部目的地" value="" />
        <ElOption
          v-for="item in destinations"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        >
          {{ item.name }}({{ item.code }})
        </ElOption>
      </ElSelect>
    </template>
    <template #channelTypeId>
      <ElSelect
        v-model="conditions.channelTypeId"
        placeholder="请选择运输方式"
        filterable
        clearable
      >
        <ElOption label="全部运输方式" value="" />
        <ElOption
          v-for="item in channelTypes"
          :key="item.bizKey"
          :value="item.bizKey"
          :label="item.name"
        />
      </ElSelect>
    </template>
    <template #planId>
      <ChaneelSeletor
        v-model="conditions.planId"
        placeholder="请选择渠道"
        clearable
        model-value-type="prop"
      />
    </template>
    <template #transportStatusCondition>
      <ElSelect
        v-model="conditions.transportStatusCondition"
        placeholder="请选择头程运输状态"
        clearable
      >
        <ElOption label="全部头程运输状态" value="" />
        <ElOption
          v-for="item in orderHeadTransportStatuses"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        />
      </ElSelect>
    </template>
    <template #receiverType>
      <ElSelect
        v-model="conditions.receiverType"
        placeholder="请选择收件类型"
        clearable
        @change="handleChangeReceiverType"
        @clear="handleChangeReceiverType"
      >
        <ElOption
          v-for="opt in DestAddressType"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </ElSelect>
    </template>
    <template #receiverKeyword>
      <ElInput
        v-model="conditions.receiverKeyword"
        placeholder="请输入收件人姓名"
        clearable
      />
    </template>
    <template #warehouseId>
      <BelongWarehouseSelect
        v-model="conditions.warehouseId"
        filter="def-ban"
      />
    </template>
    <template #orderBelonging>
      <OrderBelongingSelector v-model="conditions.orderBelonging" />
    </template>
    <template #businessTimeRange>
      <ElDatePicker
        v-model="conditions.businessTimeRange"
        type="daterange"
        range-separator="-"
        start-placeholder="业务日期 (始)"
        end-placeholder="业务日期 (终)"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD HH:mm:ss"
        :default-time="defaultTime"
        clearable
      />
    </template>
    <template #createTimeRange>
      <ElDatePicker
        v-model="conditions.createTimeRange"
        type="daterange"
        range-separator="-"
        start-placeholder="建单日期 (始)"
        end-placeholder="建单日期 (终)"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD HH:mm:ss"
        :default-time="defaultTime"
        clearable
      />
    </template>
    <template #checkedTimeRange>
      <ElDatePicker
        v-model="conditions.checkedTimeRange"
        type="daterange"
        range-separator="-"
        start-placeholder="核单日期 (始)"
        end-placeholder="核单日期 (终)"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD HH:mm:ss"
        :default-time="defaultTime"
        clearable
      />
    </template>
    <template #paymentTimeRange>
      <ElDatePicker
        v-model="conditions.paymentTimeRange"
        type="daterange"
        range-separator="-"
        start-placeholder="放单日期 (始)"
        end-placeholder="放单日期 (终)"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD HH:mm:ss"
        :default-time="defaultTime"
        clearable
      />
    </template>
    <template #packedTimeRange>
      <ElDatePicker
        v-model="conditions.packedTimeRange"
        type="daterange"
        range-separator="-"
        start-placeholder="装箱日期 (始)"
        end-placeholder="装箱日期 (终)"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD HH:mm:ss"
        :default-time="defaultTime"
        clearable
      />
    </template>
    <template #shippingTimeRange>
      <ElDatePicker
        v-model="conditions.shippingTimeRange"
        type="daterange"
        range-separator="-"
        start-placeholder="发货日期 (始)"
        end-placeholder="发货日期 (终)"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD HH:mm:ss"
        :default-time="defaultTime"
        clearable
      />
    </template>
    <template #confirmReceiptRange>
      <ElDatePicker
        v-model="conditions.confirmReceiptRange"
        type="daterange"
        range-separator="-"
        start-placeholder="签收日期 (始)"
        end-placeholder="签收日期 (终)"
        format="YYYY-MM-DD"
        clearable
      />
    </template>
    <template #cancelTimeRange>
      <ElDatePicker
        v-model="conditions.cancelTimeRange"
        type="daterange"
        range-separator="-"
        start-placeholder="退件日期 (始)"
        end-placeholder="退件日期 (终)"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD HH:mm:ss"
        :default-time="defaultTime"
        clearable
      />
    </template>
  </BaseConditionsForm>
</template>
