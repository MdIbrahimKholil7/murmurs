import React, { useState, useEffect } from 'react';
import { getFollowTimeline, Murmur, createMurmur } from '../axiosApi/murmurApi';
import MurmurCard from './MurmurCard';
import { Pagination } from './Pagination';

interface TimelineProps {
    currentUserId: number;
}

const Timeline: React.FC<TimelineProps> = ({ currentUserId }) => {
    const [murmurs, setMurmurs] = useState<Murmur[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [newMurmurText, setNewMurmurText] = useState('');
    const [posting, setPosting] = useState(false);
    const perPage = 10;

    const fetchTimeline = async (pageNum: number) => {
        setLoading(true);
        try {
            const data = await getFollowTimeline(currentUserId, pageNum, perPage);
            setMurmurs(data);
        } catch (error) {
            console.error('Error fetching timeline:', error);
            alert('Failed to load timeline');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTimeline(page);
    }, [page, currentUserId]);

    const handlePostMurmur = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMurmurText.trim()) return;
        if (newMurmurText.length > 280) {
            alert('Murmur must be 280 characters or less');
            return;
        }

        setPosting(true);
        try {
            await createMurmur(currentUserId, newMurmurText);
            setNewMurmurText('');
            fetchTimeline(page);
        } catch (error) {
            console.error('Error posting murmur:', error);
            alert('Failed to post murmur');
        } finally {
            setPosting(false);
        }
    };

    const handleNextPage = () => setPage(prev => prev + 1);
    const handlePrevPage = () => setPage(prev => Math.max(1, prev - 1));

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Following Timeline</h2>

            <form onSubmit={handlePostMurmur} style={styles.postForm}>
                <textarea
                    value={newMurmurText}
                    onChange={(e) => setNewMurmurText(e.target.value)}
                    placeholder="What's happening?"
                    style={styles.textarea}
                    maxLength={280}
                    rows={4}
                />
                <div style={styles.postFooter}>
                    <span style={styles.charCount}>
                        {newMurmurText.length}/280
                    </span>
                    <button
                        type="submit"
                        disabled={posting || !newMurmurText.trim()}
                        style={styles.postButton}
                    >
                        {posting ? 'Posting...' : 'Post Murmur'}
                    </button>
                </div>
            </form>

            {loading ? (
                <div style={styles.loading}>Loading...</div>
            ) : murmurs.length === 0 ? (
                <div style={styles.empty}>
                    No murmurs to show. Follow some users to see their murmurs!
                </div>
            ) : (
                <>
                    {murmurs.map(murmur => (
                        <MurmurCard
                            key={murmur.id}
                            murmur={murmur}
                            currentUserId={currentUserId}
                            onLikeToggle={() => fetchTimeline(page)}
                            onDelete={() => fetchTimeline(page)}
                        />
                    ))}
                </>
            )}
            <Pagination
                page={page}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                isNextPageDisabled={!murmurs.length}
            />
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
    postForm: {
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
    },
    textarea: {
        width: '100%',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '12px',
        fontSize: '14px',
        resize: 'vertical',
        fontFamily: 'inherit',
    },
    postFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '8px',
    },
    charCount: {
        fontSize: '12px',
        color: '#888',
    },
    postButton: {
        backgroundColor: '#1da1f2',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
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

export default Timeline;