import React from 'react';
import { Tag, Percent, DollarSign, Eye, Edit, Trash2 } from 'lucide-react';
import Badge from '../ui/Badge';
import Table from '../ui/Table';
import { FiEdit, FiEye, FiTrash2 } from 'react-icons/fi';
import { useDeleteCouponMutation } from '../../api/services/coupon';
import toast from 'react-hot-toast';
import { useState } from 'react';
import ConfirmationModal from '../ui/ConfirmationModal';

const CouponTable = ({
    coupons = [],
    onToggleStatus,
    onView,
    onEdit,
    isLoading,
    className = '',
}) => {
    const [deleteCouponApi] = useDeleteCouponMutation({ refetchOnMountOrArgChange: true });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Format discount
    console.log(coupons)
    const formatDiscount = (type, value) => {
        if (!value) return 'N/A';
        if (type === 'percentage') return `${value}%`;
        return `$${parseFloat(value).toFixed(2)}`;
    };

    // Format minimum order amount
    const formatAmount = (amount) => {
        if (!amount || amount === '' || amount === 0) return 'No minimum';
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    const deleteCoupon = (id) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteCouponApi(itemToDelete).unwrap();
            toast.success('Coupon deleted successfully');
        } catch (error) {
            console.error("Failed to delete coupon:", error);
            toast.error('Failed to delete coupon');
        } finally {
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    const tableActions = [
        {
            key: 'view',
            label: 'View Details',
            icon: Eye,
            color: 'blue',
            onClick: (item) => onView && onView(item),
        },
        {
            key: 'edit',
            label: 'Edit Coupon',
            icon: Edit,
            color: 'purple',
            onClick: (item) => onEdit && onEdit(item),
        },
        {
            key: 'delete',
            label: 'Delete Coupon',
            icon: Trash2,
            color: 'rose',
            onClick: (item) => deleteCoupon(item._id || item.id),
        },
    ];

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 cursor-pointer ${className}`}>
            {coupons.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No coupons found.</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                        Total coupons in system: {coupons.length}
                    </p>
                </div>
            ) :


                (
                    <>
                        <div className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            Showing {coupons.length} of {coupons.length} coupons

                        </div>
                        {isLoading && <p>Loading...</p>}
                        <Table
                            data={coupons}
                            columns={[
                                {
                                    header: "Coupon Code", key: "code", render: (coupon) => (
                                        <div className="flex items-center gap-3">
                                            <Tag className="w-5 h-5 text-gray-500" />
                                            <span className="font-mono font-bold text-white uppercase tracking-wider">
                                                {coupon.code || 'N/A'}
                                            </span>
                                        </div>
                                    )
                                },
                                {
                                    header: "Discount", key: "value", render: (coupon) => (
                                        <div className="flex items-center gap-2">
                                            {coupon.discountType === 'PERCENTAGE' ? (
                                                <Percent className="w-5 h-5 text-emerald-400" />
                                            ) : (
                                                <DollarSign className="w-5 h-5 text-emerald-400" />
                                            )}
                                            <span className="font-bold text-emerald-400">
                                                {formatDiscount(coupon.discountType?.toLowerCase(), coupon.value)}
                                            </span>
                                            <span className="text-xs text-gray-500 capitalize">
                                                {coupon.discountType?.toLowerCase()}
                                            </span>
                                        </div>
                                    )
                                },
                                {
                                    header: "Min Order", key: "minOrderValue", render: (coupon) => (
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <DollarSign className="w-4 h-4 text-gray-500" />
                                            <span>{formatAmount(coupon.minOrderValue)}</span>
                                        </div>
                                    )
                                },
                                {
                                    header: "Max Discount", key: "maxDiscountLimit", render: (coupon) => (
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <DollarSign className="w-4 h-4 text-gray-500" />
                                            <span>{formatAmount(coupon.maxDiscountLimit)}</span>
                                        </div>
                                    )
                                },
                                {
                                    header: "Usage / Limit", key: "usedCount", render: (coupon) => (
                                        <div className="text-sm">
                                            <p className="text-gray-300 font-medium">
                                                {coupon.usedCount || 0} used
                                            </p>
                                            {coupon.usageLimit ? (
                                                <p className="text-xs text-gray-500">
                                                    Limit: {coupon.usageLimit}
                                                </p>
                                            ) : (
                                                <p className="text-xs text-gray-600">Unlimited</p>
                                            )}
                                        </div>
                                    )
                                },
                                {
                                    header: "Status", key: "status", render: (coupon) => (
                                        <button
                                            onClick={() => onToggleStatus?.(coupon._id || coupon.id)}
                                            disabled={!onToggleStatus}
                                            className="disabled:cursor-not-allowed hover:scale-105 transition-transform"
                                        >
                                            <Badge type={coupon.isActive ? 'active' : 'inactive'}>
                                                {(coupon.isActive ? 'active' : 'inactive').charAt(0).toUpperCase() +
                                                    (coupon.isActive ? 'active' : 'inactive').slice(1)}
                                            </Badge>
                                        </button>
                                    )
                                },
                            ]}
                            actions={tableActions}
                            title="Coupons"
                        />
                    </>
                )}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Coupon?"
                message="Are you sure you want to delete this coupon? This action cannot be undone."
                confirmText="Delete"
                isDangerous={true}
            />
        </div>
    );
};

const CouponsTable = CouponTable;
export default CouponsTable;
export { CouponTable };