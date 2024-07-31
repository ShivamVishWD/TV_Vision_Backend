const XLSX = require("xlsx");

const convertJsonToExcel = (sheetDataJSON, fileName) => {
    const workSheet = XLSX.utils.json_to_sheet(sheetDataJSON);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "students")
    // Generate buffer
    XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })
    // Binary string
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
    XLSX.writeFile(workBook, fileName)
}

module.exports = convertJsonToExcel