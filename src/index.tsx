import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './context/ThemeProvider';
import { NotificationProvider } from './context/NotificationContext';
import { BranchesProvider } from './context/BranchContext';
import { RepoProvider } from './context/RepoContext';
import { FilesProvider } from './context/FilesContext';
import { ResultProvider } from './context/ResultContext';
import { GitHubApiProvider } from './context/GithubContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <GitHubApiProvider>
        <NotificationProvider>
          <RepoProvider>
            <BranchesProvider>
              <FilesProvider>
                <ResultProvider>
                  <App />
                </ResultProvider>
              </FilesProvider>
            </BranchesProvider>
          </RepoProvider>
        </NotificationProvider>
      </GitHubApiProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
