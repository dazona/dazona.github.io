function out() {
  console.log.apply(console, arguments);
}

function outobj(obj) {
  console.log(JSON.stringify(obj, null, 2));
}
