import TransactionHistory from "@/components/user/TransactionHistory";

export const metadata = {
  title: "Transaction History | o-sms",
  description: "View your wallet recharge and package purchase history.",
};

export default function TransactionsPage() {
  return <TransactionHistory />;
}
