module.exports = {

    match: [
      /[^\,^\(\=]\s*function/,
    ],

    label: [
      /function\s*([\w]+)\(/,
      /([\w]+)\:\s*function/,
    ],

};
