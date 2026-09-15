import {resolve} from 'node:path';

export function cloudflareBindings(values=process.env){
 const databaseId=values.SARANG_D1_DATABASE_ID;
 const bucket=values.SARANG_R2_BUCKET;
 const publicUrl=values.PUBLIC_SITE_URL;
 if(!databaseId||!/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/.test(databaseId)||databaseId.startsWith('00000000-'))throw new Error('Set SARANG_D1_DATABASE_ID to your Cloudflare D1 database ID.');
 if(!bucket||!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(bucket))throw new Error('Set SARANG_R2_BUCKET to your Cloudflare R2 bucket name.');
 if(!publicUrl||new URL(publicUrl).protocol!=='https:')throw new Error('Set PUBLIC_SITE_URL to the public HTTPS address.');
 return {
  name:values.SARANG_WORKER_NAME||'sarang-hangeul-school',main:'vinext/server/fetch-handler',
  compatibility_date:'2026-09-15',compatibility_flags:['nodejs_compat'],workers_dev:true,
  d1_databases:[{binding:'DB',database_name:'sarang-school',database_id:databaseId,migrations_dir:resolve('drizzle')}],
  r2_buckets:[{binding:'BUCKET',bucket_name:bucket}],
  vars:{PUBLIC_SITE_URL:new URL(publicUrl).origin,...(values.GOOGLE_SITE_VERIFICATION?{GOOGLE_SITE_VERIFICATION:values.GOOGLE_SITE_VERIFICATION}:{})},
 };
}
