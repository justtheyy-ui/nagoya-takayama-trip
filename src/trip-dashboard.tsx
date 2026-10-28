"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BudgetItem, defaultBudget, defaultDays, defaultTodos, places, TripDay, TripTodo } from "./trip-data";

type Section = "journey" | "tickets" | "budget" | "todos" | "places";
type SyncState = "loading" | "synced" | "saving" | "error";

export default function TripDashboard({ user, signOutPath, sharedReady = true }: { user: { displayName: string; email: string }; signOutPath: string; sharedReady?: boolean }) {
  const [section, setSection] = useState<Section>("journey");
  const [activeDay, setActiveDay] = useState(0);
  const [days, setDays] = useState<TripDay[]>(defaultDays);
  const [todos, setTodos] = useState<TripTodo[]>(defaultTodos);
  const [budget, setBudget] = useState<BudgetItem[]>(defaultBudget);
  const [editing, setEditing] = useState(false);
  const [sync, setSync] = useState<SyncState>("loading");
  const [lastEdit, setLastEdit] = useState<{ by: string; at: string } | null>(null);
  const firstSection = useRef(true);

  const loadCloud = useCallback(async (quiet = false) => {
    if (!quiet) setSync("loading");
    try {
      const response = await fetch("/api/trip", { cache: "no-store" });
      if (!response.ok) throw new Error("sync failed");
      const data = await response.json();
      if (data.sections.days) setDays(data.sections.days);
      if (data.sections.todos) setTodos(data.sections.todos);
      if (data.sections.budget) setBudget(data.sections.budget);
      const latest = data.changes?.[0];
      if (latest) setLastEdit({ by: latest.updatedBy, at: latest.updatedAt });
      setSync("synced");
    } catch {
      setSync("error");
    }
  }, []);

  useEffect(() => { loadCloud(); }, [loadCloud]);
  useEffect(() => {
    const timer = window.setInterval(() => { if (!editing && sync !== "saving") loadCloud(true); }, 7000);
    return () => window.clearInterval(timer);
  }, [editing, loadCloud, sync]);
  useEffect(() => {
    if (firstSection.current) { firstSection.current = false; return; }
    const timer = window.setTimeout(() => document.querySelector(".section-transition")?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
    return () => window.clearTimeout(timer);
  }, [section]);

  async function saveCloud(kind: "days" | "todos" | "budget", payload: unknown) {
    setSync("saving");
    try {
      const response = await fetch("/api/trip", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ section: kind, payload }) });
      if (!response.ok) throw new Error("save failed");
      const result = await response.json();
      setLastEdit({ by: result.updatedBy, at: result.updatedAt });
      setSync("synced");
    } catch {
      setSync("error");
      window.alert("保存未成功，请检查网络或编辑口令后重试。当前改动尚未写入云端。");
    }
  }

  const totals = useMemo(() => ({
    you: budget.reduce((sum, item) => sum + item.you, 0),
    friend: budget.reduce((sum, item) => sum + item.friend, 0),
  }), [budget]);
  const completed = todos.filter((todo) => todo.done).length;
  const day = days[activeDay];

  function updateDay(patch: Partial<TripDay>) {
    setDays((current) => current.map((item, index) => index === activeDay ? { ...item, ...patch } : item));
  }
  function updateEvent(index: number, field: "time" | "title" | "detail", value: string) {
    updateDay({ events: day.events.map((event, eventIndex) => eventIndex === index ? { ...event, [field]: value } : event) });
  }
  function finishDayEdit() { setEditing(false); saveCloud("days", days); }
  function toggleTodo(id: string) {
    if (!sharedReady) { window.alert('云端数据库尚未连接，连接后即可共同编辑。'); return; }
    const next = todos.map((todo) => todo.id === id ? { ...todo, done: !todo.done } : todo);
    setTodos(next); saveCloud("todos", next);
  }

  return (
    <main data-shared-ready={sharedReady}>
      <header className="topbar">
        <a className="brand" href="#top"><span>JOURNEY</span><i /></a>
        <nav>
          {([['journey','Itinerary'],['tickets','Passes'],['budget','Budget'],['todos','Checklist'],['places','Map']] as [Section,string][]).map(([id,label]) =>
            <button key={id} className={section === id ? "active" : ""} onClick={() => { setSection(id); setEditing(false); }}>{label}</button>
          )}
        </nav>
        <div className="account"><span className={`sync-dot ${sync}`} /> <span className="account-name">{user.displayName}</span><a href={signOutPath} target="_top">退出</a></div>
      </header>

      <section id="top" className="hero-editorial">
        <div className="hero-image" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="hero-index">01 <i /> 05</p>
          <h1>Winter<br/>Journey</h1>
          <div className="hero-identity"><strong>名古屋 × 高山</strong><i/><span>2027.01.06 — 01.13</span></div>
          <p className="hero-skills">CITY / SNOW / ONSEN / FOOD / TOGETHER</p>
        </div>
        <div className="live-pill"><span className={`sync-dot ${sync}`} /><b>{sync === "saving" ? "正在保存" : sync === "error" ? "同步失败" : sync === "loading" ? "连接云端" : "云端已同步"}</b><i />{lastEdit ? `最近由 ${lastEdit.by} 修改` : "等待第一次共同修改"}</div>
      </section>

      <section className="intro-band">
        <div><span>TRIP PROFILE</span><h2>两个人，一份始终相同的旅行计划。</h2></div>
        <div className="intro-stats"><p><strong>08</strong><span>DAYS</span></p><p><strong>07</strong><span>NIGHTS</span></p><p><strong>02</strong><span>TRAVELERS</span></p></div>
      </section>

      {section === "journey" && <section className="content-section section-transition journey-section">
        <div className="section-kicker"><span>01</span><i/><p>ITINERARY</p></div>
        <div className="section-title-row"><h2>Daily rhythm</h2><p>班次与价格仍以临行前官方信息为准。编辑后会保存到两个人共同使用的云端空间。</p></div>
        <div className="day-filmstrip">
          {days.map((item, index) => <button key={item.date} className={activeDay === index ? "active" : ""} onClick={() => { setActiveDay(index); setEditing(false); }}><b>{item.date}</b><span>{item.week}</span><em>{item.city.split("·")[0]}</em></button>)}
        </div>
        <article key={day.date} className="day-stage day-transition">
          <div className="day-stage-head">
            <div><p>{day.date} / {day.week}</p>{editing ? <input value={day.city} onChange={(e)=>updateDay({city:e.target.value})}/> : <h3>{day.city}</h3>}</div>
            <div className="day-actions"><span>{day.status}</span>{editing ? <button className="solid-button" onClick={finishDayEdit}>保存到云端</button> : <button className="ghost-button" onClick={()=>setEditing(true)}>编辑当日</button>}</div>
          </div>
          <div className="event-list">
            {day.events.map((event,index)=><div className="event-row" key={`${event.time}-${index}`}>
              <div>{editing ? <input value={event.time} onChange={(e)=>updateEvent(index,"time",e.target.value)}/> : event.time}</div><i/>
              <div>{editing ? <><input value={event.title} onChange={(e)=>updateEvent(index,"title",e.target.value)}/><textarea value={event.detail} onChange={(e)=>updateEvent(index,"detail",e.target.value)}/></> : <><h4>{event.title}</h4><p>{event.detail}</p></>}</div>
            </div>)}
          </div>
          <div className="day-notes"><label><span>PLAN B</span>{editing ? <textarea value={day.alt} onChange={(e)=>updateDay({alt:e.target.value})}/> : <p>{day.alt}</p>}</label><label><span>REMINDER</span>{editing ? <textarea value={day.reminder} onChange={(e)=>updateDay({reminder:e.target.value})}/> : <p>{day.reminder}</p>}</label></div>
        </article>
      </section>}

      {section === "tickets" && <section className="content-section section-transition">
        <div className="section-kicker"><span>02</span><i/><p>PASSES & TRANSIT</p></div>
        <div className="section-title-row"><h2>Choose certainty</h2><p>默认优先锁定白川乡座位。三日券只在省钱与排队风险都可接受时购买。</p></div>
        <div className="poster-grid">
          <article className="poster-card dark"><span>DEFAULT</span><h3>各段单买<br/>＋预约白川乡</h3><p>去回程更确定，适合成人节连休周六。</p><a href="https://www.nouhibus.co.jp/route_bus/shirakawago/" target="_blank">OFFICIAL INFO ↗</a></article>
          <article className="poster-card blue"><span>CANDIDATE</span><h3>浓飞区域<br/>3 日券</h3><strong>¥8,000</strong><p>基础线参考省 ¥1,190 / 人；预约制白川乡班次不可用。</p><a href="https://www.nouhibus.co.jp/other/areafree-ticket/" target="_blank">CHECK LIMITS ↗</a></article>
          <article className="poster-card pale"><span>SKIP FOR NOW</span><h3>JR 高山北陆<br/>周游券</h3><strong>¥19,800</strong><p>不覆盖当前高速巴士与平汤滑雪主线。</p><a href="https://touristpass.jp/en/takayama_hokuriku/" target="_blank">COVERAGE ↗</a></article>
        </div>
      </section>}

      {section === "budget" && <section className="content-section section-transition">
        <div className="section-kicker"><span>03</span><i/><p>BUDGET</p></div>
        <div className="section-title-row"><h2>Spend differently,<br/>travel together.</h2><p>固定费用相同，餐饮与购物各自控制。金额是计划值，不等于已付款。</p></div>
        <div className="budget-hero"><div><span>YOU</span><strong>¥{totals.you.toLocaleString()}</strong></div><i/><div><span>FRIEND</span><strong>¥{totals.friend.toLocaleString()}</strong></div><button className={editing ? "solid-button" : "ghost-button"} onClick={()=> editing ? (setEditing(false),saveCloud("budget",budget)) : setEditing(true)}>{editing ? "保存预算" : "编辑预算"}</button></div>
        <div className="budget-list">
          {budget.map((item,index)=><div className="budget-line" key={item.label}><span>{String(index+1).padStart(2,"0")}</span><b>{item.label}{item.fixed && <em>已订</em>}</b>{editing ? <input type="number" value={item.you} onChange={(e)=>setBudget(budget.map((row,i)=>i===index?{...row,you:Number(e.target.value)}:row))}/> : <p>¥{item.you.toLocaleString()}</p>}{editing ? <input type="number" value={item.friend} onChange={(e)=>setBudget(budget.map((row,i)=>i===index?{...row,friend:Number(e.target.value)}:row))}/> : <p>¥{item.friend.toLocaleString()}</p>}</div>)}
        </div>
      </section>}

      {section === "todos" && <section className="content-section section-transition">
        <div className="section-kicker"><span>04</span><i/><p>CHECKLIST</p></div>
        <div className="section-title-row"><h2>{completed} / {todos.length}<br/>ready.</h2><p>任何一方勾选后立即写入云端，另一方最迟约 7 秒看到更新。</p></div>
        <div className="todo-grid">{todos.map((todo,index)=><label className={`todo-card ${todo.done?"done":""}`} key={todo.id}><input type="checkbox" checked={todo.done} onChange={()=>toggleTodo(todo.id)}/><span>{String(index+1).padStart(2,"0")}</span><div><h3>{todo.title}</h3><p>{todo.note}</p><em>{todo.due} · {todo.priority}优先级</em></div></label>)}</div>
      </section>}

      {section === "places" && <section className="content-section section-transition">
        <div className="section-kicker"><span>05</span><i/><p>PLACES</p></div>
        <div className="section-title-row"><h2>Routes in view,<br/>not just a link.</h2><p>已确认的地理关系直接画在页面里；班次和票价仍保留“待核”标记，不把推测当成已确认。</p></div>
        <div className="map-layout">
          <article className="map-card"><div className="map-card-head"><span>CONFIRMED AREA MAP</span><b>高山 / 平汤 / 白川乡</b></div><iframe title="高山周边旅行地图" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=136.62%2C35.18%2C137.72%2C36.2&layer=mapnik&marker=36.1408%2C137.2522" /><small>底图用于确认地点相对位置；交通班次以临行前官方信息为准。</small></article>
          <article className="route-card"><div className="map-card-head"><span>ROUTE LOGIC</span><b>四段主线</b></div><div className="route-line"><div className="route-stop"><i className="start"/><strong>名古屋</strong><small>1/6 抵达 · 1/11 返回</small></div><div className="route-connector"><span>高速巴士 · 参考</span></div><div className="route-stop"><i/><strong>高山</strong><small>1/7—1/11 住宿基地</small></div><div className="route-connector"><span>浓飞巴士 · 待核</span></div><div className="route-stop"><i/><strong>朴之木平 / 平汤</strong><small>1/8 滑雪与温泉</small></div><div className="route-connector"><span>预约制巴士 · 待订</span></div><div className="route-stop"><i className="end"/><strong>白川乡</strong><small>1/9 雪景日归</small></div></div></article>
        </div>
        <div className="place-stack">{places.map(([index,name,detail,query])=><a key={index} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`} target="_blank"><span>{index}</span><h3>{name}</h3><p>{detail}</p><b>↗</b></a>)}</div>
      </section>}

      <footer><div><p>NAGOYA — TAKAYAMA</p><h2>See you<br/>in the snow.</h2></div><div className="footer-meta"><p>Cloud-synced travel room</p><p>{user.email}</p><p>© 2026 / PRIVATE JOURNEY</p></div></footer>
    </main>
  );
}
