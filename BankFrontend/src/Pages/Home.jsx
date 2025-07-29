import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

function Home() {

    const { isLogged } = useContext(AuthContext);

    return (
        <div className="">
            <section className="flex flex-col items-center justify-center py-24 text-center px-4">
                <h2 className="text-4xl font-bold mb-4">Banking Made Easy</h2>
                <p className="text-lg max-w-xl mb-6">
                    Manage your money securely, anytime, anywhere. Sign up and get started in seconds.
                </p>
                {
                    isLogged ? (
                        <a href="/user/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700">
                            View your Account
                        </a>
                    ) : (
                        <a href="/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700">
                            Get Started
                        </a>
                    )
                }
            </section>

            <section className="py-16 bg-gray-300 dark:bg-slate-800 px-6">
                <h2 className="text-center text-4xl font-bold mb-10">Our Products</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
                    <div className="border-r-2">
                        <h3 className="text-xl font-semibold mb-2">One Account</h3>
                        <p className="text-sm">There is only one account associated with each user.</p>
                    </div>
                    <div className="border-r-2">
                        <h3 className="text-xl font-semibold mb-2">Withdraw/Deposit/Transfer</h3>
                        <p className="text-sm">Simple and easy withdrawals, deposits and transfers across different accounts.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Transaction History</h3>
                        <p className="text-sm">Track your transaction history whether it's a withdrawal, deposit or a money-transfer.</p>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6">
                <h2 className="text-center text-4xl font-bold mb-10">Features</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
                    <div className="border-r-2">
                        <h3 className="text-xl font-semibold mb-2">🔐 Secure Transfers</h3>
                        <p className="text-sm">Your transactions are protected with top-grade encryption.</p>
                    </div>
                    <div className="border-r-2">
                        <h3 className="text-xl font-semibold mb-2">⚡ Real-time Updates</h3>
                        <p className="text-sm">Track every movement of your money as it happens.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">🌍 24/7 Access</h3>
                        <p className="text-sm">Access your account anytime, from any device.</p>
                    </div>
                </div>
            </section>

            <footer className="text-center py-6 text-sm bg-gray-300 dark:bg-slate-800 text-gray-800 dark:text-gray-400">
                &copy; {new Date().getFullYear()} KBank. All rights reserved.
            </footer>
        </div>
    );
}

export default Home;