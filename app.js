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
/* table packages */
.pk{border-bottom:1px dashed var(--line)}
.pk summary{list-style:none;cursor:pointer;padding:16px 28px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.pk summary::-webkit-details-marker{display:none}
.pk summary .t{font:600 13px var(--en);letter-spacing:.2em;color:var(--fg)}
.pk summary .from{font:500 12.5px var(--en);color:var(--fg-2);font-variant-numeric:tabular-nums}
.pk summary .chev{margin-left:auto;font:500 11px var(--en);letter-spacing:.16em;color:var(--fg-2)}
.pk summary .chev::after{content:"+";display:inline-block;margin-left:8px;font-size:15px;color:var(--red-2);transition:transform .2s}
.pk[open] summary .chev::after{transform:rotate(45deg)}
.pk summary:hover .chev{color:var(--fg)}
.ltd{font:600 9.5px/1 var(--en);letter-spacing:.2em;color:#fff;background:var(--red);padding:5px 7px 4px}
.pk-body{padding:0 28px 22px;display:grid;gap:10px}
.pk-card{border:1px solid var(--line);padding:16px;display:grid;grid-template-columns:1fr auto;gap:4px 12px;align-items:baseline;background:#080707}
.pk-card.top{border-color:var(--red-dim);background:linear-gradient(180deg,rgba(216,15,38,.10),rgba(216,15,38,.01))}
.pk-card h4{margin:0;font:600 17px var(--en);letter-spacing:.12em;display:flex;gap:8px;align-items:center}
.pk-card .price{font:600 17px var(--en);color:var(--red-2);font-variant-numeric:tabular-nums;white-space:nowrap}
.pk-card .where{grid-column:1/-1;font-size:12px;color:var(--red-2)}
.pk-card ul{grid-column:1/-1;margin:6px 0 0;padding:0 0 0 10px;border-left:2px solid var(--red);list-style:none;font-size:13px;line-height:1.7;color:var(--fg)}
.pk-spirits{display:flex;flex-wrap:wrap;gap:6px 14px;align-items:baseline;padding:6px 0 0;font-size:12.5px}
.pk-spirits .k{font:500 10px var(--en);letter-spacing:.2em;text-transform:uppercase;color:var(--red-2)}
.pk-spirits b{font:500 12.5px var(--en);letter-spacing:.06em}
.pk-info{margin:2px 0 0;padding:0;list-style:none;font-size:12.5px;color:var(--fg-2);line-height:1.8}
.pk-info strong{color:var(--fg);font-weight:500}
.pk-cta{margin-top:6px;height:46px;background:transparent;border:1px solid var(--red-2);color:var(--fg);cursor:pointer;font:500 13px var(--kr);letter-spacing:.04em;transition:all .2s}
.pk-cta:hover{background:rgba(216,15,38,.15)}
.tbl-sub{display:grid;gap:10px;margin-top:8px}
.tbl-sub .lab{font-size:12.5px;color:var(--fg-2)}
.bottles{display:grid;gap:10px}
form{padding:8px 28px 28px;display:grid}
.field{padding:20px 0;border-bottom:1px solid var(--line);display:grid;gap:10px;min-width:0}
.field:last-of-type{border-bottom:0}
.lab{font-size:13px;font-weight:500;letter-spacing:.02em;color:var(--fg);display:flex;gap:8px;align-items:baseline}
.lab .n{font-family:var(--en);font-size:10px;color:var(--red-2);letter-spacing:.14em}
.lab .req{color:var(--red-2);font-size:12px}
.lab .opt{font-size:11px;color:var(--fg-2);font-weight:400}
.hint{font-size:12px;color:var(--fg-2);margin:0}
input[type=text],input[type=tel],select{width:100%;min-width:0;background:transparent;border:0;border-bottom:1px solid var(--smoke);border-radius:0;color:var(--fg);
  font:inherit;font-size:17px;padding:8px 0;outline:none;transition:border-color .2s;appearance:none;-webkit-appearance:none}
input::placeholder{color:#4a4345}
input:focus,select:focus{border-bottom-color:var(--red-2)}
input:focus-visible,select:focus-visible,button:focus-visible,.seg label:focus-within{outline:2px solid var(--red-2);outline-offset:4px}
select{background-image:linear-gradient(45deg,transparent 50%,var(--fg-2) 50%),linear-gradient(135deg,var(--fg-2) 50%,transparent 50%);
  background-position:calc(100% - 14px) 50%,calc(100% - 9px) 50%;background-size:5px 5px;background-repeat:no-repeat;padding-right:28px;cursor:pointer}
select option{background:var(--bg-2)}
select:invalid{color:#4a4345}

/* ticket type list */
.seg{display:grid;gap:8px}
.seg input{position:absolute;opacity:0;width:0;height:0}
.seg label{cursor:pointer;border:1px solid var(--line);padding:14px 16px;display:grid;grid-template-columns:1fr auto;gap:2px 12px;align-items:baseline;transition:border-color .2s,background .2s;position:relative;min-width:0}
.seg label strong{font-weight:500;font-size:15px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.seg label .p{font-family:var(--en);font-weight:500;font-size:15px;color:var(--red-2);font-variant-numeric:tabular-nums;white-space:nowrap}
.seg label .note{grid-column:1/-1;font-size:12px;color:var(--fg-2)}
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
.amount b{display:block;font-size:22px;font-weight:600;color:var(--red-2);font-variant-numeric:tabular-nums;line-height:1.2;font-family:var(--kr)}

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
      <span class="k">Line up</span><span class="lineup"><b>DPC</b> <b>D.KIM</b> <b>DJ No:biz</b> <b>JENNA KIM</b> <b>DJ Maple</b> <b>심섹시</b> <b>MIGNØ</b> <b>Linzi</b> <b>Elissa</b> <b>DJ Hondo</b></span>
    </div>

    <details class="pk" id="pk">
      <summary><span class="t">TABLE PACKAGES</span><span class="ltd">LIMITED</span><span class="from">₩150,000~</span><span class="chev">자세히</span></summary>
      <div class="pk-body" id="pkBody"></div>
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
        <p class="hint">모든 티켓에 프리드링크 1잔이 포함됩니다.</p>
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
        <div class="lab"><span class="n">06</span>테이블 선택 <span class="req">*</span></div>
        <div class="seg" id="tblSeg" role="radiogroup" aria-label="테이블 종류"></div>
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
          <option value="" disabled selected>입금하시는 분의 은행을 선택하세요</option>
        </select>
      </div>

      <div class="field">
        <label class="lab" for="arrival"><span class="n">09</span>예상 도착 시간 <span class="req">*</span></label>
        <select id="arrival" name="arrival" required>
          <option value="" disabled selected>18:00 – 23:00 사이에서 선택</option>
        </select>
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

  // 티켓 구분. price: 숫자면 금액, null이면 "별도 문의". deadline이 지나면 자동 마감.
  tickets: [
    { id: "early",   label: "얼리버드", price: 15000, deadline: "2026-11-21", note: "11월 21일 (토)까지 · 환불 불가" },
    { id: "regular", label: "일반",     price: 20000, note: "11월 25일 (수) 자정까지 환불 가능 · 별도 문의" },
    { id: "table",   label: "테이블", table: true, tag: "LIMITED", note: "엔트리 티켓 포함 · 11월 21일 (토) 자정까지 환불 가능" }
  ],

  // 테이블 패키지. 매진되면 해당 항목에 soldOut: true 를 추가하세요.
  tables: [
    { id: "standing", label: "STANDING", where: "3층 · 최대 4인", max: 4, price: 150000, bottles: 1,
      items: ["보틀 1병"] },
    { id: "vip",      label: "VIP",      where: "4층 · 최대 4인", max: 4, price: 250000, bottles: 1,
      items: ["보틀 1병 + 샴페인 2병", "나초 플레이트 1개 + 컵과일 1개", "물 3병"] },
    { id: "vvip",     label: "VVIP",     where: "4층 · 최대 6인", max: 6, price: 450000, bottles: 2,
      items: ["보틀 2병 + 샴페인 3병", "나초 플레이트 2개 + 컵과일 2개", "물 5병"] }
  ],
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
  const closed = t.deadline && today > new Date(t.deadline + "T23:59:59");
  const tag = closed ? "CLOSED" : (t.deadline ? "~" + t.deadline.slice(5).replace("-", ".") : "");
  seg.insertAdjacentHTML("beforeend", `
    <input type="radio" id="t-${t.id}" name="ticket" value="${t.label}" ${closed ? "disabled" : ""}>
    <label for="t-${t.id}">
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

// table packages (안내 블록)
const tableTicket = CONFIG.tickets.find(t => t.table);
$("#pkBody").innerHTML = CONFIG.tables.map((x, i) => `
  <div class="pk-card${i === CONFIG.tables.length - 1 ? " top" : ""}">
    <h4>${x.label}${x.soldOut ? ' <span class="ltd">SOLD OUT</span>' : ""}</h4><span class="price">${won(x.price).replace("원", "")}<small style="font-size:12px">원</small></span>
    <span class="where">${x.where}</span>
    <ul>${x.items.map(it => `<li>${it}</li>`).join("")}</ul>
  </div>`).join("") + `
  <div class="pk-spirits"><span class="k">Spirit options</span>${CONFIG.spiritsEn.map(s => `<b>${s}</b>`).join('<span style="color:var(--red-2)">/</span>')}</div>
  <ul class="pk-info">
    <li><strong>모든 테이블 구매 시 엔트리 티켓 포함</strong></li>
    <li>기본 제공: ${CONFIG.tableBasics} · VIP·VVIP는 기본 제공에 구성이 추가됩니다</li>
    <li>주류 병 수에 따라 스탠딩 / VIP / VVIP 테이블 배정 · 수량 한정</li>
  </ul>
  ${tableTicket ? '<button type="button" class="pk-cta" id="pkCta">테이블 예약하기</button>' : ""}`;

// table form
const tblSeg = $("#tblSeg");
CONFIG.tables.forEach(x => tblSeg.insertAdjacentHTML("beforeend", `
  <input type="radio" id="tb-${x.id}" name="tableType" value="${x.label}" ${x.soldOut ? "disabled" : ""}>
  <label for="tb-${x.id}">
    <strong>${x.label}${x.soldOut ? ' <span class="tag">SOLD OUT</span>' : ""}</strong>
    <span class="p">${won(x.price)}</span>
    <span class="note">${x.where} · ${x.items.join(" · ")}</span>
  </label>`));
const tbl = () => CONFIG.tables.find(x => $("#tb-" + x.id).checked);
let pax = 1;
function renderBottles(){
  const n = tbl() ? tbl().bottles : 1, box = $("#bottles");
  const prev = [...box.querySelectorAll("select")].map(s => s.value);
  box.innerHTML = Array.from({ length: n }, (_, i) => `
    <select id="bottle${i}" aria-label="보틀 ${i + 1}" data-table-req>
      <option value="" disabled ${prev[i] ? "" : "selected"}>${n > 1 ? "보틀 " + (i + 1) + " 선택" : "보틀 선택"}</option>
      ${CONFIG.spirits.map(s => `<option ${prev[i] === s ? "selected" : ""}>${s}</option>`).join("")}
    </select>`).join("");
}
document.querySelectorAll("input[name=tableType]").forEach(r => r.addEventListener("change", () => { renderBottles(); render(); }));
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
  $("#paxHint").textContent = x ? `${x.label} 최대 ${x.max}인 · 인원 수와 관계없이 테이블 금액만 입금하시면 됩니다.` : "테이블을 먼저 선택해 주세요.";
}
$("#plus").onclick = () => { if (qty < CONFIG.maxQty) { qty++; render(); } };
$("#minus").onclick = () => { if (qty > 1) { qty--; render(); } };
if ($("#pkCta")) $("#pkCta").onclick = () => {
  $("#t-" + tableTicket.id).checked = true; render();
  $("#tableField").scrollIntoView({ behavior: "smooth", block: "center" });
};
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
  document.querySelectorAll(".field").forEach(f => f.classList.remove("invalid"));
  let bad = null;
  for (const el of form.querySelectorAll("[required]")) {
    if (!el.checkValidity()) { el.closest(".field, .consent")?.classList.add("invalid"); if (!bad) bad = el; }
  }
  if (!ticket()) { bad = bad || $("#seg"); $("#seg").closest(".field").classList.add("invalid"); }
  if (ticket() && ticket().table) {
    const empty = [...document.querySelectorAll("[data-table-req]")].find(s => !s.value);
    if (!tbl() || empty) { $("#tableField").classList.add("invalid"); bad = bad || (tbl() ? empty : $("#tblSeg")); }
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
