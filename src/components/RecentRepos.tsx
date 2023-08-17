import { useState } from 'react';
import { Remove } from './icons';
import { useRepo } from '../context/RepoContext';

interface RecentRepoItemProps {
  repo: string;
  onSelectClick: () => void;
  onRemoveClick: (event: React.MouseEvent) => void;
}

const RecentRepoItem = ({
  onSelectClick,
  onRemoveClick,
  repo,
}: RecentRepoItemProps) => {
  const [showRemoveIcon, setShowRemoveIcon] = useState(false);
  return (
    <div
      onClick={onSelectClick}
      onMouseOver={() => setShowRemoveIcon(true)}
      onMouseLeave={() => setShowRemoveIcon(false)}
      className="cursor-pointer flex items-center justify-start gap-2 hover:dark:bg-gray-800 rounded p-2 mb-2"
    >
      {repo}
      {showRemoveIcon && (
        <span className="cursor-pointer" onClick={onRemoveClick}>
          <Remove />
        </span>
      )}
    </div>
  );
};

export const RecentRepos = () => {
  const { storedRepoUrls, setStoredRepoUrls, setRepoUrl } = useRepo();

  const handleRemoveClick = (repoToRemove: string) => {
    setStoredRepoUrls(storedRepoUrls.filter((repo) => repo !== repoToRemove));
  };

  if (!storedRepoUrls.length) return null;

  return (
    <div className="text-gray-700 dark:text-gray-300">
      <p className="mb-2 text-gray-700 dark:text-gray-300">
        Recent Repositories:
      </p>
      <div className="mb-4">
        {storedRepoUrls.map((repo) => (
          <RecentRepoItem
            key={repo}
            repo={repo}
            onSelectClick={() => setRepoUrl(repo)}
            onRemoveClick={(e) => {
              e.stopPropagation();
              handleRemoveClick(repo);
            }}
          />
        ))}
      </div>
    </div>
  );
};
