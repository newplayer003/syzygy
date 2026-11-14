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
.tt summary{list-style:none;cursor:pointer;padding:16px 28px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.tt summary::-webkit-details-marker{display:none}
.tt summary .t{font:600 13px var(--en);letter-spacing:.2em;color:var(--fg)}
.tt summary .sub{font:500 11.5px var(--en);letter-spacing:.06em;color:var(--fg-2)}
.tt summary .chev{margin-left:auto;font:500 11px var(--kr);letter-spacing:.06em;color:var(--fg-2)}
.tt summary .chev::after{content:"+";display:inline-block;margin-left:8px;font-size:15px;color:var(--red-2);transition:transform .2s}
.tt[open] summary .chev::after{transform:rotate(45deg)}
.tt summary:hover .chev{color:var(--fg)}
.tt .tt-list{padding:0 28px 16px}
.tt-quiz{padding:14px 28px 18px;border-bottom:1px dashed var(--line)}
.tt-quiz .quiz-cta{margin-top:0}
.tt-head{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:10px}
.tt-head .k{font:500 10px var(--en);letter-spacing:.2em;text-transform:uppercase;color:var(--red-2)}
.tt-head small{font:400 11px var(--en);letter-spacing:.14em;color:var(--fg-2)}
.tt-list{list-style:none;margin:0;padding:0}
.tt-list li{display:grid;grid-template-columns:88px 1fr;gap:0 12px;align-items:baseline;padding:7px 0;border-top:1px solid #1a1616}
.tt-list .nm{display:flex;flex-wrap:wrap;align-items:baseline;gap:0 8px;min-width:0}
.tt-list li:first-child{border-top:0}
.tt-list time{font:500 12px var(--en);letter-spacing:.04em;color:var(--fg-2);font-variant-numeric:tabular-nums;white-space:nowrap}
.tt-list b{font:600 13px var(--en);letter-spacing:.08em;color:var(--fg);white-space:nowrap}
.tt-list .g{font-size:11.5px;color:var(--fg-2);white-space:nowrap}
.tt-list .star{color:var(--red-2);margin-left:6px;font-weight:400}
.tt-list li.me{border-left:2px solid var(--red);padding-left:10px;margin-left:-12px}
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
@media (max-width:380px){.pk-card .img img{max-height:84px}.tt-list li{grid-template-columns:78px 1fr}}
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
      <h2>이벤트 신청</h2>
      <small>ADMIT ONE</small>
    </div>
    <div class="notice">
      <span class="k">Dress code</span><span>ALL BLACK + RED POINT <em>(권장)</em></span>
      <span class="k">Age</span><span>19+ only</span>
      <span class="k">Line up</span><span class="lineup"><b>DPC</b> <b>D.KIM</b> <b>DJ No:biz</b> <b>JENNA KIM</b> <b>DJ Maple</b> <b>SIMSEXY</b> <b>MIGNØ</b> <b>Linzi</b> <b>Elissa</b> <b>DJ Hondo</b></span>
    </div>

    <details class="tt" id="timetable">
      <summary><span class="t">DJ TIME TABLE</span><span class="sub">18:00 – 23:00</span><span class="chev">자세히</span></summary>
      <ol class="tt-list" id="ttList"></ol>
    </details>

    <form id="form" novalidate>
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
  timetable: [
    ["18:00", "18:30", "SIMSEXY",   "Jazzy Hip-hop / Soul"],
    ["18:30", "19:00", "DJ MAPLE",  "Tech House"],
    ["19:00", "19:30", "MIGNØ",     "French Electronic"],
    ["19:30", "20:00", "HONDO",     "Pop EDM"],
    ["20:00", "20:30", "DJ NO:BIZ", "K·J Indie Pop"],
    ["20:30", "21:00", "JENNA KIM", "Lo-fi House"],
    ["21:00", "21:30", "LINZI",     "Hip-Hop × K-pop"],
    ["21:30", "22:00", "ELISSA",    "90s R&B → Trap"],
    ["22:00", "22:30", "D.KIM",     "Acid / Hard Techno"],
    ["22:30", "23:00", "DPC",       "French Electro"]
  ],
  testUrl: "https://claude.ai/artifact/THoUpHQuBbv8W2C3fJqAt6",   // 음악 취향 테스트
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

// time table
const hlName = PAGE.highlight && PAGE.highlight.name ? PAGE.highlight.name.toUpperCase() : "";
$("#ttList").innerHTML = CONFIG.timetable.map(([a, b, n, g]) => {
  const me = hlName && n.toUpperCase().includes(hlName);
  return `<li${me ? ' class="me"' : ""}><time>${a} – ${b}</time><span class="nm"><b>${n}${me ? '<span class="star">★</span>' : ""}</b><span class="g">${g}</span></span></li>`;
}).join("");
$("#quizCtaDone").href = CONFIG.testUrl;

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
