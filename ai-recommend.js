function getAIRecommendations() {
  const students = Store.getStudents();
  const attendance = Store.getAttendance();
  const now = new Date();
  const monthAgo = new Date(now); monthAgo.setDate(monthAgo.getDate() - 30);
  const recentAttendance = attendance.filter(r => new Date(r.date) >= monthAgo);

  const withPct = students.map(s => ({
    ...s,
    pct: Store.calcAttendancePercent(s.id)
  }));

  const critical = withPct.filter(s => s.pct < 75).length;
  const warning = withPct.filter(s => s.pct >= 75 && s.pct < 85).length;
  const good = withPct.filter(s => s.pct >= 85).length;
  const atRiskStudents = withPct.filter(s => s.pct < 75).sort((a, b) => a.pct - b.pct);

  const classMap = {};
  students.forEach(s => {
    if (!classMap[s.class]) classMap[s.class] = { sum: 0, count: 0 };
    classMap[s.class].sum += s.attendance;
    classMap[s.class].count++;
  });
  const classStats = Object.entries(classMap).map(([cls, d]) => ({
    class: cls, avg: Math.round(d.sum / d.count), total: d.count
  })).sort((a, b) => b.avg - a.avg);
  const bestClass = classStats[0];
  const worstClass = classStats[classStats.length - 1];

  const deptMap = {};
  classStats.forEach(c => {
    const dept = c.class.split("-")[0];
    if (!deptMap[dept]) deptMap[dept] = { sum: 0, count: 0, classes: [] };
    deptMap[dept].sum += c.avg * c.total;
    deptMap[dept].count += c.total;
    deptMap[dept].classes.push(c);
  });
  const deptStats = Object.entries(deptMap).map(([code, d]) => ({
    code, avg: Math.round(d.sum / d.count), classes: d.classes
  })).sort((a, b) => b.avg - a.avg);
  const bestDept = deptStats[0];
  const worstDept = deptStats[deptStats.length - 1];

  const subjMap = {};
  recentAttendance.forEach(r => {
    if (!subjMap[r.subject]) subjMap[r.subject] = { present: 0, total: 0 };
    subjMap[r.subject].total++;
    if (r.status === "present") subjMap[r.subject].present++;
  });
  const subjectStats = Object.entries(subjMap).map(([subj, d]) => ({
    subject: subj,
    pct: Math.round((d.present / d.total) * 100),
    absent: d.total - d.present,
    total: d.total
  })).sort((a, b) => a.pct - b.pct);

  const nowStr = now.toISOString().split("T")[0];
  const twoWeeksAgo = new Date(now); twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const twoWeeksStr = twoWeeksAgo.toISOString().split("T")[0];
  const decliningStudents = students.map(s => {
    const recs = recentAttendance.filter(r => r.studentId === s.id);
    const recent14 = recs.filter(r => r.date >= twoWeeksStr);
    const earlier = recs.filter(r => r.date < twoWeeksStr && r.date >= monthAgo.toISOString().split("T")[0]);
    const pct14 = recent14.length ? (recent14.filter(r => r.status === "present").length / recent14.length) * 100 : 0;
    const pctEarlier = earlier.length ? (earlier.filter(r => r.status === "present").length / earlier.length) * 100 : pct14;
    return { ...s, pct14: Math.round(pct14), pctEarlier: Math.round(pctEarlier), drop: Math.round(pctEarlier - pct14) };
  }).filter(s => s.drop >= 15 && s.pct14 < 80).sort((a, b) => b.drop - a.drop);

  const consecutiveAbsentees = students.map(s => {
    const absences = recentAttendance.filter(r => r.studentId === s.id && r.status === "absent")
      .sort((a, b) => b.date.localeCompare(a.date));
    if (!absences.length) return null;
    let streak = 1;
    for (let i = 0; i < absences.length - 1; i++) {
      const d1 = new Date(absences[i].date), d2 = new Date(absences[i + 1].date);
      if ((d1 - d2) / 86400000 <= 3) streak++; else break;
    }
    return streak >= 2 ? { ...s, streak, lastDate: absences[0].date } : null;
  }).filter(Boolean).sort((a, b) => b.streak - a.streak);

  const trending = classStats.map(c => {
    const recs = attendance.filter(r => r.class === c.class);
    const recent = recs.filter(r => r.date >= twoWeeksStr);
    const prev = recs.filter(r => r.date < twoWeeksStr && r.date >= monthAgo.toISOString().split("T")[0]);
    const rPct = recent.length ? (recent.filter(r => r.status === "present").length / recent.length) * 100 : 0;
    const pPct = prev.length ? (prev.filter(r => r.status === "present").length / prev.length) * 100 : 0;
    return { class: c.class, avg: c.avg, recent: Math.round(rPct), prev: Math.round(pPct), delta: Math.round(pPct - rPct) };
  });

  const weeklyTrend = getWeeklyTrend();
  const thisWeek = weeklyTrend.slice(-5).filter(d => d.pct > 0);
  const lastWeek = weeklyTrend.slice(0, -5).filter(d => d.pct > 0);
  const twAvg = thisWeek.length ? thisWeek.reduce((s, d) => s + d.pct, 0) / thisWeek.length : 0;
  const lwAvg = lastWeek.length ? lastWeek.reduce((s, d) => s + d.pct, 0) / lastWeek.length : 0;
  const trendDir = twAvg > lwAvg + 2 ? "up" : twAvg < lwAvg - 2 ? "down" : "stable";

  const overallAvg = withPct.length ? Math.round(withPct.reduce((s, st) => s + st.pct, 0) / withPct.length) : 0;
  const criticalNow = atRiskStudents.filter(s => {
    const r = Store.getStudentAttendance(s.id, 15);
    return r.length >= 3 && (r.filter(x => x.status === "present").length / r.length) < 0.5;
  });
  const predictedFail = criticalNow.length;

  const suggestions = [];
  if (critical > 0) {
    suggestions.push({
      text: critical <= 5
        ? `Contact ${critical} student${critical > 1 ? 's' : ''} below 75% attendance immediately — ${atRiskStudents.slice(0, 3).map(s => s.name.split(" ")[0]).join(", ")}`
        : `Batch counseling needed: ${critical} students below 75% threshold — organize group intervention`,
      priority: "high"
    });
  }
  if (decliningStudents.length >= 2) {
    suggestions.push({
      text: `${decliningStudents.length} students dropped >15% in 14 days — ${decliningStudents.slice(0, 2).map(s => s.name).join(" & ")} need immediate counseling`,
      priority: "high"
    });
  }
  if (consecutiveAbsentees.length >= 2) {
    const worst = consecutiveAbsentees[0];
    suggestions.push({
      text: `${worst.name} absent ${worst.streak} consecutive days — parent notification required urgently`,
      priority: "high"
    });
  }
  if (worstDept && worstDept.avg < 75) {
    suggestions.push({
      text: `${worstDept.code} department lowest at ${worstDept.avg}% — review workload distribution across sections`,
      priority: "medium"
    });
  }
  if (subjectStats.length && subjectStats[0].pct < 70) {
    const lowSubjs = subjectStats.filter(s => s.pct < 70).slice(0, 2);
    suggestions.push({
      text: `${lowSubjs.map(s => s.subject).join(" & ")} has ${100 - subjectStats[0].pct}% absenteeism — consider rescheduling to better time slots`,
      priority: "medium"
    });
  }
  if (trendDir === "down") {
    suggestions.push({
      text: `Overall attendance declining (${Math.round(twAvg)}% this week vs ${Math.round(lwAvg)}% last week) — review recent schedule changes`,
      priority: "medium"
    });
  }
  const lowClasses = trending.filter(c => c.recent < 70);
  if (lowClasses.length) {
    suggestions.push({
      text: `${lowClasses.map(c => c.class).join(", ")} showing <70% attendance recently — focused mentoring sessions recommended`,
      priority: "medium"
    });
  }
  if (predictedFail > 0) {
    suggestions.push({
      text: `${predictedFail} student${predictedFail > 1 ? 's' : ''} on track to fall below 60% — schedule weekly check-ins`,
      priority: "medium"
    });
  }
  suggestions.push({
    text: `Set up parent-teacher meetings for ${atRiskStudents.length} students below threshold (recommended: ${Math.ceil(atRiskStudents.length / 10)} sessions)`,
    priority: "low"
  });
  if (bestClass && bestClass.avg >= 85) {
    suggestions.push({
      text: `${bestClass.class} leading at ${bestClass.avg}% — study successful strategies and replicate across other sections`,
      priority: "low"
    });
  }

  const predictions = [];
  if (predictedFail > 0) {
    predictions.push({ text: `${predictedFail} student${predictedFail > 1 ? 's' : ''} likely to drop below 60% next month`, type: "danger" });
  }
  if (trendDir === "down") {
    predictions.push({ text: `Attendance declining ${Math.round(lwAvg - twAvg)}% week-over-week — early intervention critical`, type: "warning" });
  } else if (trendDir === "up") {
    predictions.push({ text: `Positive momentum — attendance up ${Math.round(twAvg - lwAvg)}% from last week`, type: "success" });
  }
  if (decliningStudents.length >= 3) {
    predictions.push({ text: `${decliningStudents.length} students in rapid decline — projected impact could lower class average by 3-5%`, type: "warning" });
  }
  if (consecutiveAbsentees.length >= 3) {
    predictions.push({ text: `${consecutiveAbsentees.length} students with prolonged absence — risk of falling below year-end minimum`, type: "warning" });
  }
  predictions.push({
    text: `Distribution: ${good} good (≥85%) · ${warning} warning (75-84%) · ${critical} critical (<75%) — overall ${overallAvg}%`,
    type: "info"
  });
  if (bestDept && worstDept) {
    predictions.push({
      text: `Gap alert: ${bestDept.code} (${bestDept.avg}%) vs ${worstDept.code} (${worstDept.avg}%) — ${bestDept.avg - worstDept.avg}% disparity`,
      type: "info"
    });
  }

  return {
    critical, warning, good, overallAvg,
    totalStudents: students.length,
    atRiskStudents: atRiskStudents.slice(0, 10),
    bestClass, worstClass,
    bestDept, worstDept,
    deptStats,
    classStats: trending,
    subjectStats: subjectStats.slice(0, 10),
    decliningStudents: decliningStudents.slice(0, 5),
    consecutiveAbsentees: consecutiveAbsentees.slice(0, 5),
    suggestions: suggestions.slice(0, 8),
    predictions: predictions.slice(0, 5),
    weeklyTrend,
    trendDir,
    predictedFail
  };
}

