import {execSync} from 'child_process';

function main(packageName: string, serviceAccountKey: string) {
  try {
    const command = `google-play tracks get --package-name "${packageName}" --track "production" --credentials "${serviceAccountKey}"`;
    const result = execSync(command, {stdio: 'pipe'}).toString();

    const data = JSON.parse(result);
    let latestVersionName = '';

    for (const release of data.releases) {
      if (release.status === 'draft') {
        latestVersionName = release.name;
        break;
      }
    }

    if (latestVersionName) {
      console.log(latestVersionName);
    } else {
      console.error('No draft version found.');
      process.exit(1);
    }
  } catch (error: any) {
    console.error('Error processing the command output:', error?.message);
    process.exit(1);
  }
}

const [, , packageName, serviceAccountKey] = process.argv;

if (!packageName || !serviceAccountKey) {
  console.error(
    'Usage: ts-node extractVersion.ts <PACKAGE_NAME> <SERVICE_ACCOUNT_JSON_KEY>',
  );
  process.exit(1);
}

main(packageName, serviceAccountKey);
