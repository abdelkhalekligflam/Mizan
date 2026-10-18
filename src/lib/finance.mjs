/** Pure finance helpers: no network access or UI side effects. */
export function sumAmounts(items){return items.reduce((sum,item)=>sum+(Number.isFinite(item.amount)?item.amount:0),0)}
export function goalProgress(saved,target){if(!Number.isFinite(saved)||!Number.isFinite(target)||target<=0)return 0;return Math.min(100,Math.max(0,saved/target*100))}
export function recurringTotals(items){const active=items.filter(item=>item.active);const expenses=sumAmounts(active.filter(item=>item.type==="expense"));const income=sumAmounts(active.filter(item=>item.type==="income"));return {expenses,income,annualExpenses:expenses*12}}
export function availableBalance(entries,savingsMovements){const income=sumAmounts(entries.filter(e=>e.type==="income"));const expenses=sumAmounts(entries.filter(e=>e.type==="expense"));const transferred=savingsMovements.filter(m=>m.affects_balance).reduce((sum,m)=>sum+(m.kind==="withdrawal"?-m.amount:m.amount),0);return income-expenses-transferred}
