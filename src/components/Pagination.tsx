import { Murmur } from "../axiosApi/murmurApi";

export const Pagination = ({
    page,
    handlePrevPage,
    handleNextPage,
    isNextPageDisabled,
}: {
    page: number;
    handlePrevPage: () => void;
    handleNextPage: () => void;
    isNextPageDisabled: boolean;
}) => (
    <div style={styles.pagination}>
        <button
            onClick={handlePrevPage}
            disabled={page === 1}
            style={styles.paginationButton}
        >
            Previous
        </button>
        <span style={styles.pageInfo}>Page {page}</span>
        <button
            onClick={handleNextPage}
            style={styles.paginationButton}
            disabled={isNextPageDisabled}
        >
            Next
        </button>
    </div>
);

const styles: { [key: string]: React.CSSProperties } = {
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '20px',
    },
    paginationButton: {
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        fontSize: '14px',
        padding: '8px 16px',
        margin: '0 4px',
        borderRadius: '4px',
        transition: 'background-color 0.3s ease',
    },
    paginationButtonActive: {
        backgroundColor: '#007bff',
        color: '#fff',
    },
    pageInfo: {
        fontSize: '14px',
        color: '#333',
    },
};