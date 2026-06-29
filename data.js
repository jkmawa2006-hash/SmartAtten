const AppData = {
  students: (function() {
    const pools = {
      muslim: {
        male: ["Mohammed Ansari","Ahmad Khan","Ibrahim Sheikh","Omar Farooq","Hassan Ali","Yusuf Patel","Ismail Rahim","Abdullah Mirza","Rizwan Ahmad","Khalid Ansari","Tariq Mehmood","Zayed Hussain","Arif Khan","Salman Qureshi","Faiz Ahmed","Imran Patel","Rashid Sheikh","Aamir Hussain","Kabir Ansari","Nasir Khan"],
        female: ["Fatima Sharma","Ayesha Begum","Zainab Ali","Sana Mirza","Hira Khan","Nadia Hasan","Samira Iqbal","Amina Sheikh","Layla Ansari","Noor Fatima","Farah Khan","Isha Mirza","Shabana Husain","Rukhsar Ahmed","Yasmin Ali","Sofia Begum","Nasreen Bano","Saira Banu","Zara Sheikh","Firdaus Ansari"]
      },
      hindu: {
        male: ["Aarav Sharma","Arjun Patel","Vikram Singh","Rajesh Kumar","Amit Verma","Rohan Gupta","Suresh Yadav","Deepak Joshi","Manoj Tiwari","Nikhil Saxena","Pranav Desai","Karan Mehta","Aniket Rao","Harsh Vardhan","Shubham Jain","Rahul Mishra","Vivek Pandey","Aakash Choudhury","Siddharth Nair","Aditya Bhat"],
        female: ["Priya Sharma","Lakshmi Das","Ananya Gupta","Divya Singh","Neha Patel","Kavita Reddy","Pooja Verma","Sneha Joshi","Radha Iyer","Shreya Nair","Anjali Deshmukh","Meera Iyengar","Nandini Rao","Swati Mishra","Kirti Saxena","Deepa Nair","Shweta Pandey","Ananya Reddy","Neelam Kaur","Meher Kapadia"]
      },
      buddhist: {
        male: ["Tenzin Dorjee","Sangay Wangchuk","Karma Tsering","Jigme Norbu","Lobsang Tashi","Thubten Gyatso","Tashi Dorji","Kinley Dorji","Ugyen Penjore","Sonam Tobgay","Passang Dorjee","Nima Wangdi","Dechen Zangpo","Rinzin Dorji","Pema Wangchuk","Karma Yangzom","Dorji Wangmo","Tenzin Wangdi","Chimi Dorji","Yeshi Lhamo"],
        female: ["Choden Yangzom","Deki Lhamo","Pema Choki","Yangchen Dolma","Sonam Choden","Tshering Lhamo","Kinley Dema","Yuden Lhamo","Dorji Wangmo","Karma Yangzom","Chimi Wangmo","Ugyen Choden","Tenzin Yangzom","Sangay Choden","Jigme Yangzom","Tashi Yangzom","Rinzin Choden","Lhamo Dolma","Pema Yangzom","Dechen Wangmo"]
      },
      christian: {
        male: ["John Fernandes","David Thomas","Michael D'Souza","Joseph Mathew","Samuel George","Daniel Jacob","James Philip","Thomas Paul","Peter John","Benjamin Roy","Christopher Luke","Steven Mark","Andrew Simon","Joshua Daniel","Anthony Francis","Jonathan David","Matthew Samuel","Nathan George","Timothy Joseph","Lawrence Philip"],
        female: ["Mary Joseph","Sarah Abraham","Elizabeth John","Rebecca Thomas","Rachel Mathew","Hannah David","Grace Philip","Anna George","Ruth Daniel","Esther Paul","Martha Joseph","Catherine Simon","Susan Thomas","Dorothy James","Margaret Luke","Jennifer Mathew","Lydia George","Angel Paul","Sarah John","Rebecca David"]
      },
      sikh: {
        male: ["Gurpreet Singh","Harpreet Singh","Manpreet Singh","Amarjeet Singh","Ranveer Singh","Balwinder Singh","Kuldeep Singh","Sukhwinder Singh","Navjot Singh","Jaspreet Singh","Inderjeet Singh","Tejinder Singh","Simranjit Singh","Harjeet Singh","Gaganpreet Singh","Amritpal Singh","Karamjeet Singh","Satnam Singh","Daljeet Singh","Mandeep Singh"],
        female: ["Simran Kaur","Rajinder Kaur","Amrit Kaur","Navneet Kaur","Sukhdeep Kaur","Ravneet Kaur","Harpreet Kaur","Jaspreet Kaur","Manpreet Kaur","Gurpreet Kaur","Inderpreet Kaur","Tejinder Kaur","Simranjit Kaur","Harjeet Kaur","Navjeet Kaur","Kiran Kaur","Mandeep Kaur","Ranjeet Kaur","Sukhwinder Kaur","Baljinder Kaur"]
      }
    };
    const depts = [
      { code:"CSE", secs:["A","B"], rp:"CS" },
      { code:"ECE", secs:["A","B"], rp:"EC" },
      { code:"EEE", secs:["A"], rp:"EE" },
      { code:"MECH", secs:["A","B"], rp:"ME" },
      { code:"CIVIL", secs:["A"], rp:"CV" },
      { code:"IT", secs:["A","B"], rp:"IT" },
      { code:"AIDS", secs:["A"], rp:"AD" }
    ];
    const groups = ["muslim","hindu","buddhist","christian","sikh"];
    const result = [];
    let id = 1;
    let phoneBase = 43210;
    depts.forEach((dept, di) => {
      const secCount = dept.secs.length;
      const perSec = Math.ceil(40 / secCount);
      dept.secs.forEach((sec, si) => {
        const classKey = `${dept.code}-${sec}`;
        groups.forEach(religion => {
          const pool = pools[religion];
          const count = Math.ceil(perSec / groups.length);
          for (let g = 0; g < count; g++) {
            const isMale = g % 2 === 0;
            const src = isMale ? pool.male : pool.female;
            const idx = (di * 4 + si * 2 + Math.floor(g/2)) % src.length;
            const name = src[idx];
            const roll = `${dept.rp}21B${String(id).padStart(3,'0')}`;
            const att = Math.floor(Math.random() * 50) + 50;
            result.push({
              id, name, roll, class: classKey,
              attendance: att,
              status: att >= 75 ? "present" : "absent",
              email: `${name.toLowerCase().replace(/['\s.]/g,'').substring(0,10)}@example.com`,
              phone: `98765${String(phoneBase++)}`
            });
            id++;
          }
        });
      });
    });
    return result;
  })(),

  classes: ["CSE-A", "CSE-B", "ECE-A", "ECE-B", "EEE-A", "MECH-A", "MECH-B", "CIVIL-A", "IT-A", "IT-B", "AIDS-A"],
  subjects: ["Data Structures", "Algorithms", "AI & ML", "Database Systems", "Computer Networks", "Operating Systems", "Digital Electronics", "Microprocessors", "Communication Systems", "VLSI Design", "Embedded Systems", "Signal Processing", "Power Systems", "Electrical Machines", "Control Systems", "Renewable Energy", "Power Electronics", "Instrumentation", "Thermodynamics", "Fluid Mechanics", "Manufacturing Science", "Machine Design", "CAD/CAM", "Strength of Materials", "Structural Analysis", "Geotechnical Engg", "Transportation Engg", "Environmental Engg", "Surveying", "Concrete Technology", "Web Technologies", "Cyber Security", "Cloud Computing", "Data Mining", "Software Engineering", "Mobile Computing", "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Big Data Analytics", "Reinforcement Learning"],
  batches: ["2021-2025", "2022-2026", "2023-2027"],

  departments: [
    { code: "CSE", name: "Computer Science Engineering", sections: ["A", "B"] },
    { code: "ECE", name: "Electronics & Communication Engg", sections: ["A", "B"] },
    { code: "EEE", name: "Electrical & Electronics Engg", sections: ["A"] },
    { code: "MECH", name: "Mechanical Engineering", sections: ["A", "B"] },
    { code: "CIVIL", name: "Civil Engineering", sections: ["A"] },
    { code: "IT", name: "Information Technology", sections: ["A", "B"] },
    { code: "AIDS", name: "AI & Data Science", sections: ["A"] }
  ],

  deptSubjects: {
    "CSE": ["Data Structures", "Algorithms", "AI & ML", "Database Systems", "Computer Networks", "Operating Systems"],
    "ECE": ["Digital Electronics", "Microprocessors", "Communication Systems", "VLSI Design", "Embedded Systems", "Signal Processing"],
    "EEE": ["Power Systems", "Electrical Machines", "Control Systems", "Renewable Energy", "Power Electronics", "Instrumentation"],
    "MECH": ["Thermodynamics", "Fluid Mechanics", "Manufacturing Science", "Machine Design", "CAD/CAM", "Strength of Materials"],
    "CIVIL": ["Structural Analysis", "Geotechnical Engg", "Transportation Engg", "Environmental Engg", "Surveying", "Concrete Technology"],
    "IT": ["Web Technologies", "Cyber Security", "Cloud Computing", "Data Mining", "Software Engineering", "Mobile Computing"],
    "AIDS": ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Big Data Analytics", "Reinforcement Learning"]
  },

  users: [
    { id: 1, name: "Dr. Sharma", email: "admin@institrack.ai", password: "admin123", role: "admin", avatar: "DS" },
    { id: 2, name: "Prof. Gupta", email: "teacher@institrack.ai", password: "teacher123", role: "teacher", avatar: "PG" },

  ],

  notifications: [
    { id: 1, message: "Pooja Sharma attendance dropped to 38%", type: "danger", time: "2 hours ago", read: false },
    { id: 2, message: "Sneha Reddy marked absent for 3 consecutive days", type: "warning", time: "5 hours ago", read: false },
    { id: 3, message: "CSE-A class average attendance is 82% this week", type: "info", time: "1 day ago", read: false },
    { id: 4, message: "Extra class scheduled for AI & ML on Friday", type: "success", time: "2 days ago", read: false }
  ],

  timetable: (function() {
    const T = ["09:00-10:00","10:00-11:00","11:15-12:15","01:15-02:15","02:15-03:15"];
    const days = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday"];

    function sched(daySlots) {
      return days.map((day, di) => ({
        day,
        slots: (daySlots[di] || []).map((s, pi) => ({ time: T[pi], ...s }))
      }));
    }

    const deptSchedules = {

      "CSE": sched([
        // Saturday
        [
          { subject:"Competitive Programming", class:"CSE-A", teacher:"Prof. Gupta", room:"Lab-201" },
          { subject:"Web Development Lab", class:"CSE-B", teacher:"Prof. Singh", room:"Lab-202" },
          { subject:"Open Source Tools", class:"CSE-A", teacher:"Dr. Sharma", room:"LH-101" }
        ],
        // Sunday
        [
          { subject:"Remedial - Data Structures", class:"CSE-A", teacher:"Dr. Sharma", room:"LH-102" },
          { subject:"Remedial - Algorithms", class:"CSE-B", teacher:"Prof. Gupta", room:"LH-103" }
        ],
        // Monday
        [
          { subject:"Data Structures", class:"CSE-A", teacher:"Prof. Gupta", room:"LH-101" },
          { subject:"Algorithms", class:"CSE-B", teacher:"Dr. Sharma", room:"LH-102" },
          { subject:"Database Systems", class:"CSE-A", teacher:"Dr. Verma", room:"LH-104" },
          { subject:"Operating Systems", class:"CSE-B", teacher:"Dr. Sharma", room:"LH-102" },
          { subject:"Computer Networks", class:"CSE-A", teacher:"Prof. Singh", room:"LH-101" }
        ],
        // Tuesday
        [
          { subject:"AI & ML", class:"CSE-A", teacher:"Prof. Gupta", room:"LH-103" },
          { subject:"Data Structures", class:"CSE-B", teacher:"Prof. Gupta", room:"LH-101" },
          { subject:"Algorithms Lab", class:"CSE-A", teacher:"Dr. Sharma", room:"Lab-201" },
          { subject:"Computer Networks", class:"CSE-B", teacher:"Prof. Singh", room:"LH-102" },
          { subject:"Database Systems", class:"CSE-A", teacher:"Dr. Verma", room:"LH-104" }
        ],
        // Wednesday
        [
          { subject:"Operating Systems", class:"CSE-A", teacher:"Dr. Sharma", room:"LH-102" },
          { subject:"AI & ML", class:"CSE-B", teacher:"Prof. Gupta", room:"LH-103" },
          { subject:"Computer Networks", class:"CSE-A", teacher:"Prof. Singh", room:"LH-101" },
          { subject:"Data Structures Lab", class:"CSE-B", teacher:"Prof. Gupta", room:"Lab-202" },
          { subject:"Algorithms", class:"CSE-A", teacher:"Dr. Sharma", room:"LH-102" }
        ],
        // Thursday
        [
          { subject:"Database Systems", class:"CSE-B", teacher:"Dr. Verma", room:"LH-104" },
          { subject:"Operating Systems", class:"CSE-A", teacher:"Dr. Sharma", room:"LH-102" },
          { subject:"AI & ML Lab", class:"CSE-B", teacher:"Prof. Gupta", room:"Lab-201" },
          { subject:"Data Structures", class:"CSE-A", teacher:"Prof. Gupta", room:"LH-101" },
          { subject:"Networks Lab", class:"CSE-B", teacher:"Prof. Singh", room:"Lab-202" }
        ]
      ]),

      "ECE": sched([
        // Saturday
        [
          { subject:"Robotics Workshop", class:"ECE-A", teacher:"Prof. Rao", room:"Lab-301" },
          { subject:"PCB Design Lab", class:"ECE-B", teacher:"Dr. Kulkarni", room:"Lab-301" },
          { subject:"IoT Fundamentals", class:"ECE-A", teacher:"Prof. Rao", room:"LH-103" }
        ],
        // Sunday
        [
          { subject:"Remedial - Digital Electronics", class:"ECE-A", teacher:"Prof. Rao", room:"LH-103" },
          { subject:"Remedial - Signal Processing", class:"ECE-B", teacher:"Dr. Kulkarni", room:"LH-104" }
        ],
        [
          { subject:"Digital Electronics", class:"ECE-A", teacher:"Prof. Rao", room:"LH-103" },
          { subject:"Microprocessors", class:"ECE-B", teacher:"Dr. Kulkarni", room:"LH-104" },
          { subject:"Communication Systems", class:"ECE-A", teacher:"Prof. Rao", room:"LH-103" },
          { subject:"Signal Processing", class:"ECE-B", teacher:"Dr. Kulkarni", room:"LH-104" },
          { subject:"VLSI Design", class:"ECE-A", teacher:"Dr. Kulkarni", room:"LH-201" }
        ],
        [
          { subject:"Embedded Systems", class:"ECE-B", teacher:"Prof. Rao", room:"LH-103" },
          { subject:"Digital Electronics", class:"ECE-A", teacher:"Prof. Rao", room:"LH-103" },
          { subject:"Microprocessors Lab", class:"ECE-B", teacher:"Dr. Kulkarni", room:"Lab-301" },
          { subject:"VLSI Design", class:"ECE-A", teacher:"Dr. Kulkarni", room:"LH-201" },
          { subject:"Communication Systems", class:"ECE-B", teacher:"Prof. Rao", room:"LH-103" }
        ],
        [
          { subject:"Signal Processing", class:"ECE-A", teacher:"Dr. Kulkarni", room:"LH-104" },
          { subject:"Embedded Systems", class:"ECE-B", teacher:"Prof. Rao", room:"LH-103" },
          { subject:"Digital Electronics Lab", class:"ECE-A", teacher:"Prof. Rao", room:"Lab-301" },
          { subject:"Microprocessors", class:"ECE-B", teacher:"Dr. Kulkarni", room:"LH-104" },
          { subject:"Communication Systems", class:"ECE-A", teacher:"Prof. Rao", room:"LH-103" }
        ],
        [
          { subject:"VLSI Design", class:"ECE-B", teacher:"Dr. Kulkarni", room:"LH-201" },
          { subject:"Signal Processing", class:"ECE-A", teacher:"Dr. Kulkarni", room:"LH-104" },
          { subject:"Embedded Systems Lab", class:"ECE-B", teacher:"Prof. Rao", room:"Lab-301" },
          { subject:"Digital Electronics", class:"ECE-A", teacher:"Prof. Rao", room:"LH-103" },
          { subject:"Microprocessors", class:"ECE-B", teacher:"Dr. Kulkarni", room:"LH-104" }
        ]
      ]),

      "EEE": sched([
        // Saturday
        [
          { subject:"Electrical Workshop", class:"EEE-A", teacher:"Dr. Patel", room:"Lab-301" },
          { subject:"SCADA Systems", class:"EEE-A", teacher:"Dr. Patel", room:"LH-202" },
          { subject:"Smart Grid Tech", class:"EEE-A", teacher:"Dr. Patel", room:"LH-201" }
        ],
        // Sunday
        [
          { subject:"Remedial - Power Systems", class:"EEE-A", teacher:"Dr. Patel", room:"LH-201" },
          { subject:"Remedial - Electrical Machines", class:"EEE-A", teacher:"Dr. Patel", room:"LH-202" }
        ],
        [
          { subject:"Power Systems", class:"EEE-A", teacher:"Dr. Patel", room:"LH-201" },
          { subject:"Electrical Machines", class:"EEE-A", teacher:"Dr. Patel", room:"LH-201" },
          { subject:"Control Systems", class:"EEE-A", teacher:"Dr. Patel", room:"LH-202" },
          { subject:"Power Electronics", class:"EEE-A", teacher:"Dr. Patel", room:"LH-202" },
          { subject:"Instrumentation", class:"EEE-A", teacher:"Dr. Patel", room:"Lab-301" }
        ],
        [
          { subject:"Renewable Energy", class:"EEE-A", teacher:"Dr. Patel", room:"LH-202" },
          { subject:"Power Systems", class:"EEE-A", teacher:"Dr. Patel", room:"LH-201" },
          { subject:"Electrical Machines Lab", class:"EEE-A", teacher:"Dr. Patel", room:"Lab-301" },
          { subject:"Control Systems", class:"EEE-A", teacher:"Dr. Patel", room:"LH-202" },
          { subject:"Power Electronics", class:"EEE-A", teacher:"Dr. Patel", room:"LH-201" }
        ],
        [
          { subject:"Instrumentation", class:"EEE-A", teacher:"Dr. Patel", room:"Lab-301" },
          { subject:"Renewable Energy", class:"EEE-A", teacher:"Dr. Patel", room:"LH-202" },
          { subject:"Power Systems Lab", class:"EEE-A", teacher:"Dr. Patel", room:"Lab-301" },
          { subject:"Electrical Machines", class:"EEE-A", teacher:"Dr. Patel", room:"LH-201" },
          { subject:"Control Systems", class:"EEE-A", teacher:"Dr. Patel", room:"LH-202" }
        ],
        [
          { subject:"Power Electronics", class:"EEE-A", teacher:"Dr. Patel", room:"LH-201" },
          { subject:"Instrumentation", class:"EEE-A", teacher:"Dr. Patel", room:"Lab-301" },
          { subject:"Renewable Energy Lab", class:"EEE-A", teacher:"Dr. Patel", room:"Lab-301" },
          { subject:"Power Systems", class:"EEE-A", teacher:"Dr. Patel", room:"LH-201" },
          { subject:"Electrical Machines", class:"EEE-A", teacher:"Dr. Patel", room:"LH-202" }
        ]
      ]),

      "MECH": sched([
        // Saturday
        [
          { subject:"CNC Programming", class:"MECH-A", teacher:"Prof. Nair", room:"Lab-202" },
          { subject:"3D Printing Lab", class:"MECH-B", teacher:"Prof. Nair", room:"Lab-202" },
          { subject:"Automobile Engineering", class:"MECH-A", teacher:"Prof. Nair", room:"LH-202" }
        ],
        // Sunday
        [
          { subject:"Remedial - Thermodynamics", class:"MECH-A", teacher:"Prof. Nair", room:"LH-202" },
          { subject:"Remedial - Fluid Mechanics", class:"MECH-B", teacher:"Prof. Nair", room:"LH-202" }
        ],
        [
          { subject:"Thermodynamics", class:"MECH-A", teacher:"Prof. Nair", room:"LH-202" },
          { subject:"Fluid Mechanics", class:"MECH-B", teacher:"Prof. Nair", room:"LH-202" },
          { subject:"Manufacturing Science", class:"MECH-A", teacher:"Prof. Nair", room:"LH-202" },
          { subject:"Strength of Materials", class:"MECH-B", teacher:"Prof. Nair", room:"LH-202" },
          { subject:"Machine Design", class:"MECH-A", teacher:"Prof. Nair", room:"LH-202" }
        ],
        [
          { subject:"CAD/CAM", class:"MECH-B", teacher:"Prof. Nair", room:"Lab-202" },
          { subject:"Thermodynamics", class:"MECH-A", teacher:"Prof. Nair", room:"LH-202" },
          { subject:"Fluid Mechanics Lab", class:"MECH-B", teacher:"Prof. Nair", room:"Lab-202" },
          { subject:"Manufacturing Science", class:"MECH-A", teacher:"Prof. Nair", room:"LH-202" },
          { subject:"Strength of Materials", class:"MECH-B", teacher:"Prof. Nair", room:"LH-202" }
        ],
        [
          { subject:"Machine Design", class:"MECH-A", teacher:"Prof. Nair", room:"LH-202" },
          { subject:"CAD/CAM", class:"MECH-B", teacher:"Prof. Nair", room:"Lab-202" },
          { subject:"Thermodynamics Lab", class:"MECH-A", teacher:"Prof. Nair", room:"Lab-202" },
          { subject:"Fluid Mechanics", class:"MECH-B", teacher:"Prof. Nair", room:"LH-202" },
          { subject:"Manufacturing Science", class:"MECH-A", teacher:"Prof. Nair", room:"LH-202" }
        ],
        [
          { subject:"Strength of Materials", class:"MECH-B", teacher:"Prof. Nair", room:"LH-202" },
          { subject:"Machine Design", class:"MECH-A", teacher:"Prof. Nair", room:"LH-202" },
          { subject:"CAD/CAM Lab", class:"MECH-B", teacher:"Prof. Nair", room:"Lab-202" },
          { subject:"Thermodynamics", class:"MECH-A", teacher:"Prof. Nair", room:"LH-202" },
          { subject:"Fluid Mechanics", class:"MECH-B", teacher:"Prof. Nair", room:"LH-202" }
        ]
      ]),

      "CIVIL": sched([
        // Saturday
        [
          { subject:"AutoCAD Lab", class:"CIVIL-A", teacher:"Dr. Verma", room:"Lab-301" },
          { subject:"Building Materials", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" },
          { subject:"Surveying Practice", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" }
        ],
        // Sunday
        [
          { subject:"Remedial - Structural Analysis", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" },
          { subject:"Remedial - Geotechnical Engg", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" }
        ],
        [
          { subject:"Structural Analysis", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" },
          { subject:"Geotechnical Engg", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" },
          { subject:"Transportation Engg", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" },
          { subject:"Surveying", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" },
          { subject:"Concrete Technology", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" }
        ],
        [
          { subject:"Environmental Engg", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" },
          { subject:"Structural Analysis", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" },
          { subject:"Geotechnical Lab", class:"CIVIL-A", teacher:"Dr. Verma", room:"Lab-301" },
          { subject:"Transportation Engg", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" },
          { subject:"Surveying Field Work", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" }
        ],
        [
          { subject:"Concrete Technology", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" },
          { subject:"Environmental Engg", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" },
          { subject:"Structural Analysis Lab", class:"CIVIL-A", teacher:"Dr. Verma", room:"Lab-301" },
          { subject:"Geotechnical Engg", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" },
          { subject:"Transportation Engg", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" }
        ],
        [
          { subject:"Surveying", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" },
          { subject:"Concrete Technology", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" },
          { subject:"Environmental Lab", class:"CIVIL-A", teacher:"Dr. Verma", room:"Lab-301" },
          { subject:"Structural Analysis", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" },
          { subject:"Geotechnical Engg", class:"CIVIL-A", teacher:"Dr. Verma", room:"LH-104" }
        ]
      ]),

      "IT": sched([
        // Saturday
        [
          { subject:"DevOps Lab", class:"IT-A", teacher:"Prof. Xavier", room:"Lab-201" },
          { subject:"Blockchain Basics", class:"IT-B", teacher:"Dr. Mehta", room:"LH-201" },
          { subject:"UI/UX Design", class:"IT-A", teacher:"Prof. Xavier", room:"LH-103" }
        ],
        // Sunday
        [
          { subject:"Remedial - Web Technologies", class:"IT-A", teacher:"Prof. Xavier", room:"LH-103" },
          { subject:"Remedial - Cloud Computing", class:"IT-B", teacher:"Dr. Mehta", room:"LH-201" }
        ],
        [
          { subject:"Web Technologies", class:"IT-A", teacher:"Prof. Xavier", room:"LH-103" },
          { subject:"Cyber Security", class:"IT-B", teacher:"Prof. Xavier", room:"LH-201" },
          { subject:"Cloud Computing", class:"IT-A", teacher:"Dr. Mehta", room:"LH-103" },
          { subject:"Data Mining", class:"IT-B", teacher:"Dr. Mehta", room:"LH-201" },
          { subject:"Software Engineering", class:"IT-A", teacher:"Prof. Xavier", room:"LH-103" }
        ],
        [
          { subject:"Mobile Computing", class:"IT-B", teacher:"Dr. Mehta", room:"LH-201" },
          { subject:"Web Technologies", class:"IT-A", teacher:"Prof. Xavier", room:"LH-103" },
          { subject:"Cyber Security Lab", class:"IT-B", teacher:"Prof. Xavier", room:"Lab-201" },
          { subject:"Cloud Computing", class:"IT-A", teacher:"Dr. Mehta", room:"LH-103" },
          { subject:"Data Mining", class:"IT-B", teacher:"Dr. Mehta", room:"LH-201" }
        ],
        [
          { subject:"Software Engineering", class:"IT-A", teacher:"Prof. Xavier", room:"LH-103" },
          { subject:"Mobile Computing", class:"IT-B", teacher:"Dr. Mehta", room:"LH-201" },
          { subject:"Web Tech Lab", class:"IT-A", teacher:"Prof. Xavier", room:"Lab-201" },
          { subject:"Cyber Security", class:"IT-B", teacher:"Prof. Xavier", room:"LH-201" },
          { subject:"Cloud Computing Lab", class:"IT-A", teacher:"Dr. Mehta", room:"Lab-301" }
        ],
        [
          { subject:"Data Mining", class:"IT-B", teacher:"Dr. Mehta", room:"LH-201" },
          { subject:"Software Engineering", class:"IT-A", teacher:"Prof. Xavier", room:"LH-103" },
          { subject:"Mobile Computing Lab", class:"IT-B", teacher:"Dr. Mehta", room:"Lab-301" },
          { subject:"Web Technologies", class:"IT-A", teacher:"Prof. Xavier", room:"LH-103" },
          { subject:"Cyber Security", class:"IT-B", teacher:"Prof. Xavier", room:"LH-201" }
        ]
      ]),

      "AIDS": sched([
        // Saturday
        [
          { subject:"Data Visualization", class:"AIDS-A", teacher:"Dr. Mehta", room:"Lab-201" },
          { subject:"Ethical Hacking", class:"AIDS-A", teacher:"Prof. Xavier", room:"Lab-301" },
          { subject:"Research Methodology", class:"AIDS-A", teacher:"Dr. Mehta", room:"LH-103" }
        ],
        // Sunday
        [
          { subject:"Remedial - Machine Learning", class:"AIDS-A", teacher:"Dr. Mehta", room:"Lab-201" },
          { subject:"Remedial - Deep Learning", class:"AIDS-A", teacher:"Dr. Mehta", room:"Lab-301" }
        ],
        [
          { subject:"Machine Learning", class:"AIDS-A", teacher:"Dr. Mehta", room:"Lab-201" },
          { subject:"Deep Learning", class:"AIDS-A", teacher:"Dr. Mehta", room:"Lab-301" },
          { subject:"NLP", class:"AIDS-A", teacher:"Prof. Xavier", room:"LH-103" },
          { subject:"Computer Vision", class:"AIDS-A", teacher:"Dr. Mehta", room:"Lab-201" },
          { subject:"Big Data Analytics", class:"AIDS-A", teacher:"Prof. Xavier", room:"LH-103" }
        ],
        [
          { subject:"Reinforcement Learning", class:"AIDS-A", teacher:"Dr. Mehta", room:"Lab-301" },
          { subject:"Machine Learning", class:"AIDS-A", teacher:"Dr. Mehta", room:"Lab-201" },
          { subject:"Deep Learning Lab", class:"AIDS-A", teacher:"Dr. Mehta", room:"Lab-301" },
          { subject:"NLP", class:"AIDS-A", teacher:"Prof. Xavier", room:"LH-103" },
          { subject:"Computer Vision", class:"AIDS-A", teacher:"Dr. Mehta", room:"Lab-201" }
        ],
        [
          { subject:"Big Data Analytics", class:"AIDS-A", teacher:"Prof. Xavier", room:"LH-103" },
          { subject:"Reinforcement Learning", class:"AIDS-A", teacher:"Dr. Mehta", room:"Lab-301" },
          { subject:"ML Lab", class:"AIDS-A", teacher:"Dr. Mehta", room:"Lab-201" },
          { subject:"Deep Learning", class:"AIDS-A", teacher:"Dr. Mehta", room:"Lab-301" },
          { subject:"NLP Lab", class:"AIDS-A", teacher:"Prof. Xavier", room:"Lab-201" }
        ],
        [
          { subject:"Computer Vision Lab", class:"AIDS-A", teacher:"Dr. Mehta", room:"Lab-301" },
          { subject:"Big Data Analytics", class:"AIDS-A", teacher:"Prof. Xavier", room:"LH-103" },
          { subject:"Reinforcement Learning Lab", class:"AIDS-A", teacher:"Dr. Mehta", room:"Lab-301" },
          { subject:"Machine Learning", class:"AIDS-A", teacher:"Dr. Mehta", room:"Lab-201" },
          { subject:"Deep Learning", class:"AIDS-A", teacher:"Dr. Mehta", room:"Lab-301" }
        ]
      ])
    };

    const result = [];
    days.forEach((day, di) => {
      const slots = [];
      Object.values(deptSchedules).forEach(dept => {
        (dept[di]?.slots || []).forEach(s => slots.push(s));
      });
      result.push({ day, slots });
    });
    return result;
  })(),

  teachers: ["Prof. Gupta", "Dr. Sharma", "Dr. Verma", "Prof. Singh", "Dr. Patel", "Prof. Rao", "Dr. Mehta", "Prof. Xavier", "Dr. Kulkarni", "Prof. Nair"],
  rooms: ["LH-101", "LH-102", "LH-103", "LH-104", "LH-201", "LH-202", "Lab-201", "Lab-202", "Lab-301", "Seminar Hall"],

  feeStructure: {
    "CSE-A": { tuition: 45000, lab: 5000, library: 3000, sports: 2000, total: 55000 },
    "CSE-B": { tuition: 45000, lab: 5000, library: 3000, sports: 2000, total: 55000 },
    "ECE-A": { tuition: 42000, lab: 6000, library: 3000, sports: 2000, total: 53000 },
    "ECE-B": { tuition: 42000, lab: 6000, library: 3000, sports: 2000, total: 53000 },
    "EEE-A": { tuition: 40000, lab: 5000, library: 3000, sports: 2000, total: 50000 },
    "MECH-A": { tuition: 41000, lab: 5500, library: 3000, sports: 2000, total: 51500 },
    "MECH-B": { tuition: 41000, lab: 5500, library: 3000, sports: 2000, total: 51500 },
    "CIVIL-A": { tuition: 39000, lab: 5000, library: 3000, sports: 2000, total: 49000 },
    "IT-A": { tuition: 44000, lab: 5000, library: 3000, sports: 2000, total: 54000 },
    "IT-B": { tuition: 44000, lab: 5000, library: 3000, sports: 2000, total: 54000 },
    "AIDS-A": { tuition: 46000, lab: 6000, library: 3000, sports: 2000, total: 57000 }
  }
};

const Store = {
  key: "institrack_data",

  dataVersion: 2,

  init() {
    const stored = localStorage.getItem(this.key);
    if (!stored) {
      this.seed();
    } else {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length < AppData.students.length) {
          this.seed();
          localStorage.removeItem("institrack_attendance");
          localStorage.removeItem("institrack_fees");
        }
      } catch(e) { this.seed(); }
    }
    if (!localStorage.getItem("institrack_attendance")) {
      this.seedAttendance();
    }
    if (!localStorage.getItem("institrack_notifications")) {
      localStorage.setItem("institrack_notifications", JSON.stringify(AppData.notifications));
    }
    if (!localStorage.getItem("institrack_fees")) {
      this.seedFees();
    } else {
      const stored = JSON.parse(localStorage.getItem("institrack_fees"));
      if (stored.length && !stored[0].paidHistory) {
        this.seedFees();
      }
    }
    this.generateNotifications();
    if (Math.random() < 0.1) this.createBackup();
  },

  seed() {
    localStorage.setItem(this.key, JSON.stringify(AppData.students));
  },

  seedAttendance() {
    const records = [];
    const today = new Date();
    const allSubjects = ["Data Structures", "Algorithms", "AI & ML", "Digital Electronics", "Microprocessors", "Power Systems", "Thermodynamics", "Web Technologies", "Structural Analysis", "Communication Systems", "Fluid Mechanics", "Cyber Security", "Machine Learning", "VLSI Design", "Electrical Machines", "Manufacturing Science", "Cloud Computing", "Embedded Systems", "Control Systems", "Operating Systems"];
    for (let d = 30; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(date.getDate() - d);
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      const dateStr = date.toISOString().split("T")[0];
      const subjIdx = d % allSubjects.length;
      const subj = allSubjects[subjIdx];
      const students = JSON.parse(localStorage.getItem(this.key));
      students.forEach(s => {
        const r = Math.random();
        records.push({
          id: `${dateStr}-${s.id}-${subjIdx}`,
          date: dateStr,
          studentId: s.id,
          name: s.name,
          roll: s.roll,
          class: s.class,
          subject: subj,
          status: r < 0.75 ? "present" : "absent",
          markedBy: "auto"
        });
      });
    }
    localStorage.setItem("institrack_attendance", JSON.stringify(records));
  },

  getStudents() {
    return JSON.parse(localStorage.getItem(this.key)) || AppData.students;
  },

  saveStudents(students) {
    localStorage.setItem(this.key, JSON.stringify(students));
  },

  getAttendance() {
    return JSON.parse(localStorage.getItem("institrack_attendance")) || [];
  },

  saveAttendance(records) {
    localStorage.setItem("institrack_attendance", JSON.stringify(records));
  },

  addAttendanceRecord(records) {
    const existing = this.getAttendance();
    const merged = [...existing, ...records];
    localStorage.setItem("institrack_attendance", JSON.stringify(merged));
  },

  /* ===== ACTIVITY LOG ===== */
  getActivities() {
    return JSON.parse(localStorage.getItem("institrack_activity_log")) || [];
  },

  saveActivities(activities) {
    localStorage.setItem("institrack_activity_log", JSON.stringify(activities));
  },

  logActivity(action, details) {
    const activities = this.getActivities();
    const user = App.currentUser || {};
    const now = new Date();
    activities.push({
      id: Date.now(),
      teacherId: user.id || 0,
      teacherName: user.name || "System",
      teacherDept: user.department || "",
      role: user.role || "system",
      action,
      details,
      timestamp: now.toISOString(),
      date: now.toISOString().split("T")[0]
    });
    this.saveActivities(activities);
  },

  getNotifications() {
    return JSON.parse(localStorage.getItem("institrack_notifications")) || [];
  },

  saveNotifications(notes) {
    localStorage.setItem("institrack_notifications", JSON.stringify(notes));
  },

  markNotifRead(id) {
    const notes = this.getNotifications();
    const idx = notes.findIndex(n => n.id === id);
    if (idx > -1) { notes[idx].read = true; this.saveNotifications(notes); }
  },

  getStudentAttendance(studentId, days = 30) {
    const all = this.getAttendance();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return all.filter(r => r.studentId === studentId && new Date(r.date) >= cutoff);
  },

  getTodayAttendance() {
    const today = new Date().toISOString().split("T")[0];
    return this.getAttendance().filter(r => r.date === today);
  },

  calcAttendancePercent(studentId, days = 30) {
    const records = this.getStudentAttendance(studentId, days);
    if (!records.length) return 100;
    const present = records.filter(r => r.status === "present").length;
    return Math.round((present / records.length) * 100);
  },

  getLeaves() {
    return JSON.parse(localStorage.getItem("institrack_leaves")) || [];
  },

  saveLeaves(leaves) {
    localStorage.setItem("institrack_leaves", JSON.stringify(leaves));
  },

  addLeave(leave) {
    const leaves = this.getLeaves();
    leaves.push(leave);
    this.saveLeaves(leaves);
  },

  updateLeaveStatus(id, status) {
    const leaves = this.getLeaves();
    const idx = leaves.findIndex(l => l.id === id);
    if (idx > -1) { leaves[idx].status = status; this.saveLeaves(leaves); }
  },

  getFees() {
    return JSON.parse(localStorage.getItem("institrack_fees")) || [];
  },

  saveFees(fees) {
    localStorage.setItem("institrack_fees", JSON.stringify(fees));
  },

  seedFees() {
    const students = this.getStudents();
    const baseDate = new Date("2026-01-15");
    const fees = students.map((s, idx) => {
      const total = AppData.feeStructure[s.class]?.total || 55000;
      const rand = Math.random();
      let paid, status, paidHistory;
      if (rand < 0.30) { // fully paid
        paid = total;
        status = "paid";
        paidHistory = [{ id: 1, amount: total, date: "2026-03-15", mode: "online", notes: "Full payment" }];
      } else if (rand < 0.65) { // partial
        paid = Math.floor(total * (0.25 + Math.random() * 0.5));
        status = "partial";
        const p1 = Math.floor(paid * 0.6);
        const p2 = paid - p1;
        paidHistory = [{ id: 1, amount: p1, date: "2026-03-10", mode: "online", notes: "First installment" }];
        if (p2 > 500) paidHistory.push({ id: 2, amount: p2, date: "2026-04-20", mode: Math.random() > 0.5 ? "cash" : "online", notes: "Second installment" });
      } else { // no payment
        paid = 0;
        status = "pending";
        paidHistory = [];
      }
      const dd = new Date(baseDate);
      dd.setDate(dd.getDate() + (idx % 60));
      return {
        studentId: s.id, name: s.name, roll: s.roll, class: s.class,
        total, paid, balance: total - paid,
        dueDate: dd.toISOString().split("T")[0],
        status, paidHistory
      };
    });
    localStorage.setItem("institrack_fees", JSON.stringify(fees));
  },

  recordPayment(studentId, amount, mode, notes) {
    const fees = this.getFees();
    const idx = fees.findIndex(f => f.studentId === studentId);
    if (idx === -1) return false;
    const fee = fees[idx];
    const newPaid = fee.paid + amount;
    fee.paid = newPaid;
    fee.balance = fee.total - newPaid;
    const history = fee.paidHistory || [];
    const maxId = history.length ? Math.max(...history.map(h => h.id)) : 0;
    history.push({
      id: maxId + 1, amount, date: new Date().toISOString().split("T")[0],
      mode: mode || "cash", notes: notes || ""
    });
    fee.paidHistory = history;
    fee.status = fee.balance <= 0 ? "paid" : "partial";
    this.saveFees(fees);
    return true;
  },

  getFeeSummary() {
    const fees = this.getFees();
    const totalCollectable = fees.reduce((s, f) => s + f.total, 0);
    const totalPaid = fees.reduce((s, f) => s + f.paid, 0);
    const paidCount = fees.filter(f => f.status === "paid").length;
    const partialCount = fees.filter(f => f.status === "partial").length;
    const pendingCount = fees.filter(f => f.status === "pending").length;
    const overdue = fees.filter(f => f.status !== "paid" && new Date(f.dueDate) < new Date()).length;
    const rate = totalCollectable ? Math.round((totalPaid / totalCollectable) * 100) : 0;
    return { totalCollectable, totalPaid, pendingTotal: totalCollectable - totalPaid, paidCount, partialCount, pendingCount, overdue, rate, total: fees.length };
  },

  getTimetable() {
    const t = [...AppData.timetable];
    t.unshift({ day: "Sunday", slots: [] }, { day: "Saturday", slots: [] });
    t.push({ day: "Friday", slots: [], isHoliday: true });
    return t;
  },

  generateNotifications() {
    const existing = this.getNotifications();
    const existingMsgs = new Set(existing.map(n => n.message));
    const students = this.getStudents();
    const attendance = this.getAttendance();
    const newNotes = [];

    // Low attendance warnings
    students.forEach(s => {
      const pct = this.calcAttendancePercent(s.id, 30);
      if (pct < 75 && pct > 0) {
        const msg = `${s.name} (${s.roll}) attendance dropped to ${pct}%`;
        if (!existingMsgs.has(msg)) {
          const maxId = existing.length + newNotes.length;
          newNotes.push({ id: maxId + 1, message: msg, type: "warning", read: false, time: new Date().toISOString() });
        }
      }
    });

    // Pending leaves notification
    const leaves = this.getLeaves();
    const pendingLeaves = leaves.filter(l => l.status === "pending");
    pendingLeaves.forEach(l => {
      const msg = `${l.type} request from ${l.name} — pending approval`;
      if (!existingMsgs.has(msg)) {
        const maxId = existing.length + newNotes.length;
        newNotes.push({ id: maxId + 1, message: msg, type: "info", read: false, time: new Date().toISOString() });
      }
    });

    // Fee reminders
    const fees = this.getFees();
    fees.filter(f => f.status === "pending").forEach(f => {
      const msg = `Fee pending for ${f.name} — ৳${(f.total - f.paid).toLocaleString()} due`;
      if (!existingMsgs.has(msg)) {
        const maxId = existing.length + newNotes.length;
        newNotes.push({ id: maxId + 1, message: msg, type: "warning", read: false, time: new Date().toISOString() });
      }
    });

    if (newNotes.length) {
      this.saveNotifications([...existing, ...newNotes]);
    }
  },

  // Auto-backup
  backupKey: "institrack_backup",

  createBackup() {
    const data = {
      students: this.getStudents(),
      attendance: this.getAttendance(),
      leaves: this.getLeaves(),
      fees: this.getFees(),
      notifications: this.getNotifications(),
      timestamp: new Date().toISOString()
    };
    // Keep last 3 backups
    let backups = JSON.parse(localStorage.getItem(this.backupKey) || "[]");
    backups.push(data);
    if (backups.length > 3) backups = backups.slice(-3);
    localStorage.setItem(this.backupKey, JSON.stringify(backups));
  },

  restoreLatestBackup() {
    const backups = JSON.parse(localStorage.getItem(this.backupKey) || "[]");
    if (!backups.length) return false;
    const data = backups[backups.length - 1];
    localStorage.setItem("institrack_data", JSON.stringify(data.students));
    localStorage.setItem("institrack_attendance", JSON.stringify(data.attendance));
    localStorage.setItem("institrack_leaves", JSON.stringify(data.leaves));
    localStorage.setItem("institrack_fees", JSON.stringify(data.fees));
    localStorage.setItem("institrack_notifications", JSON.stringify(data.notifications));
    return true;
  },

  resetAll() {
    localStorage.removeItem(this.key);
    localStorage.removeItem("institrack_attendance");
    localStorage.removeItem("institrack_notifications");
    localStorage.removeItem("institrack_leaves");
    localStorage.removeItem("institrack_fees");
    localStorage.removeItem("institrack_theme");
    this.init();
    this.seedFees();
  }
};

Store.init();

/* ===== USER AUTH SYSTEM ===== */
const UserStore = {
  key: "institrack_users",

  getUsers() {
    return JSON.parse(localStorage.getItem(this.key) || "[]");
  },

  seedUsers() {
    const users = [
      { id: 1, name: "Admin User", email: "admin@institrack.ai", employeeId: "ADM-001", password: this.hash("admin123"), role: "admin", department: "Administration", phone: "+880-1712345678", createdAt: new Date().toISOString() },
      { id: 2, name: "Teacher User", email: "teacher@institrack.ai", employeeId: "TCH-001", password: this.hash("teacher123"), role: "teacher", department: "Computer Science", phone: "+880-1712345679", createdAt: new Date().toISOString() },

    ];
    localStorage.setItem(this.key, JSON.stringify(users));
  },

  hash(pw) {
    let h = 0;
    for (let i = 0; i < pw.length; i++) { const c = pw.charCodeAt(i); h = ((h << 5) - h) + c; h |= 0; }
    return "h" + Math.abs(h).toString(36);
  },

  validatePassword(pw) {
    const errs = [];
    if (pw.length < 6) errs.push("at least 6 characters");
    if (!/[A-Z]/.test(pw)) errs.push("an uppercase letter");
    if (!/[0-9]/.test(pw)) errs.push("a number");
    return { valid: errs.length === 0, errors: errs };
  },

  register({ name, email, employeeId, rollNumber, password, role, department, phone, class: cls, batch }) {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) return { ok: false, msg: "Email already registered" };
    if (employeeId && users.find(u => u.employeeId === employeeId)) return { ok: false, msg: "Employee ID already exists" };
    const val = this.validatePassword(password);
    if (!val.valid) return { ok: false, msg: "Password needs " + val.errors.join(", ") };
    const user = { id: Date.now(), name, email, employeeId: employeeId || "", password: this.hash(password), role, department: department || "", phone: phone || "", createdAt: new Date().toISOString() };
    users.push(user);
    localStorage.setItem(this.key, JSON.stringify(users));
    return { ok: true, user };
  },

  login(identifier, password) {
    const users = this.getUsers();
    const hashed = this.hash(password);
    const user = users.find(u => (u.email === identifier || u.employeeId === identifier) && u.password === hashed);
    return user || null;
  },

  updateUser(email, data) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1) return false;
    users[idx] = { ...users[idx], ...data };
    localStorage.setItem(this.key, JSON.stringify(users));
    return true;
  },

  resetAll() {
    localStorage.removeItem(this.key);
    this.seedUsers();
  }
};
