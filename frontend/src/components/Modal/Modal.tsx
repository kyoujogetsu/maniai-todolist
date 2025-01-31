import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<Props> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg"
        style={{
          width: '400px',
          border: '2px solid #e5e7eb',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <h3 className="text-lg font-medium text-gray-900">
            タスクの完了状態を選択
          </h3>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
