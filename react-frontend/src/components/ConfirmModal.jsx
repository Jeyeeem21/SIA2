/**
 * CONFIRM MODAL COMPONENT
 * 
 * A specialized modal for confirmation dialogs (delete, cancel, etc.)
 * 
 * Design Standards:
 * - Centered icon with colored background
 * - Clear warning message
 * - Two-button layout: Cancel (gray) and Confirm (colored)
 * - Consistent with unified modal design
 * - Backdrop blur effect
 * 
 * Usage:
 * <ConfirmModal
 *   isOpen={showDeleteModal}
 *   onClose={() => setShowDeleteModal(false)}
 *   onConfirm={handleDelete}
 *   title="Delete Item"
 *   message="Are you sure you want to delete this item? This action cannot be undone."
 *   itemName="John Doe"
 *   confirmText="Delete"
 *   type="danger"
 *   icon={<Trash2 className="w-8 h-8" />}
 * />
 */

import { AlertTriangle, Trash2 } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  itemName,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  type = 'danger', // danger, warning, info, success
  icon: CustomIcon = null,
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      button: 'bg-rose-600 hover:bg-rose-700',
    },
    warning: {
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      button: 'bg-amber-600 hover:bg-amber-700',
    },
    info: {
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      button: 'bg-emerald-600 hover:bg-emerald-700',
    },
    success: {
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      button: 'bg-emerald-600 hover:bg-emerald-700',
    },
  };

  const styles = typeStyles[type] || typeStyles.danger;
  const Icon = CustomIcon || (type === 'danger' ? Trash2 : AlertTriangle);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-sm max-w-md w-full">
        <div className="p-6">
          {/* Icon */}
          <div className={`flex items-center justify-center w-16 h-16 ${styles.iconBg} rounded-full mx-auto mb-4`}>
            <Icon className={`w-8 h-8 ${styles.iconColor}`} />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 text-center mb-6">
            {message}
            {itemName && (
              <>
                {' '}
                <span className="font-semibold text-gray-900">{itemName}</span>?
              </>
            )}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-6 py-3 ${styles.button} text-white rounded-lg transition-all font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
