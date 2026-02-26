const owners = ["Amanda","Ana Patrícia","Angélica","Bianca","Bruna","Douglas","Ester","Fernando","Gedla","George","Izabelle","Laura","Maria Eduarda","Maria Fernanda","Matheus","Nathalia Doro","Nathalia Morais","Pedro","Stéfani"];
const tagsList = {
    "Shopee": "#f97316",
    "Mercado Livre": "#facc15",
    "Magalu": "#38bdf8",
    "Web Continental": "#3b82f6",
    "Netshoes": "#a855f7",
    "Casas Bahia": "#2563eb",
    "TikTok": "#6d28d9",
    "Tiny": "#dc2626",
    "NF": "#16a34a",
    "Americanas": "#ef4444",
    "iFood": "#dc2626"
};

const tagLogos = {
  "Shopee": "assets/logos/shopee.png",
  "Mercado Livre": "assets/logos/mercadolivre.png",
  "Magalu": "assets/logos/magalu.png",
  "Web Continental": "assets/logos/webcontinental.png",
  "Netshoes": "assets/logos/netshoes.png",
  "Casas Bahia": "assets/logos/casasbahia.png",
  "TikTok": "assets/logos/tiktok.png",
  "Tiny": "assets/logos/tiny.png",
  "NF": "assets/logos/nf.png",
  "Americanas": "assets/logos/americanas.png",
  "iFood": "assets/logos/ifood.png"
}

const tagSelect = document.getElementById("tagSelect");

// Placeholder "Tag"
let placeholder = document.createElement("option");
placeholder.value = "";
placeholder.textContent = "Tag";
placeholder.disabled = true;
placeholder.selected = true;
tagSelect.appendChild(placeholder);

// Agora adiciona os marketplaces
for (let tag in tagsList) {
    let opt = document.createElement("option");
    opt.value = tag;
    opt.textContent = tag;
    tagSelect.appendChild(opt);
}


const filterTag = document.getElementById("filterTag");

for (let tag in tagsList) {
    let opt = document.createElement("option");
    opt.value = tag;
    opt.textContent = tag;
    filterTag.appendChild(opt);
}



let files = JSON.parse(localStorage.getItem("pyFiles")) || [];

function saveStorage() {
    localStorage.setItem("pyFiles", JSON.stringify(files));
}

