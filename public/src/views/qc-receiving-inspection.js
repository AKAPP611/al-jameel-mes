// qc-receiving-inspection.js - Receiving QC Inspection Form
export function ReceivingQCInspection(mount) {
  // In-memory storage for inspection data
  let inspectionData = {
    photos: [],
    organoleptic: {},
    foreignMatter: {},
    physical: {},
    chemical: {},
    productDetails: {},
    storageCondition: {}
  };

  mount.innerHTML = `
    <div class="qc-inspection-container">
      <!-- Header Section -->
      <div class="inspection-header">
        <div class="header-logo">
          <img src="./logo.ico" alt="Al Jameel Logo" style="width: 60px; height: 60px;" onerror="this.style.display='none'">
        </div>
        <div class="header-info">
          <h1>Receiving Inspection Report</h1>
          <div class="document-info">
            <div class="info-row">
              <span><strong>Issue Date:</strong> <span id="issueDate">${new Date().toLocaleDateString()}</span></span>
              <span><strong>Revision No.:</strong> 00</span>
            </div>
            <div class="info-row">
              <span><strong>Document No.:</strong> ALJL-FM-15-RIC</span>
              <span><strong>Issue No.:</strong> <input type="text" id="issueNo" placeholder="Enter issue number"></span>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn" id="saveBtn">💾 Save Report</button>
          <button class="ghost" id="printBtn">🖨️ Print</button>
          <button class="ghost" id="exportBtn">📄 Export PDF</button>
        </div>
      </div>

      <!-- Product Details Section -->
      <div class="inspection-section">
        <h2 class="section-title">📦 PRODUCT DETAILS</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>Product Name</label>
            <input type="text" id="productName" class="form-control" placeholder="e.g., PECAN HALVES">
          </div>
          <div class="form-group">
            <label>Receiving Date</label>
            <input type="date" id="receivingDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
          </div>
          <div class="form-group">
            <label>Supplier Name</label>
            <input type="text" id="supplierName" class="form-control" placeholder="e.g., ALPI USA">
          </div>
          <div class="form-group">
            <label>Brand Name</label>
            <input type="text" id="brandName" class="form-control" placeholder="e.g., Al JAMEEL INTERNATIONAL">
          </div>
          <div class="form-group">
            <label>Country Of Origin</label>
            <select id="countryOrigin" class="form-control">
              <option value="">Select Country</option>
              <option value="USA">USA</option>
              <option value="Iran">Iran</option>
              <option value="Turkey">Turkey</option>
              <option value="China">China</option>
              <option value="India">India</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label>PDT Date</label>
            <input type="month" id="pdtDate" class="form-control">
          </div>
          <div class="form-group">
            <label>Weight (kg)</label>
            <input type="number" id="weight" class="form-control" step="0.01" min="0">
          </div>
          <div class="form-group">
            <label>EXP Date</label>
            <input type="month" id="expDate" class="form-control">
          </div>
          <div class="form-group">
            <label>Lot Numbers</label>
            <input type="text" id="lotNumbers" class="form-control" placeholder="e.g., 202519, 202521">
          </div>
          <div class="form-group">
            <label>Total Quantity (CTNs)</label>
            <input type="number" id="totalQuantity" class="form-control" min="0">
          </div>
          <div class="form-group">
            <label>Container No.</label>
            <input type="text" id="containerNo" class="form-control" placeholder="e.g., HLBU920042345R1">
          </div>
          <div class="form-group">
            <label>Type Of Container</label>
            <select id="containerType" class="form-control">
              <option value="">Select Type</option>
              <option value="Chiller">Chiller</option>
              <option value="Freezer">Freezer</option>
              <option value="Dry">Dry Container</option>
              <option value="Ambient">Ambient</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Storage Conditions -->
      <div class="inspection-section">
        <h2 class="section-title">🌡️ STORAGE CONDITIONS</h2>
        <div class="storage-conditions">
          <div class="storage-option">
            <label>
              <input type="radio" name="storageType" value="cold" checked>
              <strong>Cold Storage:</strong> Below 15°C
            </label>
          </div>
          <div class="storage-option">
            <label>
              <input type="radio" name="storageType" value="dry">
              <strong>Dry Storage:</strong> Below 21°C
            </label>
          </div>
        </div>
      </div>

      <!-- Organoleptic Properties -->
      <div class="inspection-section">
        <h2 class="section-title">👁️ ORGANOLEPTIC PROPERTIES</h2>
        <div class="properties-table">
          <div class="property-header">
            <span>Parameter</span>
            <span>Standard Value</span>
            <span>Approved</span>
          </div>
          
          <div class="property-row">
            <span><strong>Appearance</strong></span>
            <input type="text" id="appearanceStd" class="form-control" placeholder="e.g., Smooth skin, whole, free from damage">
            <label><input type="checkbox" id="appearanceApproved"> ✓</label>
          </div>
          
          <div class="property-row">
            <span><strong>Color</strong></span>
            <input type="text" id="colorStd" class="form-control" placeholder="e.g., Dark Brown skin">
            <label><input type="checkbox" id="colorApproved"> ✓</label>
          </div>
          
          <div class="property-row">
            <span><strong>Odor</strong></span>
            <input type="text" id="odorStd" class="form-control" placeholder="e.g., Free from foreign odor">
            <label><input type="checkbox" id="odorApproved"> ✓</label>
          </div>
          
          <div class="property-row">
            <span><strong>Taste</strong></span>
            <input type="text" id="tasteStd" class="form-control" placeholder="e.g., Nutty, free from bitterness">
            <label><input type="checkbox" id="tasteApproved"> ✓</label>
          </div>
          
          <div class="property-row">
            <span><strong>Texture</strong></span>
            <input type="text" id="textureStd" class="form-control" placeholder="e.g., Smooth, crunchy, firm">
            <label><input type="checkbox" id="textureApproved"> ✓</label>
          </div>
        </div>
      </div>

      <!-- Foreign Matter -->
      <div class="inspection-section">
        <h2 class="section-title">🔍 FOREIGN MATTER</h2>
        <div class="foreign-matter-table">
          <div class="matter-header">
            <span>Parameters</span>
            <span>Standard Value</span>
            <span>Status</span>
          </div>
          
          <div class="matter-row">
            <span>Wood, paper, stone, hair, flexible plastic, glass</span>
            <span>Absent</span>
            <select id="foreignMatter1" class="form-control">
              <option value="ABSENT">ABSENT</option>
              <option value="PRESENT">PRESENT</option>
            </select>
          </div>
          
          <div class="matter-row">
            <span>Rodent contamination, metal contamination</span>
            <span>Absent</span>
            <select id="foreignMatter2" class="form-control">
              <option value="ABSENT">ABSENT</option>
              <option value="PRESENT">PRESENT</option>
            </select>
          </div>
          
          <div class="matter-row">
            <span>Visible signs of spoilage, stains, water condensation</span>
            <span>Absent</span>
            <select id="foreignMatter3" class="form-control">
              <option value="ABSENT">ABSENT</option>
              <option value="PRESENT">PRESENT</option>
            </select>
          </div>
          
          <div class="matter-row">
            <span>Insect fragments and infestation</span>
            <span>Absent</span>
            <select id="foreignMatter4" class="form-control">
              <option value="ABSENT">ABSENT</option>
              <option value="PRESENT">PRESENT</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Physical Properties -->
      <div class="inspection-section">
        <h2 class="section-title">⚖️ PHYSICAL PROPERTIES</h2>
        <div class="physical-props">
          <div class="prop-row">
            <label>Good Product (%)</label>
            <input type="number" id="goodProduct" class="form-control" step="0.01" min="0" max="100">
          </div>
          <div class="prop-row">
            <label>Broken Pieces (%)</label>
            <input type="number" id="brokenPieces" class="form-control" step="0.01" min="0" max="100">
          </div>
          <div class="prop-row">
            <label>Insect/Serious Damage</label>
            <div class="damage-input">
              <input type="number" id="insectDamageLimit" class="form-control" step="0.1" value="0.1" readonly>
              <span>% max.</span>
              <select id="insectDamageResult" class="form-control">
                <option value="Nil">Nil</option>
                <option value="Present">Present</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Chemical Properties -->
      <div class="inspection-section">
        <h2 class="section-title">🧪 CHEMICAL PROPERTIES</h2>
        <div class="chemical-props">
          <div class="chem-row">
            <label>Moisture Test</label>
            <div class="test-input">
              <input type="number" id="moistureLimit" class="form-control" value="5" step="0.1" min="0">
              <span>% max.</span>
              <input type="number" id="moistureResult" class="form-control" step="0.001" placeholder="Result">
              <span>%</span>
            </div>
          </div>
          
          <div class="chem-row">
            <label>Aflatoxin Test</label>
            <div class="test-input">
              <input type="number" id="aflatoxinLimit" class="form-control" value="10" step="1" min="0">
              <span>ppb max.</span>
              <input type="text" id="aflatoxinResult" class="form-control" placeholder="Result or '-'">
            </div>
          </div>
          
          <div class="chem-row">
            <label>FFA (as oleic acid)</label>
            <div class="test-input">
              <input type="number" id="ffaLimit" class="form-control" value="1.5" step="0.1" min="0">
              <span>% max.</span>
              <input type="text" id="ffaResult" class="form-control" placeholder="Result or '-'">
            </div>
          </div>
        </div>
      </div>

      <!-- Photo Upload Section -->
      <div class="inspection-section">
        <h2 class="section-title">📸 INSPECTION PHOTOS</h2>
        <div class="photo-upload-section">
          <div class="upload-area" id="photoUpload">
            <div class="upload-placeholder">
              <span class="upload-icon">📷</span>
              <p>Click to upload photos or drag and drop</p>
              <p class="upload-hint">JPG, PNG files up to 10MB each</p>
            </div>
            <input type="file" id="photoInput" multiple accept="image/*" style="display: none;">
          </div>
          <div class="photo-grid" id="photoGrid">
            <!-- Uploaded photos will appear here -->
          </div>
          <div class="photo-templates">
            <h4>Recommended Photo Categories:</h4>
            <div class="template-tags">
              <span class="photo-tag">Container Exterior</span>
              <span class="photo-tag">Product Labeling</span>
              <span class="photo-tag">Product Sample</span>
              <span class="photo-tag">Good Product</span>
              <span class="photo-tag">Defects/Issues</span>
              <span class="photo-tag">Packaging</span>
            </div>
          </div>
        </div>
      </div>

      <!-- General Evaluation -->
      <div class="inspection-section">
        <h2 class="section-title">📋 GENERAL EVALUATION</h2>
        <div class="evaluation-section">
          <div class="sample-info">
            <label>Sample Collection Details</label>
            <textarea id="sampleDetails" class="form-control" rows="3" placeholder="e.g., 1 Kg sample was collected in 3 Different Cartons for further inspection."></textarea>
          </div>
          <div class="additional-notes">
            <label>Additional Comments</label>
            <textarea id="additionalNotes" class="form-control" rows="4" placeholder="Any additional observations, concerns, or recommendations..."></textarea>
          </div>
        </div>
      </div>

      <!-- Final Decision -->
      <div class="inspection-section final-decision">
        <h2 class="section-title">✅ FINAL DECISION</h2>
        <div class="decision-container">
          <div class="decision-options">
            <label class="decision-option accepted">
              <input type="radio" name="finalDecision" value="ACCEPTED" checked>
              <span class="decision-text">ACCEPTED</span>
            </label>
            <label class="decision-option rejected">
              <input type="radio" name="finalDecision" value="REJECTED">
              <span class="decision-text">REJECTED</span>
            </label>
          </div>
          <div class="rejection-reason" id="rejectionReason" style="display: none;">
            <label>Reason for Rejection</label>
            <textarea class="form-control" id="rejectionDetails" rows="3" placeholder="Specify reasons for rejection..."></textarea>
          </div>
        </div>
      </div>

      <!-- Inspector Information -->
      <div class="inspection-section">
        <h2 class="section-title">👤 INSPECTOR INFORMATION</h2>
        <div class="inspector-info">
          <div class="inspector-field">
            <label>Checked By</label>
            <input type="text" id="checkedBy" class="form-control" placeholder="Inspector Name">
          </div>
          <div class="inspector-field">
            <label>Position</label>
            <input type="text" id="inspectorPosition" class="form-control" placeholder="e.g., QA/QC">
          </div>
          <div class="inspector-field">
            <label>Verified By</label>
            <input type="text" id="verifiedBy" class="form-control" placeholder="Supervisor Name">
          </div>
          <div class="inspector-field">
            <label>Date</label>
            <input type="date" id="inspectionDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="btn-secondary" id="saveDraftBtn">💾 Save as Draft</button>
        <button class="btn" id="submitBtn">✅ Submit Report</button>
        <button class="ghost" id="clearFormBtn">🗑️ Clear Form</button>
      </div>
    </div>
  `;

  // Setup event handlers
  setupEventHandlers();
  setupPhotoUpload();
  calculatePhysicalProperties();
  
  function setupEventHandlers() {
    // Decision change handler
    document.querySelectorAll('input[name="finalDecision"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const rejectionDiv = document.getElementById('rejectionReason');
        rejectionDiv.style.display = e.target.value === 'REJECTED' ? 'block' : 'none';
      });
    });

    // Physical properties auto-calculation
    const goodProductInput = document.getElementById('goodProduct');
    const brokenPiecesInput = document.getElementById('brokenPieces');
    
    const updatePhysical = () => {
      const good = parseFloat(goodProductInput.value) || 0;
      const broken = parseFloat(brokenPiecesInput.value) || 0;
      const total = good + broken;
      
      if (total > 100) {
        // Adjust broken pieces to not exceed 100%
        brokenPiecesInput.value = (100 - good).toFixed(2);
      }
    };
    
    goodProductInput.addEventListener('input', updatePhysical);
    brokenPiecesInput.addEventListener('input', updatePhysical);

    // Button handlers
    document.getElementById('saveBtn').addEventListener('click', saveReport);
    document.getElementById('saveDraftBtn').addEventListener('click', saveDraft);
    document.getElementById('submitBtn').addEventListener('click', submitReport);
    document.getElementById('clearFormBtn').addEventListener('click', clearForm);
    document.getElementById('printBtn').addEventListener('click', printReport);
    document.getElementById('exportBtn').addEventListener('click', exportToPDF);
  }

  function setupPhotoUpload() {
    const uploadArea = document.getElementById('photoUpload');
    const photoInput = document.getElementById('photoInput');
    const photoGrid = document.getElementById('photoGrid');

    uploadArea.addEventListener('click', () => photoInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      handlePhotoUpload(files);
    });

    photoInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      handlePhotoUpload(files);
    });

    function handlePhotoUpload(files) {
      files.forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
          alert(\`File \${file.name} is too large. Maximum size is 10MB.\`);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const photo = {
            id: Date.now() + Math.random(),
            name: file.name,
            data: e.target.result,
            size: file.size,
            uploadTime: new Date().toISOString()
          };
          
          inspectionData.photos.push(photo);
          renderPhoto(photo);
        };
        reader.readAsDataURL(file);
      });
    }

    function renderPhoto(photo) {
      const photoElement = document.createElement('div');
      photoElement.className = 'photo-item';
      photoElement.innerHTML = \`
        <img src="\${photo.data}" alt="\${photo.name}" loading="lazy">
        <div class="photo-info">
          <span class="photo-name">\${photo.name}</span>
          <button class="photo-delete" onclick="deletePhoto('\${photo.id}')">🗑️</button>
        </div>
      \`;
      photoGrid.appendChild(photoElement);
    }

    // Make deletePhoto globally available
    window.deletePhoto = function(photoId) {
      inspectionData.photos = inspectionData.photos.filter(p => p.id !== photoId);
      renderPhotoGrid();
    };

    function renderPhotoGrid() {
      photoGrid.innerHTML = '';
      inspectionData.photos.forEach(renderPhoto);
    }
  }

  function calculatePhysicalProperties() {
    // Auto-calculate remaining percentage
    const inputs = ['goodProduct', 'brokenPieces'];
    inputs.forEach(inputId => {
      document.getElementById(inputId).addEventListener('input', () => {
        const good = parseFloat(document.getElementById('goodProduct').value) || 0;
        const broken = parseFloat(document.getElementById('brokenPieces').value) || 0;
        const total = good + broken;
        
        // Visual feedback if total exceeds 100%
        if (total > 100) {
          document.getElementById('goodProduct').style.borderColor = '#ef4444';
          document.getElementById('brokenPieces').style.borderColor = '#ef4444';
        } else {
          document.getElementById('goodProduct').style.borderColor = '';
          document.getElementById('brokenPieces').style.borderColor = '';
        }
      });
    });
  }

  function collectFormData() {
    return {
      // Product details
      productName: document.getElementById('productName').value,
      receivingDate: document.getElementById('receivingDate').value,
      supplierName: document.getElementById('supplierName').value,
      brandName: document.getElementById('brandName').value,
      countryOrigin: document.getElementById('countryOrigin').value,
      pdtDate: document.getElementById('pdtDate').value,
      weight: document.getElementById('weight').value,
      expDate: document.getElementById('expDate').value,
      lotNumbers: document.getElementById('lotNumbers').value,
      totalQuantity: document.getElementById('totalQuantity').value,
      containerNo: document.getElementById('containerNo').value,
      containerType: document.getElementById('containerType').value,
      
      // Storage
      storageType: document.querySelector('input[name="storageType"]:checked')?.value,
      
      // Organoleptic
      organoleptic: {
        appearance: { std: document.getElementById('appearanceStd').value, approved: document.getElementById('appearanceApproved').checked },
        color: { std: document.getElementById('colorStd').value, approved: document.getElementById('colorApproved').checked },
        odor: { std: document.getElementById('odorStd').value, approved: document.getElementById('odorApproved').checked },
        taste: { std: document.getElementById('tasteStd').value, approved: document.getElementById('tasteApproved').checked },
        texture: { std: document.getElementById('textureStd').value, approved: document.getElementById('textureApproved').checked }
      },
      
      // Foreign matter
      foreignMatter: {
        matter1: document.getElementById('foreignMatter1').value,
        matter2: document.getElementById('foreignMatter2').value,
        matter3: document.getElementById('foreignMatter3').value,
        matter4: document.getElementById('foreignMatter4').value
      },
      
      // Physical properties
      physical: {
        goodProduct: document.getElementById('goodProduct').value,
        brokenPieces: document.getElementById('brokenPieces').value,
        insectDamage: document.getElementById('insectDamageResult').value
      },
      
      // Chemical properties
      chemical: {
        moisture: { limit: document.getElementById('moistureLimit').value, result: document.getElementById('moistureResult').value },
        aflatoxin: { limit: document.getElementById('aflatoxinLimit').value, result: document.getElementById('aflatoxinResult').value },
        ffa: { limit: document.getElementById('ffaLimit').value, result: document.getElementById('ffaResult').value }
      },
      
      // Evaluation
      sampleDetails: document.getElementById('sampleDetails').value,
      additionalNotes: document.getElementById('additionalNotes').value,
      
      // Decision
      finalDecision: document.querySelector('input[name="finalDecision"]:checked')?.value,
      rejectionDetails: document.getElementById('rejectionDetails').value,
      
      // Inspector info
      checkedBy: document.getElementById('checkedBy').value,
      inspectorPosition: document.getElementById('inspectorPosition').value,
      verifiedBy: document.getElementById('verifiedBy').value,
      inspectionDate: document.getElementById('inspectionDate').value,
      
      // Photos
      photos: inspectionData.photos,
      
      // Metadata
      issueNo: document.getElementById('issueNo').value,
      reportDate: new Date().toISOString()
    };
  }

  function saveReport() {
    const data = collectFormData();
    // In a real app, this would save to a database
    console.log('Saving report:', data);
    alert('Report saved successfully!');
  }

  function saveDraft() {
    const data = collectFormData();
    data.status = 'draft';
    console.log('Saving draft:', data);
    alert('Draft saved!');
  }

  function submitReport() {
    const data = collectFormData();
    
    // Basic validation
    if (!data.productName) {
      alert('Product name is required');
      return;
    }
    
    if (!data.checkedBy) {
      alert('Inspector name is required');
      return;
    }
    
    data.status = 'submitted';
    console.log('Submitting report:', data);
    alert('Report submitted successfully!');
  }

  function clearForm() {
    if (confirm('Are you sure you want to clear all form data? This cannot be undone.')) {
      mount.querySelectorAll('input, select, textarea').forEach(element => {
        if (element.type === 'checkbox' || element.type === 'radio') {
          if (element.name === 'finalDecision' && element.value === 'ACCEPTED') {
            element.checked = true;
          } else if (element.name === 'storageType' && element.value === 'cold') {
            element.checked = true;
          } else {
            element.checked = false;
          }
        } else if (element.type === 'date') {
          element.value = new Date().toISOString().split('T')[0];
        } else {
          element.value = '';
        }
      });
      
      // Clear photos
      inspectionData.photos = [];
      document.getElementById('photoGrid').innerHTML = '';
      document.getElementById('rejectionReason').style.display = 'none';
      
      alert('Form cleared!');
    }
  }

  function printReport() {
    window.print();
  }

  function exportToPDF() {
    // In a real implementation, you'd use a PDF generation library
    alert('PDF export functionality would be implemented here using libraries like jsPDF or Puppeteer');
  }
}
