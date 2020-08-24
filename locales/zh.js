const zh = {
  login: '登入',
  clientName: '商業名稱',
  email: '電子郵件',
  passcode: '六位數代碼',
  password: '密碼',
  logout: '登出',
  refreshed: '已重新刷新',
  general: {
    noData: '沒有資料'
  },
  menu: {
    home: '主頁',
    tables: '座位訂單',
    orders: '訂單',
    orderDisplay: '訂單顯示',
    reservations: '訂位',
    reporting: '報表',
    settings: '設定',
    clientUsers: '使用者清單',
    timecard: '打卡'
  },
  settings: {
    account: '帳號',
    stores: '商店資訊',
    products: '產品管理',
    staff: '員工',
    workingArea: '工作區/出單機',
    language: '語言',
    tableLayouts: '座位管理',
    manageShifts: '開關帳',
    announcements: '公告',
    manageOffers: '促銷管理',
    preferences: '喜好設定'
  },
  newItem: {
    new: '新增',
    product: '產品',
    category: '分類',
    printer: '出單機',
    workingArea: '工作區'
  },
  action: {
    ok: '好',
    done: '結束',
    enter: '輸入',
    save: '儲存',
    search: '搜尋',
    update: '更新',
    cancel: '取消',
    delete: '刪除',
    prepare: '準備完成',
    confirmMessageTitle: '執行確認',
    confirmMessage: '確定執行嗎？',
    yes: '是',
    no: '不是',
    unpin: '移除置頂',
    pin: '加入置頂',
    activate: '啟用',
    deactivate: '停用'
  },
  // ==== domain specific ====
  product: {
    ungrouped: '未分類',
    pinned: '置頂產品',
  },
  order: {
    inStore: '內用',
    IN_STORE: '內用',
    TAKE_OUT: '外帶',
    takeOut: '外帶',

    ordersTitle: '訂單歷史',
    fromDate: '開始日期',
    toDate: '結束日期',
    orderId: '訂單號碼',
    date: '日期',
    orderStatusLong: '訂單狀態',
    orderStatus: '狀態',
    noOrder: '沒有資料',

    orderDetailsTitle: '訂單內容',
    subtotal: '總計',
    serviceCharge: '服務費',
    discount: '折扣',
    total: '總金額',
    paymentMethod: '付款方式',
    staff: '員工',
    ageGroup: '來客年齡層',
    visitedFrequency: '造訪次數',
    notFilledIn: '未填',
    orderStartDate: '開單日期',
    lineItemCreatedDate: '日期',
    preparationDuration: '備餐時間',
    endDate: '結束日期',
    duration: '共計',
    product: '產品',
    quantity: '數量',
    subTotal: '小計',
    serveBy: '結帳人員',
    copiedFrom: '複製於',

    // order specific actions
    liveOrders: '打開即時訂單',
    copyOrder: '複製訂單',

    // order messages
    submitted: '訂單送出',
    deleted: '訂單刪除',
    copied: '複製訂單成功'
  },
  orderState: {
    OPEN: '已開單',
    IN_PROCESS: '準備中',
    DELIVERED: '已送餐',
    SETTLED: '已付款',
    REFUNDED: '已退款',
    COMPLETED: '完成',
    DELETED: '刪單'
  },
  orderLog: {
    title: '訂單日誌',
    updateOrder: '更新訂單資訊',
    stateChange: '訂單狀態',
    addOrderLineItem: '新增品項',
    updateOrderLineItem: '更新品項',
    deleteOrderLineItem: '刪除品項',
    deliverLineItems: '送餐',
    waiveServiceCharge: '抵服務費',
    applyOrderDiscount: '訂單折扣',
    removeOrderDiscount: '移除折扣',
    copyOrder: '複製訂單',
    deleteOrder: '刪除訂單'
  },
  payment: {
    cashPayment: '現金',
    cardPayment: '信用卡'
  },
  timecard: {
    hours: '小時',
    minutes: '分鐘'
  },
  shift: {
    closeShift: '關帳',
    status: {
      INACTIVE: '未開帳',
      ACTIVE: '開帳中',
      CLOSING: '關帳中',
      CONFIRM_CLOSE: '關帳確認',
      BALANCED: '已關帳',
      UNBALANCED: '關帳金額異常'
    },
    shiftDetailsTitle: '帳內容',
    staff: '員工',
    shiftSummary: '關帳總覽',
    totalCashIncome: '現金營業額',
    totalCreditCardIncome: '刷卡營業額',
    totalClosingAmount: '總營業額',
    invoicesTitle: '訂單總覽',
    totalInvoices: '訂單數',
    deletedOrders: '刪單數',
    totalDiscounts: '折扣',
    totalServiceCharge: '服務費',
    closingRemark: '關帳備註',
    confirmAction: '確定關帳',
    abortAction: '取消關帳',
    accountCloseTitle: '開始關帳',
    confirmCloseTitle: '關帳確認',
    cashSection: '現金',
    cardSection: '信用卡',
    nextAction: '下一步',
    closingStatus: '關帳狀態',
    startingCash: '開帳現金',
    totalCashTransitionAmt: '現金營業額',
    totalCashInRegister: '實際現金總額',
    enterAmount: '請輸入金額',
    remark: '理由',
    totalCardTransitionAmt: '刷卡營業額',
    totalCardInRegister: '實際刷卡營業額',
    difference: '差額',

    // messages
    shiftOpened: '已開帳',
    shiftAborted: '關帳取消',
    shiftClosed: '已關帳'
  },
  preferences: {
    darkMode: '暗黑模式'
  },
  // ==== component specific ====
  monthPicker: {
    month: '月',
    year: '年'
  },
  datetimeRange: {
    pickerTitle: '選擇日期與時間',
    select: '確定'
  },
  errors: {
    required: '必填',
    email: 'Email欄位',
    clientPassword: '密碼需要至少六個字母，一個數字，一個大寫字母',
    percentage: '百分比需介於1至100',
    moreThanZero: '數量至少要大於零',
    balanceError: '請輸入大於零的數字',
    loginFailed: '登入失敗'
  },
  backend: {
    POST: '儲存成功',
    PATCH: '儲存成功',
    DELETE: '刪除成功',
    403: '您未被授權執行本次動作',
    404: '您要找的項目不存在',
    message: {
      insufficientCashAmount: '輸入的現金金額小於訂單總金額',
      discountedTotalLessThanZero: '打折後的金額不能小於零',
      completeAllOrdersFirst: '請先完成所有的訂單',
      userRoleInUse: '此權限正被使用中',
      unableToChangeState: '無法更改訂單狀態'
    }
  },
  bar: 'Bar {{someValue}}'
}

export default zh
