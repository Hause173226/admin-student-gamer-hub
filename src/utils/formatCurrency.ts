export function formatAmountCents(amountCents: number): string {
    if (amountCents === 0) return 'K VND';
    const abbreviated = amountCents >= 1000 ? `${(amountCents / 1000).toFixed(0)}k` : amountCents.toLocaleString('vi-VN');
    return `${abbreviated} VND`; // 🔥 "2k VND" for 2000 cents, "99k VND" for 99,000, "0K VND" for 0
}