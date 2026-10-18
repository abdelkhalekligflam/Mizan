import test from "node:test";
import assert from "node:assert/strict";
import {sumAmounts,goalProgress,recurringTotals,availableBalance} from "../src/lib/finance.mjs";
test("amounts sum accurately and ignore invalid values",()=>{assert.equal(sumAmounts([{amount:100},{amount:50},{amount:NaN}]),150)});
test("goal progress is capped and zero target is safe",()=>{assert.equal(goalProgress(50,200),25);assert.equal(goalProgress(200,100),100);assert.equal(goalProgress(10,0),0);assert.equal(goalProgress(-10,100),0)});
test("only active recurring charges are counted",()=>{assert.deepEqual(recurringTotals([{active:true,type:"expense",amount:100},{active:false,type:"expense",amount:1000},{active:true,type:"income",amount:250}]),{expenses:100,income:250,annualExpenses:1200})});
test("savings deposits decrease and withdrawals restore available balance",()=>{assert.equal(availableBalance([{type:"income",amount:1000},{type:"expense",amount:200}],[{kind:"deposit",amount:300,affects_balance:true},{kind:"withdrawal",amount:100,affects_balance:true}]),600)});
test("historical savings that do not affect balance are excluded",()=>{assert.equal(availableBalance([{type:"income",amount:1000}],[{kind:"initial",amount:500,affects_balance:false}]),1000)});

test("recurring totals ignore inactive and invalid amounts",()=>{assert.deepEqual(recurringTotals([{active:true,type:"expense",amount:NaN},{active:false,type:"income",amount:999},{active:true,type:"income",amount:20}]),{expenses:0,income:20,annualExpenses:0})});
test("available balance handles empty ledgers",()=>{assert.equal(availableBalance([],[]),0)});
test("savings withdrawals can restore balance independently",()=>{assert.equal(availableBalance([{type:"expense",amount:40}],[{kind:"withdrawal",amount:100,affects_balance:true}]),60)});
