async function findRoute() {
  const source = document.getElementById("source").value;
  const destination = document.getElementById("destination").value;
  const resultBox = document.getElementById("result");

  resultBox.innerHTML = `<div class="card">⏳ Searching routes...</div>`;

  try {
    const res = await fetch(
      `http://localhost:4000/find-route?source=${source}&destination=${destination}`
    );

    const data = await res.json();

    console.log(data);

    // ---------------- DIRECT ROUTE ----------------
    if (data.type === "direct") {
      resultBox.innerHTML = `
        <div class="card">
          <span class="badge">DIRECT ROUTE</span>

          <h3>${data.route}</h3>

          <p><b>Buses:</b></p>

          ${data.options.map(bus => `
            <div class="bus-block">
              <div class="bus-time">🕒 ${bus.departure}</div>
              <div class="bus-number">🚌 ${bus.busNumber}</div>
            </div>
          `).join("")}

          <p><b>Stops:</b></p>
          <div>${data.stops.join(" → ")}</div>
        </div>
      `;
    }

    // ---------------- INDIRECT ROUTE ----------------
    else if (data.type === "indirect") {
      const best = data.best;

      resultBox.innerHTML = `
        <h2>🔁 Indirect Routes</h2>

        <!-- ⭐ BEST ROUTE -->
        <div class="card">
          <span class="badge">⭐ BEST ROUTE</span>

          <h3>${best.firstRoute} → ${best.secondRoute}</h3>

          <p><b>Change At:</b> ${best.changeAt}</p>

          <p><b>Bus 1:</b></p>

          ${best.bus1.map(b => `
            <div class="bus-block">
              <div class="bus-time">🕒 ${b.startTime}</div>
              <div class="bus-number">🚌 ${b.busNumber}</div>
            </div>
          `).join("")}

          <p><b>Bus 2:</b></p>

          ${best.bus2.map(b => `
            <div class="bus-block">
              <div class="bus-time">🕒 ${b.startTime}</div>
              <div class="bus-number">🚌 ${b.busNumber}</div>
            </div>
          `).join("")}

          <p><b>Score:</b> ${best.score}</p>
        </div>

        <!-- ALL OPTIONS -->
        <h3>📊 All Options</h3>

        ${data.options.map(r => `
          <div class="card">
            <h3>${r.firstRoute} → ${r.secondRoute}</h3>

            <p><b>Change At:</b> ${r.changeAt}</p>
            <p><b>Score:</b> ${r.score}</p>
          </div>
        `).join("")}
      `;
    }

    // ---------------- NO ROUTE ----------------
    else {
      resultBox.innerHTML = `
        <div class="card">
          <h2>❌ No Route Found</h2>
          <p>Try different source or destination</p>
        </div>
      `;
    }

  } catch (err) {
    resultBox.innerHTML = `
      <div class="card" style="border-left: 5px solid red;">
        <h2>⚠️ Error</h2>
        <p>${err.message}</p>
      </div>
    `;
  }
}