import { useMemo } from "react";
import * as React from "react";
// Giả định: BoxProps là kiểu cơ bản
interface BoxProps {
  [key: string]: any;
}

// Giả định: Mock hooks `useWalletBalances` và `usePrices`
const useWalletBalances = (): WalletBalance[] => [
  { currency: "USD", amount: 100, blockchain: "Ethereum" },
  { currency: "EUR", amount: 200, blockchain: "Osmosis" },
  { currency: "GBP", amount: 50, blockchain: "Neo" },
];

const usePrices = (): Record<string, number> => ({
  USD: 1,
  EUR: 1.1,
  GBP: 1.25,
});

// Định nghĩa kiểu WalletBalance và FormattedWalletBalance
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// Props cho WalletPage
interface Props extends BoxProps {
  children?: React.ReactNode; // Đảm bảo children được định nghĩa đúng
}

// Component WalletPage
const WalletPage: React.FC<Props> = ({ children, ...rest }: Props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // Hàm lấy độ ưu tiên của blockchain
  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  // Lọc và sắp xếp balances
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0; // Chỉ lấy balance có ưu tiên > -99 và amount > 0
      })
      .sort((lhs, rhs) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority; // Sắp xếp từ ưu tiên cao xuống thấp
      });
  }, [balances]);

  // Định dạng balances
  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance) => ({
      ...balance,
      formatted: balance.amount.toFixed(2), // Giới hạn 2 chữ số thập phân
    }));
  }, [sortedBalances]);

  // Tạo danh sách hàng (rows)
  const rows = useMemo(() => {
    return formattedBalances.map((balance, index) => {
      const usdValue = (prices[balance.currency] || 0) * balance.amount; // Tránh lỗi nếu currency không tồn tại trong prices
      return (
        <div
          key={index}
          style={{ padding: "8px", borderBottom: "1px solid #ccc" }}
        >
          <span>{balance.currency}:</span>
          <span> {balance.formatted}</span>
          <span> (~{usdValue.toFixed(2)} USD)</span>
        </div>
      );
    });
  }, [formattedBalances, prices]);

  // Render
  return (
    <div {...rest} style={{ padding: "16px", border: "1px solid #000" }}>
      {children}
      {rows}
    </div>
  );
};

export default WalletPage;
