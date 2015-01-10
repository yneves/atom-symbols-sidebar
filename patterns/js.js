module.exports = {

    match: [
      /[^\,^\(\=]\s*function/,
      /^function/,
    ],

    label: [
      /function\s*([\w]+)\(/,
      /([\w]+)\:\s*function/,
    ],

};
