// Sample offered courses
let offeredCourses = [
  { code: "CSE 221", title: "Database Management Systems", credits: 3 },
  { code: "CSE 222", title: "Database Management Systems Sessional", credits: 1.5},
  
  { code: "CSE 315", title: "System Analysis Design", credits: 3 },
  { code: "CSE 413", title: "Microprocessor and Assembly Programming", credits: 3 },
  { code: "CSE 414", title: "Microprocessor and Assembly Programming Sessional", credits: 1.5 },
  { code: "CSE 435", title: "Data Communication", credits: 3 },
  { code: "MATH 415", title: "Numerical Methods", credits: 3 },
  { code: "STAT 235", title: "Statistics", credits: 3 },
];

// Student's registered list
let registeredList = [];

// Initialize Page
window.onload = function() {
  const studentId = localStorage.getItem('student_id') || '2026-1-60-001';
  document.getElementById('user-display-id').innerText = studentId;
  renderOfferTable();
};

// Switch Dashboard Tabs
function switchDashboardTab(tab) {
  const offerView = document.getElementById('tab-view-offer');
  const enrolledView = document.getElementById('tab-view-enrolled');
  const btnOffer = document.getElementById('btn-tab-offer');
  const btnEnrolled = document.getElementById('btn-tab-enrolled');

  if (tab === 'offer') {
    offerView.classList.remove('hidden');
    enrolledView.classList.add('hidden');
    btnOffer.className = "px-5 py-2.5 text-sm font-semibold text-blue-700 border-b-2 border-blue-700";
    btnEnrolled.className = "px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700";
  } else {
    offerView.classList.add('hidden');
    enrolledView.classList.remove('hidden');
    btnEnrolled.className = "px-5 py-2.5 text-sm font-semibold text-blue-700 border-b-2 border-blue-700";
    btnOffer.className = "px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700";
    renderEnrolledTable();
  }
}

// Render Offered Courses Table
function renderOfferTable() {
  const tbody = document.getElementById('course-list-body');
  
  tbody.innerHTML = offeredCourses.map(c => {
    const isAlreadyAdded = registeredList.some(r => r.code === c.code);

    return `
      <tr class="hover:bg-gray-50">
        <td class="border border-gray-200 p-3 font-semibold text-gray-700">${c.code}</td>
        <td class="border border-gray-200 p-3">${c.title}</td>
<td class="border border-gray-200 p-3">${Number(c.credits).toFixed(1)}</td>
        <td class="border border-gray-200 p-3">
          <select id="type-${c.code.replace(' ', '_')}" class="border border-gray-300 rounded px-2 py-1 text-xs">
            <option value="Regular">Regular</option>
            <option value="Retake">Retake / Repeat</option>
            <option value="Incomplete">Incomplete Clear</option>
          </select>
        </td>
        <td class="border border-gray-200 p-3 text-center">
          ${isAlreadyAdded 
            ? `<span class="text-xs text-green-600 font-semibold">Registered</span>`
            : `<button onclick="addCourse('${c.code}')" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">Add Course</button>`
          }
        </td>
      </tr>
    `;
  }).join('');
}

// Add Course Action
function addCourse(code) {
  const course = offeredCourses.find(c => c.code === code);
  const selectId = `type-${code.replace(' ', '_')}`;
  const regType = document.getElementById(selectId).value;

  if (course) {
    registeredList.push({
      code: course.code,
      title: course.title,
      credits: course.credits,
      type: regType
    });

    alert(`Course ${code} (${regType}) added successfully!`);
    renderOfferTable();
  }
}

// Render Enrolled Table & Summary
function renderEnrolledTable() {
  const tbody = document.getElementById('enrolled-list-body');
  let totalCredits = 0;

  tbody.innerHTML = registeredList.map(r => {
    totalCredits += r.credits;

    return `
      <tr class="hover:bg-gray-50">
        <td class="border border-gray-200 p-3 font-semibold text-gray-700">${r.code}</td>
        <td class="border border-gray-200 p-3">${r.title}</td>
        <td class="border border-gray-200 p-3">${r.credits}.0</td>
        <td class="border border-gray-200 p-3">
          <span class="px-2 py-0.5 rounded text-xs font-semibold ${
            r.type === 'Regular' ? 'bg-blue-100 text-blue-800' :
            r.type === 'Retake' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'
          }">${r.type}</span>
        </td>
        <td class="border border-gray-200 p-3 text-center">
          <button onclick="dropCourse('${r.code}')" class="text-red-600 hover:underline text-xs">Drop</button>
        </td>
      </tr>
    `;
  }).join('');

  if (registeredList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="border border-gray-200 p-4 text-center text-gray-400">No courses registered yet.</td></tr>`;
  }

  // Calculate Summary
  document.getElementById('summary-credits').innerText = totalCredits.toFixed(1);
  document.getElementById('summary-count').innerText = registeredList.length;
  document.getElementById('summary-fee').innerText = 'BDT ' + (totalCredits * 2150); // $100 per credit
}

// Drop Course
function dropCourse(code) {
  registeredList = registeredList.filter(r => r.code !== code);
  renderEnrolledTable();
}

// Logout
function logout() {
  localStorage.removeItem('student_id');
  window.location.href = 'login.html';
}