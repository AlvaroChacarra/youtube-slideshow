import { describe, it, expect } from 'vitest';
import { slides } from '../../src/presentation/content';
import { clampPosition, movePosition, couponCase, discountedFlows, type Position } from '../../src/presentation/model';
import { generateIllustrativeBondCloud, fitIllustrativeCurve } from '../../src/domain/curve';

describe('the complete teaching sequence',()=>{
  it('traverses every state and returns to the same state when reversing',()=>{
    const counts=slides.map(s=>s.steps.length);let p:Position={slide:0,step:0};const visited=new Set<string>();
    for(let i=0;i<counts.reduce((a,b)=>a+b,0);i++){
      visited.add(`${p.slide}:${p.step}`);const next=movePosition(p,1,counts);
      if(next.slide!==p.slide||next.step!==p.step)expect(movePosition(next,-1,counts)).toEqual(p);
      p=next;
    }
    expect(slides).toHaveLength(13);expect(visited.size).toBe(43);expect(p).toEqual({slide:12,step:2});
    expect(movePosition({slide:0,step:0},-1,counts)).toEqual({slide:0,step:0});
    expect(clampPosition(NaN,Infinity,counts)).toEqual({slide:0,step:0});
    expect(clampPosition(999,999,counts)).toEqual({slide:12,step:2});
  });
  it('reproduces all coupon comparisons without rounding intermediate values',()=>{
    for(const [c,p,cagr] of [[.08,117.81,.03512],[.01,86.64,.03917],[0,82.19,.04]]){
      const actual=couponCase(c!);expect(actual.price).toBeCloseTo(p!,2);expect(actual.cagr).toBeCloseTo(cagr!,4);
    }
    for(const [c,p] of [[.07,113.36],[.04,100],[.03,95.55]]) expect(couponCase(c!).price).toBeCloseTo(p!,2);
  });
  it('changes only the intended economic variable',()=>{
    const before=discountedFlows(.04),after=discountedFlows(.08);
    expect(after.slice(0,4)).toEqual(before.slice(0,4));expect(after[4]!.amount).toBe(104);expect(after[4]!.pv).toBeLessThan(before[4]!.pv);
    const zero=couponCase(.04,.04,0),reinvested=couponCase(.04,.04,.04);
    expect(reinvested.price).toBe(zero.price);expect(reinvested.flows).toEqual(zero.flows);expect(reinvested.cagr).toBeCloseTo(.04,12);
  });
  it('has real illustrative benchmark observations and a bounded long-end fit',()=>{
    const points=generateIllustrativeBondCloud({seed:42});
    expect(points.filter(p=>p.benchmark).map(p=>p.maturityYears)).toEqual([2,3,5,7,10,15,30,50]);
    const curve=fitIllustrativeCurve({points});
    expect(Math.abs(curve.points.at(-1)!.ytm-points.at(-1)!.ytm)).toBeLessThan(.003);
  });
});
