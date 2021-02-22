import { exec } from 'child_process';

export default packageVersion = (pkg) =>
  new Promise((resolve, reject) =>
    exec(`npm view ${pkg} version`, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout.trim());
      }
    }),
  );
