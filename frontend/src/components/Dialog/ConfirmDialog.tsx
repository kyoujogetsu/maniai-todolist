interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        width: '90%',
        maxWidth: '400px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '12px'
        }}>
          {title}
        </h3>
        <p style={{
          marginBottom: '24px',
          color: '#4b5563'
        }}>
          {message}
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #e5e7eb',
              backgroundColor: 'white',
              color: '#374151',
              cursor: 'pointer'
            }}
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#ef4444',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
} 