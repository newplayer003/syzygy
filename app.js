/* SYZYGY 신청 페이지 공통 스크립트
 * - 각 페이지(index.html, dj_xxx/index.html)는 OG 메타 + window.PAGE 설정만 갖고, 나머지는 전부 여기서 그립니다.
 * - 페이지별 설정: window.PAGE = { hero: "이미지파일", source: "시트 '유입 경로' 열에 들어갈 값",
 *                               highlight: { name: "라인업 이름", note: "이름 옆 괄호 문구" }  // 선택 }
 * - 이미지 파일은 저장소 루트(index.html 옆)에 두세요. hero 파일이 없으면 hero.jpg 로 대체됩니다.
 */
(function () {
const ROOT = document.currentScript.src.replace(/[^/]*$/, "");   // app.js 가 있는 폴더 = 이미지 폴더
const PAGE = Object.assign({ hero: "hero.jpg", source: "메인" }, window.PAGE || {});

/* ---------- 스타일 ---------- */
const CSS = `
/* Layout: one dark column. Hero = rotating red corona around a black disc in smoke; UNDEFINED glitches above it; the form sits below as a ticket stub. */
:root{
  --bg:#050505;
  --bg-2:#0d0b0b;
  --line:#272121;
  --fg:#efe8e6;
  --fg-2:#9d9290;
  --smoke:#5c5557;
  --red:#d80f26;
  --red-2:#ff2438;
  --red-dim:#5a0b14;
  --err:#ff6a6a;
  --en:"Poppins",-apple-system,"Helvetica Neue",Arial,sans-serif;
  --kr:"Pretendard",-apple-system,"Apple SD Gothic Neo","Noto Sans KR",system-ui,sans-serif;
  color-scheme:dark;
}
*{box-sizing:border-box}
[hidden]{display:none!important}
html,body{margin:0;max-width:100%;overflow-x:hidden;overflow-x:clip}
body{background:var(--bg);color:var(--fg);font-family:var(--kr);font-size:15px;line-height:1.6;-webkit-font-smoothing:antialiased;position:relative}
.wrap{max-width:640px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:16px 72px;overflow:hidden}

/* ---------- hero ---------- */
.hero{text-align:center;padding-block:0 8px}
.poster{display:block;width:100%;max-width:100%;height:auto;margin:0 auto}
.maps{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin:18px 0 0}
.maps a{font-size:12px;font-weight:500;letter-spacing:.02em;color:var(--fg);text-decoration:none;border:1px solid var(--line);padding:7px 14px;transition:border-color .2s,color .2s}
.maps a:hover{border-color:var(--red-2);color:var(--red-2)}
.share{max-width:420px;margin:12px auto 0}
.share-btn{display:block;width:100%;background:transparent;border:1px solid var(--red-2);color:var(--red-2);cursor:pointer;
  font:italic 300 18px var(--en);letter-spacing:.12em;padding:11px 18px;transition:all .2s}
.share-btn:hover{background:var(--red-2);color:#fff}

/* ---------- ticket / form ---------- */
.ticket{background:var(--bg-2);border:1px solid var(--line);position:relative;margin-top:36px}
.ticket-head{padding:26px 28px 22px;border-bottom:1px dashed var(--line);display:flex;justify-content:space-between;align-items:flex-end;gap:12px}
.ticket-head h2{font-weight:600;font-size:21px;margin:0;letter-spacing:-.01em}
.ticket-head h2.en{font-family:var(--en);font-size:19px;letter-spacing:.04em}
.ticket-head small{white-space:nowrap}
@media (max-width:380px){.ticket-head h2.en{font-size:16px;letter-spacing:.02em;white-space:nowrap}.ticket-head small{font-size:9.5px;letter-spacing:.18em}}
.form-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:24px 0 4px}
.form-head h3{margin:0;font-size:19px;font-weight:600;letter-spacing:-.01em}
.form-head small{font-family:var(--en);font-size:10.5px;letter-spacing:.22em;color:var(--fg-2)}
.ticket-head small{font-family:var(--en);font-size:11px;letter-spacing:.24em;color:var(--fg-2)}
.notice{display:grid;grid-template-columns:auto 1fr;gap:6px 14px;padding:16px 28px;border-bottom:1px dashed var(--line);font-size:12.5px;color:var(--fg);align-items:baseline}
.notice .k{font-family:var(--en);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--red-2);font-weight:500}
.notice em{font-style:normal;color:var(--fg-2)}
.notice .lineup{font-family:var(--en);font-weight:500;font-size:12.5px;line-height:1.5;display:flex;flex-wrap:wrap;gap:4px 10px}
.notice .lineup b{font-weight:500;white-space:nowrap}
.notice .lineup b.hl{color:var(--fg);white-space:normal}
.notice .lineup b.hl .star{color:var(--red-2);font-style:normal}
.notice .lineup b.hl .note{font:italic 300 12px var(--en);letter-spacing:.02em;white-space:nowrap;margin-left:5px}
/* time table */
.tt{border-bottom:1px dashed var(--line)}
.tt summary{list-style:none;cursor:pointer;padding:15px 28px;display:flex;align-items:center;gap:10px;flex-wrap:nowrap}
.tt summary::-webkit-details-marker{display:none}
.tt summary .t{font:600 13px var(--en);letter-spacing:.2em;color:var(--fg)}
.tt summary .t{white-space:nowrap}
.tt summary .sub{font:500 11.5px var(--en);letter-spacing:.04em;color:var(--fg-2);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tt summary .chev{margin-left:auto;font:500 11px var(--kr);letter-spacing:.06em;color:var(--fg-2)}
.tt summary .chev::after{content:"+";display:inline-block;font-size:18px;line-height:1;color:var(--red-2);transition:transform .2s}
.tt[open] summary .chev::after{transform:rotate(45deg)}
.tt summary:hover .chev{color:var(--fg)}
.tt .tt-list{padding:0 28px 6px}
.tt .gd-body{padding:0 28px 18px}
.tt .tt-q{padding:4px 28px 18px}
.tt .tt-q .quiz-cta{margin-top:0}
.tt-list .av{width:24px;height:24px;border-radius:50%;background-size:240px 24px;background-repeat:no-repeat;background-color:#1a1616;align-self:center;flex:none}
/* floor guide */
.fl{display:grid;gap:0;border-top:1px solid var(--fg-2)}
.fl-row{display:grid;grid-template-columns:40px 1fr auto;gap:0 12px;padding:12px 2px;border-bottom:1px solid #3a3335;align-items:start}
.fl-row .f{font:600 22px/1 var(--en);letter-spacing:-.01em;color:var(--fg);padding-top:1px;display:grid;justify-items:start;gap:7px}
.fl-row .f .chip{font-size:10px;padding:3px 4px 2px;border-color:var(--red-2);color:var(--red-2)}
.fl-row.main .f,.fl-row.in .f{color:var(--red-2)}
.fl-c{min-width:0;word-break:keep-all}
.fl-items{display:flex;flex-wrap:wrap;align-items:flex-start;row-gap:6px;overflow:hidden;margin-left:-10px}
.fl-items .it{display:grid;gap:1px;position:relative;padding:0 10px;margin-left:-1px}
.fl-items .it::before{content:"";position:absolute;left:0;top:4px;width:1px;height:13px;background:var(--fg-2)}
.fl-items .it b{font-size:14px;font-weight:600;color:var(--fg);line-height:1.3;white-space:nowrap}
.fl-items .it i{font:400 10px/1.2 var(--en);font-style:normal;color:var(--fg-2);letter-spacing:.02em;white-space:nowrap}
.fl-row small{display:block;font-size:12.5px;font-weight:600;color:var(--fg);line-height:1.5;margin-top:7px}
.fl-row small + small{margin-top:1px}
.fl svg,.fl-note svg{fill:none;stroke:currentColor;stroke-width:1.3;stroke-linejoin:round;stroke-linecap:round}
.wc{display:flex;align-items:center;gap:8px;align-self:start;padding-top:2px;color:var(--fg)}
.wci{display:grid;justify-items:center;gap:2px}
.wci svg{width:14px;height:23px}
.wci.sm svg{width:24px;height:15px}
.wci.sm{align-self:center}
.chip{font:600 9.5px/1 var(--en);letter-spacing:.06em;padding:4px 5px 3px;white-space:nowrap;border:1px solid var(--line);color:var(--fg-2)}
.chip.in{border-color:var(--fg-2);color:var(--fg);font-family:var(--kr);font-size:10px}
.fl-note{display:grid;gap:4px;font-size:12.5px;color:var(--fg-2);margin:12px 0 0;line-height:1.5}
.fl-note .ln{display:flex;align-items:center;gap:8px}
.fl-note .ln svg{width:10px;height:16px;color:var(--fg)}
.fl-note .ln-h{font-size:11px;color:#6c6466}
.fl-note b{color:var(--fg);font-weight:600}
/* steps & checks */
.steps{list-style:none;margin:0;padding:0;counter-reset:st}
.steps li{display:grid;grid-template-columns:28px 1fr;gap:0 10px;padding:9px 0;border-top:1px solid #1a1616}
.steps li:first-child{border-top:0}
.steps li::before{counter-increment:st;content:counter(st,decimal-leading-zero);font:700 13px var(--en);color:var(--red-2);line-height:1.5}
.steps strong,.checks strong{display:block;font-size:13.5px;font-weight:600;color:var(--fg);line-height:1.5}
.steps small,.checks small{display:block;font-size:11.5px;color:var(--fg-2);margin-top:1px}
.checks{list-style:none;margin:0;padding:0}
.checks li{display:grid;grid-template-columns:14px 1fr;gap:0 10px;padding:9px 0;border-top:1px solid #1a1616}
.checks li:first-child{border-top:0}
.checks li::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--red-2);margin-top:7px}
.gd-top{font:500 11.5px var(--en);letter-spacing:.06em;color:var(--fg-2);margin:0 0 8px}
.gd-top b{color:var(--fg);font-weight:600}
.menu-empty{font-size:13px;color:var(--fg-2);padding:14px;border:1px dashed var(--line);text-align:center;line-height:1.6}
.menu-cat{font:600 11px var(--en);letter-spacing:.2em;color:var(--red-2);margin:12px 0 4px}
.menu-cat:first-child{margin-top:0}
.menu-list{list-style:none;margin:0;padding:0}
.menu-list li{display:flex;justify-content:space-between;gap:12px;padding:7px 0;border-top:1px solid #1a1616;font-size:13.5px}
.menu-list li:first-child{border-top:0}
.menu-list .p{font:500 13px var(--en);color:var(--fg);white-space:nowrap;font-variant-numeric:tabular-nums}
.menu-list small{display:block;font-size:11.5px;color:var(--fg-2)}
.tt-quiz{padding:14px 28px 18px;border-bottom:1px dashed var(--line)}
.tt-quiz .quiz-cta{margin-top:0}
.tt-head{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:10px}
.tt-head .k{font:500 10px var(--en);letter-spacing:.2em;text-transform:uppercase;color:var(--red-2)}
.tt-head small{font:400 11px var(--en);letter-spacing:.14em;color:var(--fg-2)}
.tt-list{list-style:none;margin:0;padding:0}
.tt-list li{padding:0;border-top:1px solid #1a1616}
.tt-list li a{display:grid;grid-template-columns:84px 24px 1fr 10px;gap:0 10px;align-items:center;padding:5px 0;color:inherit;text-decoration:none}
.tt-list li a .go{color:var(--fg-2);font-size:16px;line-height:1;transition:color .2s,transform .2s}
.tt-list li a:hover .go{color:var(--red-2);transform:translateX(2px)}
.tt-list li a:hover .av{box-shadow:0 0 0 2px var(--red-2)}
.tt-list .av{transition:box-shadow .2s}
.tt-top{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap;padding:0 28px 6px}
.tt-top b{font:600 11px var(--en);letter-spacing:.16em;color:var(--red-2)}
.tt-top small{font-size:11.5px;color:var(--fg-2)}
.tt-list .nm{display:flex;flex-wrap:wrap;align-items:baseline;gap:0 8px;min-width:0}
.tt-list li:first-child{border-top:0}
.tt-list time{font:500 12px var(--en);letter-spacing:.04em;color:var(--fg-2);font-variant-numeric:tabular-nums;white-space:nowrap}
.tt-list b{font:600 13px var(--en);letter-spacing:.08em;color:var(--fg);white-space:nowrap}
.tt-list .g{font-size:11.5px;color:var(--fg-2);line-height:1.4}
.tt-list .star{color:var(--red-2);margin-left:6px;font-weight:400}
.tt-list li.me{border-left:2px solid var(--red);padding-left:10px;margin-left:-12px}
.tt-list li{align-items:center}
.quiz-cta{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px;padding:14px 16px;border:1px solid var(--red-2);color:var(--fg);text-decoration:none;
  background:linear-gradient(90deg,rgba(216,15,38,.16),rgba(216,15,38,.02));transition:background .2s}
.quiz-cta:hover{background:linear-gradient(90deg,rgba(216,15,38,.28),rgba(216,15,38,.06))}
.quiz-cta span{display:grid;gap:2px;font-size:14px;font-weight:600;text-align:left}
.quiz-cta small{font-size:11.5px;font-weight:400;color:var(--fg-2)}
.quiz-cta i{font:500 11px var(--en);letter-spacing:.16em;font-style:normal;color:var(--red-2);white-space:nowrap}
.done .quiz-cta{max-width:360px;margin:26px auto 0}

/* table packages (inside form) */
.ltd{font:600 9.5px/1 var(--en);letter-spacing:.2em;color:#fff;background:var(--red);padding:5px 7px 4px}
.pk-list{display:grid;gap:8px}
.pk-head{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;margin-top:8px;padding-top:14px;border-top:1px dashed var(--line)}
.pk-head .t{font:600 12px var(--en);letter-spacing:.2em;color:var(--fg)}
.pk-head small{flex-basis:100%;font-size:12.5px;color:var(--fg-2)}
.pk-sp{flex-basis:100%;display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 8px;margin-top:2px;padding:9px 12px;border:1px solid var(--line);background:#080707}
.pk-sp .k{flex-basis:100%;font:500 10px var(--en);letter-spacing:.18em;text-transform:uppercase;color:var(--red-2)}
.pk-sp b{font:500 12px var(--en);letter-spacing:.04em;color:var(--fg)}
.pk-sp i{font-style:normal;color:var(--fg-2);font-size:11px}
.pk-list input{position:absolute;opacity:0;width:0;height:0}
.pk-card{cursor:pointer;border:1px solid var(--line);background:#080707;display:block;padding:12px 14px 12px;position:relative;overflow:hidden;transition:border-color .2s,background .2s;min-width:0}
.pk-card .txt{display:grid;gap:1px;align-content:start;min-width:0;padding-right:var(--iw,0);min-height:60px}
.pk-card h4{margin:0;font:600 15px var(--en);letter-spacing:.12em}
.pk-card .where{font-size:12.5px;color:var(--red-2)}
.pk-card .price{font:600 16px var(--en);color:var(--fg);font-variant-numeric:tabular-nums;margin-top:1px}
.pk-card ul{margin:8px 0 0;padding:0 0 0 9px;border-left:2px solid var(--red);list-style:none;font-size:13px;line-height:1.55;color:var(--fg)}
.pk-card .cnt{font:500 10px var(--en);letter-spacing:.14em;color:var(--fg-2);margin-top:4px;white-space:nowrap}
.pk-card .cnt b{color:var(--red-2);font-weight:600}
.pk-card .img{position:absolute;top:8px;right:8px;height:64px;display:block;pointer-events:none}
.pk-card .img img{height:100%;width:auto;display:block;-webkit-mask:linear-gradient(to right,transparent,#000 18%);mask:linear-gradient(to right,transparent,#000 18%)}
.pk-list input:checked+.pk-card{border-color:var(--red-2);background:linear-gradient(180deg,rgba(216,15,38,.14),rgba(216,15,38,.02))}
.pk-list input:checked+.pk-card h4::after{content:" ✓";color:var(--red-2)}
.pk-list input:disabled+.pk-card{opacity:.45;cursor:not-allowed}
.pk-list input:focus-visible+.pk-card{outline:2px solid var(--red-2);outline-offset:3px}
.pk-head.invalid~.pk-list .pk-card{border-color:var(--err)}
#pkWrap{display:grid;gap:10px}
.pk-meta{display:grid;gap:6px;font-size:12.5px;color:var(--fg-2);line-height:1.6}
.pk-meta .sp{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:baseline}
.pk-meta .sp .k{font:500 10px var(--en);letter-spacing:.2em;text-transform:uppercase;color:var(--red-2)}
.pk-meta .sp b{font:500 12px var(--en);letter-spacing:.06em;color:var(--fg)}
.pk-meta strong{color:var(--fg);font-weight:500}
@media (max-width:380px){.pk-card .img img{max-height:84px}.tt-list li a{grid-template-columns:76px 24px 1fr 8px;gap:0 8px}.tt summary .sub{display:none}}
.tbl-sub{display:grid;gap:10px;margin-top:8px}
.tbl-sub .lab{font-size:13px;color:var(--fg-2)}
.bottles{display:grid;gap:10px}
form{padding:8px 28px 28px;display:grid}
.field{padding:20px 0;border-bottom:1px solid var(--line);display:grid;gap:10px;min-width:0}
.field:last-of-type{border-bottom:0}
.lab{font-size:14px;font-weight:500;letter-spacing:.02em;color:var(--fg);display:flex;gap:8px;align-items:baseline}
.lab .n{font-family:var(--en);font-size:10.5px;color:var(--red-2);letter-spacing:.14em}
.lab .req{color:var(--red-2);font-size:12px}
.lab .opt{font-size:11px;color:var(--fg-2);font-weight:400}
.hint{font-size:12px;color:var(--fg-2);margin:0}
input[type=text],input[type=tel],select{width:100%;min-width:0;background:transparent;border:0;border-bottom:1px solid var(--smoke);border-radius:0;color:var(--fg);
  font:inherit;font-size:16px;padding:8px 0;outline:none;transition:border-color .2s;appearance:none;-webkit-appearance:none}
input::placeholder{color:#5a5355;font-size:14px}
input:focus,select:focus{border-bottom-color:var(--red-2)}
input:focus-visible,select:focus-visible,button:focus-visible,.seg label:focus-within{outline:2px solid var(--red-2);outline-offset:4px}
select{background-image:linear-gradient(45deg,transparent 50%,var(--fg-2) 50%),linear-gradient(135deg,var(--fg-2) 50%,transparent 50%);
  background-position:calc(100% - 14px) 50%,calc(100% - 9px) 50%;background-size:5px 5px;background-repeat:no-repeat;padding-right:28px;cursor:pointer}
select option{background:var(--bg-2)}
select:invalid{color:#5a5355}

/* ticket type list */
.seg{display:grid;gap:8px}
.seg input{position:absolute;opacity:0;width:0;height:0}
.seg label{cursor:pointer;border:1px solid var(--line);padding:14px 16px;display:grid;grid-template-columns:1fr auto;gap:2px 12px;align-items:baseline;transition:border-color .2s,background .2s;position:relative;min-width:0}
.seg label strong{font-weight:500;font-size:15px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.seg label .p{font-family:var(--en);font-weight:500;font-size:15px;color:var(--red-2);font-variant-numeric:tabular-nums;white-space:nowrap}
.seg label .note{grid-column:1/-1;font-size:12.5px;color:var(--fg-2);line-height:1.55}
.seg label .tag{font-family:var(--en);font-size:10px;letter-spacing:.16em;color:var(--red-2)}
.seg input:checked+label{border-color:var(--red-2);background:linear-gradient(180deg,rgba(216,15,38,.12),rgba(216,15,38,.02))}
.seg input:disabled+label{opacity:.45;cursor:not-allowed}

.qty{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.step{display:inline-grid;grid-template-columns:44px 64px 44px;border:1px solid var(--line)}
.step button{background:transparent;border:0;color:var(--fg);font-size:20px;cursor:pointer;height:44px;font-family:var(--en)}
.step button:hover{color:var(--red-2)}
.step button:disabled{opacity:.3;cursor:not-allowed}
.step output{display:grid;place-items:center;font-family:var(--en);font-size:16px;border-left:1px solid var(--line);border-right:1px solid var(--line);font-variant-numeric:tabular-nums}
.amount{font-family:var(--en);font-size:13px;color:var(--fg-2);letter-spacing:.04em}
.amount b{display:block;font-size:20px;font-weight:600;color:var(--red-2);font-variant-numeric:tabular-nums;line-height:1.2;font-family:var(--kr)}

.acct{border:1px solid var(--line);padding:14px 16px;display:grid;gap:6px;background:#080707;min-width:0}
.acct .row{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.acct .num{font-family:var(--en);font-weight:500;font-size:16px;letter-spacing:.06em;user-select:all;word-break:break-all}
.acct .bank{font-size:13px;color:var(--fg-2)}
.copy{font:500 11px/1 var(--en);letter-spacing:.16em;color:var(--fg);background:transparent;border:1px solid var(--smoke);padding:8px 12px;cursor:pointer;transition:all .2s}
.copy:hover{border-color:var(--red-2);color:var(--red-2)}

.consent{display:flex;gap:10px;align-items:flex-start;font-size:12px;color:var(--fg-2);padding:14px 0 0}
.consent+.consent{padding-top:10px}
.consent input{accent-color:var(--red);margin-top:3px;width:15px;height:15px;flex:none}
.submit{margin-top:14px;width:100%;height:58px;border:0;cursor:pointer;color:#fff;font:600 14px var(--en);letter-spacing:.26em;
  background:linear-gradient(90deg,var(--red-dim),var(--red) 50%,var(--red-dim));background-size:200% 100%;background-position:0 0;
  transition:background-position .6s,transform .15s,opacity .2s}
.submit:hover{background-position:100% 0}
.submit:active{transform:scale(.99)}
.submit[disabled]{opacity:.55;cursor:wait}
.msg{margin:14px 0 0;font-size:13px;min-height:1.2em}
.msg.err{color:var(--err)}
.field.invalid input,.field.invalid select{border-bottom-color:var(--err)}

.done{display:none;padding:48px 28px;text-align:center}
.done .ring{width:84px;height:84px;border-radius:50%;margin:0 auto 22px;background:#000;box-shadow:0 0 0 2px var(--red-2),0 0 30px 6px rgba(216,15,38,.5)}
.done h3{font-family:var(--en);font-weight:600;font-size:30px;letter-spacing:.14em;margin:0 0 8px}
.done p{color:var(--fg-2);font-size:14px;margin:0 0 22px}
.done .num{font-family:var(--en);font-size:14px;letter-spacing:.2em;color:var(--red-2);font-weight:500}
.done-actions{margin-top:26px}
.again{width:100%;max-width:320px;height:50px;background:transparent;border:1px solid var(--fg);color:var(--fg);cursor:pointer;font:500 14px var(--kr);letter-spacing:.04em;transition:all .2s}
.again:hover{border-color:var(--red-2);color:var(--red-2)}
.ticket.ok form,.ticket.ok .ticket-head{display:none}
.ticket.ok .done{display:block}

footer{margin-top:36px;text-align:center;font-family:var(--en);font-size:11px;letter-spacing:.24em;color:#4a4345}
.demo{position:fixed;left:50%;bottom:max(14px,env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:5;
  font:500 10px/1 var(--en);letter-spacing:.22em;color:var(--fg-2);background:rgba(13,11,11,.9);border:1px solid var(--line);padding:8px 12px;display:none;white-space:nowrap}
.demo.on{display:block}
@media (max-width:480px){form,.ticket-head,.notice{padding-left:18px;padding-right:18px}.done{padding:40px 18px}}
`;

/* ---------- 마크업 ---------- */
const HTML = `
<div class="wrap">

  <section class="hero">
    <img class="poster" src="{{HERO}}" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='{{ROOT}}hero.jpg'}" alt="NEW PLAYER 003 presents SYZYGY — Spin the Eclipse. 2026.11.28 SAT 성수율뮤직 18:00–23:00. Ticket 20,000원 · Early bird 15,000원 · 1 free drink 포함. Dress code: all black + red point (권장) / 19+ only">
    <div class="maps" id="maps"></div>
    <div class="share">
      <button type="button" id="shareBtn" class="share-btn"><span id="shareLabel">share</span></button>
    </div>
  </section>

  <section class="ticket" id="ticket">
    <div class="ticket-head">
      <h2 class="en">[SYZYGY] DJ PARTY</h2>
      <small>ADMIT ONE</small>
    </div>
    <div class="notice">
      <span class="k">Dress code</span><span>ALL BLACK + RED POINT <em>(권장)</em></span>
      <span class="k">Age</span><span>19+ only</span>
      <span class="k">Line up</span><span class="lineup"><b>DPC</b> <b>D.KIM</b> <b>DJ No:biz</b> <b>JENNA KIM</b> <b>DJ Maple</b> <b>SIMSEXY</b> <b>MIGNØ</b> <b>Linzi</b> <b>Elissa</b> <b>DJ Hondo</b></span>
    </div>

    <details class="tt" id="timetable">
      <summary><span class="t">DJ TIME TABLE</span><span class="sub">3F 메인 스테이지</span><span class="chev" aria-hidden="true"></span></summary>
      <div class="tt-top"><b>3F MAIN STAGE&nbsp;&nbsp;18:00 – 23:00</b><small>DJ를 누르면 취향 결과지로 이동해요</small></div>
      <ol class="tt-list" id="ttList"></ol>
      <div class="tt-q"><a class="quiz-cta" id="quizCta" target="_blank" rel="noopener"><span>SYZYGY를 제대로 즐기는 방법!<small>질문 5개로 알아보는 음악 취향 테스트</small></span><i>TEST →</i></a></div>
    </details>
    <details class="tt" id="floorGuide">
      <summary><span class="t">FLOOR GUIDE</span><span class="sub">층별 안내와 화장실 위치</span><span class="chev" aria-hidden="true"></span></summary>
      <div class="gd-body" id="floorBody"></div>
    </details>
    <details class="tt" id="enterGuide">
      <summary><span class="t">HOW TO ENTER</span><span class="sub">입장은 5F에서</span><span class="chev" aria-hidden="true"></span></summary>
      <div class="gd-body" id="enterBody"></div>
    </details>
    <details class="tt" id="goodGuide">
      <summary><span class="t">GOOD TO KNOW</span><span class="sub">오기 전 체크</span><span class="chev" aria-hidden="true"></span></summary>
      <div class="gd-body" id="goodBody"></div>
    </details>
    <!-- MENU: CONFIG.menu에 내용을 넣으면 자동으로 나타납니다 -->
    <div id="menuSlot"></div>

    <form id="form" novalidate>
      <div class="form-head"><h3>이벤트 신청</h3><small>APPLY</small></div>
      <div class="field">
        <label class="lab" for="name"><span class="n">01</span>이름 <span class="req">*</span></label>
        <input type="text" id="name" name="name" placeholder="이름을 넣어주세요" autocomplete="name" required>
      </div>

      <div class="field">
        <label class="lab" for="phone"><span class="n">02</span>연락처 <span class="req">*</span></label>
        <input type="tel" id="phone" name="phone" placeholder="010-0000-0000" autocomplete="tel" inputmode="tel" required>
        <p class="hint">입금 확인 및 안내 문자 발송에 사용됩니다.</p>
      </div>

      <div class="field">
        <label class="lab" for="affiliation"><span class="n">03</span>소속 <span class="req">*</span></label>
        <select id="affiliation" name="affiliation" required>
          <option value="" disabled selected>소속을 선택하세요</option>
        </select>
      </div>

      <div class="field">
        <label class="lab" for="inviter"><span class="n">04</span>초대자명 <span class="opt">(선택)</span></label>
        <input type="text" id="inviter" name="inviter" placeholder="초대해 주신 분의 이름">
      </div>

      <div class="field">
        <div class="lab"><span class="n">05</span>티켓 구분 <span class="req">*</span></div>
        <div class="seg" id="seg" role="radiogroup" aria-label="티켓 구분"></div>
        <div id="pkWrap" hidden>
          <div class="pk-head" id="pkField"><span class="t">TABLE PACKAGES</span><small>원하는 테이블을 선택해 주세요.</small><div class="pk-sp" id="pkSpirits"></div></div>
          <div class="pk-list" id="tblSeg" role="radiogroup" aria-label="테이블 패키지"></div>
        </div>
      </div>

      <div class="field" id="qtyField">
        <div class="lab"><span class="n">06</span>티켓 구매 수 <span class="req">*</span></div>
        <div class="qty">
          <div class="step" role="group" aria-label="티켓 구매 수">
            <button type="button" id="minus" aria-label="줄이기">−</button>
            <output id="qtyOut" for="qty">1</output>
            <button type="button" id="plus" aria-label="늘리기">+</button>
          </div>
          <div class="amount">입금 금액<b id="totalPrice"></b></div>
        </div>
        <input type="hidden" id="qty" name="qty" value="1">
      </div>

      <div class="field" id="tableField" hidden>
        <div class="lab"><span class="n">06</span>보틀 · 인원 선택 <span class="req">*</span></div>
        <p class="hint" id="tblChosen"></p>
        <div class="tbl-sub">
          <div class="lab">보틀 선택 <span class="req">*</span></div>
          <div class="bottles" id="bottles"></div>
        </div>
        <div class="tbl-sub">
          <div class="lab">인원 수 (대표자 포함) <span class="req">*</span></div>
          <div class="qty">
            <div class="step" role="group" aria-label="인원 수">
              <button type="button" id="pMinus" aria-label="줄이기">−</button>
              <output id="paxOut">1</output>
              <button type="button" id="pPlus" aria-label="늘리기">+</button>
            </div>
            <div class="amount">입금 금액<b id="tblPrice"></b></div>
          </div>
          <p class="hint" id="paxHint"></p>
        </div>
      </div>

      <div class="field">
        <div class="lab"><span class="n">07</span>입금자명 <span class="req">*</span></div>
        <div class="acct">
          <div class="row">
            <span class="num" id="acctNum"></span>
            <button type="button" class="copy" id="copyBtn">COPY</button>
          </div>
          <span class="bank" id="acctBank"></span>
        </div>
        <input type="text" id="depositor" name="depositor" placeholder="실제 입금하는 분의 이름" required>
        <p class="hint">신청 후 24시간 내 위 계좌로 입금해 주세요. 입금 확인 후 신청이 확정됩니다.</p>
      </div>

      <div class="field">
        <label class="lab" for="bank"><span class="n">08</span>입금자 은행 <span class="req">*</span></label>
        <select id="bank" name="bank" required>
          <option value="" disabled selected>은행 선택</option>
        </select>
      </div>

      <div class="field">
        <label class="lab" for="arrival"><span class="n">09</span>예상 도착 시간 <span class="req">*</span></label>
        <select id="arrival" name="arrival" required>
          <option value="" disabled selected>도착 시간 선택 (18:00 – 23:00)</option>
        </select>
        <p class="hint">현장 운영 준비를 위한 참고용이에요. 정확하지 않아도 괜찮고, 다른 시간에 오셔도 됩니다.</p>
      </div>

      <label class="consent"><input type="checkbox" id="agree" required>
        <span>입력한 정보는 이벤트 운영(입금 확인, 안내 연락)에만 사용되며 행사 종료 후 파기됩니다. 동의합니다.</span></label>
      <label class="consent"><input type="checkbox" id="agreePhoto" required>
        <span>행사 현장은 사진·영상으로 촬영되며, 촬영물이 NEW PLAYER 003의 홍보 콘텐츠(SNS 등)에 활용될 수 있습니다. 초상권 활용에 동의합니다.</span></label>

      <button class="submit" type="submit" id="submitBtn">SUBMIT</button>
      <p class="msg" id="msg" aria-live="polite"></p>
    </form>

    <div class="done" id="done">
      <div class="ring"></div>
      <h3>ADMITTED</h3>
      <p id="doneText">신청이 접수되었습니다.<br>입금 확인 후 안내 문자를 드릴게요.</p>
      <span class="num" id="doneNum"></span>
      <p class="hint" style="margin-top:8px">접수번호는 문의 시 알려주세요.</p>
      <a class="quiz-cta" id="quizCtaDone" target="_blank" rel="noopener"><span>SYZYGY를 제대로 즐기는 방법!<small>질문 5개로 알아보는 음악 취향 테스트</small></span><i>TEST →</i></a>
      <div class="done-actions">
        <button type="button" class="again" id="againBtn">추가 신청하기</button>
      </div>
    </div>
  </section>

  <footer>SYZYGY · NEW PLAYER 003</footer>
</div>
<div class="demo" id="demo">DEMO MODE · 시트 연결 전</div>
`;

const style = document.createElement("style"); style.textContent = CSS; document.head.appendChild(style);
document.body.insertAdjacentHTML("afterbegin", HTML.replace(/{{HERO}}/g, ROOT + PAGE.hero).replace(/{{ROOT}}/g, ROOT));
if (PAGE.highlight && PAGE.highlight.name) {
  const b = [...document.querySelectorAll(".lineup b")].find(x => x.textContent.trim() === PAGE.highlight.name);
  if (b) { b.parentNode.appendChild(b); b.classList.add("hl"); if (PAGE.highlight.note) b.insertAdjacentHTML("beforeend", `<span class="note">(${PAGE.highlight.note.replace(/★/g, '<span class="star">★</span>')})</span>`); }
}

/* ---------- 로직 ---------- */
/* ===================== 설정 (여기만 수정하세요) ===================== */
const CONFIG = {
  endpoint: "https://script.google.com/macros/s/AKfycbzLuz234h-ERnFnWnucMNay9BPbqxuPM7WmmW1Hildi5rZ1ChW-kPIP1O9BG2NzZ8Oq/exec",

  event: {
    title: "SYZYGY",
    date: "2026년 11월 28일 (토) 18:00 – 23:00",
    venue: "성수율뮤직",
    address: "서울특별시 성동구 성수이로16길 31",
    startHour: 18, endHour: 23, slotMinutes: 30   // 예상 도착 시간 선택지
  },

  // 티켓 구분. price: 숫자면 금액, null이면 "별도 문의". deadline(한국시간 그날 자정)이 지나면 자동 마감, 그 전엔 D-n 표시.
  tickets: [
    { id: "early",   label: "얼리버드", price: 15000, deadline: "2026-11-21", note: "11월 21일 (토)까지 · 환불 불가<br>프리드링크 1잔 포함" },
    { id: "regular", label: "일반",     price: 20000, note: "11월 25일 (수) 자정까지 환불 가능<br>프리드링크 1잔 포함" },
    { id: "table",   label: "테이블", table: true, note: "엔트리 티켓 포함 · 11월 21일 (토) 자정까지 환불 가능" }
  ],

  // 테이블 패키지. count: 운영 테이블 수(관리용, 화면에는 표시 안 함). 매진되면 soldOut: true 를 추가하세요.
  // img: 저장소 루트의 이미지 파일 (없으면 이미지 없이 표시)
  // ※ VVIP(6인)를 2개로 운영하면 VIP(3-4인) 수량이 줄어드니 count 를 함께 바꿔주세요.
  tables: [
    { id: "standing", label: "STANDING", where: "3층 · 최대 4인 엔트리 티켓 포함", max: 4, price: 150000, bottles: 1, count: 3,
      img: "tbl_standing.webp", items: ["보틀 1병 + 얼음 + 물 + 토닉 2병"] },
    { id: "vip",      label: "VIP",      where: "4층 · 최대 4인 엔트리 티켓 포함", max: 4, price: 250000, bottles: 1, count: 5,
      img: "tbl_vip.webp", items: ["보틀 1병 + 샴페인 2병", "나초 플레이트 1개 + 컵과일 1개", "얼음 + 물 3병 + 토닉 2병"] },
    { id: "vvip",     label: "VVIP",     where: "4층 · 최대 6인 엔트리 티켓 포함", max: 6, price: 450000, bottles: 2, count: 1,
      img: "tbl_vvip.webp", items: ["보틀 2병 + 샴페인 3병", "나초 플레이트 2개 + 컵과일 2개", "얼음 + 물 5병 + 토닉 2병"] }
  ],

  // DJ 타임테이블 [시작, 끝, 이름, 장르]
  // [시작, 끝, 이름, 장르, 취향테스트 DJ id, 결과지에 함께 뜨는 '색다른 DJ' id]
  timetable: [
    ["18:00", "18:30", "SIMSEXY",   "Jazzy Hip-hop / Soul",          "simsexy",  "hondo"],
    ["18:30", "19:00", "DJ MAPLE",  "Tech House",                    "maple",    "jennakim"],
    ["19:00", "19:30", "MIGNØ",     "French Electronic",             "migno",    "hondo"],
    ["19:30", "20:00", "HONDO",     "Pop EDM",                       "hondo",    "simsexy"],
    ["20:00", "20:30", "DJ NO:BIZ", "K·J Indie Pop",                 "nobiz",    "hondo"],
    ["20:30", "21:00", "JENNA KIM", "Afro House / Deep House",       "jennakim", "maple"],
    ["21:00", "21:30", "LINZI",     "Hip-hop × K-pop × House/Techno", "linzi",   "simsexy"],
    ["21:30", "22:00", "ELISSA",    "Old School R&B / Hip-hop",      "elissa",   "hondo"],
    ["22:00", "22:30", "D.KIM",     "Acid / Hard Techno",            "dkim",     "simsexy"],
    ["22:30", "23:00", "DPC",       "French Electro",                "dpc",      "simsexy"]
  ],
  testUrl: "https://claude.ai/artifact/THoUpHQuBbv8W2C3fJqAt6",   // 음악 취향 테스트

  // ===== 파티 가이드 (페이지 상단 접이식 안내) =====
  // 층별 안내: 위층부터. items: [한글, 영문]. notes: 설명 줄. smoke: true면 오른쪽에 흡연 아이콘. wc: { m: 남자 칸 수, w: 여자 칸 수 } (없으면 화장실 없음). main: true면 강조
  floors: [
    { f: "5F", tag: "입장", items: [["리셉션", "Reception"], ["짐 보관", "Coat check"], ["술꼬마 F&B", "Food & Drinks"], ["테라스", "Smoking area"]],
      notes: ["입장, 팔찌 착용, 프리드링크 수령", "짐 보관 무료 (~23:30)"], smoke: true },
    { f: "4F", items: [["VIP 존", "VIP & VVIP tables"]] },
    { f: "3F", main: true, items: [["메인 스테이지", "Main stage"], ["바", "Bar"], ["포토존", "Photo zone"]], wc: { m: 1, w: 1 } },
    { f: "2F", items: [["화장실", "Restroom"]], wc: { m: 1, w: 1 } },
    { f: "1F", items: [["엘리베이터", "Elevator to 5F"]], wc: { w: 3 } }
  ],
  enter: [
    ["1F 엘리베이터 타고 5F로", "Take the elevator to 5F"],
    ["성함, 휴대폰 번호 확인", "Name & phone check"],
    ["입장 팔찌 착용, 프리드링크 쿠폰 수령", "Wristband & free drink coupon"],
    ["짐 보관 무료 (~23:30)", "Free coat check until 23:30"],
    ["계단으로 3F 메인 스테이지", "Stairs down to 3F main stage"]
  ],
  goodToKnow: [
    ["19세 이상 입장, 신분증 지참", "19+ only, bring your ID"],
    ["주차 불가, 대중교통 이용", "No parking available"],
    ["외부 음식과 음료 반입 불가", "No outside food or drinks"],
    ["흡연은 5F 테라스에서만", "Smoking on the 5F terrace only"],
    ["입장 17:30, 공연 18:00 – 23:00", "Doors 17:30 / Show 18:00 – 23:00"]
  ],
  // 메뉴판: 비어 있으면 화면에 안 보임. 내용을 넣으면 MENU 칸이 생깁니다. 예) { cat: "DRINK", items: [["하이볼", 9000, "짐빔 · 토닉"], ["맥주", 7000]] }
  menu: [],
  spirits: ["보드카", "호세 쿠엘보", "제임슨"],
  spiritsEn: ["VODKA", "JOSE CUERVO", "JAMESON"],
  tableBasics: "잔 · 얼음 · 물 · 토닉 2병",
  maxQty: 10,

  affiliations: ["낯대 오리지널", "낯대 Y", "낯대 C", "DJ 지인"],

  banks: ["카카오뱅크","토스뱅크","케이뱅크","국민은행","신한은행","우리은행","하나은행","농협은행","기업은행","SC제일은행","씨티은행",
          "새마을금고","우체국","수협","신협","대구은행(iM뱅크)","부산은행","경남은행","광주은행","전북은행","제주은행","기타"],

  account: { bank: "카카오뱅크", number: "79422146646", holder: "김명환" },

  // 구글 시트 열 순서. [시트 헤더, 전송 키]. 항목을 추가하면 여기만 맞춰주면 시트도 따라옵니다.
  columns: [
    ["접수번호", "receipt"], ["접수일시", "timestamp"], ["이름", "name"], ["연락처", "phone"],
    ["소속", "affiliation"], ["초대자명", "inviter"], ["티켓 구분", "ticket"], ["구매 수", "qty"],
    ["입금 금액", "amount"], ["입금자명", "depositor"], ["입금자 은행", "bank"], ["예상 도착", "arrival"],
    ["촬영 동의", "photoConsent"], ["입금 확인", "__checkbox"], ["비고", "__blank"], ["기기", "userAgent"], ["유입 경로", "source"],
    ["테이블 종류", "tableType"], ["보틀", "bottles"], ["인원", "pax"]
  ]
};
/* =================================================================== */

const $ = s => document.querySelector(s);
const won = n => n.toLocaleString("ko-KR") + "원";
const today = new Date();

// hero
const q = encodeURIComponent(CONFIG.event.address);
$("#maps").innerHTML = [
  ["네이버 지도", "https://map.naver.com/p/search/" + q],
  ["카카오맵", "https://map.kakao.com/?q=" + q],
  ["구글맵", "https://www.google.com/maps/search/?api=1&query=" + q]
].map(([t,u]) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`).join("");
if (!CONFIG.endpoint) $("#demo").classList.add("on");

// tickets
const seg = $("#seg");
CONFIG.tickets.forEach((t, i) => {
  const closed = t.deadline && today > new Date(t.deadline + "T23:59:59+09:00");   // 한국시간 기준
  const kstToday = new Date(today.getTime() + 9*3600*1000).toISOString().slice(0, 10);
  const dLeft = t.deadline ? Math.round((Date.parse(t.deadline) - Date.parse(kstToday)) / 86400000) : null;
  const tag = closed ? "CLOSED" : (t.deadline ? (dLeft === 0 ? "D-DAY" : "D-" + dLeft) : "");
  seg.insertAdjacentHTML("beforeend", `
    <input type="radio" id="t-${t.id}" name="ticket" value="${t.label}" ${closed ? "disabled" : ""}${t.table ? ' class="is-table"' : ""}>
    <label for="t-${t.id}"${t.table ? ' class="is-table"' : ""}>
      <strong>${t.label}${tag ? ` <span class="tag">${tag}</span>` : ""}${t.tag ? ` <span class="ltd">${t.tag}</span>` : ""}</strong>
      <span class="p">${t.table ? won(Math.min(...CONFIG.tables.map(x => x.price))) + "~" : t.price === null ? "별도 문의" : won(t.price)}</span>
      ${t.note ? `<span class="note">${t.note}</span>` : ""}
    </label>`);
});
const firstOpen = CONFIG.tickets.find(t => !$("#t-" + t.id).disabled);
if (firstOpen) $("#t-" + firstOpen.id).checked = true;
const ticket = () => CONFIG.tickets.find(t => $("#t-" + t.id).checked);

// selects
CONFIG.affiliations.forEach(a => $("#affiliation").insertAdjacentHTML("beforeend", `<option>${a}</option>`));
CONFIG.banks.forEach(b => $("#bank").insertAdjacentHTML("beforeend", `<option>${b}</option>`));
for (let m = CONFIG.event.startHour*60; m <= CONFIG.event.endHour*60; m += CONFIG.event.slotMinutes) {
  const h = Math.floor(m/60), mm = String(m%60).padStart(2,"0");
  const label = h === 24 ? "자정 12:00" : "오후 " + (h-12) + ":" + mm + " (" + h + ":" + mm + ")";
  $("#arrival").insertAdjacentHTML("beforeend", `<option value="${String(h).padStart(2,"0")}:${mm}">${label}</option>`);
}

// account
$("#acctNum").textContent = CONFIG.account.number;
$("#acctBank").textContent = CONFIG.account.bank + " · 예금주 " + CONFIG.account.holder;

// DJ 프로필 사진 (타임테이블 순서대로 10명이 가로로 이어진 스프라이트)
const DJ_AVATARS = "data:image/webp;base64,UklGRhokAABXRUJQVlA4IA4kAABwhACdASqAAkAAPp08mEiloyIhLtgN2LATiWwAyJZo2F6BfyfOGuH+4/vXCUnjuB+lDbl+aHzd/+h6xv8r6hX9S6nX0Uult/t3/m4OHnH+y3lR8Rv0X5M+evlu+Eyt3EvU7+dflL0D7W/7HwX+YOod7c3wcAfcVfl+eHiAd+l4oNAXxftCb2J7Bv6+9ZH93P/////g6/bwNalNP/NcY5jOTyM4NwwbxOxJl8Z6iOLGxHd3sP/36PAVQyEHjoYHePN0Ny4Ltm3LamJda1o9VgZLBAIn4Za4ckNXk+8HOFCovfSdbXFcnD/v3vwhLkKzWMLMeq63cAiTIO65VM/HqKDKt1RZqY/yYz/3uU64St7+kNp+QBHlSLhuf/jsBmVgBWwE5bpbVBxxcI7hQOr9GH1Wy/wpJaxg48I7D85vFtf/EvQY4T/ZQZrYp88su/VLWkb99XODZ1spq2dpiLxW1EtwE9SkHTfDw+Ut0NYxMfA4DV+sYvi5tB6Wg6rdjNyRyWkEDvJtVSMyvfIK8PUZVIB0BVJg0x0Q2U4zh/U1MhGBLv/T9Ew97dtrdIBQp+dxCU2dttPgQiOQZvug81/iZmY9LfAO1PLwddy+amhN7sQh5T+pWW3aKTmA9H9P8OlGgZ07i0yMHm6G0vtw4Mu1bSrqLayIv5w5nrIgRfMUf823vv1qMkaw4jOSFl9UTwDw7Q8YTgL3CejXjebo920Dy3MQfoFY+6z6av9iucLd1pgxpVcBuLqFINE7vkA3ExBz4tL+11znPfFJIL9c92sEUdsXzK5ZqEvzIPVntqjTN5il5FL9Lxkm2q5KJ5/Ci8v0pwaJgCt2PyWgpRQgHEdeYiLnKaT0XcCB/qo6bJES64t6FBrSafzCwfpEvxyeMyryuM+hy+htowRVotzXtNEXT+E12YNQEbPv9aFZSas0VlXob4MRWB8nIe/ixtX2gfSOkLHCqCw9hwDnQNUk3pr11JRvcLey1sCS8REuW3Vg9DuicEGX0edkhmtdDyGG9deNAkjmQRxu6TzxcFYbBm5fqFDcqYpvq4t8viJ3ntNLF+xQ97RDVH36037YgUDWbaSP05GTrSVTTp1/5RIY4k8fbrwEuk/kIfQCdh3ok72ozGX+dUdU1vf9I4IWV9BkNB7AI+gkuU8FuRrPtDnpwNftL14Jm9mxl7rsHDEX0fyqlh6sfFgJ/5WbjzowGmyWjSy/+Xu+fxyoTiSryqsUixKVKYgaetYavk95HvKs3cc1s6oLg2huIX0Mz076Feiot10k0gGuEGaNjOb2fHTQC46cn9fKRfLPv3nw2B7TTWRtiPfbVWc2N5N/WuufDhrKLqWgXMFpZh+xat9HwjbOqpmL8O6WoR/5r+I4pLZ8rkegELJV174+b0b/HYvNO40imUfIy2ryK4b6M3Ptmo1j8BAA/uHsNoZJ+yL4alUJPEyulqgscBeoXzB2j0h6UFd9EJMVr0+PNQTYScp/L13x9ENHZfRAFAW0SmE4SpbhZVg7rsGpFirlTM+3oW98V0ir0LxRaKZQ8yzqDeTek+qIF0dNJRC/EyO994POS+o68yyPszBH25rJIm1XUpBIYEWjtpW5hojkHlarrkchlkQ2QCZW12EyjevIXSz6q7Dr/4fBgmv4FH3po21CjOOSROJxwuDbRMH0+IthTHhvsOwSmbt1yOg9R0VR9xpASTxAK15IvFb7vjvFRboDEb20pdCEcfoh1Nm0r8aogqcBUulLXVuxkpAHxwz+yMTDrDwpYs5jJG1z1FqOIiiU3DpzU18P9EyCPgWUILW1Fq+xTc+wEPg6sj4MLSGOcZIrdHBVDThrpgN3oc9gmDINiIG9FT17xDhvaC6ImUqP1nvI0KWmTKl1i0gLpqhyNo2T+zwg4i0CeYf73xcK3G67/vFArpdEncG0z5w/MKoksH0JPGqk2tvN+BPrhnNulyvOzX629Cj2KU+0tqJAAZa5HYkorQC5GsXp4PiKmoP/VqC/zy4aP4qzSZ/OA+xcB6lPwR2cmwkEZ51KjtHRBEaj9wYwRb03Y6tnWrHpWl1VZxIjJwtrbx9qCXvRU0oBvOXUHa7GkaS3vnSBEyBbQkqrvcvupBju5S5Z4YbpMCcJojeIOQhrcy5u0K6DG29kuMB4IecSaclpzPx+2BoQdB6ooQIiBn0icrd8k5p22hkv+D0XFG85yPr7ZopspV75BEBBBstVkPHeiZ+ehwJxNru0bakxTW2tv+xPuzn1MdRNykkH1u/Q42QXKq5A9acq4ItrULDSxq5UB2MHP4kZb0WZLU3+2Pue90znIq5tMKqRj7JjeFYhBoqkmGWpkH0oNxRksKZXw/RRBnjHiATF7FHhZ0toCRl1MwAemFh2aY6gyOmDGWL8o5SRYf4RbxpnN+5fzARg+zOP5gjQ9XUrWa4HedtoCT+AJCgfr4Rw2UdX2n5I56GhIdEape9Ocj2xjxY7ZjpUuehHlhwNa00dY80pS+kZ97SohMk/YPaRbTlaxaMI//dA9+08eyu85eENHEp5HB0tg0+BnnfPqdhrXcwfePvtWqeYFaeo99s3gztlCdX0qMsZC8XbhnsAjtsXSJmEPye+SXLpzI03YE3Wi5jFCwgkCyVQMVuUsdRZOt9N2mW5mVGYRzhmR40/wCmtERFgqBa6t6V6nze3t53bQO7kK9ladfROeWAKA7tXPNqFgFhVlqi/ujPdHOrkSO7wie0YuRjq0logjYMqgKBsj/d0y3UILc2h4ASUw6RDKbDcFgAf2fy7F+BNIkT+kuTeayxDWVjHBZbB39pCh84sNkrnmBaH7SqhutVIYKCvIc7ks1b8MWB9U5JcsUPRqGPoWPbCTcdvJGuzLs333cIHfQgjoNc4JgpWOIVZV3KvvOE8XF59CVrE+SO7ImpXFl94YNHBRsRWpPJhiN7fQgCgjlgvnH6cYl9f1dA36wpXdP06wWVm778lCSlWGX5Q9ZZshh16gO6B88YclahlkevtcERPedhIvlK6aZRwgGyT90j359DwleVqcBVOjUTyhKafvKVr6nppvT0V0AKs7FkwTpjWR3tGMwHmh9BOtkXprcWQMW9xJCX/IBplciLvylMvxjmqKPypjhtY5hAF8ZjMs3iV+JnDxD6mm7Y+x6+cWprmQ8Xsa/163NQaejxL8HMRXLlF3e973e+N9lWtg6RMtzKOc4xM6UK+EJ06XFGcnLC1XDVMATZhg+eR463BnXICqNxm6LgwpcGH0IFgkT3RcOMre3bDQa5nO2oumD+LeY9w+SuhC9ppJRJiXo9Ay9w/F2EA7xDEhDECwNacSYLIVjsN2SAZYM+5O6+st0LcpArTvH/1RI52EfuXovf5HSawq3/fFwkv9bbZHdnnd1+5z5ID8ERykJBbTZNdDl6wMjy3LkyxCmKn8jsWZS7BTUd+t359bgfvyLGDDMlpkVoLgzSXi5BTuYzl2ASIwlhwswvPgAmqxFPwjLBZ7eI7YJbTECQSwOaa/aFjvtylZadwFM0q+zaK/2VPlDqqc7ubnfWB2AoejkZqFS3s5IokZb+D7GYNJ1GLEcmPm2/GkdzvP3HSumyCC37SrsoqzXgritadrDG89xhoyvXBmaC4dcrOZxC/QPa8Vi4JULhsGPo19orcDkxyDkR92tlXCGCQCbZ/A8D6FxA7OTsQOuXEyy1mui/rbziqOhsojpkCKbQlT1pVpZ3zwQrcD6fEW2aVJsd/EoQPsQwRTpbLjoNORKHTOsQGM4L00I8d32SAhJ9RXnkKmzHeozmfch4LRi1anvxNHH17mg9oVAOmUOKZN5QD5soNg+2xdZWg/oyf1xP37wcqLggkGf2JjUPFxPFutTHbu90lYd1mnIcLvB1IpOSS2F5qfjUnHiOHqhWvd1daE24d+aYl2FLkNTD87CsqllkzVtT8xW8TARP9wPc1UD5Z9TKLXewwSDhGd1Bd17wDq/l0QyZnV8p0MODpuJHwrn5eZKYR8ocpagPSoh2SzYqbvYQagTUqR335PRGbjINMu5YMsnJrHMxQBSPhfFup9jjdpnWQOSYhlyTUd3tySK6f7BHMolVSokKMRh0wju4WVoe0+LadxdLrWR9t4eewZhIjKZ2zXFAPdKPGV0jIZgyuqdh8+sT6AKAmhBiwm4IQTqM1rh5v3XYL5kDk1pPoktMIlcoTtshuMXoZOEl6dmSwygl6JApohJMMnnYWCfZdBuXdCn1ZDhdDrBRPbLJG6FkkUbjhptLUTidOXtrH/fiWlU2+LYg/aJl6oD3kAeX+Xi2LU0LKcnKlRci5cfZVtxbfj9zY+PQNyaRX2AZHO0FVP/fAWeqmC951oYjRAE9rJuf32WIltWQegXJeb3hEujoMLNS9ZRB2EnTBIcJV1s8qa/cCambNk0GuUQtGLM1/ImnQaH9/197jkjLwKfmqmkvqeOpWYUzzolCOTF3ZfDAKgo6sMUy754xjmC7AXAMIYiw4EjMgNg5lZ7dDP+qapnJDVD8cnyF2XaVxob/Ivdal/19Li2c2ut2/dZGOkFgfb9vURYXNC+RyXoaF6M5VsZh/Utb9reo/rV3LtRvTkim/0s84Xt2qVWk3pCL7RFGZUu3o4dmRTX7XuxdIk1hVbStTqYM6vVu0tT2/6fyZb6Ef5nVX2NVNeD+iWlrml2HkMFF8ZISN9L0eG9unafA7NasHdNObQDNVCuR0Uwe2jDW0WpyjMIykZmJJG8pej1qYRspBeuOgPO8mAKd6RNa3GK/OscYL7PcjBYi24KphZf53GbdIX05MXvhJlhYwdQLXYV5AyDxitd7c5Rd6S6KH87Wbmwn/GNN3omtyvPmUOfU6OLHI7lVeDPRVEcAhFe2qjTYV98aMMiKhgYls8+IVNtDbluSDtgeddIK0HatszN1B+4LYB7fY+X3gt50c3ryzBO+Gc4TRn4TqAevitsiqSc53Ui4O+WXL/zT0riQFbr/RPEt7DUkwyurn6gqWGXpeuKAMGwzSjf+GxQ2t1ONXvQtwReQx2tdYSKoxMEJC9uf4D4VNihm/qF+MkgXWY1kp2ArL11CA8H1oLNVu9Rt0H2xDx0daMTNkuqcP4E374llFTnV7wa2PKNvcjqt9kTbgEqd7xBbSG0qTgFqBpI3itBEUwTYyUDCJGMrvxU2hiddfC8Qx6jGTigf6aW+fox13w002OZCa1GqHqfxkHdP+e1OemDP50yjlU+Fvl/7tyN7fYdjWvyNai4m+uaP97mCkKLaVpe899nOLJCR+5aXZTGleEBjiZtpWPTpZ8dHqLi/LuaBL7V0l6PEwJbmqZcpYTjecGNfHTJZTrNQUpS0xGQi2ShY/c/UeXnXzx0XGjb8i/J5IIlqKJD55U/JPkwnW25/9+izonICZEcTSL2qtcLBxr2oL/WjN2Rjz9k/tzBb8DOlcDVeCj7jr+ashP9lu89JEZDIz3zQMrQkzp2HkJud667Z/HGKGjlzwpJVz4l6tPlf7jF5lWCik/KF2x9sf/SzPoPI6aeJbb2/KKERMvk3fUVvRJYZHLQYA8D9jMJr3H+DwjGLFWhWncI9/msWvqNqt07ebpRGDQOz7E03gwMilO3epXyZ4ejFU3rI2i7rvZZ+T5YIa1svrH/Q59nCLVrF9z5Rpji26Dz5zQ1HMrV+AuC2jIRC+lNLgiRA6vFCzW9ocxoH1Zf09BbPrkHfwcy4W/YsybTa98H0RTqyPanHIs7fZbC2EZ9cfJBos97m/vQrQ289Qfv54OzTu2IKi2RnpMVW6E9IH0SaLaybpKjx3q0QO21y5lFHa81nuwtF/o3pS9kE8DH0zkT1YtONzyKv61vt1jxwUUIRStykqkByWSRL5ToykcwdwK40wehSdMkeQu3TQf4x6yd0f+FVu+I2IGd4O8lY0D6zGSsa72QSk7WLK+45g8K6fJc9dOx54hZJmWbySQFmsFSrkic5U9McCH8PUCybEFUWqTyCMyECtGIrIkfl1V+PNOdML/VmyWm0Yq+hGw0SSMwZPO0afX54O2dg9OosbO2yFo1x4KkmDV0oEadS6Gl4sfog4NTiobk8cy8h/WDMmMjktFJ+TPEvBVDihq7zx/85OOLFGoHMj+8Jo/LTVf2NtThz5+mPUIi5YO02KU+73VFEz9kkvG0asHE+CifOrefu2LGzWXZWxuwxeziqY/EJz8DDf+ZkA+vJTYNq0wSxgzs9U/PxQVFbFZcSs1ZZZF7Jz1vIpY/x6fTvkgSspqrOo8tzNi3El2dmoJoC1Plg0wARGQD6RE8qOtWVW7A+EXfwiq19QutwO5u5b9XvLUbkGDXIC+nVkxNfiyNZPTFf9oqOPTbyNQf4KE3r9p5f91rtMKmyOi/Pch+UcdfFdxNjDNOb1JyZU9bpN15XqYyfkar57veWw0/FtkUpc694ZwpC6lAtlHBLdPlbSo7eN8yZVW25q75pCXbOT3EC15sDjoweyQAyNQud4ETQz9HafimHW1DcMJmWLsuWOhngW3ShadHrI+rtYYRSnuutVHUr/peB32wrJFOzCJ0Zi1uO3AjeJgzoAY20z+NADUGZczDsd5vUvOWEOLzbwLXwEmowuce1VLSxpydh26ahrBraB+u9918WikmjNnLPYrdZtIMK6Nfkgju9WW74zBQQh7K5EdB2TtgsD39thE9sJQhK9NBJmerZvKkFDpAyrq+gRhOBA5P5HM9E03JGhZUNRglVLkeaa/dWBn3cE6568aEfHHhmXTX90ZPpCHxPNtxc29O7QgeKCUH/FTmYAik0qOv7nJflPTBMG5GJEqJbAPbYJJkQ58pp49KpTk/K04ERZf6plnUm/uebif3RweyP+LxyUIIukXdIjNYFMTDw3EsPfYD8J5xCGl2recr7Cq9Z0t/ZZufbe2SvVewndWDap/vXnxxIKdXdZ1Z2HLfEclikJN4qFHgk2zfL9B8ct4axT6o0qznQm9bONNvOP+Nv8UG8Tx9DOxe1ukPvzRDKYkS7Ba8aMs7ArALE1ImTQD+40cPxh65dyObEUpzmWplrO1WHj/uIXPbt5NYHaX1GUapn8tvpBO/yFXO/p4aIET2qDcYTaQ3R0xieu3LlS2InFGukmwhqzKTDhamlfKHrC/f3hUFzpHat10ABtPvd/N4N1g+5Hx0RusawK7bTtV9qkexU4U7YStz5vu/2rjkjqtcseoWMJygskDXlYjgFvMleIiZNTicFGeF1A88rdVlRNkkwlXJPeBBRhx3SFcbq+UAtXJHaE1inHkEyR1bLd4AvBD/G9kLnt1bGSLHlCDRhMBFUGl76O9BFMwvQ5HjZPVOwXRImoEjLE14bZSmmvgpVLl40X8bw2c5g8zhbDfTh8AiofWDKVNNkAAfPW8cbA+pCQP+8xyWa5k4iHuUG21WHObopw0TDzngQqSpQHgymlcCMcLAoEgdRMf3yHlD56jV4jiyR/O96S9TVk9Mv9LeCbY4MjWkDqSWHIDfgN2YvNdH3bOrL7R2JzCpnxZcQ1zIIKgbwmk5O8rnwc618xho5DXkJWu+7PbDJlBuV7fXpT8eDoqVGsXURYEjQp80H2Hg5glMuHHIyGUxOlByHeYcBr8bjQ2FpqN8i2OPKYlzeyRVsUCwbdfEWnq06jh9mSCHlXsDJtHx0CYSTUaYKBHQxmxjiFmlhSpydW4qT6Ysed3C8c655/bWuD6OayzPSU0e0KrolkqXHFep4+A6vi8vVuic9GdH3YsAWKl3E+hX+r0PNwVXoYSyljyF07XmRbHEpM0eqJBxpS0U2MVvrwJsGlwQh9xrIOK51o2mWgvlsJZ5rFJxSp+XShQ3fpd56ZoWWkArQwXBfASlIHVsoewFeQKjb8YbbQO9dcLrfHk00CSxwiFO3UXrCDjjKBqtuJd/ZuluC7Tw+Ul/1e1JXmF5qN/+Zm6TfLKZpDksEj7Gt1WOVGi+7/+jS9vZL9Iaji+mWy6cqhPauOsYHl9aAUOFrYiplKN3SLuxtFsuDTrrl20xMwELxPnSKlXCnk9mcTM2uR/ln/tpzfCIPw9GBGwJvGENLgiKwKUXs7D9wrDRfstFCEZBVBV4iAmYdrc7Eju/vmatN2M00gIGEc7FROV+zmajfKdTCKpLUpY/J1bmZPbzyTpVcKTvy3kK+8GUrh1KV9CVI+XBj93H7lBJkqM1n8Yrf4nO9ZhZIKEX4AabThKbaS5afXDbUKpvTOf2911HqHguZ4v0JZgwt7EwsNoocUqx+Dha3VErVKWUNo0Uvy/5NbvSU1s6GOzA+tDQlhaoPweN79WodBIajMyhF64MbJ0rJ912HEPsrF1MLdiEmEOxmGSbK+TfNyN/bNVz2kuBL9kVP0ZypwizeGHvoqJXS2+onVcI7xePSvPxhpt6soiqvJzE648V764DlyB4Cj0K0zOAIIdeMcBu37nAAMtxSuqaPyqn15ixI2Q/Zk2dllbA+HVBZQEQun+qLgkSJn7i6/KiuW/Wtr/XVExI05zMsiCweaSUPj3gXW6zTlUW3EfF0qoKJ6baHiUwjmni/UKIVuewJD4APK5GQJP4WzsBZWH1PfDHDt1cm9qh2oiO58sLHWu7ux2PiYH5n5GJSPgebrBXfDRttwcZFGbB1vgJgPZrMfUv203K5Grlgy9L2Yi2ULo4CfIPMALHAS6r1tKG2SGSv/9XYS4UINaiQPWWQISSrqOcVWY1PNUu1PY1SC0f3vRkFErYkrhHRDXDAfxOOUFlo/VGv9Jr8P2Zx1QGVHfA7bbXgrYjwCLJUrRMfCRn3PvQWF95oHLuaXa0kH0aTozZULgWOeEhtK+3cl7Ojr+rZsP3QQa35ZpYwVLrydmWdRS4ctZLTJiUlTrqjONdMI5t/n9eXjxGSLp/E5WJoHQG4RNUzuGW/KgSM/OFWOEGKlzURxqwdeueAHO5FzviQHrNL3h94Q8mV5Mxa/d92J2Fcj6BBW5jb715DTStedVA5yYhoFpw1ZPb/8GIST9LVzkRThAN4RM18iLJ+dsBpXrf1fuwgPAfR5OLfRhMg/9zUBgVpcl9dDo2uk/2H+QF33Kb5t481/Eg8nYuqOqH0DMpDmdc+wZO6JDBki+3uQQfxs3T7iVM8+y9iT9zo6sruC1Ps7npWHF5v3wXgR2hg56G6H93/LEHkc+8BSflo9cIcQJBkTqwvtHBmKYRiPlJWXe/jJHjlTaWqtBsuVxjl/W35dNVX2rogIyUZKc09b+6YoahR6eeryXjJXmPW90NhiZ6+bk22Mr2ntttlHhabZE5V+/V478s5LLNRaSXWGmYfIQh4dLdxgeXupu4DE11z7qc/kYjs2Uh6RUOseq/ZI7sffKee38UaWYNQvwxYpzjan2gFLH6V401aom+McGPjU5mj6Z19JwrnwKf477TJNPQ30USfyiyMXGze9pkn3NrrueSPBruyMPEwAunuIZAvOcoVfce4dRoGO8a3LpgPUcK0TQ76JYjt6LEuLjPCu3SNLOHymeg0DnOJ9WgE5qwOwPlyyCVcVFmfCtCNnU+FbR6XnwedYf6pO/do+kd0QQyfSLR00Kkmt8IAs8glCFTkecp81Gs54eZ3IEVLVJLzHFmMqsgUyFBrFSrNnfjmEcTbw2+DCMOEWA5mC5VaMgBtK7BbltbG9dcmz4iw931xebpowiVDB3cdo/cvkO2F3CN+YkePM83SjNU+oc/8vvqGJWi5kzyZ79UdvliX2RwMAbJ2EvLl4N1097KEUToY4uqAibFW1QpLJdVXMr1HphP/KEubdCOgpWce8GjlUtwcv2rBPg9sMc9ERaO1HfJPxThCXvENL7ude3+2KBYYwZ3nfPZqRQRJaBW0c+44SdWza3pW2cFzGyK4I/ZCM3/wBYFPGQD4F8xpXvvZxyCAf3Zq5pcugWDpEX7Oby7PIe4wgWSPGLeZLGyekqkR2/z4IDU1JcqMmOI4wkLOWSHTpXW7lUL5ThpV3OEJ3U9bBU8J4ZyTkixXconGYWzN+uahX8Wwjhh0931ciqC7NUVPUlOD5pA/JINou0HCFnIcbenORLW+t6tVccmBiq4/azHQNN1IqzpOYvkyqi16ViPf/6tX0qt8tqxdxTboMR3AfmCWQplb1UwGO548BOIaI9HpCN2pp1Zvl6WVxfwTOchIhlZXvwSg/fbp0Y0vIV8BXvc67AsyUTk8oFzyImtTUUAp2gYclm2ms0S36kdifk2oOg+d0YmK5QhqA4LsqAisWdZ6HASX/XVCsX//vO8RIf7zBtaNg3mH01aRJu3bd5meggI/8SfZtJGU34/5D0jBQc3QRfNjWAJJ9441HR4fw/JXFpvOPJa2EkVmvmY6/DxWy0qyRph/XX87i7AG8HrAUeUJAccjWMMNtjs0CPj1WGEuxGNBaQvM1Hj8Qiz9jiI3Yl3VPdr0bniupPZeILI0Xzsh2aEeoBCUp5s3FNjxFz9mxERZIpwkEy/doGpRrS5XAcW76fKmaS1QES35/5/53zZsCiTOPtnC+stG3YYPf50ShmWB5a9bHebxFJtZWcijzCgO3TYy55lMEVA9lNzUWKd1rMyXDVYZ8yC2EKo7ShkOfkoNSHlWOmdoGPpXI1u+vgfoyoQExojCT+h82sTAQuQm1sZYteZ7hB1de41zv2HTVm4yLTkwvRmuTYQ6ZLVI46t4MsPKFiiw1cFnf7rGYx4wl5Vo7Y7NAnh+pYqBoZFw76iC68WlGj1M9I/q4RQJqE3BCIGXYU+XjB3XkCM0teeuAfFTkGcxDWXeK3VFh9C1rhVeXUSUVbfJTJ89XF+n2JoKjVvHA5/5BCWuMSlrwV3fUJTgK075Fc7r8Ijm+bLbUTpdy0bREfk5HloCMFotlPGjqULQRuxnNR+LlKztbAai9nEyF8HwpdRU7A+7WUen9vF6cK1830yuhyDXj1sfaYbjWFkATDmelje8SgI6W3+2GPZp2x8oaa5SdQIMG3s3P92ar1xrKJR5Ru2FhY4fcYUWPKADDnbbGs4/9ckS+2qsNSQTwqrUyCMwEUY5vXQ+9Dt70kSiPhw5x1heZw+OuJNk9eTgPBWbPflJOmbtLbAVcn/d9+9md2Y7RHTnq6JBUoVrTmg7BcpuhLmKn26VloBcauTdJ4MxGv8mz42wlS2QKd/4cQluvcH9MpQN7wXF2DjXJS6zY0PNPiv4o4A5+Jfm/rwdzzC4LSZDUVv6mBok1lJXq86QCVh4IKjnzt3nf7BhIbw0Hwc1g814YNPZ3N4Zj7lmAAs2tZfMLUeXFkKAg/3Mbwc3GTwG2pibxFO3RrF/73xTqxZrxZugo0viUzkqPoWVdXHPg5Neyxb4QWT9rFr9XHXZJHaIPjwcvWkVNHQw7r8XYJxQcr/cAAlZu6Oom/ZEbF0coGCqVC8ESbKMLI57gqrO4xDbBMPbwqvcgMAQnguWqOCVOdv/jB6d6YpDlH4Zbyyf4VOO6zS/BCEdkFKQft0KpbDOMa07lZi7pdirhty5tE7JuxF4budr8anrn4tNxk8B7dpv+R27Lxu56SjPVo+e755XXQFLt2STDw5KCwBgN4h4W5CwLCJF2WHXmuRx8zeORR+icsBcCNZGKMQhdEgerMd3yWo1PKHxUkUI9DRZALPIWWh/bYh7X7VeXCBoe9KVDIvHpW0kHjwFpJi8GU9hmKRsaw+aYIEdzugRHeYdXS5DAVSpxDuA4XSCxQpsi+R1sPflGvO426nFJlteSR0zXq/1oWKc+5hiCFZ+jNJQa8IFgkdvVu6ArJq57rznkeod6HT56BTeWbALd7F4Gkbg2eZxMBwAh3ilkaecpYrb4CSn7BMwWzJOClMNZvAadEKX25ceFLHFSZqAoh8sxsfZFF3QgdZAJ6E2mFtbHMOul5ewEVxc+kUwalGFn96oNsWnhphoFgj4aObHmNPCAjXCPl2tfJSZJoj2zFJUkKRSS8nXnxfXfe8zwEIvNcDoOzukanfgMr4rvxmiAu5nKO9Xx0KPDxquG1ZkJfaZTbvtKijNQMqkx4xbfkdD0S4VynW3vSTkKUsNkzU0si1gseFuQT0Vc2z0CN0k0eE9qov9PUfk1cac6vBBkvQUr9mgfOxpbLMV4DPOr2A80GgCfSUTVef4eJQfHzQkMGyGPVi/s+qwrYOzG9/28xtkG2sytsGvztkFMUyZaoUd1fqt75EtRWwWASc0TyD736sLBne3CItJ5Ypnb9QPRj6qLzXcgbbgXyxNtwjqhq7MHs/K8Zg5fl87nfngOM5g8R2/7IV0neg7yAPRDrBqQLIwjGlgOqGAoUFFDudETPA9t/GDvVv63coyqQ9T5ANbtsETmOKyO3YDos1QhQHlTADH6Of3wdssBlawBfpS8MeqVddAAAA==";

// time table
const hlName = PAGE.highlight && PAGE.highlight.name ? PAGE.highlight.name.toUpperCase() : "";
$("#ttList").innerHTML = CONFIG.timetable.map(([a, b, n, g, id, alt], i) => {
  const me = hlName && n.toUpperCase().includes(hlName);
  return `<li${me ? ' class="me"' : ""}><a href="${CONFIG.testUrl}#r-${id}-${alt}" target="_blank" rel="noopener" aria-label="${n} 취향 결과지 보기"><time>${a} – ${b}</time><span class="av" style="background-image:url(${DJ_AVATARS});background-position:-${i * 24}px 0"></span><span class="nm"><b>${n}${me ? '<span class="star">★</span>' : ""}</b><span class="g">${g}</span></span><span class="go" aria-hidden="true">›</span></a></li>`;
}).join("");
$("#quizCta").href = $("#quizCtaDone").href = CONFIG.testUrl;

// party guide
// 라인 아이콘 (층별 안내도 스타일)
const ICON = {
  m: '<svg viewBox="0 0 16 26" aria-hidden="true"><circle cx="8" cy="4" r="2.6"/><path d="M4.6 9h6.8v7.2H9.8V24H6.2v-7.8H4.6z"/></svg>',
  w: '<svg viewBox="0 0 16 26" aria-hidden="true"><circle cx="8" cy="4" r="2.6"/><path d="M6.4 9h3.2l3.1 8.4H9.9V24H6.1v-6.6H3.3z"/></svg>',
  smoke: '<svg viewBox="0 0 26 16" aria-hidden="true"><rect x="1.5" y="9" width="15" height="4"/><path d="M19 9v4M22 9v4M19 6.5c0-2.2 3-1.8 3-4.5"/></svg>'
};
const sideIcons = x => (x.wc || x.smoke) ? `<span class="wc">${x.smoke ? `<span class="wci sm" title="흡연구역">${ICON.smoke}</span>` : ""}${x.wc && x.wc.m ? `<span class="wci" title="남자 화장실">${ICON.m}</span>` : ""}${x.wc && x.wc.w ? `<span class="wci" title="여자 화장실">${ICON.w}</span>` : ""}</span>` : "";
const wcFloors = k => CONFIG.floors.filter(x => x.wc && x.wc[k]).map(x => x.f).reverse().join(", ");
$("#floorBody").innerHTML = `<div class="fl">${CONFIG.floors.map(x => `
  <div class="fl-row${x.main ? " main" : ""}${x.tag ? " in" : ""}"><span class="f">${x.f}${x.tag ? `<span class="chip in">${x.tag}</span>` : ""}</span><div class="fl-c">
    <div class="fl-items">${x.items.map(([k, e]) => `<span class="it"><b>${k}</b><i>${e}</i></span>`).join("")}</div>
    ${(x.notes || []).map(l => `<small>${l}</small>`).join("")}
  </div>${sideIcons(x)}</div>`).join("")}</div>
  <p class="fl-note"><span class="ln">${ICON.m}남자 화장실 <b>${wcFloors("m")}</b></span><span class="ln">${ICON.w}여자 화장실 <b>${wcFloors("w")}</b></span></p>`;
$("#enterBody").innerHTML = `<p class="gd-top"><b>DOORS 17:30</b>&nbsp;&nbsp;SHOW 18:00 – 23:00</p><ol class="steps">${CONFIG.enter.map(([k, e]) => `<li><div><strong>${k}</strong><small>${e}</small></div></li>`).join("")}</ol>`;
$("#goodBody").innerHTML = `<ul class="checks">${CONFIG.goodToKnow.map(([k, e]) => `<li><div><strong>${k}</strong><small>${e}</small></div></li>`).join("")}</ul>`;
if (CONFIG.menu.length) {
  $("#menuSlot").outerHTML = `<details class="tt" id="menuGuide"><summary><span class="t">MENU</span><span class="sub">술과 음식</span><span class="chev" aria-hidden="true"></span></summary><div class="gd-body">${
    CONFIG.menu.map(c => `<div class="menu-cat">${c.cat}</div><ul class="menu-list">${c.items.map(([n, pr, d]) => `<li><span>${n}${d ? `<small>${d}</small>` : ""}</span><span class="p">${typeof pr === "number" ? won(pr) : (pr || "")}</span></li>`).join("")}</ul>`).join("")
  }</div></details>`;
}

// table packages (form)
const tableTicket = CONFIG.tickets.find(t => t.table);
const tblSeg = $("#tblSeg");
CONFIG.tables.forEach(x => tblSeg.insertAdjacentHTML("beforeend", `
  <input type="radio" id="tb-${x.id}" name="tableType" value="${x.label}" ${x.soldOut ? "disabled" : ""}>
  <label class="pk-card" for="tb-${x.id}">
    <span class="txt">
      <h4>${x.label}${x.soldOut ? ' <span class="ltd">SOLD OUT</span>' : ""}</h4>
      <span class="where">${x.where}</span>
      <span class="price">${won(x.price)}</span>
    </span>
    ${x.img ? `<span class="img"><img src="${ROOT + x.img}" alt="" onload="this.closest('.pk-card').style.setProperty('--iw', (this.offsetWidth + 10) + 'px')" onerror="this.parentNode.remove()"></span>` : ""}
    <ul>${x.items.map(it => `<li>${it}</li>`).join("")}</ul>
  </label>`));
$("#pkSpirits").innerHTML = `<span class="k">Spirit options</span>${CONFIG.spiritsEn.map(s => `<b>${s}</b>`).join('<i>/</i>')}`;
// 카드형 선택지: 숨겨진 라디오가 목록 맨 위에 있어 클릭 시 화면이 위로 튀는 것을 막음
document.addEventListener("click", e => {
  const l = e.target.closest(".seg label, .pk-list label");
  if (!l) return;
  const i = document.getElementById(l.htmlFor);
  if (!i || i.disabled) return;
  e.preventDefault();
  if (!i.checked) { i.checked = true; i.dispatchEvent(new Event("change", { bubbles: true })); }
});
const tbl = () => CONFIG.tables.find(x => $("#tb-" + x.id).checked);
let pax = 1;
function renderBottles(){
  const n = tbl() ? tbl().bottles : 1, box = $("#bottles");
  const prev = [...box.querySelectorAll("select")].map(s => s.value);
  box.innerHTML = Array.from({ length: n }, (_, i) => `
    <select id="bottle${i}" aria-label="보틀 ${i + 1}" data-table-req>
      <option value="" disabled ${prev[i] ? "" : "selected"}>${n > 1 ? (i + 1) + "번째 보틀" : "보틀 종류"}</option>
      ${CONFIG.spirits.map(s => `<option ${prev[i] === s ? "selected" : ""}>${s}</option>`).join("")}
    </select>`).join("");
}
document.querySelectorAll("input[name=tableType]").forEach(r => r.addEventListener("change", () => {
  if (tableTicket) $("#t-" + tableTicket.id).checked = true;
  renderBottles(); render();
}));
document.querySelectorAll("input[name=ticket]").forEach(r => r.addEventListener("change", () => {
  if (!ticket().table) document.querySelectorAll("input[name=tableType]").forEach(x => x.checked = false);
  renderBottles();
}));
$("#pPlus").onclick = () => { const x = tbl(); if (pax < (x ? x.max : 6)) { pax++; render(); } };
$("#pMinus").onclick = () => { if (pax > 1) { pax--; render(); } };
renderBottles();

// quantity + amount
let qty = 1;
function render(){
  const t = ticket(), isTable = !!(t && t.table), inquiry = !t || (!isTable && t.price == null);
  $("#qtyField").hidden = isTable; $("#tableField").hidden = !isTable;
  $("#qtyOut").value = qty; $("#qty").value = qty;
  $("#totalPrice").textContent = inquiry ? "별도 문의" : won(t.price * qty);
  $("#plus").disabled = inquiry || qty >= CONFIG.maxQty;
  $("#minus").disabled = inquiry || qty <= 1;
  const x = tbl(), max = x ? x.max : 6;
  if (pax > max) pax = max;
  $("#paxOut").value = pax;
  $("#pPlus").disabled = !x || pax >= max; $("#pMinus").disabled = pax <= 1;
  $("#tblPrice").textContent = x ? won(x.price) : "—";
  $("#pkWrap").hidden = !isTable;
  $("#tblChosen").innerHTML = x ? `선택한 테이블: <b style="color:var(--fg)">${x.label}</b> · ${x.where}` : "05에서 테이블 패키지를 먼저 선택해 주세요.";
  $("#paxHint").textContent = x ? `${x.label} 최대 ${x.max}인 · 인원 수와 관계없이 테이블 금액만 입금하시면 됩니다.` : "테이블을 먼저 선택해 주세요.";
}
$("#plus").onclick = () => { if (qty < CONFIG.maxQty) { qty++; render(); } };
$("#minus").onclick = () => { if (qty > 1) { qty--; render(); } };
document.querySelectorAll("input[name=ticket]").forEach(r => r.addEventListener("change", render));
render();

$("#shareBtn").onclick = async () => {
  const url = location.href, lbl = $("#shareLabel");
  const payload = { title: CONFIG.event.title, text: "NEW PLAYER 003 presents " + CONFIG.event.title + " · " + CONFIG.event.date + " " + CONFIG.event.venue, url };
  try {
    if (navigator.share) { await navigator.share(payload); return; }
    await navigator.clipboard.writeText(url); lbl.textContent = "link copied";
  } catch (e) {
    if (e && e.name === "AbortError") return;
    try { await navigator.clipboard.writeText(url); lbl.textContent = "link copied"; } catch (_) { lbl.textContent = url; }
  }
  setTimeout(() => lbl.textContent = "share", 1800);
};

$("#againBtn").onclick = () => {
  const form = $("#form");
  form.reset(); qty = 1; pax = 1; renderBottles();
  if (firstOpen) $("#t-" + firstOpen.id).checked = true;
  render();
  $("#doneText").innerHTML = "신청이 접수되었습니다.<br>입금 확인 후 안내 문자를 드릴게요.";
  $("#submitBtn").disabled = false; $("#submitBtn").textContent = "SUBMIT";
  $("#msg").textContent = "";
  $("#ticket").classList.remove("ok");
  $("#ticket").scrollIntoView({ behavior: "smooth", block: "start" });
};

$("#copyBtn").onclick = async () => {
  const b = $("#copyBtn");
  try { await navigator.clipboard.writeText(CONFIG.account.number); b.textContent = "COPIED"; }
  catch (e) { const r = document.createRange(); r.selectNodeContents($("#acctNum")); getSelection().removeAllRanges(); getSelection().addRange(r); b.textContent = "SELECT"; }
  setTimeout(() => b.textContent = "COPY", 1600);
};

$("#phone").addEventListener("input", e => {
  const d = e.target.value.replace(/\D/g, "").slice(0, 11);
  e.target.value = d.length > 7 ? d.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3") : d.length > 3 ? d.replace(/(\d{3})(\d+)/, "$1-$2") : d;
});

$("#form").addEventListener("submit", async e => {
  e.preventDefault();
  const form = e.target, msg = $("#msg"), btn = $("#submitBtn");
  msg.textContent = ""; msg.classList.remove("err");
  document.querySelectorAll(".field, .pk-head").forEach(f => f.classList.remove("invalid"));
  let bad = null;
  for (const el of form.querySelectorAll("[required]")) {
    if (!el.checkValidity()) { el.closest(".field, .consent")?.classList.add("invalid"); if (!bad) bad = el; }
  }
  if (!ticket()) { bad = bad || $("#seg"); $("#seg").closest(".field").classList.add("invalid"); }
  if (ticket() && ticket().table) {
    const empty = [...document.querySelectorAll("[data-table-req]")].find(s => !s.value);
    if (!tbl() || empty) { $("#tableField").classList.add("invalid"); if (!tbl()) $("#pkField").classList.add("invalid"); bad = bad || (tbl() ? empty : $("#tb-" + CONFIG.tables.find(x => !x.soldOut).id)); }
  }
  if (bad) { msg.textContent = "필수 항목을 확인해 주세요."; msg.classList.add("err"); bad.focus?.(); return; }

  const t = ticket();
  const now = new Date();
  const kst = new Date(now.getTime() + 9*3600*1000).toISOString().slice(2,10).replace(/-/g,"");  // 한국 날짜 기준
  const receipt = "SYZ-" + kst + "-" + Math.random().toString(36).slice(2,6).toUpperCase();
  const data = {
    receipt,
    timestamp: now.toISOString(),
    name: $("#name").value.trim(),
    phone: $("#phone").value.trim(),
    affiliation: $("#affiliation").value,
    inviter: $("#inviter").value.trim(),
    ticket: t.label,
    qty: t.table ? 1 : t.price == null ? 0 : qty,
    amount: t.table ? tbl().price : t.price == null ? 0 : t.price * qty,
    tableType: t.table ? tbl().label : "",
    bottles: t.table ? [...document.querySelectorAll("[data-table-req]")].map(s => s.value).join(", ") : "",
    pax: t.table ? pax : "",
    depositor: $("#depositor").value.trim(),
    bank: $("#bank").value,
    arrival: $("#arrival").value,
    photoConsent: $("#agreePhoto").checked ? "동의" : "",
    userAgent: navigator.userAgent,
    source: PAGE.source
  };

  btn.disabled = true; btn.textContent = "SENDING…";
  try {
    if (CONFIG.endpoint) {
      // 응답을 기다리지 않고 전송만 보장 (keepalive). Apps Script 응답이 느려도 화면은 바로 넘어갑니다.
      // 구/신 스크립트 모두 읽을 수 있게 평평한 필드 + columns/data 를 함께 보냅니다.
      const body = JSON.stringify({ ...data, columns: CONFIG.columns, data });
      const sent = fetch(CONFIG.endpoint, { method: "POST", mode: "no-cors", keepalive: true, headers: { "Content-Type": "text/plain;charset=utf-8" }, body });
      await Promise.race([sent, new Promise(r => setTimeout(r, 600))]);
    } else { await new Promise(r => setTimeout(r, 500)); }
    if (t.table) $("#doneText").innerHTML = `${tbl().label} 테이블 예약이 접수되었습니다.<br>입금 확인 후 테이블 배정 안내를 드릴게요.`;
    $("#doneNum").textContent = "NO. " + receipt;
    $("#ticket").classList.add("ok");
    $("#ticket").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    msg.textContent = "전송에 실패했습니다. 잠시 후 다시 시도해 주세요."; msg.classList.add("err");
    btn.disabled = false; btn.textContent = "SUBMIT";
  }
});

})();
