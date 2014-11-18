var addon = require('../ibapi'),
  messageIds = addon.messageIds,
  contract = addon.contract,
  order = addon.order;

var orderId = -1;
function createMarketOrder() {
  var msftContract1 = contract.createContract();
  msftContract1.secIdType = 'ISIN';
  msftContract1.secId = 'US92343V3024';
  msftContract1.secType = 'STK';
  msftContract1.exchange = 'NYSE';
  //msftContract1.primaryExchange = 'NASDAQ';
  msftContract1.currency = 'USD';

  var newOrder = order.createOrder();
  newOrder.action = "BUY";
  newOrder.totalQuantity = 100;
  newOrder.orderType = "MKT";

  api.placeOrder(orderId, msftContract1, newOrder);
}
function createMarketOnOpenOrder() {
  var msftContract1 = contract.createContract();
  msftContract1.symbol = 'VZA';
  msftContract1.secType = 'STK';
  msftContract1.exchange = 'SMART';
  msftContract1.primaryExchange = 'NYSE';
  msftContract1.currency = 'USD';

  var newOrder = order.createOrder();
  newOrder.action = "BUY";
  newOrder.totalQuantity = 100;
  newOrder.orderType = "MKT";
  newOrder.tif = "OPG";

  api.placeOrder(orderId, msftContract1, newOrder);
}

function createReplaceOrder() {
  createLimitOrder();

  setTimeout(function () {
    var msftContract1 = contract.createContract();
    msftContract1.symbol = 'AAPL';
    msftContract1.secType = 'STK';
    msftContract1.exchange = 'SMART';
    msftContract1.primaryExchange = 'NASDAQ';
    msftContract1.currency = 'USD';

    var newOrder = order.createOrder();
    newOrder.action = "BUY";
    newOrder.totalQuantity = 100;
    newOrder.orderType = "LMT";
    newOrder.lmtPrice = 109;

    api.placeOrder(orderId, msftContract1, newOrder);
  }, 3000);
}

function createIocOrder() {
  var msftContract1 = contract.createContract();
  msftContract1.symbol = 'AAPL';
  msftContract1.secType = 'STK';
  msftContract1.exchange = 'SMART';
  msftContract1.primaryExchange = 'NASDAQ';
  msftContract1.currency = 'USD';

  var newOrder = order.createOrder();
  newOrder.action = "BUY";
  newOrder.totalQuantity = 100;
  newOrder.orderType = "LMT";
  newOrder.tif = "IOC";
  newOrder.lmtPrice = 111.65;

  api.placeOrder(orderId, msftContract1, newOrder);
}

function createFokOrder() {
  var msftContract1 = contract.createContract();
  msftContract1.symbol = 'AAPL';
  msftContract1.secType = 'STK';
  msftContract1.exchange = 'SMART';
  msftContract1.primaryExchange = 'NASDAQ';
  msftContract1.currency = 'USD';

  var newOrder = order.createOrder();
  newOrder.action = "BUY";
  newOrder.totalQuantity = 1000;
  newOrder.orderType = "MKT";
  newOrder.allOrNone = true;

  api.placeOrder(orderId, msftContract1, newOrder);
}

function createLimitOrder() {
  var msftContract1 = contract.createContract();
  msftContract1.symbol = 'AAPL';
  msftContract1.secType = 'STK';
  msftContract1.exchange = 'SMART';
  msftContract1.primaryExchange = 'NASDAQ';
  msftContract1.currency = 'USD';

  var newOrder = order.createOrder();
  newOrder.action = "BUY";
  newOrder.totalQuantity = 100;
  newOrder.orderType = "LMT";
  newOrder.lmtPrice = 110.54;

  api.placeOrder(orderId, msftContract1, newOrder);
}

function reqExecutions() {
  api.reqExecutions(2);
}

function reqCurrentTime() {

  api.reqCurrentTime();
}

var handleValidOrderId = function (message, callback) {
  orderId = message.orderId;
  //createMarketOnOpenOrder();
  console.log('next order Id is ' + orderId);
  callback();
};

var handleServerError = function (message, callback) {
  console.log('Error: ' + message.id.toString() + '-' +
              message.errorCode.toString() + '-' +
              message.errorString.toString());
  callback();
};

var handleOrderStatus = function (message, callback) {
  console.log(JSON.stringify(message));
  callback();
};

var handleOpenOrder = function (message, callback) {

  console.log('openOrder');
  console.log(JSON.stringify(message));

  callback()
};

var handlePosition = function (message, callback) {

  console.log('position');
  console.log(JSON.stringify(message));

  callback()
};

var handleCurrentTime = function (message, callback) {

  console.log('currentTime');
  console.log(JSON.stringify(message));

  callback();
};

var api = new addon.NodeIbapi();

// Please follow this guideline for event handlers:
//  1. Add handlers to listen to messages
//  2. Each handler must have be a function (message, callback) signature
//  3. Each handler must call the callback() to signal that processing
//     finished
api.handlers[messageIds.nextValidId] = handleValidOrderId;
api.handlers[messageIds.svrError] = handleServerError;
api.handlers[messageIds.orderStatus] = handleOrderStatus;
api.handlers[messageIds.openOrder] = handleOpenOrder;
api.handlers[messageIds.currentTime] = handleCurrentTime;
//api.handlers[messageIds.position] = handlePosition;

var connected = api.connect('127.0.0.1', 7496, 0);

if (connected) {
  api.beginProcessing();
  setTimeout(api.reqOpenOrders.bind(api), 4000);
}
