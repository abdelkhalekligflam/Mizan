import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const page=readFileSync(new URL("../src/app/page.tsx",import.meta.url),"utf8");
const styles=readFileSync(new URL("../src/app/globals.css",import.meta.url),"utf8");
const layout=readFileSync(new URL("../src/app/layout.tsx",import.meta.url),"utf8");

test("keyboard users can skip navigation to main content",()=>{
 assert.match(page,/href="#mizan-main"/);
 assert.match(page,/id="mizan-main"/);
 assert.match(page,/tabIndex=\{-1\}/);
 assert.match(page,/focus:not-sr-only/);
});
test("links and form controls have keyboard focus outlines",()=>{
 assert.match(styles,/a:focus-visible/);
 assert.match(styles,/button:focus-visible/);
 assert.match(styles,/input:focus-visible/);
});
test("mobile and desktop responsive rules are present",()=>{
 assert.match(styles,/@media\(max-width:640px\)/);
 assert.match(styles,/@media\(min-width:1024px\)/);
 assert.match(page,/mizan-mobile-dock/);
 assert.match(page,/mizan-sidebar/);
});
test("theme supports dark and light modes",()=>{
 assert.match(page,/data-theme=\{dark\?"dark":"light"\}/);
 assert.match(styles,/data-theme="dark"/);
 assert.match(page,/mizan-theme/);
});
test("reduced motion and bilingual document direction are supported",()=>{
 assert.match(styles,/prefers-reduced-motion:reduce/);
 assert.match(page,/document\.documentElement\.dir/);
 assert.match(page,/document\.documentElement\.lang/);
 assert.match(layout,/<html lang="fr">/);
});
