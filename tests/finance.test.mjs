import test from "node:test";
import assert from "node:assert/strict";
import {sumAmounts,goalProgress,recurringTotals,availableBalance,monthlyCashFlow,spendingByCategory,budgetHealth,budgetRollover} from "../src/lib/finance.mjs";
test("amounts sum accurately and ignore invalid values",()=>{assert.equal(sumAmounts([{amount:100},{amount:50},{amount:NaN}]),150)});
test("goal progress is capped and zero target is safe",()=>{assert.equal(goalProgress(50,200),25);assert.equal(goalProgress(200,100),100);assert.equal(goalProgress(10,0),0);assert.equal(goalProgress(-10,100),0)});
test("only active recurring charges are counted",()=>{assert.deepEqual(recurringTotals([{active:true,type:"expense",amount:100},{active:false,type:"expense",amount:1000},{active:true,type:"income",amount:250}]),{expenses:100,income:250,annualExpenses:1200})});
test("savings deposits decrease and withdrawals restore available balance",()=>{assert.equal(availableBalance([{type:"income",amount:1000},{type:"expense",amount:200}],[{kind:"deposit",amount:300,affects_balance:true},{kind:"withdrawal",amount:100,affects_balance:true}]),600)});
test("historical savings that do not affect balance are excluded",()=>{assert.equal(availableBalance([{type:"income",amount:1000}],[{kind:"initial",amount:500,affects_balance:false}]),1000)});

test("recurring totals ignore inactive and invalid amounts",()=>{assert.deepEqual(recurringTotals([{active:true,type:"expense",amount:NaN},{active:false,type:"income",amount:999},{active:true,type:"income",amount:20}]),{expenses:0,income:20,annualExpenses:0})});
test("available balance handles empty ledgers",()=>{assert.equal(availableBalance([],[]),0)});
test("savings withdrawals can restore balance independently",()=>{assert.equal(availableBalance([{type:"expense",amount:40}],[{kind:"withdrawal",amount:100,affects_balance:true}]),60)});

test("goal progress rejects non-finite saved amounts",()=>{assert.equal(goalProgress(NaN,100),0);assert.equal(goalProgress(Infinity,100),0)});

test("monthly cash flow ignores other months and reports savings rate",()=>{assert.deepEqual(monthlyCashFlow([{date:"2026-10-01",type:"income",amount:1000},{date:"2026-10-02",type:"expense",amount:250},{date:"2026-09-30",type:"expense",amount:999}],"2026-10"),{income:1000,expenses:250,net:750,savingsRate:75})});
test("monthly cash flow avoids division by zero",()=>{assert.equal(monthlyCashFlow([{date:"2026-10-01",type:"expense",amount:20}],"2026-10").savingsRate,null)});
test("spending categories rank highest first and ignore invalid values",()=>{assert.deepEqual(spendingByCategory([{date:"2026-10-01",type:"expense",category:"Food",amount:30},{date:"2026-10-02",type:"expense",category:"Rent",amount:100},{date:"2026-10-03",type:"expense",category:"Food",amount:20},{date:"2026-09-01",type:"expense",category:"Rent",amount:500}],"2026-10"),[{category:"Rent",amount:100},{category:"Food",amount:50}])});
test("budget health exposes 80 percent warning and over-budget state",()=>{assert.deepEqual(budgetHealth(80,100),{percent:80,remaining:20,status:"warning"});assert.deepEqual(budgetHealth(120,100),{percent:120,remaining:-20,status:"over"});assert.equal(budgetHealth(0,0).status,"unconfigured")});

test("rollover is opt-in and starts without retroactive carry",()=>{
 const rows=[{date:"2026-09-10",type:"expense",category:"Food",amount:100},{date:"2026-10-10",type:"expense",category:"Food",amount:700}];
 assert.deepEqual(budgetRollover(rows,"Food",1000,"2026-10",undefined),{carry:0,available:1000,spent:700,remaining:300});
 assert.deepEqual(budgetRollover(rows,"Food",1000,"2026-10","2026-10"),{carry:0,available:1000,spent:700,remaining:300});
 assert.deepEqual(budgetRollover(rows,"Food",1000,"2026-11","2026-10"),{carry:300,available:1300,spent:0,remaining:1300});
});
test("rollover does not generate money or carry overspending as negative debt",()=>{
 const rows=[{date:"2026-10-01",type:"expense",category:"Food",amount:1200},{date:"2026-11-02",type:"expense",category:"Food",amount:400}];
 assert.deepEqual(budgetRollover(rows,"Food",1000,"2026-11","2026-10"),{carry:0,available:1000,spent:400,remaining:600});
 assert.equal(availableBalance(rows,[]),-1600);
});
test("rollover is scoped to category and accumulates unused allocations",()=>{
 const rows=[{date:"2026-10-03",type:"expense",category:"Food",amount:700},{date:"2026-11-03",type:"expense",category:"Food",amount:900},{date:"2026-11-03",type:"expense",category:"Rent",amount:500}];
 assert.deepEqual(budgetRollover(rows,"Food",1000,"2026-12","2026-10"),{carry:400,available:1400,spent:0,remaining:1400});
});
