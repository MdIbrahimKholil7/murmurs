import React, { useState, useEffect } from 'react';
import { getOwnTimeline, Murmur, getFollowers, getFollowing, followUser, unfollowUser } from '../axiosApi/murmurApi';
import MurmurCard from './MurmurCard';
import { Pagination } from './Pagination';

interface OtherUserProfileProps {
    currentUserId: number;
    otherUserId: number;
}

const OtherUserProfile: React.FC<OtherUserProfileProps> = ({
    currentUserId,
    otherUserId,
}) => {
    const [murmurs, setMurmurs] = useState<Murmur[]>([]);
    const [userName, setUserName] = useState('');
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const perPage = 10;

    const fetchUserData = async (pageNum: number) => {
        setLoading(true);
        try {
            const murmursData = await getOwnTimeline(otherUserId, pageNum, perPage);
            setMurmurs(murmursData);
            if (murmursData.length > 0) {
                setUserName(murmursData[0].user.name);
            }

            const followersData = await getFollowers(otherUserId);
            setFollowersCount(followersData.length);
            setIsFollowing(followersData.some(follower => follower.id === currentUserId));


            const followingData = await getFollowing(otherUserId);
            setFollowingCount(followingData.length);

        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Failed to load user profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (otherUserId) {
            fetchUserData(page);
        }
    }, [page, otherUserId, currentUserId]);

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await unfollowUser(currentUserId, otherUserId);
                setFollowersCount(prev => prev - 1);
                setIsFollowing(false);
            } else {
                await followUser(currentUserId, otherUserId);
                setFollowersCount(prev => prev + 1);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
            alert('Failed to toggle follow');
        }
    };

    const handleNextPage = () => setPage(prev => prev + 1);
    const handlePrevPage = () => setPage(prev => Math.max(1, prev - 1));

    if (!otherUserId) return <div>No user selected.</div>;

    return (
        <div style={styles.container}>
            <div style={styles.profileHeader}>
                <div style={styles.avatar}>
                    {userName.charAt(0).toUpperCase()}
                </div>
                <div style={styles.profileInfo}>
                    <h2 style={styles.name}>{userName}</h2>
                    <div style={styles.stats}>
                        <span style={styles.stat}>
                            <strong>{murmurs.length}</strong> Murmurs
                        </span>
                        <span style={styles.stat}>
                            <strong>{followersCount}</strong> Followers
                        </span>
                        <span style={styles.stat}>
                            <strong>{followingCount}</strong> Following
                        </span>
                    </div>
                    {currentUserId !== otherUserId && (
                        <button
                            onClick={handleFollowToggle}
                            style={isFollowing ? styles.unfollowButton : styles.followButton}
                        >
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                    )}
                </div>
            </div>

            <div style={styles.murmursSection}>
                <h3 style={styles.sectionTitle}>{userName}'s Murmurs</h3>

                {loading ? (
                    <div style={styles.loading}>Loading...</div>
                ) : murmurs.length === 0 ? (
                    <div style={styles.empty}>
                        This user hasn't posted any murmurs yet.
                    </div>
                ) : (
                    <>
                        {murmurs.map(murmur => (
                            <MurmurCard
                                key={murmur.id}
                                murmur={murmur}
                                currentUserId={currentUserId}
                                onLikeToggle={() => fetchUserData(page)}
                            />
                        ))}

                        <Pagination
                            page={page}
                            handlePrevPage={handlePrevPage}
                            handleNextPage={handleNextPage}
                            isNextPageDisabled={murmurs.length < perPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
    },
    profileHeader: {
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        display: 'flex',
        gap: '16px',
    },
    avatar: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#1da1f2',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        fontWeight: 'bold',
    },
    profileInfo: {
        flex: 1,
    },
    name: {
        fontSize: '24px',
        margin: '0 0 4px 0',
        color: '#333',
    },
    stats: {
        display: 'flex',
        gap: '20px',
        marginBottom: '12px'
    },
    stat: {
        fontSize: '14px',
        color: '#333',
    },
    murmursSection: {
        marginTop: '20px',
    },
    sectionTitle: {
        fontSize: '20px',
        marginBottom: '16px',
        color: '#333',
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        color: '#888',
    },
    empty: {
        textAlign: 'center',
        padding: '40px',
        color: '#888',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
    },
    followButton: {
        backgroundColor: '#1da1f2',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
    },
    unfollowButton: {
        backgroundColor: '#ff4444',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
    },
};

export default OtherUserProfile;
