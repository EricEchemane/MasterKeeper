import type { Account } from "$lib/types/user";
import { writable } from "svelte/store";

type ViewEditStoreType = {
    showModal: boolean;
    account: Account;
};

function createStore() {
    const { set, update, subscribe } = writable<ViewEditStoreType>({
        showModal: false,
        account: null
    });

    const setAccount = (account: Account) => update(s => ({ ...s, account }));
    const toggleModal = () => update(s => ({ ...s, showModal: !s.showModal }));

    return { set, update, subscribe, setAccount, toggleModal };
}

export const viewEditStore = createStore();