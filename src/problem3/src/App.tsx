import * as React from "react";
import "./App.css";
import WalletPage from "./WalletPagePartialRefactor";

// Nếu đang sử dụng TypeScript
const App: React.FC = () => {
  return (
    <div className="App">
      <WalletPage>
        <h1>Welcome to your Wallet</h1>
        <p>Below are your wallet balances:</p>
      </WalletPage>
    </div>
  );
};

export default App;
