import axios from 'axios';
import { User } from './userApi';

const API_BASE_URL = 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



export interface Murmur {
  id: number;
  text: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
  likes: Like[];
}

export interface Like {
  id: number;
  user: {
    name: string;
    id: number;
  };
}

export interface Follow {
  id: number;
  follower: User;
  following: User;
}


export const createMurmur = async (userId: number, text: string) => {
  const response = await api.post<Murmur>(`/murmurs/me/${userId}`, { text });
  return response.data;
};

export const deleteMurmur = async (userId: number, murmurId: number) => {
  const response = await api.delete<Murmur>(`/murmurs/me/${userId}/${murmurId}`);
  return response.data;
};

export const likeMurmur = async (userId: number, murmurId: number) => {
  const response = await api.post<Like>(`/murmurs/like/${userId}/${murmurId}`);
  return response.data;
};

export const unlikeMurmur = async (userId: number, murmurId: number) => {
  const response = await api.delete<Like>(`/murmurs/like/${userId}/${murmurId}`);
  return response.data;
};

export const getOwnTimeline = async (userId: number, page: number = 1, perPage: number = 10) => {
  const response = await api.get<Murmur[]>(`/murmurs/own-timeline/${userId}`, {
    params: { page, perPage },
  });
  return response.data;
};

export const getFollowTimeline = async (userId: number, page: number = 1, perPage: number = 10) => {
  const response = await api.get<Murmur[]>(`/murmurs/follow-timeline/${userId}`, {
    params: { page, perPage },
  });
  return response.data;
};


export const followUser = async (followerId: number, followeeId: number) => {
  const response = await api.post<Follow>(`/follows/${followerId}/${followeeId}`);
  return response.data;
};

export const unfollowUser = async (followerId: number, followeeId: number) => {
  const response = await api.delete<Follow>(`/follows/${followerId}/${followeeId}`);
  return response.data;
};

export const getFollowing = async (userId: number) => {
  const response = await api.get<User[]>(`/follows/following/${userId}`,);
  return response.data;
};

export const getFollowers = async (userId: number) => {
  const response = await api.get<User[]>(`/follows/followers/${userId}`);
  return response.data;
};

export default api;