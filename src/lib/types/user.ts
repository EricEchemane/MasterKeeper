export type User = {
    id: string;
    nickname: string;
    master_email: string;
    master_avatar: string;
    accounts: Account[];
};

export type Account = {
    id: string;
    username: string;
    url: string;
    password: string;
    account_label: string;
    owner: User;
    ownser_id: string;
};