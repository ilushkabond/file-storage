import React, {useEffect, useState} from 'react';
import styles from './style.css';

/**
 * Represents a FileViewer component.
 * @FileViewer
 * @return {React.Element}
 */
function FileViewer() {
  //   const [dir, setDir] = useState({})
  const [files, setFiles] = useState<Array<FileInfo>>([]);
  const [path, setPath] = useState('/');
  useEffect(() => {
    fetch(`http://localhost:3000/dir?path=${path}`)
        .then((res) => res.json())
        .then((res) => {
          setFiles(res.files);
        });
  }, [path]);
  return (
    <div>
      {
        path !== '/' && (
          <button
            type="button"
            className={styles.text}
            onClick={() => {
              setPath((lastPath) => {
                const r = lastPath.split('/');
                r.pop();
                return r.join('/');
              });
            }}
          >
            <span>..</span>
          </button>
        )
      }
      {files.map((file, index) => (
        <button
          key={index}
          type="button"
          className={styles.text}
          onClick={() => {
            if (file.isDirectory) {
              setPath((lastPath) => `${lastPath}/${file.name}`);
            } else {
              fetch(`http://localhost:3000/download?path=${`${path}/${file.name}`}`)
                  .then((res) => res.blob())
                  .then((res) => {
                    const a = document.createElement('a');
                    a.download = file.name;
                    a.href = URL.createObjectURL(res);
                    a.click();
                  });
            }
          }}
        >
          <span>{file.name}</span>
          <span>{file.isDirectory ? '...' : ''}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Represents a App component.
 * @App
 * @return {React.Element}
 */
export function App() {
  return <FileViewer />;
}

interface FileInfo {
  isDirectory: boolean,
  name: string
}
