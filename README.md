#  Manufacturing Execution System

A modern MES application for pistachio, walnut, and cardamom processing facilities.

## Features

- **Multi-language support** (English/Arabic/Hindi)
- **Mobile-first responsive design**
- **Real-time production monitoring**
- **Inventory management**
- **Shift entry and tracking**
- **Materials usage logging**
- **CSV export functionality**

## Quick Start

1. **Download all files** and organize them in this folder structure:

```
public/
├── index.html
├── pistachio.html
├── src/
│   ├── app.js
│   ├── styles.css
│   ├── views/
│   │   ├── factory-select.js
│   │   ├── pistachio-home.js
│   │   ├── pistachio-shift.js
│   │   └── materials.js
│   ├── components/
│   │   ├── counter.js
│   │   ├── chip.js
│   │   └── table.js
│   └── data/
│       └── mock/
│           ├── factories.json
│           ├── production_today.json
│           └── pistachio_reject_types.json
└── README.md
```

2. **Start a local web server** (required for ES6 modules):

```bash
# Using Python
cd public
python -m http.server 8000

# Using Node.js
npx serve public

# Using PHP
cd public
php -S localhost:8000
```

3. **Open your browser** and navigate to:
   - Main MES: `http://localhost:8000`
   - Pistachio Production: `http://localhost:8000/pistachio.html`

## Login Credentials

### Pistachio Production System
- **Admin**: username `admin`, password `admin123`
- **Operator**: username `operator`, password `op123`

## How to Use

1. **Main MES Dashboard**: Start at `index.html` to see all factory workspaces
2. **Pistachio Workspace**: Click on the Pistachio card to access the dedicated production system
3. **Multi-language**: Use the language buttons in the header to switch between English, Arabic, and Hindi
4. **Production Entry**: Record shift data, materials usage, and reject quantities
5. **Inventory Management**: Track stock levels and adjustments
6. **Data Export**: Export production and materials data to CSV

## Browser Requirements

- Modern browser with ES6 module support
- JavaScript enabled
- Local server (not file:// protocol)

## Troubleshooting

- **Blank page**: Ensure you're running from a web server, not opening files directly
- **Module errors**: Check that all files are in the correct folder structure
- **CORS errors**: Use a local web server as described above

## Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, ES6 JavaScript
- **Modules**: ES6 import/export
- **Storage**: In-memory (no localStorage dependencies)
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Icons**: Unicode emojis with image fallbacks

## Development

The application uses a modular architecture with:
- **Views**: Page components for different sections
- **Components**: Reusable UI elements
- **Data**: Mock JSON files for development
- **Styling**: Component-based CSS with design tokens