function getWeeklyTrend() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const trend = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const records = Store.getAttendance().filter(r => r.date === dateStr);
    const pct = records.length ? Math.round((records.filter(r => r.status === "present").length / records.length) * 100) : 0;
    trend.push({ day: days[d.getDay()], date: dateStr, pct });
  }
  return trend;
}

function renderAIRecommendations() {
  const container = document.getElementById("aiContent");
  if (!container) return;
  const r = getAIRecommendations();

  let html = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:20px">
      <div class="card" style="padding:14px;text-align:center;border-left:4px solid #0091A0">
        <div style="font-size:28px;font-weight:700;color:var(--primary)">${r.overallAvg}%</div>
        <div style="color:var(--text-light);font-size:12px">Overall Attendance</div>
      </div>
      <div class="card" style="padding:14px;text-align:center;border-left:4px solid #22c55e">
        <div style="font-size:28px;font-weight:700;color:#22c55e">${r.good}</div>
        <div style="color:var(--text-light);font-size:12px">Good (≥85%)</div>
      </div>
      <div class="card" style="padding:14px;text-align:center;border-left:4px solid #f59e0b">
        <div style="font-size:28px;font-weight:700;color:var(--warning)">${r.warning}</div>
        <div style="color:var(--text-light);font-size:12px">Warning (75-84%)</div>
      </div>
      <div class="card" style="padding:14px;text-align:center;border-left:4px solid #dc2626">
        <div style="font-size:28px;font-weight:700;color:var(--danger)">${r.critical}</div>
        <div style="color:var(--text-light);font-size:12px">Critical (<75%)</div>
      </div>
      <div class="card" style="padding:14px;text-align:center;border-left:4px solid ${r.trendDir === 'up' ? '#22c55e' : r.trendDir === 'down' ? '#dc2626' : '#6b7280'}">
        <div style="font-size:28px;font-weight:700;color:${r.trendDir === 'up' ? '#22c55e' : r.trendDir === 'down' ? '#dc2626' : '#6b7280'}">
          <i class="fas fa-arrow-${r.trendDir === 'up' ? 'up' : r.trendDir === 'down' ? 'down' : 'right'}"></i>
        </div>
        <div style="color:var(--text-light);font-size:12px">${r.trendDir === 'up' ? 'Improving' : r.trendDir === 'down' ? 'Declining' : 'Stable'}</div>
      </div>
    </div>
    <div class="absentee-charts">
      <div class="card">
        <div class="card-header"><h4>Department Comparison</h4></div>
        <div class="card-body"><canvas id="deptChart" height="200"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><h4>Class Attendance Ranking</h4></div>
        <div class="card-body"><canvas id="classChart" height="200"></canvas></div>
      </div>
    </div>`;

  if (r.classStats && r.classStats.length) {
    html += `<div class="card" style="margin-bottom:16px">
      <div class="card-header"><h4>Class Trends <small style="font-weight:400;color:var(--text-light);font-size:12px">(last 14 days vs previous period)</small></h4></div>
      <div class="card-body" style="padding:12px">`;
    r.classStats.forEach(c => {
      const dir = c.delta < -5 ? "down" : c.delta > 5 ? "up" : "stable";
      const dirColor = dir === "up" ? "#22c55e" : dir === "down" ? "#dc2626" : "#6b7280";
      const dirIcon = dir === "up" ? "fa-arrow-up" : dir === "down" ? "fa-arrow-down" : "fa-minus";
      html += `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="flex:1"><strong>${c.class}</strong> <small style="color:var(--text-light)">${c.total || ''}</small></div>
        <div style="width:100px;height:6px;background:var(--border);border-radius:4px;overflow:hidden">
          <div style="height:100%;width:${c.recent}%;background:${c.recent >= 75 ? '#22c55e' : c.recent >= 60 ? '#f59e0b' : '#dc2626'};border-radius:4px"></div>
        </div>
        <div style="width:40px;text-align:right;font-weight:600;font-size:13px">${c.recent}%</div>
        <div style="width:50px;text-align:right;color:${dirColor};font-size:12px"><i class="fas ${dirIcon}"></i> ${c.delta > 0 ? '+' : ''}${c.delta}%</div>
      </div>`;
    });
    html += `</div></div>`;
  }

  if (r.decliningStudents && r.decliningStudents.length) {
    html += `<div class="card" style="margin-bottom:16px">
      <div class="card-header"><h4><i class="fas fa-exclamation-triangle" style="color:var(--danger)"></i> Rapidly Declining Students</h4></div>
      <div class="card-body" style="padding:12px">`;
    r.decliningStudents.forEach(s => {
      html += `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
        <div><span style="font-weight:500">${s.name}</span><small style="color:var(--text-light);margin-left:8px">${s.roll} · ${s.class}</small></div>
        <div style="text-align:right"><span style="font-weight:600;color:#22c55e">${s.pctEarlier}%</span> → <span style="font-weight:600;color:var(--danger)">${s.pct14}%</span> <span style="color:var(--danger);font-size:12px">(-${s.drop}%)</span></div>
      </div>`;
    });
    html += `</div></div>`;
  }

  if (r.consecutiveAbsentees && r.consecutiveAbsentees.length) {
    html += `<div class="card" style="margin-bottom:16px">
      <div class="card-header"><h4><i class="fas fa-link" style="color:var(--warning)"></i> Consecutive Absences</h4></div>
      <div class="card-body" style="padding:12px">`;
    r.consecutiveAbsentees.slice(0, 4).forEach(s => {
      html += `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
        <div><span style="font-weight:500">${s.name}</span><small style="color:var(--text-light);margin-left:8px">${s.class}</small></div>
        <div><span class="badge ${s.streak >= 5 ? 'badge-danger' : 'badge-warning'}">${s.streak} days</span> <small style="color:var(--text-light);font-size:11px">since ${s.lastDate}</small></div>
      </div>`;
    });
    html += `</div></div>`;
  }

  if (r.atRiskStudents && r.atRiskStudents.length) {
    html += `<div class="card" style="margin-bottom:16px">
      <div class="card-header"><h4>Students Needing Attention <span class="badge badge-danger" style="margin-left:8px">${r.critical} critical</span></h4></div>
      <div class="card-body" style="padding:12px">`;
    r.atRiskStudents.slice(0, 8).forEach(s => {
      html += `<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border)">
        <div><span style="font-weight:500">${s.name}</span><small style="color:var(--text-light);margin-left:8px">${s.roll}</small></div>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:50px;height:5px;background:var(--border);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${s.pct}%;background:${s.pct >= 60 ? '#f59e0b' : '#dc2626'};border-radius:3px"></div>
          </div>
          <span class="badge ${s.pct >= 60 ? 'badge-warning' : 'badge-danger'}">${s.pct}%</span>
        </div>
      </div>`;
    });
    html += `</div></div>`;
  }

  html += `<div class="card" style="margin-bottom:16px">
    <div class="card-header"><h4>AI Suggestions</h4></div>
    <div class="card-body">`;
  r.suggestions.forEach(s => {
    const icon = s.priority === "high" ? "fa-exclamation-triangle" : s.priority === "medium" ? "fa-exclamation-circle" : "fa-lightbulb";
    const cls = s.priority === "high" ? "critical" : s.priority === "medium" ? "warning" : "info";
    html += `<div class="ai-card ${cls}">
      <h4><i class="fas ${icon}"></i> ${s.text} <span class="badge ${s.priority === 'high' ? 'badge-danger' : s.priority === 'medium' ? 'badge-warning' : 'badge-success'}" style="float:right;text-transform:uppercase;font-size:9px">${s.priority}</span></h4>
    </div>`;
  });
  html += `</div></div>`;

  html += `<div class="card">
    <div class="card-header"><h4>Predictive Insights</h4></div>
    <div class="card-body">`;
  r.predictions.forEach(p => {
    const icon = p.type === "danger" ? "fa-chart-line" : p.type === "warning" ? "fa-exclamation-circle" : "fa-info-circle";
    html += `<div class="ai-card ${p.type}"><h4><i class="fas ${icon}"></i> ${p.text}</h4></div>`;
  });
  html += `</div></div>`;

  container.innerHTML = html;

  setTimeout(() => {
    renderDeptChart(r);
    renderClassChart(r);
  }, 100);
}

function renderDeptChart(r) {
  if (!r.deptStats || !r.deptStats.length) return;
  const canvas = document.getElementById("deptChart");
  if (!canvas || typeof Chart === "undefined") return;
  if (window._deptChart) window._deptChart.destroy();
  const colors = r.deptStats.map(d => d.avg >= 80 ? "#22c55e" : d.avg >= 70 ? "#f59e0b" : "#dc2626");
  window._deptChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: r.deptStats.map(d => d.code),
      datasets: [{
        label: "Attendance %",
        data: r.deptStats.map(d => d.avg),
        backgroundColor: colors,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { font: { size: 10 }, callback: v => v + "%" } },
        x: { ticks: { font: { size: 10 } } }
      }
    }
  });
}

function renderClassChart(r) {
  if (!r.classStats || !r.classStats.length) return;
  const canvas = document.getElementById("classChart");
  if (!canvas || typeof Chart === "undefined") return;
  if (window._classChart) window._classChart.destroy();
  const sorted = [...r.classStats].sort((a, b) => a.recent - b.recent);
  const colors = sorted.map(c => c.recent >= 75 ? "#22c55e" : c.recent >= 60 ? "#f59e0b" : "#dc2626");
  window._classChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: sorted.map(c => c.class),
      datasets: [{
        label: "Recent %",
        data: sorted.map(c => c.recent),
        backgroundColor: colors,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, indexAxis: "y",
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, max: 100, ticks: { font: { size: 9 }, callback: v => v + "%" } },
        y: { ticks: { font: { size: 9 } } }
      }
    }
  });
}

function renderWeeklyChart() {
  const canvas = document.getElementById("weeklyChart");
  if (!canvas || typeof Chart === "undefined") return;
  const trend = getWeeklyTrend();
  new Chart(canvas, {
    type: "line",
    data: {
      labels: trend.map(t => t.day),
      datasets: [{
        label: "Attendance %",
        data: trend.map(t => t.pct),
        borderColor: "#0091A0",
        backgroundColor: "rgba(0,145,160,0.1)",
        fill: true, tension: 0.4,
        pointBackgroundColor: "#0091A0"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 100, grid: { color: "rgba(0,0,0,0.05)" } },
        x: { grid: { display: false } }
      }
    }
  });
}
