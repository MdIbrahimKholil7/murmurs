import React, { useState, useEffect } from 'react';
import { getOwnTimeline, Murmur } from '../axiosApi/murmurApi';
import MurmurCard from './MurmurCard';
import { Pagination } from './Pagination';

interface OwnProfileProps {
    currentUserId: number;
    currentUserName: string;
    currentUserEmail: string;
}

const OwnProfile: React.FC<OwnProfileProps> = ({
    currentUserId,
    currentUserName,
    currentUserEmail
}) => {
    const [murmurs, setMurmurs] = useState<Murmur[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const perPage = 10;

    const fetchOwnMurmurs = async (pageNum: number) => {
        setLoading(true);
        try {
            const data = await getOwnTimeline(currentUserId, pageNum, perPage);
            setMurmurs(data);
        } catch (error) {
            console.error('Error fetching own murmurs:', error);
            alert('Failed to load your murmurs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOwnMurmurs(page);
    }, [page, currentUserId]);

    const handleNextPage = () => setPage(prev => prev + 1);
    const handlePrevPage = () => setPage(prev => Math.max(1, prev - 1));

    return (
        <div style={styles.container}>
            <div style={styles.profileHeader}>
                <div style={styles.avatar}>
                    {currentUserName.charAt(0).toUpperCase()}
                </div>
                <div style={styles.profileInfo}>
                    <h2 style={styles.name}>{currentUserName}</h2>
                    <p style={styles.email}>{currentUserEmail}</p>
                    <div style={styles.stats}>
                        <span style={styles.stat}>
                            <strong>{murmurs.length}</strong> Murmurs
                        </span>
                    </div>
                </div>
            </div>

            <div style={styles.murmursSection}>
                <h3 style={styles.sectionTitle}>Your Murmurs</h3>

                {loading ? (
                    <div style={styles.loading}>Loading...</div>
                ) : murmurs.length === 0 ? (
                    <div style={styles.empty}>
                        You haven't posted any murmurs yet.
                    </div>
                ) : (
                    <>
                        {murmurs.map(murmur => (
                            <MurmurCard
                                key={murmur.id}
                                murmur={murmur}
                                currentUserId={currentUserId}
                                onDelete={() => fetchOwnMurmurs(page)}
                                onLikeToggle={() => fetchOwnMurmurs(page)}
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
    email: {
        fontSize: '14px',
        color: '#888',
        margin: '0 0 12px 0',
    },
    stats: {
        display: 'flex',
        gap: '20px',
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
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        marginTop: '20px',
    },
    paginationButton: {
        backgroundColor: '#1da1f2',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    pageInfo: {
        fontSize: '14px',
        color: '#333',
    },
};

export default OwnProfile;