const Attendance = {
  currentSubject: "",
  currentClass: "",
  currentDate: new Date().toISOString().split("T")[0],
  detectedStudents: new Set(),
  scanInterval: null,
  webcamStream: null,

  init() {
    this.currentDate = new Date().toISOString().split("T")[0];
    this.setupEventListeners();
    this.renderManualTable();
    this.loadClassOptions();
  },

  loadClassOptions() {
    const classSelects = document.querySelectorAll(".class-select");
    classSelects.forEach(sel => {
      sel.innerHTML = '<option value="">Select Class</option>' +
        AppData.classes.map(c => `<option value="${c}">${c}</option>`).join("");
    });
    const subjectSelects = document.querySelectorAll(".subject-select");
    subjectSelects.forEach(sel => {
      sel.innerHTML = '<option value="">Select Subject</option>' +
        AppData.subjects.map(s => `<option value="${s}">${s}</option>`).join("");
    });
    const dateInputs = document.querySelectorAll(".date-input");
    dateInputs.forEach(inp => { inp.value = this.currentDate; });
  },

  setupEventListeners() {
    document.querySelectorAll(".class-select").forEach(el => {
      el.addEventListener("change", (e) => {
        this.currentClass = e.target.value;
        this.renderManualTable();
      });
    });
    document.querySelectorAll(".subject-select").forEach(el => {
      el.addEventListener("change", (e) => { this.currentSubject = e.target.value; });
    });
    document.querySelectorAll(".date-input").forEach(el => {
      el.addEventListener("change", (e) => { this.currentDate = e.target.value; });
    });
    const scanBtn = document.getElementById("startScan");
    if (scanBtn) scanBtn.addEventListener("click", () => this.startAutoAttendance());
    const qrBtn = document.getElementById("startQR");
    if (qrBtn) qrBtn.addEventListener("click", () => this.startQRScan());
  },

  getFilteredStudents() {
    let students = Store.getStudents();
    if (this.currentClass) {
      students = students.filter(s => s.class === this.currentClass);
    }
    return students;
  },

  renderManualTable() {
    const tbody = document.getElementById("manualTableBody");
    if (!tbody) return;
    const students = this.getFilteredStudents();
    const todayRecords = Store.getAttendance().filter(r => r.date === this.currentDate);

    tbody.innerHTML = students.map(s => {
      const today = todayRecords.find(r => r.studentId === s.id && r.subject === this.currentSubject);
      const status = today ? today.status : "";
      return `<tr>
        <td><div style="display:flex;align-items:center;gap:8px">
          <div class="face-avatar" style="width:28px;height:28px;font-size:11px;margin:0">${s.name.charAt(0)}</div>
          <div><div style="font-weight:500;font-size:13px">${s.name}</div><small style="color:var(--text-light)">${s.roll}</small></div>
        </div></td>
        <td style="font-size:13px">${s.class}</td>
        <td><span class="badge ${s.attendance >= 75 ? 'badge-success' : s.attendance >= 60 ? 'badge-warning' : 'badge-danger'}">${s.attendance}%</span></td>
        <td>
          <select class="form-control status-select" data-id="${s.id}" style="width:auto;padding:4px 8px;font-size:12px" ${!this.currentSubject ? 'disabled' : ''}>
            <option value="">--</option>
            <option value="present" ${status === "present" ? "selected" : ""}>Present</option>
            <option value="absent" ${status === "absent" ? "selected" : ""}>Absent</option>
            <option value="leave" ${status === "leave" ? "selected" : ""}>Leave</option>
          </select>
        </td>
      </tr>`;
    }).join("");

    document.querySelectorAll(".status-select").forEach(sel => {
      sel.addEventListener("change", (e) => {
        const id = parseInt(e.target.dataset.id);
        const status = e.target.value;
        if (status) this.markSingle(id, status);
      });
    });

    const bulkPresent = document.getElementById("bulkPresent");
    const bulkAbsent = document.getElementById("bulkAbsent");
    if (bulkPresent) bulkPresent.onclick = () => this.bulkMark("present");
    if (bulkAbsent) bulkAbsent.onclick = () => this.bulkMark("absent");

    this.renderSummary();
  },

  renderSummary() {
    const el = document.getElementById("attendanceSummary");
    if (!el) return;
    const students = this.getFilteredStudents();
    const todayRecords = Store.getAttendance().filter(r => r.date === this.currentDate && r.subject === this.currentSubject);
    if (!this.currentSubject) {
      el.innerHTML = '<span style="color:var(--text-light)">Select a subject to start marking</span>';
      return;
    }
    const present = todayRecords.filter(r => r.status === "present").length;
    const absent = todayRecords.filter(r => r.status === "absent").length;
    const leave = todayRecords.filter(r => r.status === "leave").length;
    const total = students.length;
    el.innerHTML = `
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        <span><span style="color:var(--success);font-weight:600">${present}</span> Present</span>
        <span><span style="color:var(--danger);font-weight:600">${absent}</span> Absent</span>
        <span><span style="color:var(--warning);font-weight:600">${leave}</span> Leave</span>
        <span><span style="font-weight:600">${total - present - absent - leave}</span> Unmarked</span>
      </div>
    `;
  },

  markSingle(id, status) {
    if (!this.currentSubject) {
      App.showToast("Please select a subject first", "warning");
      return;
    }
    const records = Store.getAttendance();
    const existing = records.findIndex(r => r.date === this.currentDate && r.studentId === id && r.subject === this.currentSubject);
    const student = Store.getStudents().find(s => s.id === id);
    if (!student) return;
    const teacher = App.currentUser?.name || "manual";
    const record = {
      id: `${this.currentDate}-${id}-${Date.now()}`,
      date: this.currentDate,
      studentId: id,
      name: student.name,
      roll: student.roll,
      class: student.class,
      subject: this.currentSubject,
      status,
      markedBy: teacher
    };
    if (existing > -1) {
      records[existing] = record;
    } else {
      records.push(record);
    }
    Store.saveAttendance(records);
    this.renderSummary();
    this.updateStudentAttendance(id);
    Store.logActivity("attendance_marked", `${status} for ${student.name} (${student.roll}) in ${this.currentClass || student.class} — ${this.currentSubject}`);
    App.showToast(`${student.name} marked ${status}`, status === "present" ? "success" : "danger");
  },

  bulkMark(status) {
    if (!this.currentSubject) {
      App.showToast("Please select a subject first", "warning");
      return;
    }
    const students = this.getFilteredStudents();
    const todayRecords = Store.getAttendance().filter(r => r.date === this.currentDate && r.subject === this.currentSubject);
    const existingIds = new Set(todayRecords.map(r => r.studentId));
    const records = Store.getAttendance();
    const label = status === "present" ? "Present" : "Absent";
    students.forEach(s => {
      if (!existingIds.has(s.id)) {
        records.push({
          id: `${this.currentDate}-${s.id}-${Date.now()}-${Math.random()}`,
          date: this.currentDate,
          studentId: s.id,
          name: s.name,
          roll: s.roll,
          class: s.class,
          subject: this.currentSubject,
          status,
          markedBy: App.currentUser?.name || "bulk"
        });
      }
    });
    Store.saveAttendance(records);
    this.renderManualTable();
    Store.logActivity("attendance_bulk", `All ${students.length} students in ${this.currentClass || "class"} — ${this.currentSubject} marked ${label}`);
    App.showToast(`All students marked ${label}`, status === "present" ? "success" : "info");
  },

  updateStudentAttendance(id) {
    const pct = Store.calcAttendancePercent(id);
    const students = Store.getStudents();
    const idx = students.findIndex(s => s.id === id);
    if (idx > -1) {
      students[idx].attendance = pct;
      Store.saveStudents(students);
    }
  },

  startAutoAttendance() {
    const modal = document.getElementById("autoModal");
    if (!modal) return;
    const classVal = this.currentClass || "CSE-A";
    const subjectVal = this.currentSubject || "AI & ML";
    modal.classList.add("active");

    const body = modal.querySelector(".modal-body");
    if (!body) return;

    const students = Store.getStudents().filter(s => s.class === classVal);
    this.detectedStudents = new Set();

    body.innerHTML = `
      <div style="text-align:center;margin-bottom:16px">
        <p style="font-size:14px;color:var(--text-light)">${classVal} - ${subjectVal} - ${this.currentDate}</p>
      </div>
      <div class="scanner-frame" style="margin-bottom:16px">
        <video id="webcam" autoplay playsinline></video>
        <div class="scanner-line"></div>
      </div>
      <div style="text-align:center;margin-bottom:16px">
        <button class="btn btn-primary" id="detectFaces"><i class="fas fa-camera"></i> Detect Faces</button>
        <button class="btn btn-outline" id="stopAutoScan"><i class="fas fa-stop"></i> Stop</button>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <h4 style="font-size:14px">Students (${students.length})</h4>
        <small><span style="color:var(--success)">${this.detectedStudents.size}</span> detected</small>
      </div>
      <div class="face-grid" id="faceGrid">
        ${students.map(s => `
          <div class="face-item" data-id="${s.id}" id="face-${s.id}">
            <div class="face-avatar">${s.name.charAt(0)}</div>
            <div class="face-name">${s.name.split(" ")[0]}</div>
            <div class="face-status" style="color:var(--text-light)">Waiting...</div>
          </div>
        `).join("")}
      </div>
    `;

    this.startWebcam();

    setTimeout(() => {
      document.getElementById("detectFaces")?.addEventListener("click", () => this.mockFaceDetection(students, classVal, subjectVal));
      document.getElementById("stopAutoScan")?.addEventListener("click", () => this.stopAutoAttendance());
    }, 100);
  },

  startWebcam() {
    const video = document.getElementById("webcam");
    if (!video) return;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: "user" } })
        .then(stream => {
          this.webcamStream = stream;
          video.srcObject = stream;
        })
        .catch(() => {
          this.mockWebcamFallback(video);
        });
    } else {
      this.mockWebcamFallback(video);
    }
  },

  mockWebcamFallback(video) {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext("2d");
    let count = 0;
    this.scanInterval = setInterval(() => {
      ctx.fillStyle = "#0a1628";
      ctx.fillRect(0, 0, 320, 240);
      ctx.fillStyle = "#0091A0";
      ctx.font = "14px Inter, sans-serif";
      ctx.fillText("📷 Camera Simulating...", 80, 100);
      ctx.fillStyle = "#6b7280";
      ctx.font = "12px Inter, sans-serif";
      ctx.fillText(`Frame ${count++}`, 130, 140);
      if (count % 20 === 0) {
        ctx.fillStyle = "#0091A0";
        ctx.fillRect(120, 160, 80, 2);
      }
      video.srcObject = null;
      video.src = canvas.toDataURL("image/png");
    }, 200);
  },

  mockFaceDetection(students, classVal, subjectVal) {
    const detected = new Set();
    students.forEach(s => {
      const el = document.getElementById(`face-${s.id}`);
      if (!el) return;
      const isPresent = Math.random() > 0.25;
      if (isPresent) {
        el.className = "face-item present";
        el.querySelector(".face-status").textContent = "✓ Present";
        el.querySelector(".face-status").style.color = "var(--success)";
        detected.add(s.id);
      } else {
        el.className = "face-item absent";
        el.querySelector(".face-status").textContent = "✗ Absent";
        el.querySelector(".face-status").style.color = "var(--danger)";
      }
    });

    this.detectedStudents = detected;
    const detectedCount = document.querySelector(".face-grid ~ small span");
    if (detectedCount) detectedCount.textContent = detected.size;

    const records = [];
    students.forEach(s => {
      const status = detected.has(s.id) ? "present" : "absent";
      const teacher = App.currentUser?.name || "auto";
      records.push({
        id: `${this.currentDate}-${s.id}-auto-${Date.now()}`,
        date: this.currentDate,
        studentId: s.id,
        name: s.name,
        roll: s.roll,
        class: classVal,
        subject: subjectVal,
        status,
        markedBy: teacher
      });
    });

    const existing = Store.getAttendance().filter(r => !(r.date === this.currentDate && r.subject === subjectVal));
    Store.saveAttendance([...existing, ...records]);
    students.forEach(s => this.updateStudentAttendance(s.id));
    Store.logActivity("attendance_auto", `Auto-scan for ${classVal} — ${subjectVal}: ${detected.size}/${students.length} present`);

    App.showToast(`Detected ${detected.size} students present out of ${students.length}`, "success");
    this.renderManualTable();
  },

  stopAutoAttendance() {
    if (this.webcamStream) {
      this.webcamStream.getTracks().forEach(t => t.stop());
      this.webcamStream = null;
    }
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
    document.getElementById("autoModal")?.classList.remove("active");
  },

  startQRScan() {
    const modal = document.getElementById("qrModal");
    if (!modal) return;
    modal.classList.add("active");
    const body = modal.querySelector(".modal-body");
    if (!body) return;

    let qrCount = 0;
    body.innerHTML = `
      <div style="text-align:center;padding:20px">
        <div class="scanner-frame" style="margin:0 auto 20px">
          <div style="color:white;text-align:center;padding:20px">
            <i class="fas fa-qrcode" style="font-size:64px;color:var(--primary);margin-bottom:12px"></i>
            <div style="font-size:12px;color:var(--text-light)" id="qrStatus">Waiting to scan...</div>
          </div>
          <div class="scanner-line"></div>
        </div>
        <button class="btn btn-primary" id="simulateQR"><i class="fas fa-camera"></i> Simulate Scan</button>
        <button class="btn btn-outline" onclick="Attendance.closeQRModal()"><i class="fas fa-times"></i> Close</button>
        <div id="qrResult" style="margin-top:16px"></div>
      </div>
    `;

    setTimeout(() => {
      document.getElementById("simulateQR")?.addEventListener("click", () => {
        qrCount++;
        const students = this.getFilteredStudents();
        if (!students.length || !this.currentSubject) {
          App.showToast("Select a class and subject first", "warning");
          return;
        }
        const randomStudent = students[Math.floor(Math.random() * students.length)];
        const statusEl = document.getElementById("qrStatus");
        if (statusEl) statusEl.textContent = `✓ Scanned! Student ID: ${randomStudent.roll}`;
        const resultEl = document.getElementById("qrResult");
        if (resultEl) {
          resultEl.innerHTML = `
            <div class="ai-card success" style="text-align:left">
              <h4><i class="fas fa-check-circle" style="color:var(--success)"></i> Scan #${qrCount} Successful</h4>
              <p>Student: ${randomStudent.name} (${randomStudent.roll})<br>Status: <span style="color:var(--success);font-weight:600">Present</span></p>
            </div>
          `;
        }
        const records = Store.getAttendance();
        const teacher = App.currentUser?.name || "qr";
        records.push({
          id: `${this.currentDate}-${randomStudent.id}-qr-${Date.now()}`,
          date: this.currentDate,
          studentId: randomStudent.id,
          name: randomStudent.name,
          roll: randomStudent.roll,
          class: randomStudent.class,
          subject: this.currentSubject,
          status: "present",
          markedBy: teacher
        });
        Store.saveAttendance(records);
        this.updateStudentAttendance(randomStudent.id);
        this.renderManualTable();
        Store.logActivity("attendance_qr", `QR scan: ${randomStudent.name} (${randomStudent.roll}) marked present in ${this.currentSubject}`);
        App.showToast(`${randomStudent.name} marked present via QR`, "success");
      });
    }, 100);
  },

  closeQRModal() {
    document.getElementById("qrModal")?.classList.remove("active");
  }
};
