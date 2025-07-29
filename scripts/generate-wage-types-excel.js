const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Wage type data from the component
const wageTypes = [
  {
    id: "WT001",
    name: "Basic Salary",
    category: "Earnings",
    description: "Regular monthly salary based on employment contract",
    calculationMethod: "Fixed amount as per contract",
    taxable: true,
    status: "Active",
    effectiveDate: "2024-01-01",
    lastUpdated: "2024-01-01"
  },
  {
    id: "WT002",
    name: "Housing Allowance",
    category: "Allowances",
    description: "Monthly allowance to cover housing expenses",
    calculationMethod: "Percentage of basic salary (15%)",
    taxable: false,
    status: "Active",
    effectiveDate: "2024-01-01",
    lastUpdated: "2024-01-01"
  },
  {
    id: "WT003",
    name: "Transport Allowance",
    category: "Allowances",
    description: "Monthly allowance for transportation costs",
    calculationMethod: "Fixed amount based on employee grade",
    taxable: false,
    status: "Active",
    effectiveDate: "2024-01-01",
    lastUpdated: "2024-01-01"
  },
  {
    id: "WT004",
    name: "Overtime",
    category: "Earnings",
    description: "Payment for hours worked beyond standard working hours",
    calculationMethod: "1.6x hourly rate for weekdays, 2x for weekends",
    taxable: true,
    status: "Active",
    effectiveDate: "2024-01-01",
    lastUpdated: "2024-03-01"
  },
  {
    id: "WT005",
    name: "Income Tax",
    category: "Deductions",
    description: "Mandatory tax deduction based on income bracket",
    calculationMethod: "Progressive tax rates based on income level",
    taxable: false,
    status: "Active",
    effectiveDate: "2024-01-01",
    lastUpdated: "2024-01-01"
  },
  {
    id: "WT006",
    name: "Health Insurance",
    category: "Deductions",
    description: "Employee contribution to health insurance plan",
    calculationMethod: "Fixed amount or percentage based on plan type",
    taxable: false,
    status: "Active",
    effectiveDate: "2024-01-01",
    lastUpdated: "2024-02-01"
  },
  {
    id: "WT007",
    name: "Retirement Fund",
    category: "Deductions",
    description: "Employee contribution to retirement savings plan",
    calculationMethod: "Percentage of gross salary (typically 5-10%)",
    taxable: false,
    status: "Active",
    effectiveDate: "2024-01-01",
    lastUpdated: "2024-01-01"
  },
  {
    id: "WT008",
    name: "Performance Bonus",
    category: "Earnings",
    description: "Bonus payment based on employee performance",
    calculationMethod: "Percentage of annual salary based on performance rating",
    taxable: true,
    status: "Active",
    effectiveDate: "2024-01-01",
    lastUpdated: "2024-01-01"
  },
  {
    id: "WT009",
    name: "Meal Allowance",
    category: "Allowances",
    description: "Allowance for meals during work hours",
    calculationMethod: "Fixed daily amount for working days",
    taxable: false,
    status: "Inactive",
    effectiveDate: "2024-01-01",
    lastUpdated: "2024-01-01"
  },
  {
    id: "WT010",
    name: "Night Shift Allowance",
    category: "Allowances",
    description: "Additional compensation for night shift work",
    calculationMethod: "Fixed hourly rate for hours worked between 10 PM and 6 AM",
    taxable: true,
    status: "Active",
    effectiveDate: "2024-01-01",
    lastUpdated: "2024-01-01"
  },
  {
    id: "WT011",
    name: "Social Security",
    category: "Deductions",
    description: "Mandatory social security contribution",
    calculationMethod: "Fixed percentage of gross salary as per government regulations",
    taxable: false,
    status: "Active",
    effectiveDate: "2024-01-01",
    lastUpdated: "2024-01-01"
  },
  {
    id: "WT012",
    name: "Annual Bonus",
    category: "Earnings",
    description: "Year-end bonus based on company performance",
    calculationMethod: "Variable amount based on company profitability and individual tenure",
    taxable: true,
    status: "Active",
    effectiveDate: "2024-01-01",
    lastUpdated: "2024-01-01"
  }
];

// Create workbook and worksheet
const workbook = XLSX.utils.book_new();

// Convert data to worksheet format
const worksheet = XLSX.utils.json_to_sheet(wageTypes);

// Set column widths for better readability
const colWidths = [
  { wch: 8 },   // ID
  { wch: 25 },  // Name
  { wch: 12 },  // Category
  { wch: 50 },  // Description
  { wch: 50 },  // Calculation Method
  { wch: 10 },  // Taxable
  { wch: 10 },  // Status
  { wch: 12 },  // Effective Date
  { wch: 12 }   // Last Updated
];
worksheet['!cols'] = colWidths;

// Add the worksheet to the workbook
XLSX.utils.book_append_sheet(workbook, worksheet, "WageTypes");

// Create metadata sheet
const metadata = [
  {
    Property: "File Version",
    Value: "1.0",
    Description: "Version of the wage types catalog file"
  },
  {
    Property: "Last Updated",
    Value: new Date().toISOString().split('T')[0],
    Description: "Date when the file was last updated"
  },
  {
    Property: "Total Records",
    Value: wageTypes.length,
    Description: "Total number of wage type records"
  },
  {
    Property: "Categories",
    Value: "Earnings, Allowances, Deductions",
    Description: "Available wage type categories"
  },
  {
    Property: "Status Options",
    Value: "Active, Inactive",
    Description: "Available status options for wage types"
  }
];

const metadataSheet = XLSX.utils.json_to_sheet(metadata);
metadataSheet['!cols'] = [
  { wch: 15 },  // Property
  { wch: 20 },  // Value
  { wch: 40 }   // Description
];
XLSX.utils.book_append_sheet(workbook, metadataSheet, "Metadata");

// Ensure public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write the file
const filePath = path.join(publicDir, 'wage-types-catalog.xlsx');
XLSX.writeFile(workbook, filePath);

console.log(`✅ Wage types Excel file generated successfully at: ${filePath}`);
console.log(`📊 Total wage types: ${wageTypes.length}`);
console.log(`📁 Categories: ${[...new Set(wageTypes.map(wt => wt.category))].join(', ')}`);
console.log(`✨ Active wage types: ${wageTypes.filter(wt => wt.status === 'Active').length}`); 