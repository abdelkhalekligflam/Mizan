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
