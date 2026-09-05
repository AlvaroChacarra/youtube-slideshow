// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, expect, it, vi } from 'vitest';
import { NumberValue } from '../../src/presentation/primitives';
import { couponCase, euro } from '../../src/presentation/model';

const host=document.createElement('div');
document.body.append(host);
const root=createRoot(host);
Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
afterEach(()=>vi.useRealTimers());
it('commits each financial result and its displayed value together, including rapid reversals',async()=>{
  vi.useFakeTimers();
  for (const g of [0,.08,.04,0,.075,0]) {
    const r=couponCase(.04,.04,g);
    await act(async()=>root.render(<div data-rate={g}><NumberValue value={r.wealth}/><NumberValue value={r.cagr*100}/></div>));
    for(const element of host.querySelectorAll<HTMLElement>('[data-value]')) expect(element.textContent).toBe(euro(Number(element.dataset.value)));
    await act(async()=>vi.advanceTimersByTime(30));
    expect(host.querySelector('[data-value]')!.textContent).toBe(euro(r.wealth));
  }
});
