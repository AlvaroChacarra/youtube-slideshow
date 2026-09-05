import { useCallback, useEffect, useRef, useState } from 'react';
import type { DeckDefinition, Scenario, Snapshot } from './types';
import { positionOf } from './state';

/** Explicit window relationship + nonce isolates separate presenting sessions.
 * postMessage also works for our self-contained file, unlike origin storage APIs.
 */
export function useWindowSync<S extends Scenario>(deck:DeckDefinition<S>,state:Snapshot<S>,apply:(state:Snapshot<S>)=>void,ready:boolean,presenter:boolean){
  const peer=useRef<Window|null>(null);
  const session=useRef('');
  const latest=useRef(state);latest.current=state;
  const applyRef=useRef(apply);applyRef.current=apply;
  const [connected,setConnected]=useState(false);
  const [error,setError]=useState('');
  const targetOrigin=()=>location.protocol==='file:'?'*':location.origin;
  const send=useCallback((kind:'hello'|'state'|'command',payload?:Snapshot<S>)=>{
    const target=presenter?window.opener:peer.current;
    if(target&&!target.closed)target.postMessage({kind,deckId:deck.id,session:session.current,payload},targetOrigin());
  },[deck.id,presenter]);
  useEffect(()=>{
    if(!ready)return;
    session.current=new URLSearchParams(location.search).get('session')||crypto.randomUUID();
    const receive=(event:MessageEvent)=>{
      const expected=presenter?window.opener:peer.current;
      const data=event.data;
      if(!expected||event.source!==expected||(location.protocol!=='file:'&&event.origin!==location.origin)||data?.session!==session.current||data?.deckId!==deck.id)return;
      if(data.kind==='hello'&&!presenter){setConnected(true);send('state',latest.current);return;}
      if((presenter&&data.kind==='state')||(!presenter&&data.kind==='command')){
        try {positionOf(deck,data.payload);applyRef.current(data.payload);setConnected(true);}catch{/* Reject malformed or stale messages. */}
      }
    };
    addEventListener('message',receive);
    if(presenter)send('hello');
    const check=window.setInterval(()=>{const target=presenter?window.opener:peer.current;if(!target||target.closed)setConnected(false);},1000);
    return()=>{removeEventListener('message',receive);clearInterval(check);};
  },[ready,presenter,deck,send]);
  useEffect(()=>{if(ready&&!presenter)send('state',state);},[state,ready,presenter,send]);
  function open(){
    const url=new URL(location.href);url.searchParams.set('view','presenter');url.searchParams.set('session',session.current);url.searchParams.delete('capture');
    peer.current=window.open(url,`presenter-${session.current}`,'popup,width=1100,height=850');
    if(!peer.current)setError('Permite abrir esta ventana para ver las notas en otra pantalla.');else{setError('');peer.current.focus();}
    return Boolean(peer.current);
  }
  return {open,connected,error,command:(next:Snapshot<S>)=>send('command',next)};
}
