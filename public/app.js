document.addEventListener("DOMContentLoaded", () => {
  const sectorSelect = document.getElementById("sectorSelect");
  const locationSelect = document.getElementById("locationSelect");
  const educationSelect = document.getElementById("educationSelect");
  const form = document.getElementById("profileForm");
  const results = document.getElementById("results");
  const skillsInput = document.getElementById("skillsInput");

  const tagify = new Tagify(skillsInput, {
    whitelist: [],
    dropdown: {
      enabled: 1,
      maxItems: 20,
      classname: "tags-look",
      fuzzySearch: true,
      position: "all",
      caseSensitive: false,
    },
  });

  const sectorOptions = document.getElementById("sectorOptions");
  const locationOptions = document.getElementById("locationOptions");
  const educationOptions = document.getElementById("educationOptions");

  // Load meta options dynamically into datalists
  fetch("/meta")
    .then((r) => r.json())
    .then((data) => {
      (data.sectors || []).forEach((s) => {
        const opt = document.createElement("option");
        opt.value = s;
        sectorOptions.appendChild(opt);
      });

      (data.locations || []).forEach((l) => {
        const opt = document.createElement("option");
        opt.value = l;
        locationOptions.appendChild(opt);
      });

      (data.educations || []).forEach((e) => {
        const opt = document.createElement("option");
        opt.value = e;
        educationOptions.appendChild(opt);
      });

      if (data.skills && Array.isArray(data.skills)) {
        tagify.settings.whitelist = data.skills;
      }
    });

  // Handle form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    results.innerHTML = "<div class='card small'>Finding matches…</div>";

    const skills = tagify.value.map((tag) => tag.value).filter(Boolean);

    const payload = {
      skills,
      sector: sectorSelect.value || "",
      location: locationSelect.value || "",
      education: educationSelect.value || "",
    };

    fetch("/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data) => {
        results.innerHTML = "";
        const res = data.results || [];

        if (!res.length) {
          results.innerHTML = "<div class='card small'>No matches found.</div>";
          return;
        }

        res.forEach((job) => {
          const div = document.createElement("div");
          div.className = "job-card";

          const breakdown = job.breakdown || {};

          div.innerHTML = `
            <div class="job-header">
              <div class="job-left">
                <div class="job-title">${job.title} <span class="small">— ${
                    job.company
                  }</span></div>
                <div class="meta">${job.location} • ${job.sector}</div>
                <div class="small">Posted on: ${new Date(
                  job.postDate
                ).toLocaleDateString()}</div>
                <div class="small"><b>Education Required:</b> ${
                  job.education_required
                }</div>
              </div>

              <div class="job-right">
                <div class="match-score">${job.matchScore}%</div>
                <div class="small">Match score</div>
                <div class="breakdown">
                  <div>Skills: ${breakdown.skillScore || 0} / 50</div>
                  <div>Sector: ${breakdown.sectorScore || 0} / 20</div>
                  <div>Location: ${breakdown.locationScore || 0} / 20</div>
                  <div>Education: ${breakdown.educationScore || 0} / 10</div>
                </div>
              </div>
            </div>

            <div class="job-footer">
              <button onclick="window.open('${
                job.applyLink
              }', '_blank')" class="btn apply-btn">Apply Now</button>
              
              <div class="feedback" style="margin-top:10px; text-align:center;">
                <span style="font-size:13px; display:block; margin-bottom:6px;">
                  Was this recommendation useful?
                </span>
                <div class="feedback-buttons" style="display:flex; justify-content:center; gap:8px;">
                  
                  <button onclick="sendFeedback('${job.id}', 'useful')" 
                          style="padding:6px 10px; font-size:13px; display:flex; align-items:center; justify-content:center; border:1px solid #ccc; border-radius:6px; background:#fff; cursor:pointer;">
                    <img src="./icon/like.png" alt="Like" style="width:18px; height:18px; object-fit:contain;" />
                  </button>
                  
                  <button onclick="sendFeedback('${job.id}', 'not_useful')" 
                          style="padding:6px 10px; font-size:13px; display:flex; align-items:center; justify-content:center; border:1px solid #ccc; border-radius:6px; background:#fff; cursor:pointer;">
                    <img src="./icon/hand.png" alt="Dislike" style="width:18px; height:18px; object-fit:contain;" />
                  </button>
                  
                  <button onclick="sendFeedback('${job.id}', 'applied')" 
                          style="padding:6px 14px; font-size:13px; border:1px solid #ccc; border-radius:6px; background:#f5f5f5; cursor:pointer;">
                    Applied
                  </button>
                  
                </div>
              </div>

            </div>
          `;

          results.appendChild(div);
        });
      })
      .catch((err) => {
        console.error(err);
        results.innerHTML =
          "<div class='card small'>Error getting recommendations.</div>";
      });
  });
});

//Feedback function
function sendFeedback(internshipId, feedbackType) {
  fetch("/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ internshipId, feedback: feedbackType }),
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.ok) {
        alert("Thanks for your feedback. it will help other users!");
      } else {
        alert("⚠️ Feedback failed to save.");
      }
    })
    .catch((err) => {
      console.error("Feedback error:", err);
      alert("⚠️ Error sending feedback.");
    });
}


