const zh = {
  login: '登入',
  cancel: '取消',
  clientName: '商業名稱',
  email: '電子郵件',
  password: '密碼',
  logout: '登出',
  menu: {
    home: '主頁',
    tables: '座位訂單',
    orders: '訂單',
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
    announcements: '公告'
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
    save: '儲存',
    search: '搜尋',
    update: '更新',
    cancel: '取消',
    delete: '刪除',
    confirmMessageTitle: '執行確認',
    confirmMessage: '確定執行嗎？',
    yes: '是',
    no: '不是'
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
    serveBy: '結帳人員'
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
  timecard: {
    hours: '小時',
    minutes: '分鐘'
  },
  shift: {
    status: {
      INACTIVE: '未開帳',
      ACTIVE: '開帳中',
      CLOSING: '關帳中',
      CONFIRM_CLOSE: '關帳確認',
      BALANCED: '已關帳',
      UNBALANCED: '已關帳(帳不平)'
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
    totalCardInRegister: '實際刷卡營業額'
  },
  errors: {
    balanceError: '請輸入大於零的數字'
  },
  bar: 'Bar {{someValue}}'
}

export default zh
