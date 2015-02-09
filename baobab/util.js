var DEBUG = true;

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

function warn() {
  if (DEBUG) {
    console.log("WARNING");
    console.log.apply(console, arguments);
  }
}
