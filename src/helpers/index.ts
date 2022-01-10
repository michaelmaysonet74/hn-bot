export const extractCommandAndFlags = (str = "") => {
  const { command = "!help", flags = "" } =
    str.match(/(?:\<.*\>)? *(?<command>\![a-z]+) *(?<flags>\-[A-Za-z].*)*/)
      ?.groups ?? {};
  return { command, flags };
};

export const identity = (_) => _;

export const processFlags = (str = "") => {
  return str
    .split("-")
    .filter(identity)
    .map((_) => _.trim().split(/ +/).filter(identity))
    .map(([flag, arg]) => ({ flag, arg }));
};

export const getArgByFlag = (flags, selector) =>
  flags.find(({ flag }) => flag === selector)?.arg;

export const sanitizeNumber = (num: unknown) =>
  typeof num === "number" && !isNaN(num) ? num : 0;
