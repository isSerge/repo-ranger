import React, { useState, useCallback } from 'react';

import { useRepo } from '../context/RepoContext';
import { Button } from './Button';
import { Remove, InfoCircle } from './icons';
import { TokenModal } from './TokenModal';

interface RepositoryInputProps {
  setRepo: (repo: string) => void;
  resetRepo: () => void;
  showRecentRepos: boolean;
}

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

export const RepositorySection = ({
  setRepo,
  resetRepo,
  showRecentRepos,
}: RepositoryInputProps) => {
  const { repoUrl, setRepoUrl, storedRepoUrls, setStoredRepoUrls } = useRepo();
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepoUrl(e.target.value);
    setError('');
  };

  const handleSubmit = useCallback(() => {
    const repoMatch = repoUrl.match(/github.com\/(.+\/.+)(\/|$)/i);

    if (repoMatch && repoMatch[1]) {
      setRepo(repoMatch[1]);
      setError('');

      // Add the new repository URL to the stored repositories if not already stored
      // Move the clicked repository to the front of the list
      if (storedRepoUrls.includes(repoUrl)) {
        setStoredRepoUrls([
          repoUrl,
          ...storedRepoUrls.filter((url) => url !== repoUrl),
        ]);
      } else {
        setStoredRepoUrls([repoUrl, ...storedRepoUrls]);
      }
    } else {
      setError('Invalid GitHub repository URL');
    }
  }, [repoUrl, setRepo, setStoredRepoUrls, storedRepoUrls]);

  const handleResetClick = useCallback(() => {
    setRepoUrl('');
    setError('');
    resetRepo();
  }, [resetRepo, setRepoUrl]);

  const handleRemoveClick = (repoToRemove: string) => {
    setStoredRepoUrls(storedRepoUrls.filter((repo) => repo !== repoToRemove));
  };

  return (
    <div className="mb-4 text-gray-700 dark:text-gray-300">
      <TokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <label htmlFor="repo-url" className="block mb-2">
        GitHub Repository URL:
      </label>
      <div className="flex items-stretch gap-2">
        <input
          type="text"
          id="repo-url"
          value={repoUrl}
          onChange={handleInputChange}
          className={`border ${
            error ? 'border-red-600' : 'border-gray-300 dark:border-gray-700'
          } rounded md:w-2/3 lg:w-1/3 w-full p-2`}
          placeholder="https://github.com/owner/repo"
          aria-label="GitHub Repository URL"
        />
        <Button onClick={handleSubmit} className="rounded-r">
          Load
        </Button>
        {repoUrl && (
          <Button onClick={handleResetClick} variant="danger" className="ml-2">
            Reset
          </Button>
        )}
      </div>
      <div className="mt-2 mb-4" style={{ minHeight: '1.5em' }}>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!error && (
          <div className="flex align-center gap-1">
            <InfoCircle />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              In order to access private repositories -{' '}
              <span
                className="cursor-pointer font-semibold"
                onClick={() => setIsModalOpen(true)}
              >
                add your Github PAT
              </span>
            </p>
          </div>
        )}
      </div>
      {showRecentRepos && storedRepoUrls.length ? (
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
      ) : null}
    </div>
  );
};
