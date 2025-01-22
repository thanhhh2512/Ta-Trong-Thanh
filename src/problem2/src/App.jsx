import { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [inputAmount, setInputAmount] = useState(""); // Dữ liệu nhập vào (chuỗi)
  const [outputAmount, setOutputAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("USD");
  const [swapResult, setSwapResult] = useState("Swap: USD to USD");

  const apiKey = "90461b3e94835584e7bace63";
  const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

  useEffect(() => {
    calculateSwap();
  }, [fromCurrency, toCurrency]);

  const calculateSwap = async () => {
    // Chuyển đổi inputAmount thành số (bỏ dấu phân cách)
    const numericAmount = parseFloat(inputAmount.replace(/\./g, ""));

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setOutputAmount("");
      return;
    }

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.result === "success") {
      const fromRate = data.conversion_rates[fromCurrency];
      const toRate = data.conversion_rates[toCurrency];

      const result = numericAmount * (toRate / fromRate);
      const formattedResult = result.toLocaleString("en-US", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });

      setSwapResult(`Swap: ${fromCurrency} to ${toCurrency}`);
      setOutputAmount(formattedResult);
    } else {
      alert("Error fetching data");
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const validateAndSwap = () => {
    // Chuyển đổi inputAmount thành số (bỏ dấu phân cách)
    const numericAmount = parseFloat(inputAmount.replace(/\./g, ""));

    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    swapCurrencies();
  };

  // Hàm để xử lý và định dạng khi nhập số vào inputAmount
  const handleAmountChange = (e) => {
    let value = e.target.value;

    // Loại bỏ tất cả các ký tự không phải là số và dấu phân cách
    value = value.replace(/[^0-9]/g, "");

    // Định dạng số với dấu phân cách khi người dùng nhập
    const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    setInputAmount(formattedValue);
  };

  return (
    <div className="form-container">
      <h1 className="title">Fancy Form</h1>
      <form
        id="fancy-form"
        onSubmit={(e) => {
          e.preventDefault();
          validateAndSwap();
        }}
      >
        <h2 id="swap-result">{swapResult}</h2>
        <div className="input-container">
          <label htmlFor="input-amount">Amount to send</label>
          <div className="content">
            <input
              id="input-amount"
              value={inputAmount}
              onChange={handleAmountChange} // Gọi hàm để xử lý nhập liệu
            />
            <select
              id="from-currency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="VND">VND</option>
            </select>
          </div>
        </div>

        <button type="button" id="swap-button" onClick={swapCurrencies}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-arrow-repeat"
            viewBox="0 0 16 16"
          >
            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9" />
            <path
              fillRule="evenodd"
              d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"
            />
          </svg>
        </button>
        <div className="output-container">
          <label htmlFor="output-amount">Amount to receive</label>
          <div className="content">
            <input
              id="output-amount"
              type="text"
              value={outputAmount}
              disabled
            />
            <select
              id="to-currency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="VND">VND</option>
            </select>
          </div>
        </div>

        <button type="button" onClick={calculateSwap}>
          CONFIRM SWAP
        </button>
      </form>
    </div>
  );
};

export default App;
