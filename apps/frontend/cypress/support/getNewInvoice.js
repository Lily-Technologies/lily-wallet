import { encode, sign } from "bolt11";
import moment from "moment";

export const getNewInvoice = (amount, expirationInSeconds) => {
  const expirationTime = moment().add(expirationInSeconds, "seconds").unix();

  const encodedInvoice = encode({
    satoshis: amount,
    timestamp: expirationTime,
    tags: [
      {
        tagName: "payment_hash",
        data: "100102030405060708090a0b0c0d0e0f000102030405060708090a0b0c0d0e0f",
      },
      {
        tagName: "description",
        data: "Please consider supporting this project",
      },
    ],
  });

  const privateKeyHex =
    "e126f68f7eafcc8b74f54d269fe206be715000f94dac067d1c04a8ca3b2db734";
  const signed = sign(encodedInvoice, privateKeyHex);

  return signed;
};
