interface VersionInfoProps {
  version: string;
  lastUpdated?: string;
}

export function VersionInfo({ version, lastUpdated }: VersionInfoProps) {
  return (
    <div className="text-[10px] text-gray-400 text-center py-2 border-t border-gray-100 mt-8">
      <span>v{version}</span>
      {lastUpdated && (
        <span className="ml-1">({lastUpdated})</span>
      )}
    </div>
  );
} 