import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const configPath='dist/server/wrangler.json';
const config=JSON.parse(readFileSync(configPath,'utf8'));
if(!config.name||!config.vars?.PUBLIC_SITE_URL||!config.d1_databases?.[0]?.database_id||config.d1_databases[0].database_id.startsWith('00000000-')){
 throw new Error('Build with build:cloudflare and your own Cloudflare resource settings before deploying.');
}
for(const args of [['d1','migrations','apply','DB','--remote'],['deploy']]){
 const result=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js',...args,'--config',configPath],{stdio:'inherit'});
 if(result.error)throw result.error;
 if(result.status!==0)process.exit(result.status??1);
}
