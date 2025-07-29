import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { CgProfile } from "react-icons/cg";

function Dashboard() {

    const { user } = useContext(AuthContext);
    const [account, setAccount] = useState({});

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/accounts/${user.id}`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
                setAccount(response.data);
            } catch (err) {
                console.error("unable to fetch account details!");
            }
        }

        fetchAccountDetails();
    }, [])

    return (
        <div>
            <section className="w-ful flex flex-col items-center justify-center pt-24 px-20">
                <div className="text-9xl rounded-full"><CgProfile /></div>
                <h1 className="text-center font-bold pt-2">{user?.username}</h1>
                <p>User since: {user?.createdAt.slice(8, 10)}-{user?.createdAt.slice(5, 7)}-{user?.createdAt.slice(0, 4)}</p>
                <hr className="w-full mt-5 text-gray-400" />
            </section>

            <section className="w-ful flex items-stretch justify-center gap-10 py-15 px-20">
                <div className="flex-1 rounded-xl shadow-md border p-8 bg-white dark:bg-slate-800">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Account Overview</h2>
                    <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-700 dark:text-gray-300 font-mono">
                        <div className="font-semibold">Account Holder</div>
                        <div>{user?.username}</div>

                        <div className="font-semibold">Account Number</div>
                        <div className="tracking-wider">{account?.accountNumber}</div>

                        <div className="font-semibold">Balance</div>
                        <div className="text-green-600 dark:text-green-400 font-semibold">$ {account?.balance}</div>

                        <div className="font-semibold">Account Status</div>
                        <div className={`${account?.isFrozen ? "text-red-500" : "text-green-500"} font-bold`}>
                            {account?.isFrozen ? "Frozen" : "Active"}
                        </div>
                    </div>
                </div>
                <div className="flex-1 rounded-xl shadow-md border p-8 bg-white dark:bg-slate-800">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Actions</h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <button className="flex-1 px-4 py-2 font-semibold rounded-md border-2 border-green-500 text-green-500 hover:text-white hover:bg-green-500 transition-all">
                                Withdraw Money
                            </button>
                            <button className="flex-1 px-4 py-2 font-semibold rounded-md border-2 border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 transition-all">
                                Deposit Fund
                            </button>
                        </div>
                        <button className="px-4 py-2 font-semibold rounded-md border-2 border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500 transition-all">
                            Transfer Money
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Dashboard;