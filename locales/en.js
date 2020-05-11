const en = {
  login: 'Login',
  clientName: 'Client Name',
  email: 'Email Address',
  password: 'Password',
  logout: 'Logout',
  refreshed: 'Refreshed',
  menu: {
    home: 'Home',
    tables: 'Tables',
    orders: 'Orders',
    reservations: 'Reservations',
    reporting: 'Reporting',
    settings: 'Settings',
    clientUsers: 'Client Users',
    timecard: 'Time Card'
  },
  settings: {
    account: 'Account',
    stores: 'Stores',
    products: 'Products',
    staff: 'Staff',
    workingArea: 'Printer/Working Area',
    language: 'Language',
    tableLayouts: 'Table Layouts',
    manageShifts: 'Manage Shift',
    announcements: 'Announcements'
  },
  newItem: {
    new: 'New',
    product: 'Product',
    category: 'Category',
    printer: 'Printer',
    workingArea: 'Working Area'
  },
  action: {
    ok: 'OK',
    done: 'Done',
    save: 'Save',
    search: 'Search',
    update: 'Update',
    cancel: 'Cancel',
    delete: 'Delete',
    confirmMessageTitle: 'Confirm Action',
    confirmMessage: 'Are you sure?',
    yes: 'Yes',
    no: 'No',
    unpin: 'Unpin',
    pin: 'Pin'
  },
  order: {
    inStore: 'In Store',
    IN_STORE: 'In Store',
    takeOut: 'Take Out',
    TAKE_OUT: 'Take Out',

    ordersTitle: 'Orders',
    fromDate: 'From ',
    toDate: 'To ',
    orderId: 'Order Id',
    date: 'Date',
    orderStatusLong: 'Order Status',
    orderStatus: 'Status',
    noOrder: 'No Order',

    orderDetailsTitle: 'Order Details',
    subtotal: 'Subtotal',
    serviceCharge: 'Service Charge',
    discount: 'Discount',
    total: 'Final Total',
    paymentMethod: 'Payment Method',
    staff: 'Staff',
    ageGroup: 'Age Group',
    visitedFrequency: 'Visited Frequency',
    notFilledIn: 'Not Filled',
    orderStartDate: 'Start Date',
    lineItemCreatedDate: 'Date',
    preparationDuration: 'Order Preparation',
    endDate: 'End Date',
    duration: 'Total Duration',
    product: 'Product',
    quantity: 'Qty',
    subTotal: 'Subtotal',
    serveBy: 'Serve By',
    copiedFrom: 'Copy From',

    // order specific actions
    copyOrder: 'Copy Order',

    // order messages
    submitted: 'Order Submitted',
    deleted: 'Order Deleted',
    copied: 'Order Copied'
  },
  orderState: {
    OPEN: 'Open',
    IN_PROCESS: 'In Process',
    DELIVERED: 'Delivered',
    SETTLED: 'Settled',
    REFUNDED: 'Refunded',
    COMPLETED: 'Completed',
    DELETED: 'Deleted'
  },
  payment: {
    cashPayment: 'Cash',
    cardPayment: 'Credit Card'
  },
  timecard: {
    hours: 'Hour(s)',
    minutes: 'Minute(s)'
  },
  shift: {
    status: {
      INACTIVE: 'Inactive',
      ACTIVE: 'Active',
      CLOSING: 'Closing',
      CONFIRM_CLOSE: 'Confirm Closing',
      BALANCED: 'Balanced',
      UNBALANCED: 'Unbalanced'
    },
    staff: 'Staff',
    shiftSummary: 'Closing Account Summaries',
    totalCashIncome: 'Total Cash Income',
    totalCreditCardIncome: 'Total Card Income',
    totalClosingAmount: 'Total Closing Amount',
    invoicesTitle: 'Invoices',
    totalInvoices: 'Total Number of Orders',
    deletedOrders: 'Total Number Of Orders Deleted',
    totalDiscounts: 'Total Amount Of Discount',
    totalServiceCharge: 'Total Service Charge',
    closingRemark: 'Closing Remark',
    confirmAction: 'Confirm Close',
    abortAction: 'Abort Close',
    accountCloseTitle: 'Closing Account',
    confirmCloseTitle: 'Confirm Closing Account Details',
    cashSection: 'Cash',
    cardSection: 'Credit Card',
    nextAction: 'Next',
    closingStatus: 'Status',
    startingCash: 'Starting Cash',
    totalCashTransitionAmt: 'Total Cash Transactions',
    totalCashInRegister: 'Actual Cash Amount',
    enterAmount: 'Enter Amount',
    remark: 'Unbalance Reason',
    totalCardTransitionAmt: 'Total Card Transactions',
    totalCardInRegister: 'Actual Card Amount',
    difference: 'Difference',

    // messages
    shiftOpened: 'Shift opened',
    shiftAborted: 'Closing shift aborted',
    shiftClosed: 'Shift closed'
  },
  errors: {
    balanceError: 'Please enter a positive value'
  },
  backend: {
    POST: 'Saved',
    PATCH: 'Saved',
    DELETE: 'Deleted',
    403: 'You are not authorized for this operation.',
    404: 'The id you used to look for an item cannot be found.',
    message: {
      insufficientCashAmount: 'Entered cash amount is less than the settling amount.',
      discountedTotalLessThanZero: 'Discounted amount cannot be less than zero',
      completeAllOrdersFirst: 'Please complete all orders before closing shift.',
      userRoleInUse: 'This user role is used by existing user',
      unableToChangeState: 'Unable to change order state'
    }
  },
  bar: 'Bar {{someValue}}'
}

export default en
