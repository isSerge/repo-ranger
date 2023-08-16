import { useState, useEffect, useCallback } from 'react';
import { Button } from './Button';
import { useGitHubApi } from '../context/GithubContext';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TokenModal = ({ isOpen, onClose }: TokenModalProps) => {
  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState('');
  const { setToken: setGitHubToken, validateToken } = useGitHubApi();

  const fallbackToDefaultToken = useCallback(() => {
    setGitHubToken('');
    setTokenError('');
    setToken('');
    onClose();
  }, [onClose, setGitHubToken]);

  const handleOutsideClick = (e: React.BaseSyntheticEvent) => {
    if (e.target.className.includes('outside-click-handler')) {
      fallbackToDefaultToken();
    }
  };

  const handleEscapeKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        fallbackToDefaultToken();
      }
    },
    [fallbackToDefaultToken]
  );

  const handleSubmitClick = async () => {
    if (!token) {
      setTokenError('Token must not be empty.');
      return;
    }

    const isValid = await validateToken(token);

    if (!isValid) {
      setTokenError('Token validation failed.');
      return;
    }

    setTokenError('');
    setGitHubToken(token);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKeyPress);
    };
  }, [handleEscapeKeyPress, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
      onClick={handleOutsideClick}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75 outside-click-handler"></div>
        </div>
        <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-gray-100 dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 text-gray-700 dark:text-gray-300">
            <h3 className="text-lg leading-6 font-medium" id="modal-headline">
              Enter GitHub Personal Access Token
            </h3>
            <p className="mt-2 text-sm">
              Please enter your{' '}
              <a
                href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
                target="_blank"
                rel="noreferrer"
                className="font-semibold"
              >
                token
              </a>{' '}
              with read permissions to access private repositories.
            </p>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded p-2 w-full mt-4"
              placeholder="Enter your GitHub token"
            />
            {tokenError && (
              <div className="text-red-600 text-sm mt-2">{tokenError}</div>
            )}
          </div>
          <div className="bg-gray-100 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse text-gray-700 dark:text-gray-300 gap-2">
            <Button onClick={handleSubmitClick}>Submit</Button>
            <Button variant="secondary" onClick={fallbackToDefaultToken}>
              Use default token
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
