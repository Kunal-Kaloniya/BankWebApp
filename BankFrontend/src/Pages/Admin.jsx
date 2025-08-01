import { useEffect, useState } from "react";
import axios from "axios";

function Admin() {

    const [accounts, setAccounts] = useState([]);
    const [frozenAccounts, setFrozenAccounts] = useState([]);
    const [totalBalance, setTotalBalance] = useState([]);

    const handleFreezeAccount = async (accountId) => {
        try {
            const response = await axios.put(`http://localhost:3000/admin/freeze/${accountId}`, {}, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })

            console.log("Account frozen!");
        } catch (err) {
            console.error("Unable to freeze account!");
        }
    }

    const handleUnFreezeAccount = async (accountId) => {
        try {
            const response = await axios.put(`http://localhost:3000/admin/unfreeze/${accountId}`, {}, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });

            console.log("Account unfrozen!");
        } catch (err) {
            console.error("Unable to unfreeze account!");
        }
    }

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/admin/accounts', {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });

                setAccounts(response.data);
            } catch (err) {
                console.error("Unable to fetch users");
            }
        }

        const fetchFrozenAccounts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/admin/frozen-accounts', {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });

                setFrozenAccounts(response.data);
            } catch (err) {
                console.error("Unable to fetch frozen accounts");
            }
        }

        fetchAccounts();
        fetchFrozenAccounts();
    }, []);

    useEffect(() => {
        const fetchTotalBalance = async () => {
            try {
                const response = await axios.get('http://localhost:3000/admin/total-balance', {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem('token')
                    }
                });

                setTotalBalance(response.data);
            } catch (err) {
                console.log("Unable to get total balance!");
            }
        }

        fetchTotalBalance();
    }, []);


    return (
        <div className="w-full min-h-[80vh] px-20 py-24 flex flex-col items-top justify-center space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow">
                    <h2 className="text-sm text-gray-500 dark:text-gray-400">👤 Total Users</h2>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{accounts.length}</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow">
                    <h2 className="text-sm text-gray-500 dark:text-gray-400">💰 Total Balance</h2>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">
                        ${totalBalance.length === 0 ? 0 : totalBalance[0].totalBalance}
                    </p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow">
                    <h2 className="text-sm text-gray-500 dark:text-gray-400">❄️ Frozen Accounts</h2>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{frozenAccounts.length} Accounts</p>

                </div>
            </div>

            {accounts.length !== 0 ? (
                <div className="overflow-x-auto rounded-xl shadow bg-white dark:bg-slate-800">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Account No.</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((account, index) => (
                                <tr key={index} className="border-t border-gray-200 dark:border-slate-700">
                                    <td className="p-4">{account.accountHolder?.username}</td>
                                    <td className="p-4">{account.accountHolder?.email}</td>
                                    <td className="p-4">{account.accountNumber}</td>
                                    <td className="p-4">{account.isFrozen ? "Frozen" : "Active"}</td>
                                    <td className="p-4">
                                        {account.isFrozen ? (
                                            <button
                                                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                                onClick={() => handleUnFreezeAccount(account._id)}
                                            >
                                                unFreeze
                                            </button>
                                        ) : (
                                            <button
                                                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                                onClick={() => handleFreezeAccount(account._id)}
                                            >
                                                Freeze
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No registered users!</p>
            )}
        </div>
    );
}

export default Admin;