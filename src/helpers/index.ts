/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */
interface CommandAndFlags {
  command?: string;
  flags?: string;
}

export interface Flag {
  flag: string;
  arg: string;
}

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */
export const identity = <T>(_: T) => _;

export const extractCommandAndFlags = (str = ""): CommandAndFlags => {
  const { command = "!help", flags = "" } =
    str.match(/(?:\<.*\>)? *(?<command>\![a-z]+) *(?<flags>\-[A-Za-z].*)*/)
      ?.groups ?? {};
  return { command, flags };
};

export const processFlags = (str = ""): Flag[] => {
  return str
    .split("-")
    .filter(identity)
    .map((_) => _.trim().split(/ +/).filter(identity))
    .map(([flag, arg]) => ({ flag, arg }));
};

export const getArgByFlag = (flags: Flag[], selector: string) =>
  flags.find(({ flag }) => flag === selector)?.arg;

export const sanitizeNumber = (num: unknown) =>
  typeof num === "number" && !isNaN(num) ? num : 0;
