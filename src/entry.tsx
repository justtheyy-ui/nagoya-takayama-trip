import React from 'react';
import {createRoot} from 'react-dom/client';
import Dashboard from './trip-dashboard';
const nativeFetch=window.fetch.bind(window);
const config=await nativeFetch('./config.json').then(r=>r.json());
let editKey=sessionStorage.getItem('trip-edit-key')||'';
const rpc=async(name:string,body:unknown)=>nativeFetch(`${config.supabaseUrl}/rest/v1/rpc/${name}`,{method:'POST',headers:{apikey:config.publishableKey,'content-type':'application/json'},body:JSON.stringify(body)});
window.fetch=async(input,init)=>{
 if(input!=='/api/trip')return nativeFetch(input,init);
 if(!config.supabaseUrl||!config.publishableKey)return new Response(JSON.stringify({error:'尚未连接共享数据库'}),{status:503});
 if(init?.method==='POST'){
  if(!editKey){editKey=window.prompt('输入共享编辑口令（只有你和朋友持有）')||'';if(!editKey)return new Response('{}',{status:401});}
  const body=JSON.parse(String(init.body));
  const r=await rpc('save_trip',{p_key:editKey,p_section:body.section,p_payload:body.payload});
  if(!r.ok){editKey='';sessionStorage.removeItem('trip-edit-key');return r;}
  sessionStorage.setItem('trip-edit-key',editKey);
  return new Response(JSON.stringify({updatedBy:'旅行伙伴',updatedAt:new Date().toISOString()}));
 }
 return rpc('read_trip',{});
};
createRoot(document.getElementById('root')!).render(<><div className="hosting-notice">{config.supabaseUrl?'共同编辑：首次保存时输入共享口令':'固定网站已上线 · 云端共享数据库尚未连接，暂时仅供浏览'}</div><Dashboard sharedReady={!!config.supabaseUrl} user={{displayName:'共同旅行',email:'2027 冬季旅行'}} signOutPath='./'/></>);
