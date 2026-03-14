import { useEffect, useState } from 'react';

const TrackOrderButton = ({ order, onClick }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const activeStatuses = ['OUT_FOR_DELIVERY'];
        if (activeStatuses.includes(order.status)) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [order.status]);

    if (!show) return <span className="text-gray-400">—</span>;

    return (
        <button
            className="hover:bg-red-500 text-white px-2 py-1 rounded text-nowrap text-[10px] bg-red-400 transition-colors"
            onClick={() => onClick(order)}
        >
            Track Order
        </button>
    );
};

export default TrackOrderButton;
