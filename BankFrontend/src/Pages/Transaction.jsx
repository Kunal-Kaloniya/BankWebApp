import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

function Transaction() {

    const { user } = useContext(AuthContext);

    const [currentOperation, setCurrentOperation] = useState("withdraw");
    const [oneWayData, setOneWayData] = useState({ accountId: "", amount: 0 });
    const [twoWayData, setTwoWayData] = useState({ senderId: "", receiverId: "", amount: 0 });
    const [message, setMessage] = useState("");

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
            const response = await axios.post("http://localhost:3000/accounts/transfer-money", twoWayData, {
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
            <div className="w-full grid grid-cols-3 gap-5 text-center">
                <div className="border-r-1">
                    <button
                        onClick={() => { setCurrentOperation("withdraw"); setOneWayData({ accountId: "", amount: 0 }) }}
                        className="font-semibold text-xl cursor-pointer hover:text-blue-700 transition-colors"
                    >
                        Withdraw
                    </button>

                    {currentOperation === "withdraw" && (
                        <form
                            onSubmit={handleOneWaySubmit}
                            className="w-full flex flex-col justify-center px-10 py-24"
                        >
                            <div className="mb-5">
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
                                className="px-4 py-2 font-semibold rounded-md border-2 border-gray-400 text-gray-400 hover:text-white hover:bg-blue-500 transition-all"
                            >
                                Commence Transaction
                            </button>
                        </form>
                    )}
                </div>
                <div className="border-r-1">
                    <button
                        onClick={() => { setCurrentOperation("deposit"); setOneWayData({ accountId: "", amount: 0 }) }}
                        className="font-semibold text-xl cursor-pointer hover:text-blue-700 transition-colors"
                    >
                        Deposit
                    </button>

                    {currentOperation === "deposit" && (
                        <form onSubmit={handleOneWaySubmit}>
                            <label htmlFor="amount">Amount to deposit: </label>
                            <input name="amount" id="depositAmount" value={oneWayData.amount} onChange={handleOneWayChange} type="number" />

                            <button
                                type="submit"
                                className="px-4 py-2 font-semibold rounded-md border-2 border-gray-400 text-gray-400 hover:text-white hover:bg-blue-500 transition-all"
                            >
                                Commence Transaction
                            </button>
                        </form>
                    )}
                </div>
                <div>
                    <button
                        onClick={() => { setCurrentOperation("transfer"); setTwoWayData({ senderId: "", receiverId: "", amount: 0 }) }}
                        className="font-semibold text-xl cursor-pointer hover:text-blue-700 transition-colors"
                    >
                        Transfer
                    </button>

                    {currentOperation === "transfer" && (
                        <form onSubmit={handleTwoWaySubmit}>
                            <label htmlFor="senderId">From: </label>
                            <input name="senderId" id="senderIs" value="" onChange={handleTwoWayChange} type="text" disabled />

                            <label htmlFor="receiverId">To: </label>
                            <input name="receiverId" id="receiverId" value={oneWayData.receiverId} onChange={handleTwoWayChange} type="text" />

                            <label htmlFor="amount">Amount to transfer: </label>
                            <input name="amount" id="amount" value={twoWayData.amount} onChange={handleTwoWayChange} type="number" />

                            <button
                                type="submit"
                                className="px-4 py-2 font-semibold rounded-md border-2 border-gray-400 text-gray-400 hover:text-white hover:bg-blue-500 transition-all"
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