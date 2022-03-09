import { writable } from "svelte/store";
import type { Account, User } from "$lib/types/user";

function createUserStore() {
    const { subscribe, set, update } = writable<User | null>();

    const addAccount = (account: Account) => {
        update(curUser => {
            return {
                ...curUser,
                accounts: [...curUser.accounts, account]
            };
        });
    };

    const removeAccount = (id: string) => {
        update(curUser => {
            return {
                ...curUser,
                accounts: curUser.accounts.filter(account => account.id !== id)
            };
        });
    };

    return { subscribe, set, update, addAccount, removeAccount };
}

export const userStore = createUserStore();