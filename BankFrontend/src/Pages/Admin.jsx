import { useEffect, useState } from "react";
import axios from "axios";

function Admin() {

    const [users, setUsers] = useState([]);
    const [frozenAccounts, setFrozenAccounts] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/admin/users', {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });

                setUsers(response.data);
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

        fetchUsers();
        fetchFrozenAccounts();
    }, []);

    const handleFreezeAccount = async (accountId) => {
        try {
            const response = await axios.put(`http://localhost:3000/admin/freeze/${accountId}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });

            console.log("Account frozen!");
        } catch (err) {
            console.error("Unable to freeze account!");
        }
    }

    const handleUnFreezeAccount = async (accountId) => {
        try {
            const response = await axios.put(`http://localhost:3000/admin/unfreeze/${accountId}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });

            console.log("Account unfrozen!");
        } catch (err) {
            console.error("Unable to unfreeze account!");
        }
    }

    return (
        <div className="w-full min-h-[80vh] px-20 py-24 flex flex-col items-top justify-center space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow">
                    <h2 className="text-sm text-gray-500 dark:text-gray-400">👤 Total Users</h2>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{users.length}</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow">
                    <h2 className="text-sm text-gray-500 dark:text-gray-400">💰 Total Balance</h2>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">${totalBalance}</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm text-gray-500 dark:text-gray-400">❄️ Frozen Accounts</h2>
                        <button className="mt-2 px-2 py-1 text-[10px] bg-gray-500 text-white rounded-md hover:bg-gray-600">View frozen accounts</button>
                    </div>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{frozenAccounts.length} Accounts</p>

                </div>
            </div>

            <div className="overflow-x-auto rounded-xl shadow bg-white dark:bg-slate-800">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Account No.</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className="border-t border-gray-200 dark:border-slate-700">
                                <td className="p-4">{user.username}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">{user.accountNumber}</td>
                                <td className="p-4">{user.accountId?.isFrozen ? "Frozen" : "Active"}</td>
                                <td className="p-4">
                                    {user.accountId?.isFrozen ? (
                                        <button
                                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                            // onClick={() => handleUnFreezeAccount(user.accountId)}
                                        >
                                            unFreeze
                                        </button>
                                    ) : (
                                        <button
                                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                            // onClick={() => handleFreezeAccount(user.accountId)}
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
        </div>
    );
}

export default Admin;