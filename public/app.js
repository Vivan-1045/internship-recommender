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

          div.innerHTML = `
            <div class="job-row">
              <div>
                <div class="job-title">${job.title} <span class="small">— ${job.company}</span></div>
                <div class="meta">${job.location} • ${job.sector}</div>
                <div class="small">Posted on: ${new Date(job.postDate).toLocaleDateString()}</div>
                <div class="small"><b>Education Required:</b> ${job.education_required}</div>
              </div>
              <div style="text-align:right">
                <div style="font-weight:700">${job.matchScore}%</div>
                <div class="small">Match score</div>
              </div>
            </div>

            <div class="breakdown">
              <div>Skills: ${job.breakdown.skillScore} / 50</div>
              <div>Sector: ${job.breakdown.sectorScore} / 20</div>
              <div>Location: ${job.breakdown.locationScore} / 20</div>
              <div>Education: ${job.breakdown.educationScore} / 10</div>
            </div>

            <div style="margin-top:10px">
              <button onclick="window.open('${job.applyLink}', '_blank')" class="btn">Apply Now</button>
            </div>

            <div style="margin-top:10px">
              <span class="small">Was this recommendation useful?</span>
              <div>
                <button class="btn small-btn" onclick="sendFeedback('${job.id}', 'useful')"> <img src="./icon/like.png" width="20px" height="20px"/> </button>
                <button class="btn small-btn" onclick="sendFeedback('${job.id}', 'not_useful')"> <img src="./icon/hand.png" width="20px" height="20px"/>  </button>
                <button class="btn small-btn" onclick="sendFeedback('${job.id}', 'applied')">✅ I Applied</button>
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
