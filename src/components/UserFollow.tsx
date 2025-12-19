import React, { useState, useEffect } from 'react';
import { followUser, unfollowUser, getFollowing, getFollowers } from '../axiosApi/murmurApi';
import { User, getAllUsers } from '../axiosApi/userApi';
import { Pagination } from './Pagination';

interface UserSearchProps {
    currentUserId: number;
}

const UserFollow: React.FC<UserSearchProps> = ({ currentUserId }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [following, setFollowing] = useState<number[]>([]);
    const [followers, setFollowers] = useState<User[]>([]);
    const [followingUsers, setFollowingUsers] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<'search' | 'followers' | 'following'>('search');
    const [page, setPage] = useState(1);
    const perPage = 10;

    useEffect(() => {
        fetchFollowData();
    }, [currentUserId]);

    useEffect(() => {
        getUsers({ page, perPage,currentUserId })
    }, [page])

    const getUsers = async ({ page, perPage,currentUserId }: { page: number; perPage: number;currentUserId: number }) => {
        try {
            const users = await getAllUsers(page, perPage,currentUserId);
            setUsers(users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    const fetchFollowData = async () => {
        try {
            const [followersData, followingData] = await Promise.all([
                getFollowers(currentUserId),
                getFollowing(currentUserId),
            ]);
            setFollowers(followersData);
            setFollowingUsers(followingData);
            setFollowing(followingData.map(u => u.id));
        } catch (error) {
            console.error('Error fetching follow data:', error);
        }
    };

    const handleFollow = async (userId: number) => {
        try {
            await followUser(currentUserId, userId);
            setFollowing(prev => [...prev, userId]);
            await fetchFollowData();
        } catch (error) {
            console.error('Error following user:', error);
            alert('Failed to follow user');
        }
    };

    const handleUnfollow = async (userId: number) => {
        if (!window.confirm('Are you sure you want to unfollow this user?')) return;

        try {
            await unfollowUser(currentUserId, userId);
            setFollowing(prev => prev.filter(id => id !== userId));
            await fetchFollowData();
        } catch (error) {
            console.error('Error unfollowing user:', error);
            alert('Failed to unfollow user');
        }
    };

    const renderUserCard = (user: User, showFollowButton: boolean = true) => {
        const isFollowing = following.includes(user?.id);
        return (
            <div key={user?.id} style={styles.userCard}>
                <div style={styles.userAvatar}>
                    {user?.name.charAt(0).toUpperCase()}
                </div>
                <div style={styles.userInfo}>
                    <h3 style={styles.userName}>{user?.name}</h3>
                    <p style={styles.userEmail}>{user?.email}</p>
                </div>
                {showFollowButton && (
                    <button
                        onClick={() => isFollowing ? handleUnfollow(user?.id) : handleFollow(user?.id)}
                        style={{
                            ...styles.followButton,
                            ...(isFollowing ? styles.followingButton : {}),
                        }}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                )}
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Connect with People</h2>

            <div style={styles.tabs}>
                <button
                    onClick={() => setActiveTab('search')}
                    style={{
                        ...styles.tab,
                        ...(activeTab === 'search' ? styles.tabActive : {}),
                    }}
                >
                    Users
                </button>
                <button
                    onClick={() => setActiveTab('followers')}
                    style={{
                        ...styles.tab,
                        ...(activeTab === 'followers' ? styles.tabActive : {}),
                    }}
                >
                    Followers ({followers.length})
                </button>
                <button
                    onClick={() => setActiveTab('following')}
                    style={{
                        ...styles.tab,
                        ...(activeTab === 'following' ? styles.tabActive : {}),
                    }}
                >
                    Following ({followingUsers.length})
                </button>
            </div>

            {activeTab === 'search' && (
                <>
                    <div style={styles.usersList}>
                        {users.length === 0 ? (
                            <div style={styles.empty}>
                                Search for users to connect with them
                            </div>
                        ) : (
                            users.map(user => renderUserCard(user, true))
                        )}

                        <Pagination
                            page={page}
                            handlePrevPage={() => setPage(prev => Math.max(1, prev - 1))}
                            handleNextPage={() => setPage(prev => prev + 1)}
                            isNextPageDisabled={!users.length}
                        />
                    </div>
                </>
            )}

            {activeTab === 'followers' && (
                <div style={styles.usersList}>
                    {followers.length === 0 ? (
                        <div style={styles.empty}>
                            No followers yet
                        </div>
                    ) : (
                        followers.map(user => renderUserCard(user, true))
                    )}
                </div>
            )}

            {activeTab === 'following' && (
                <div style={styles.usersList}>
                    {followingUsers.length === 0 ? (
                        <div style={styles.empty}>
                            You're not following anyone yet
                        </div>
                    ) : (
                        followingUsers.map(user => renderUserCard(user, true))
                    )}
                </div>
            )}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
    },
    tabs: {
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        borderBottom: '2px solid #ddd',
    },
    tab: {
        backgroundColor: 'transparent',
        border: 'none',
        padding: '12px 16px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        color: '#666',
        borderBottom: '2px solid transparent',
        marginBottom: '-2px',
    },
    tabActive: {
        color: '#1da1f2',
        borderBottomColor: '#1da1f2',
    },
    searchForm: {
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
    },
    searchInput: {
        flex: 1,
        padding: '12px',
        fontSize: '14px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    searchButton: {
        backgroundColor: '#1da1f2',
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
    },
    usersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    userCard: {
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    userAvatar: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#1da1f2',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: 'bold',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#333',
        margin: '0 0 4px 0',
    },
    userEmail: {
        fontSize: '14px',
        color: '#666',
        margin: 0,
    },
    followButton: {
        backgroundColor: '#1da1f2',
        color: '#fff',
        border: 'none',
        padding: '8px 20px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
    },
    followingButton: {
        backgroundColor: '#fff',
        color: '#1da1f2',
        border: '1px solid #1da1f2',
    },
    empty: {
        textAlign: 'center',
        padding: '40px',
        color: '#888',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
    },
};

export default UserFollow;