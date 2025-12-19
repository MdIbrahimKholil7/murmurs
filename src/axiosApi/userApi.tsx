import { Murmur, api } from "./murmurApi";


export interface User {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    murmurs?: Murmur[];
}

export const getAllUsers = async (page: number = 1, perPage: number = 10, currentUserId: number) => {
    const response = await api.get<User[]>(`/users/${page}/${perPage}/${currentUserId}`);
    return response.data;
};

export const createUser = async (user: { name: string; email: string }) => {
    const response = await api.post<User>('/users', user);
    return response.data;
};

export const loginByEmail = async (email: string) => {
    const response = await api.post<User>('/users/login', { email });
    return response.data;
}