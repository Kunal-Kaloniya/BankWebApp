import { Account } from "../models/account.model.js";

export const isValidAccNum = async (accNumber) => {
    try {
        const existingAccount = await Account.findOne({ accountNumber: accNumber });
        if (!existingAccount) {
            return false;
        }

        return true;
    } catch (err) {
        console.error("Unable to verify the account number: ", err);
    }
}