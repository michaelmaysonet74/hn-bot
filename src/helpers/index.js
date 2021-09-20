const extractCommandAndFlags = (str = "") => {
  const { command = "!help", flags = "" } =
    str.match(/(?:\<.*\>)? *(?<command>\![a-z]+) *(?<flags>\-[A-Za-z].*)*/)
      ?.groups ?? {};
  return { command, flags };
};

const identity = (_) => _;

const processFlags = (str = "") => {
  return str
    .split("-")
    .filter(identity)
    .map((_) =>
      _.trim()
        .split(/ +/)
        .filter(identity)
    )
    .map(([flag, arg]) => ({ flag, arg }));
};

const getArgByFlag = (flags, selector) =>
  flags.find(({ flag }) => flag === selector)?.arg;

const sanitizeNumber = (num) =>
  typeof num === "number" && !isNaN(num) ? num : 0;

module.exports = {
  extractCommandAndFlags,
  identity,
  processFlags,
  getArgByFlag,
  sanitizeNumber,
};
