import React, { useState, useCallback } from 'react';

import { useRepo } from '../context/RepoContext';
import { Button } from './Button';

interface RepositoryInputProps {
  setRepo: (repo: string) => void;
  resetRepo: () => void;
  showRecentRepos: boolean;
}

export const RepositorySection = ({
  setRepo,
  resetRepo,
  showRecentRepos,
}: RepositoryInputProps) => {
  const { repoUrl, setRepoUrl, storedRepoUrls, setStoredRepoUrls } = useRepo();
  const [error, setError] = useState('');

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

  return (
    <div className="mb-4 text-gray-700 dark:text-gray-300">
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
      <div className="mt-2" style={{ minHeight: '1.5em' }}>
        {error && <p className="text-red-600 m-0">{error}</p>}
      </div>
      {showRecentRepos && (
        <div className="text-gray-700 dark:text-gray-300">
          {/* <h2 className="font-bold mb-4">Recent Repositories:</h2> */}
          <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Recent Repositories:
          </span>
          <ul className="mb-4">
            {storedRepoUrls.map((repo, index) => (
              <li
                key={index}
                onClick={() => setRepoUrl(repo)}
                className="cursor-pointer"
              >
                {repo}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
