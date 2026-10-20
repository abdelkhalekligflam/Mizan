/** Pure finance helpers: no network access or UI side effects. */
export function sumAmounts(items){return items.reduce((sum,item)=>sum+(Number.isFinite(item.amount)?item.amount:0),0)}
export function goalProgress(saved,target){if(!Number.isFinite(saved)||!Number.isFinite(target)||target<=0)return 0;return Math.min(100,Math.max(0,saved/target*100))}
export function recurringTotals(items){const active=items.filter(item=>item.active);const expenses=sumAmounts(active.filter(item=>item.type==="expense"));const income=sumAmounts(active.filter(item=>item.type==="income"));return {expenses,income,annualExpenses:expenses*12}}
export function availableBalance(entries,savingsMovements){const income=sumAmounts(entries.filter(e=>e.type==="income"));const expenses=sumAmounts(entries.filter(e=>e.type==="expense"));const transferred=savingsMovements.filter(m=>m.affects_balance).reduce((sum,m)=>sum+(m.kind==="withdrawal"?-m.amount:m.amount),0);return income-expenses-transferred}

/** Monthly cash flow and expense share, excluding non-finite amounts. */
export function monthlyCashFlow(entries,month){
 const valid=entries.filter(e=>typeof e.date==="string"&&e.date.slice(0,7)===month);
 const income=sumAmounts(valid.filter(e=>e.type==="income"));
 const expenses=sumAmounts(valid.filter(e=>e.type==="expense"));
 return {income,expenses,net:income-expenses,savingsRate:income>0?Math.round((income-expenses)/income*100):null};
}
/** Group expenses by category, descending, for spending insights. */
export function spendingByCategory(entries,month){
 const totals=new Map();
 for(const e of entries){
  if(e.type!=="expense"||typeof e.date!=="string"||e.date.slice(0,7)!==month||!Number.isFinite(e.amount)||e.amount<=0)continue;
  const key=typeof e.category==="string"&&e.category.trim()?e.category.trim():"Autre";
  totals.set(key,(totals.get(key)||0)+e.amount);
 }
 return [...totals].map(([category,amount])=>({category,amount})).sort((a,b)=>b.amount-a.amount||a.category.localeCompare(b.category));
}
/** Budget progress, including over-budget status without truncating actual spend. */
export function budgetHealth(spent,limit){
 if(!Number.isFinite(spent)||!Number.isFinite(limit)||limit<=0)return {percent:0,remaining:0,status:"unconfigured"};
 const percent=Math.max(0,spent)/limit*100;
 return {percent,remaining:limit-spent,status:percent>=100?"over":percent>=80?"warning":"healthy"};
}

/** Available budget for a month. Rollovers start at activation month, never retroactively.
 * Only positive unused allocations carry forward; overspending does not create debt.
 * This is an allocation display, not cash or a new transaction.
 */
export function budgetRollover(entries,category,limit,month,enabledFrom){
 const base=Number.isFinite(limit)&&limit>0?limit:0;
 const spent=(key)=>entries.reduce((sum,e)=>sum+(e.type==="expense"&&e.category===category&&typeof e.date==="string"&&e.date.slice(0,7)===key&&Number.isFinite(e.amount)?Math.max(0,e.amount):0),0);
 const valid=/^\d{4}-(0[1-9]|1[0-2])$/;
 if(!valid.test(month))return {carry:0,available:base,spent:0,remaining:base};
 const currentSpent=spent(month);
 if(!enabledFrom||!valid.test(enabledFrom)||enabledFrom>=month||base===0)return {carry:0,available:base,spent:currentSpent,remaining:base-currentSpent};
 let [year,mon]=enabledFrom.split("-").map(Number);
 const [endYear,endMon]=month.split("-").map(Number);
 let carry=0;
 // Bound the walk for safety if a malformed/ancient activation date is supplied.
 for(let i=0;i<600&&(year<endYear||(year===endYear&&mon<endMon));i++){
  const key=`${year}-${String(mon).padStart(2,"0")}`;
  carry=Math.max(0,base+carry-spent(key));
  mon++;if(mon===13){mon=1;year++}
 }
 const available=base+carry;
 return {carry,available,spent:currentSpent,remaining:available-currentSpent};
}
