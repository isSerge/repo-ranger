import { createContext, useContext, useState, FC, ReactNode } from 'react';
import { useSafeLocalStorage } from '../hooks/useSafeLocalStorage';

type RepoState = {
  repoUrl: string;
  repoName: string;
  setRepoName: (repoName: string) => void;
  setRepoUrl: (repoUrl: string) => void;
  storedRepoUrls: string[];
  setStoredRepoUrls: (repos: string[]) => void;
};

const initialRepoState: RepoState = {
  repoName: '',
  repoUrl: '',
  setRepoName: () => {},
  setRepoUrl: () => {},
  storedRepoUrls: [],
  setStoredRepoUrls: () => {},
};

const RepoContext = createContext<RepoState>(initialRepoState);

type Props = {
  children: ReactNode;
};

export const RepoProvider: FC<Props> = ({ children }) => {
  const [storedRepoUrls, setStoredRepoUrls] = useSafeLocalStorage('repositories', []);
  const [repoName, setRepoName] = useState<string>('');
  const [repoUrl, setRepoUrl] = useState<string>('');

  const value = {
    repoName,
    repoUrl,
    setRepoName,
    setRepoUrl,
    storedRepoUrls,
    setStoredRepoUrls,
  };

  return <RepoContext.Provider value={value}>{children}</RepoContext.Provider>;
};

export const useRepo = () => useContext(RepoContext);
