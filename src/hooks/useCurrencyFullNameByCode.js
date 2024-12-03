import currencyCodes from "currency-codes";

export default function useCurrencyFullNameByCode(currencyCode) {
  const currency = currencyCodes.code(currencyCode);
  if (currency) {
    return currency.currency;
  } else {
    return "Unknown currency code";
  }
}
