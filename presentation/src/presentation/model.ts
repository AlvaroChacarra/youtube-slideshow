import { cashFlows } from '../domain/cashflows';
import { priceFromYield, presentValue } from '../domain/discounting';
import { terminalWealth, realizedCagr } from '../domain/reinvestment';

export const canonicalBond = { notional:100, faceValue:100, annualCouponRate:0.04, maturityYears:5 } as const;
export const canonicalFlows = cashFlows(canonicalBond);
export const euro = (n:number, decimals=2) => n.toLocaleString('es-ES',{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
export const percent = (n:number, decimals=2) => `${euro(n*100,decimals)}%`;
export function couponCase(coupon:number, yieldRate=0.04, reinvestment=0) {
  const flows=cashFlows({...canonicalBond,annualCouponRate:coupon});
  const price=priceFromYield({flows,annualEffectiveYield:yieldRate});
  const wealth=terminalWealth({flows,horizonYears:5,annualEffectiveReinvestmentRate:reinvestment});
  return {flows,price,wealth,cagr:realizedCagr({initialPrice:price,terminalWealth:wealth,horizonYears:5})};
}
export function discountedFlows(lastRate:number) {
  return canonicalFlows.map(f=>({...f,rate:f.period===5?lastRate:0.04,pv:presentValue({amount:f.amount,annualEffectiveRate:f.period===5?lastRate:0.04,timeYears:f.timeYears})}));
}
export type Position={slide:number;step:number};
export function clampPosition(slide:number,step:number,counts:readonly number[]):Position {
  const s=Number.isFinite(slide)?Math.min(Math.max(Math.floor(slide),0),counts.length-1):0;
  return {slide:s,step:Number.isFinite(step)?Math.min(Math.max(Math.floor(step),0),(counts[s]??1)-1):0};
}
export function movePosition(p:Position,dir:1|-1,counts:readonly number[]):Position {
  if(dir===1) return p.step<(counts[p.slide]??1)-1?{...p,step:p.step+1}:clampPosition(p.slide+1,p.slide===counts.length-1?p.step:0,counts);
  return p.step>0?{...p,step:p.step-1}:clampPosition(p.slide-1,p.slide>0?(counts[p.slide-1]??1)-1:0,counts);
}
