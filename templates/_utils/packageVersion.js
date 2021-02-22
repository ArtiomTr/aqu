import { exec } from 'child_process';

const packageVersion = (pkg) =>
  new Promise((resolve, reject) =>
    exec(`npm view ${pkg} version`, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout.trim());
      }
    }),
  );

export default packageVersion;
