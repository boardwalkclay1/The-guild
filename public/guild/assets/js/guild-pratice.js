/* ------------------ OPTIONS CHAIN DATA ------------------ */

const chainData = [
  { id: 1, type: 'Call', strike: 100, bid: 1.20, ask: 1.30, last: 1.25 },
  { id: 2, type: 'Call', strike: 105, bid: 0.80, ask: 0.90, last: 0.85 },
  { id: 3, type: 'Call', strike: 110, bid: 0.45, ask: 0.55, last: 0.50 },

  { id: 4, type: 'Put',  strike: 100, bid: 1.10, ask: 1.20, last: 1.15 },
  { id: 5, type: 'Put',  strike: 105, bid: 1.40, ask: 1.55, last: 1.48 },
  { id: 6, type: 'Put',  strike: 110, bid: 1.85, ask: 2.00, last: 1.92 }
];

/* ------------------ RENDER OPTIONS CHAIN ------------------ */

function renderOptionsChain() {
  const container = document.getElementById("chainContainer");
  const strikes = [...new Set(chainData.map(c => c.strike))].sort((a,b)=>a-b);

  let html = `
    <table class="chain-table">
      <thead>
        <tr>
          <th colspan="3">CALLS</th>
          <th>STRIKE</th>
          <th colspan="3">PUTS</th>
        </tr>
        <tr>
          <th>Bid</th><th>Ask</th><th>Last</th>
          <th></th>
          <th>Bid</th><th>Ask</th><th>Last</th>
        </tr>
      </thead>
      <tbody>
  `;

  strikes.forEach(strike => {
    const call = chainData.find(c => c.strike === strike && c.type === "Call");
    const put  = chainData.find(c => c.strike === strike && c.type === "Put");

    html += `
      <tr>
        <td class="chain-row" data-id="${call.id}">${call.bid.toFixed(2)}</td>
        <td class="chain-row" data-id="${call.id}">${call.ask.toFixed(2)}</td>
        <td class="chain-row" data-id="${call.id}">${call.last.toFixed(2)}</td>

        <td><strong>${strike}</strong></td>

        <td class="chain-row" data-id="${put.id}">${put.bid.toFixed(2)}</td>
        <td class="chain-row" data-id="${put.id}">${put.ask.toFixed(2)}</td>
        <td class="chain-row" data-id="${put.id}">${put.last.toFixed(2)}</td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;

  container.querySelectorAll(".chain-row").forEach(cell => {
    cell.addEventListener("click", () => {
      const id = parseInt(cell.getAttribute("data-id"));
      const contract = chainData.find(c => c.id === id);
      openOrderTicket(contract);
    });
  });
}

/* ------------------ ORDER TICKET ------------------ */

function openOrderTicket(contract) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  overlay.innerHTML = `
    <div class="modal-box">
      <h2>Limit Order</h2>

      <p><strong>${contract.type.toUpperCase()}</strong> — Strike <strong>${contract.strike}</strong></p>

      <div class="modal-note">
        <strong>Bid:</strong> $${contract.bid.toFixed(2)}<br>
        <strong>Ask:</strong> $${contract.ask.toFixed(2)}<br>
        <strong>Last:</strong> $${contract.last.toFixed(2)}
      </div>

      <p class="modal-note">
        To buy instantly, you must enter the <strong>ASK</strong> price.
      </p>

      <label>Limit Price (must equal ask)</label>
      <input id="priceInput" type="number" step="0.01" placeholder="${contract.ask.toFixed(2)}">

      <label>Contracts</label>
      <input id="qtyInput" type="number" min="1" value="1">

      <p id="costDisplay" class="modal-note">Total Cost: $0.00</p>

      <div class="modal-actions">
        <button class="btn" id="cancelBtn">Cancel</button>
        <button class="btn" id="reviewBtn">Review Order</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const priceInput = overlay.querySelector("#priceInput");
  const qtyInput   = overlay.querySelector("#qtyInput");
  const costDisplay = overlay.querySelector("#costDisplay");

  function updateCost() {
    const p = parseFloat(priceInput.value);
    const q = parseInt(qtyInput.value);
    if (!isNaN(p) && !isNaN(q)) {
      costDisplay.innerHTML = `Total Cost: $${(p * q * 100).toFixed(2)}`;
    } else {
      costDisplay.innerHTML = "Total Cost: $0.00";
    }
  }

  priceInput.oninput = updateCost;
  qtyInput.oninput = updateCost;

  overlay.querySelector("#cancelBtn").onclick = () => overlay.remove();

  overlay.querySelector("#reviewBtn").onclick = () => {
    const price = parseFloat(priceInput.value);
    const qty = parseInt(qtyInput.value);

    if (price !== contract.ask) {
      alert("Limit price must equal the ASK to simulate a real fill.");
      return;
    }

    if (!qty || qty < 1) {
      alert("Enter at least 1 contract.");
      return;
    }

    overlay.remove();
    confirmOrder({ contract, price, qty });
  };
}

/* ------------------ CONFIRM ORDER ------------------ */

function confirmOrder(order) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const totalCost = order.price * order.qty * 100;

  overlay.innerHTML = `
    <div class="modal-box">
      <h2>Confirm Limit Order</h2>

      <p><strong>${order.contract.type.toUpperCase()}</strong> — Strike ${order.contract.strike}</p>
      <p>Price: $${order.price.toFixed(2)}</p>
      <p>Contracts: ${order.qty}</p>
      <p><strong>Total Cost: $${totalCost.toFixed(2)}</strong></p>

      <div class="modal-actions">
        <button class="btn" id="cancelBtn">Back</button>
        <button class="btn" id="executeBtn">Confirm</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector("#cancelBtn").onclick = () => overlay.remove();

  overlay.querySelector("#executeBtn").onclick = () => {
    overlay.remove();
    logExecutedOrder(order);
  };
}

/* ------------------ ORDER LOG ------------------ */

function logExecutedOrder(order) {
  const log = document.getElementById("orderLog");
  const totalCost = order.price * order.qty * 100;

  const entry = document.createElement("div");
  entry.className = "order-log-entry";
  entry.innerHTML = `
    <strong>Filled:</strong> ${order.contract.type.toUpperCase()} ${order.contract.strike}
    @ $${order.price.toFixed(2)} × ${order.qty}
    (Cost: $${totalCost.toFixed(2)})
  `;
  log.appendChild(entry);
}

/* ------------------ INIT ------------------ */

renderOptionsChain();
