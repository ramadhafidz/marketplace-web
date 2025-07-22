import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    // Dummy data, ganti dengan data asli dari backend jika sudah tersedia
    const saldoRobux = 1200;
    const username = "roblox_user123";
    const transaksi = [
        { id: 1, tanggal: "2025-07-15", jumlah: 400, status: "Sukses" },
        { id: 2, tanggal: "2025-07-10", jumlah: 800, status: "Sukses" },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard Marketplace Robux
                </h2>
            }
        >
            <Head title="Dashboard Robux" />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Info Akun */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="text-gray-500 text-sm mb-2">
                                Akun Roblox
                            </div>
                            <div className="text-lg font-bold">{username}</div>
                        </div>
                        {/* Saldo Robux */}
                        <div className="bg-green-50 shadow rounded-lg p-6 flex flex-col items-start">
                            <div className="text-gray-500 text-sm mb-2">
                                Saldo Robux
                            </div>
                            <div className="text-2xl font-bold text-green-600 mb-2">
                                {saldoRobux}{" "}
                                <span className="text-base font-normal">
                                    Robux
                                </span>
                            </div>
                            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                                Pesan Robux
                            </button>
                        </div>
                    </div>
                    {/* Riwayat Transaksi */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="text-lg font-semibold mb-4">
                            Riwayat Transaksi
                        </div>
                        <table className="min-w-full text-left text-sm">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4">Tanggal</th>
                                    <th className="py-2 px-4">Jumlah</th>
                                    <th className="py-2 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transaksi.map((trx) => (
                                    <tr key={trx.id} className="border-t">
                                        <td className="py-2 px-4">
                                            {trx.tanggal}
                                        </td>
                                        <td className="py-2 px-4">
                                            {trx.jumlah} Robux
                                        </td>
                                        <td className="py-2 px-4">
                                            <span
                                                className={
                                                    trx.status === "Sukses"
                                                        ? "text-green-600"
                                                        : "text-yellow-600"
                                                }
                                            >
                                                {trx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