// ADD FILE
function addFile() {
    const fileInput = document.getElementById("fileInput");
    const nickname = document.getElementById("nickname").value;
    const owner = document.getElementById("owner").value;
    const colabLink = document.getElementById("colabLink").value;

    const desc = document.getElementById("desc").value;
    const inputs = document.getElementById("inputs").value;
    const outputs = document.getElementById("outputs").value;
    const notes = document.getElementById("notes").value;
    const tag = document.getElementById("tagSelect").value;
    
    const tagSelect = document.getElementById("tagSelect");
    const selectedTags = [...tagSelect.selectedOptions].map(opt => opt.value);


    if (!fileInput.files[0] || owner === "Responsável" || !desc) {
        alert("Arquivo, responsável e descrição são obrigatórios!");
        return;

	
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = e => {
    files.push({
        id: crypto.randomUUID(),
        name: file.name,
        nickname,
        owner,
        tag,
        colabLink,
        desc,
        inputs,
        outputs,
        notes,
        pinned: false,
        createdAt: new Date().toISOString(),
        content: e.target.result,
        tags: selectedTags

    });

    saveStorage();
    renderFiles();

    // LIMPAR FORMULÁRIO
    fileInput.value = "";
    document.getElementById("nickname").value = "";
    document.getElementById("owner").value = "Responsável";
    document.getElementById("colabLink").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("inputs").value = "";
    document.getElementById("outputs").value = "";
    document.getElementById("notes").value = "";
    document.getElementById("tagSelect").selectedIndex = 0;


    // FECHAR FORMULÁRIO RETRÁTIL
    addForm.classList.add("hidden");
    toggleBtn.innerHTML = "Adicionar automação";

    if (!tag) {
    alert("Selecione um marketplace");
    return;
}

};

    reader.readAsText(file);
}

// EXPORT FILE
function exportFile(index) {
    const file = files[index];
    const blob = new Blob([file.content], { type: "text/x-python" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = file.name;
    link.click();
}

// DELETE
function deleteFile(index) {
    if (!confirm("Remover script?")) return;
    files.splice(index, 1);
    saveStorage();
    renderFiles();
}
function editFile(index) {
    const file = files[index];
    const card = document.querySelectorAll(".file-card")[index];

    // Owner dropdown
    let ownerOptions = owners.map(o =>
        `<option ${o === file.owner ? "selected" : ""}>${o}</option>`
    ).join("");

    // Tag dropdown
    let tagOptions = Object.keys(tagsList).map(t =>
        `<option ${t === file.tag ? "selected" : ""}>${t}</option>`
    ).join("");

    card.innerHTML = `
    <h4>Editar automação</h4>

    Apelido:<br>
    <input id="editNickname" value="${file.nickname || ""}"><br><br>

    Responsável:<br>
    <select id="editOwner">${ownerOptions}</select><br><br>

    Marketplace:<br>
    <select id="editTag">${tagOptions}</select><br><br>

    Link Google Colab:<br>
    <input id="editLink" value="${file.colabLink || ""}"><br><br>

    Descrição:<br>
    <textarea id="editDesc">${file.desc}</textarea><br><br>

    Inputs:<br>
    <textarea id="editInputs">${file.inputs}</textarea><br><br>

    Outputs:<br>
    <textarea id="editOutputs">${file.outputs}</textarea><br><br>

    Observações:<br>
    <textarea id="editNotes">${file.notes}</textarea><br><br>

    Substituir arquivo:<br>
    <input type="file" id="editFileInput"><br><br>

    <button onclick="saveEdit(${index})">💾 Salvar</button>
    <button onclick="renderFiles()">❌ Cancelar</button>
    `;
}
function saveEdit(index) {
    const file = files[index];

    file.nickname = document.getElementById("editNickname").value;
    file.owner = document.getElementById("editOwner").value;
    file.tag = document.getElementById("editTag").value;
    file.colabLink = document.getElementById("editLink").value;
    file.desc = document.getElementById("editDesc").value;
    file.inputs = document.getElementById("editInputs").value;
    file.outputs = document.getElementById("editOutputs").value;
    file.notes = document.getElementById("editNotes").value;

    const newFile = document.getElementById("editFileInput").files[0];
    if (newFile) {
        const reader = new FileReader();
        reader.onload = e => {
            file.name = newFile.name;
            file.content = e.target.result;
            saveStorage();
            renderFiles();
        };
        reader.readAsText(newFile);
    } else {
        saveStorage();
        renderFiles();
    }
}
function togglePin(index) {
    files[index].pinned = !files[index].pinned;
    localStorage.setItem("konciliaFiles", JSON.stringify(files));
    renderFiles();
}


// RENDER FILES
function renderFiles() {
    const list = document.getElementById("fileList");
    list.innerHTML = "";

    const search = document.getElementById("searchInput").value.toLowerCase();
    const ownerFilter = document.getElementById("filterOwner").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const tagFilter = document.getElementById("filterTag").value;


    files.sort((a, b) => b.pinned - a.pinned);

    files.filter(file => {
        let s = file.name.toLowerCase().includes(search) || (file.nickname||"").toLowerCase().includes(search);
        let o = !ownerFilter || file.owner === ownerFilter;
        let d = true;
        if (startDate) d = new Date(file.createdAt) >= new Date(startDate);
        if (endDate) d = d && new Date(file.createdAt) <= new Date(endDate);
        let t = !tagFilter || file.tag === tagFilter;
        return s && o && d && t;
    }).forEach((file) => {
    	const index = files.indexOf(file);

        const date = new Date(file.createdAt).toLocaleString("pt-BR");

        const div = document.createElement("div");
	div.className = "file-card";
	div.dataset.id = file.id;

    
    const tagColor = tagsList[file.tag] || "#64748b";
    const tagLogo = tagLogos[file.tag];

	if (file.pinned) {
    		div.classList.add("pinned-card");

    let tagsHTML = "";
    if (file.tags) {
    tagsHTML = file.tags.map(t => 
        `<span class="tag" style="background:${tagsList[t]}">${t}</span>`
    ).join(" ");
}

	}
        div.innerHTML = `
        <span class="tag-badge" style="
            background:${tagColor};
            display:flex;
            align-items:center;
            gap:6px;
        ">
            ${tagLogo ? `
                <img src="${tagLogo}" 
                    style="
                     height:16px;
                    width:auto;
                    background:white;
                    padding:2px;
                    border-radius:4px;
                ">
         ` : ""}
          ${file.tag || "Sem tag"}
        </span>

        <h4>${file.nickname || file.name}</h4>
        <small>${file.name}</small><br>
        <small>👤 ${file.owner} | 🕒 ${date}</small><br><br>
        

        <b>Descrição:</b><br>${file.desc}<br><br>
        <b>Inputs:</b><br>${file.inputs || "—"}<br><br>
        <b>Outputs:</b><br>${file.outputs || "—"}<br><br>
        <b>Observações:</b><br>${file.notes || "—"}<br><br>

        <a href="${file.colabLink}" target="_blank">🔗 Acessar link</a><br><br>

        <div class="buttons-container">
                <button class="btn-verde" onclick="togglePin(${index})">
                ${file.pinned ? "📌 Desfixar" : "📌 Fixar"}
            </button>

            <button class="btn-verde" onclick="editFile(${index})">✏️ Editar</button>
            <button class="btn-verde" onclick="exportFile(${index})">Download</button>
            <button class="btn-vermelho" onclick="deleteFile(${index})">Excluir</button>
        </div>    
                `;            
        list.appendChild(div);
    });

    updateStats();
}
renderFiles();

function updateStats() {
    const total = files.length;

    const ownersCount = {};
    files.forEach(f => {
        ownersCount[f.owner] = (ownersCount[f.owner] || 0) + 1;
    });

    const tagsCount = {};
    files.forEach(f => {
        if (f.tag) {
            tagsCount[f.tag] = (tagsCount[f.tag] || 0) + 1;
        }
    });

    document.getElementById("totalCount").innerHTML = `📦 Total: <b>${total}</b>`;

    let ownerHTML = "👤 Responsáveis: ";
    for (let o in ownersCount) {
        ownerHTML += `<span>${o} (${ownersCount[o]})</span> `;
    }
    document.getElementById("ownerCount").innerHTML = ownerHTML;

    let tagHTML = "🏷️ Marketplaces: ";
    for (let t in tagsCount) {
        tagHTML += `<span>${t} (${tagsCount[t]})</span> `;
    }
    document.getElementById("tagCount").innerHTML = tagHTML;
}

const toggleBtn = document.getElementById("toggleAddBtn");
const addForm = document.getElementById("addForm");

toggleBtn.onclick = () => {
    addForm.classList.toggle("hidden");

    if (addForm.classList.contains("hidden")) {
        toggleBtn.innerHTML = "Adicionar automação";
    } else {
        toggleBtn.innerHTML = "Fechar formulário";
    }
};

renderFiles();

document.getElementById("filterTag").addEventListener("change", renderFiles);
document.getElementById("filterOwner").addEventListener("change", renderFiles);
document.getElementById("searchInput").addEventListener("input", renderFiles);
document.getElementById("startDate").addEventListener("change", renderFiles);
document.getElementById("endDate").addEventListener("change", renderFiles);