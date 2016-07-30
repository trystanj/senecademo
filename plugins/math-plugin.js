'use strict';

// seneca pattern matchers for the 'math' role (grouping)
function math(options) {

  this.add('role:math,cmd:sum', function sum(msg, respond) {
    respond(null, { answer: msg.left + msg.right })
  });

  this.add('role:math,cmd:product', function product(msg, respond) {
    respond(null, { answer: msg.left * msg.right })
  });

  // wrap matches all role:math patterns (this is called a pin) and extends them
  // in this case, it parses thing into numbers before calling the appropriate pattern with new values
  this.wrap('role:math', function (msg, respond) {
    msg.left  = Number(msg.left).valueOf()
    msg.right = Number(msg.right).valueOf()
    this.prior(msg, respond)
  });
}

module.exports = math;