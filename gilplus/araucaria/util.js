var DEBUG = false;

function out() {
  if (DEBUG) {
    console.log.apply(console, arguments);
  }
}

function outobj(obj) {
  if (DEBUG) {
    console.log(JSON.stringify(obj, null, 2));
  }
}
