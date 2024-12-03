import React, { useEffect, useRef,useState } from "react";

import useCurrencyFullNameByCode from "./hooks/useCurrencyFullNameByCode";
import useCurrencyInfo from "./hooks/useCurrencyInfo";

export default function App() {
  // State management
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [currency, setCurrency] = useState("usd");
  const [convertedCurrency, setConvertedCurrency] = useState("inr");
  const inputRef = useRef(null);

  // currencyPriceObj from api {useCurrencyInfo}
  const currencyPriceObj = useCurrencyInfo(currency);

  // currency key: {code} arr
  const currencyCodeArr = Object.keys(currencyPriceObj);

  // currency key: {code} filtered arr, remove some unknown
  const currencyNameArrFilter = currencyCodeArr.filter(
    (elem) => useCurrencyFullNameByCode(elem) !== "Unknown currency code"
  );
  useEffect(() => {
    const convert = () => {
      const baseRate = currencyPriceObj[currency];
      const targetRate = currencyPriceObj[convertedCurrency];

      if (
        baseRate != null &&
        targetRate != null &&
        !isNaN(baseRate) &&
        !isNaN(targetRate)
      ) {
        // Assuming currencyPriceObj stores rates relative to a common reference like USD
        const val = amount * (targetRate / baseRate);
        setConvertedAmount(val);
      } else {
        setConvertedAmount(0); // or handle the error appropriately
      }
    };

    convert();
    inputRef.current.focus();
  }, [amount, currency, convertedCurrency, currencyPriceObj]);

  const swap = () => {
    setCurrency(convertedCurrency);
    setConvertedCurrency(currency);
  };
  return (
    <section
      className="flex items-center justify-center h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/6266283/pexels-photo-6266283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`,
      }}
    >
      <div className="bg-white bg-opacity-50 backdrop-blur-lg rounded shadow p-8">
        {/* heading */}
        <h1 className="text-3xl font-semibold pb-3">CURRENCY CONVERTER</h1>

        {/* Currency diff */}
        <div className="pb-4">
          <p className="pb-1">
            {currencyPriceObj[currency]} {currency.toUpperCase()} -{" "}
            {useCurrencyFullNameByCode(currency)} Equals
          </p>
          <p className="text-2xl ">
            {currencyPriceObj[convertedCurrency]}{" "}
            {convertedCurrency.toUpperCase()} -{" "}
            {useCurrencyFullNameByCode(convertedCurrency)}
          </p>
        </div>

        {/* Currency 1 */}
        <div className="pb-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mr-2 bg-white text-xl p-1"
            ref={inputRef}
          />
          {/* Selection from */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="text-xl p-1"
          >
            {currencyNameArrFilter.map((elem) => {
              return (
                <option key={elem} value={elem}>
                  {elem.toUpperCase()} - {useCurrencyFullNameByCode(elem)}
                </option>
              );
            })}
          </select>
        </div>

        {/* Swap Button */}
        <button onClick={swap} className="mb-2 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 active:bg-blue-900">swap</button>

        {/* Currency 2 */}
        <div>
          <input type="number" value={convertedAmount} readOnly className="mr-2 text-xl p-1"/>
          {/* Selection to */}
          <select
            value={convertedCurrency}
            onChange={(e) => setConvertedCurrency(e.target.value)}
            className="text-xl p-1 "
          >
            {currencyNameArrFilter.map((elem) => {
              return (
                <option key={elem} value={elem}>
                  {elem.toUpperCase()} - {useCurrencyFullNameByCode(elem)}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </section>
  );
}
