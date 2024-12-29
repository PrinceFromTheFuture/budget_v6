export default function formatCurrency(amountInAgorot: number) {
  const formatter = new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 2,
  });
  return formatter.format(amountInAgorot / 100);
}
