export const template = `
<ElForm ref="conditionForm" :model="conditions" inline>
    <ElFormItem prop="orderCode">
      <BaseTooltip content="订单号" inner-tag="div">
        <SearchInput
          v-model="conditions.orderCode"
          type="orderCode"
          :order-type="0"
          :status="currentStatusValue"
        />
      </BaseTooltip>
    </ElFormItem>
    <ElFormItem v-if="processModeListMap?.selfOrder" prop="selfOrder">
      <BaseTooltip content="业务单号" inner-tag="div">
        <SearchInput
          v-model="conditions.selfOrder"
          type="selfOrder"
          :status="currentStatusValue"
        />
      </BaseTooltip>
    </ElFormItem>
    <ElFormItem prop="fbaNumber">
      <BaseTooltip content="FBA编号" inner-tag="div">
        <ElInput
          v-model="conditions.fbaNumber"
          placeholder="请输入FBA编号"
        ></ElInput>
      </BaseTooltip>
    </ElFormItem>

    <ElFormItem
      v-if="isPacked || isShipping || isReceipted || isAll"
      prop="transportCode"
    >
      <BaseTooltip content="运输单号" inner-tag="div">
        <ElInput
          v-model="conditions.transportCode"
          placeholder="请输入运输单号"
          maxlength="50"
          clearable
        ></ElInput>
      </BaseTooltip>
    </ElFormItem>
    <!--<ElFormItem
            v-if="isPacked || isShipping || isReceipted"
            prop="containerCode"
        >
            <BaseTooltip content="托盘号" inner-tag="div">
                <ElInput
                    v-model="conditions.containerCode"
                    placeholder="请输入托盘号"
                    maxlength="10"
                    clearable
                ></ElInput>
            </BaseTooltip>
        </ElFormItem>-->

    <ElFormItem prop="customerBizKey">
      <BaseTooltip content="客户账号" inner-tag="div">
        <CustomerEditor v-model="conditions.customerBizKey"></CustomerEditor>
      </BaseTooltip>
    </ElFormItem>

    <ElFormItem prop="dstId">
      <BaseTooltip content="目的地" inner-tag="div">
        <ElSelect
          v-model="conditions.dstId"
          placeholder="请选择目的地"
          filterable
          clearable
        >
          <ElOption label="全部目的地" value=""></ElOption>
          <ElOption
            v-for="item in destinations"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          >
            {{ item.name }}({{ item.code }})
          </ElOption>
        </ElSelect>
      </BaseTooltip>
    </ElFormItem>

    <ElFormItem prop="channelTypeId">
      <BaseTooltip content="运输方式" inner-tag="div">
        <ElSelect
          v-model="conditions.channelTypeId"
          placeholder="请选择运输方式"
          filterable
          clearable
        >
          <ElOption label="全部运输方式" value=""></ElOption>
          <ElOption
            v-for="item in channelTypes"
            :key="item.bizKey"
            :value="item.bizKey"
            :label="item.name"
          ></ElOption>
        </ElSelect>
      </BaseTooltip>
    </ElFormItem>
    <ElFormItem prop="planId">
      <BaseTooltip content="渠道" inner-tag="div">
        <ChaneelSeletor
          v-model="conditions.planId"
          placeholder="请选择渠道"
          clearable
          model-value-type="prop"
        ></ChaneelSeletor>
      </BaseTooltip>
    </ElFormItem>

    <ElFormItem
      v-if="isShipping || isReceipted || isAll"
      prop="transportStatusCondition"
    >
      <BaseTooltip content="头程运输状态" inner-tag="div">
        <ElSelect
          v-model="conditions.transportStatusCondition"
          placeholder="请选择头程运输状态"
          clearable
        >
          <ElOption label="全部头程运输状态" value=""></ElOption>
          <ElOption
            v-for="item in orderHeadTransportStatuses"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></ElOption>
        </ElSelect>
      </BaseTooltip>
    </ElFormItem>
    <ElFormItem prop="receiverType">
      <BaseTooltip content="收件类型" inner-tag="div">
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
      </BaseTooltip>
    </ElFormItem>
    <ElFormItem v-if="conditions.receiverType" prop="receiverKeyword">
      <BaseTooltip
        v-if="conditions.receiverType === -1"
        content="收件人姓名"
        inner-tag="div"
      >
        <ElInput
          v-model="conditions.receiverKeyword"
          placeholder="请输入收件人姓名"
          clearable
        />
      </BaseTooltip>
      <BaseTooltip
        v-else-if="conditions.receiverType === 1"
        content="海外仓(FBA)"
        inner-tag="div"
      >
        <DestGroupCascader
          v-model="conditions.destinationId"
          placeholder="请选择海外仓(FBA)"
          clearable
          filter="def-ban"
          type="1"
        />
      </BaseTooltip>
      <BaseTooltip
        v-else-if="conditions.receiverType === 2"
        content="自提点"
        inner-tag="div"
      >
        <DestGroupCascader
          v-model="conditions.destinationId"
          placeholder="请选择自提点"
          clearable
          type="2"
        />
      </BaseTooltip>
    </ElFormItem>
    <ElFormItem prop="warehouseId">
      <BaseTooltip content="所属仓库" inner-tag="div">
        <BelongWarehouseSelect
          v-model="conditions.warehouseId"
          filter="def-ban"
        />
      </BaseTooltip>
    </ElFormItem>
    <ElFormItem prop="orderBelonging">
      <BaseTooltip content="订单归属人员" inner-tag="div">
        <OrderBelongingSelector v-model="conditions.orderBelonging" />
      </BaseTooltip>
    </ElFormItem>
    <ElFormItem prop="businessTimeRange">
      <BaseTooltip content="业务日期" inner-tag="div">
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
        >
        </ElDatePicker>
      </BaseTooltip>
    </ElFormItem>
    <ElFormItem prop="createTimeRange">
      <BaseTooltip content="建单时间" inner-tag="div">
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
        >
        </ElDatePicker>
      </BaseTooltip>
    </ElFormItem>

    <ElFormItem v-if="isPrePayment || isAll" prop="checkedTimeRange">
      <BaseTooltip content="核单时间" inner-tag="div">
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
        >
        </ElDatePicker>
      </BaseTooltip>
    </ElFormItem>

    <ElFormItem v-if="isPreShipping || isAll" prop="paymentTimeRange"
      ><BaseTooltip content="放单时间" inner-tag="div">
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
        >
        </ElDatePicker>
      </BaseTooltip>
    </ElFormItem>

    <ElFormItem v-if="isPacked || isAll" prop="packedTimeRange">
      <BaseTooltip content="装箱时间" inner-tag="div">
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
        >
        </ElDatePicker>
      </BaseTooltip>
    </ElFormItem>

    <ElFormItem
      v-if="isShipping || isReceipted || isAll"
      prop="shippingTimeRange"
    >
      <BaseTooltip content="发货时间" inner-tag="div">
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
        >
        </ElDatePicker>
      </BaseTooltip>
    </ElFormItem>
    <ElFormItem v-if="isReceipted || isAll" prop="confirmReceiptRange">
      <BaseTooltip content="签收时间" inner-tag="div">
        <ElDatePicker
          v-model="conditions.confirmReceiptRange"
          type="daterange"
          range-separator="-"
          start-placeholder="签收日期 (始)"
          end-placeholder="签收日期 (终)"
          format="YYYY-MM-DD"
          clearable
        >
        </ElDatePicker>
      </BaseTooltip>
    </ElFormItem>

    <ElFormItem v-if="isCanceled || isAll" prop="cancelTimeRange">
      <BaseTooltip content="退件时间" inner-tag="div">
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
        >
        </ElDatePicker>
      </BaseTooltip>
    </ElFormItem>

    <ElFormItem>
      <BaseButton type="theme" :disabled="loading" @click="searchList">
        查询
      </BaseButton>
      <BaseButton type="plain" :disabled="loading" @click="resetQuery">
        重置
      </BaseButton>
    </ElFormItem>
  </ElForm>
`
