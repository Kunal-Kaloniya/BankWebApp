import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useLocation } from "react-router-dom";

function Transaction() {

    const { user } = useContext(AuthContext);
    // const location = useLocation();

    const [currentOperation, setCurrentOperation] = useState("withdraw");
    const [oneWayData, setOneWayData] = useState({ accountNumber: "", amount: 0 });
    const [twoWayData, setTwoWayData] = useState({ senderAccNum: "", receiverAccNum: "", amount: 0 });
    const [message, setMessage] = useState("");

    // useEffect(() => {
    //     const receivedOperation = location.state;

    //     if (receivedOperation.clicked !== null) setCurrentOperation(receivedOperation.clicked);
    //     else return

    // }, [])

    useEffect(() => {
        const updateSender = () => {
            if (user?.accountNumber) {

                setOneWayData((prev) => ({
                    ...prev,
                    accountNumber: user.accountNumber,
                }));

                setTwoWayData((prev) => ({
                    ...prev,
                    senderAccNum: user.accountNumber,
                }));
            }
        }

        updateSender();
    }, [user]);

    const handleOneWaySubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:3000/accounts/${currentOperation}`, oneWayData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });

            setMessage(response.data.message);
        } catch (err) {
            setMessage(`${currentOperation} failed!`);
            console.error(`${currentOperation} failed!`);
        }
    }

    const handleTwoWaySubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3000/accounts/transfer", twoWayData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });

            setMessage(response.data.message);
        } catch (err) {
            setMessage("Transfer failed!");
            console.error("Transfer failed!");
        }
    }

    const handleOneWayChange = (e) => {
        setOneWayData({ ...oneWayData, [e.target.name]: e.target.value });
    };

    const handleTwoWayChange = (e) => {
        setTwoWayData({ ...twoWayData, [e.target.name]: e.target.value });
    };

    return (
        <div className="w-full min-h-[80vh] px-20 py-24 flex items-top justify-center relative">
            <div className="w-full grid lg:grid-cols-3 sm:grid-cols-1 gap-5 text-center">
                {/* Withdraw from */}
                <div className="lg:border-r-1 lg:border-b-0 sm:border-b-1">
                    <button
                        onClick={() => { setCurrentOperation("withdraw"); setOneWayData((prev) => ({ ...prev, amount: 0 })) }}
                        className="font-semibold text-xl cursor-pointer hover:text-blue-700 transition-colors"
                    >
                        Withdraw
                    </button>

                    {currentOperation === "withdraw" && (
                        <form
                            onSubmit={handleOneWaySubmit}
                            className="w-full flex flex-col justify-center px-10 py-24"
                        >
                            <div className="mb-5 flex justify-between">
                                <label htmlFor="amount">Amount to withdraw: </label>
                                <input
                                    name="amount"
                                    id="withdrawAmount"
                                    value={oneWayData.amount}
                                    onChange={handleOneWayChange}
                                    type="number"
                                    className="bg-gray-100 dark:bg-slate-800 h-10 mb-3 rounded text-center outline-0 border border-gray-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="px-4 py-2 font-semibold rounded-md border-2 border-gray-400 text-gray-700 dark:text-gray-400 hover:text-white hover:bg-blue-500 transition-all"
                            >
                                Commence Transaction
                            </button>
                        </form>
                    )}
                </div>

                {/* Deposit form */}
                <div className="lg:border-r-1 lg:border-b-0 sm:border-b-1">
                    <button
                        onClick={() => { setCurrentOperation("deposit"); setOneWayData((prev) => ({ ...prev, amount: 0 })) }}
                        className="font-semibold text-xl cursor-pointer hover:text-blue-700 transition-colors"
                    >
                        Deposit
                    </button>

                    {currentOperation === "deposit" && (
                        <form
                            onSubmit={handleOneWaySubmit}
                            className="w-full flex flex-col justify-center px-10 py-24"
                        >
                            <div className="mb-5 flex justify-between">
                                <label htmlFor="amount">Amount to deposit: </label>
                                <input
                                    name="amount"
                                    id="depositAmount"
                                    value={oneWayData.amount}
                                    onChange={handleOneWayChange}
                                    type="number"
                                    className="bg-gray-100 dark:bg-slate-800 h-10 mb-3 rounded text-center outline-0 border border-gray-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="px-4 py-2 font-semibold rounded-md border-2 border-gray-400 text-gray-700 dark:text-gray-400 hover:text-white hover:bg-blue-500 transition-all"
                            >
                                Commence Transaction
                            </button>
                        </form>
                    )}
                </div>
                
                {/* Transfer form */}
                <div>
                    <button
                        onClick={() => { setCurrentOperation("transfer"); setTwoWayData((prev) => ({ ...prev, receiverAccNum: "", amount: 0 })) }}
                        className="font-semibold text-xl cursor-pointer hover:text-blue-700 transition-colors"
                    >
                        Transfer
                    </button>

                    {currentOperation === "transfer" && (
                        <form
                            onSubmit={handleTwoWaySubmit}
                            className="w-full flex flex-col justify-center px-10 py-24"
                        >
                            <div className="mb-2 flex justify-between">
                                <label htmlFor="senderAccNum">From: </label>
                                <input
                                    name="senderAccNum"
                                    id="senderIs"
                                    value={twoWayData.senderAccNum}
                                    type="text"
                                    placeholder="XXXX-XXXX-XXXX"
                                    className="bg-gray-100 dark:bg-slate-800 text-black dark:text-white h-10 mb-3 rounded text-center outline-0 border border-gray-500"
                                    disabled
                                />
                            </div>

                            <div className="mb-2 flex justify-between">
                                <label htmlFor="receiverAccNum">To: </label>
                                <input
                                    name="receiverAccNum"
                                    id="receiverAccNum"
                                    value={twoWayData.receiverAccNum}
                                    onChange={handleTwoWayChange}
                                    type="text"
                                    placeholder="XXXX-XXXX-XXXX"
                                    className="bg-gray-100 dark:bg-slate-800 text-black dark:text-white h-10 mb-3 rounded text-center outline-0 border border-gray-500"
                                />
                            </div>

                            <div className="mb-5 flex justify-between">
                                <label htmlFor="amount">Amount to transfer: </label>
                                <input
                                    name="amount"
                                    id="amount"
                                    value={twoWayData.amount}
                                    onChange={handleTwoWayChange}
                                    type="number"
                                    className="bg-gray-100 dark:bg-slate-800 h-10 mb-3 rounded text-center outline-0 border border-gray-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="px-4 py-2 font-semibold rounded-md border-2 border-gray-400 text-gray-700 dark:text-gray-400 hover:text-white hover:bg-blue-500 transition-all"
                            >
                                Commence Transaction
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {message && (
                <p className="absolute left-0 bottom-0 px-10 py-5">{message}</p>
            )}
        </div>
    );
}

export default Transaction;