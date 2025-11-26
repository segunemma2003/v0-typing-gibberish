"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileSpreadsheet, X, Loader2, CheckCircle2, AlertCircle, Download } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import * as XLSX from "xlsx"

interface ExcelUploadProps {
  onFileProcessed: (data: any[]) => void
  onUpload: (data: any[]) => Promise<any>
  entityType: "students" | "teachers" | "staff" | "guardians" | "questions"
  templateColumns?: string[]
  maxRows?: number
}

export function ExcelUpload({
  onFileProcessed,
  onUpload,
  entityType,
  templateColumns = [],
  maxRows = 1000,
}: ExcelUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{
    success: boolean
    created: number
    failed: number
    errors?: any[]
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type
    const validExtensions = [".xlsx", ".xls", ".csv"]
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase()

    if (!validExtensions.includes(fileExtension)) {
      toast.error("Please upload a valid Excel file (.xlsx, .xls, or .csv)")
      return
    }

    setFile(selectedFile)
    setUploadResult(null)

    try {
      // Read Excel file
      const arrayBuffer = await selectedFile.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" })

      if (jsonData.length === 0) {
        toast.error("The Excel file is empty")
        setFile(null)
        return
      }

      // First row is headers
      const headers = (jsonData[0] as any[]).map((h: any) => String(h).trim().toLowerCase())

      if (jsonData.length < 2) {
        toast.error("The Excel file must contain at least one data row")
        setFile(null)
        return
      }

      // Convert rows to objects
      const rows = jsonData.slice(1) as any[][]
      const processedData = rows
        .filter((row) => row.some((cell) => cell !== "")) // Remove empty rows
        .map((row, index) => {
          const obj: any = {}
          headers.forEach((header, colIndex) => {
            obj[header] = row[colIndex] || ""
          })
          return { ...obj, _rowIndex: index + 2 } // +2 because we skip header and arrays are 0-indexed
        })

      if (processedData.length > maxRows) {
        toast.error(`File contains ${processedData.length} rows. Maximum allowed is ${maxRows}. Please split the file.`)
        setFile(null)
        return
      }

      setPreviewData(processedData)
      onFileProcessed(processedData)
      toast.success(`File loaded successfully. Found ${processedData.length} rows.`)
    } catch (error: any) {
      console.error("Error reading Excel file:", error)
      toast.error(`Error reading file: ${error.message}`)
      setFile(null)
    }
  }

  const handleUpload = async () => {
    if (!previewData.length) {
      toast.error("No data to upload")
      return
    }
    
    if (uploading) {
      toast.warning("Upload already in progress. Please wait...")
      return
    }

    setUploading(true)
    setUploadResult(null)

    try {
      const result = await onUpload(previewData)
      setUploadResult({
        success: result.success || result.summary?.created > 0,
        created: result.summary?.created || result.data?.created?.length || 0,
        failed: result.summary?.failed || result.data?.failed?.length || 0,
        errors: result.data?.failed || [],
      })

      if (result.success && result.summary?.failed === 0) {
        toast.success(`Successfully uploaded ${result.summary.created} ${entityType}`)
        setFile(null)
        setPreviewData([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else if (result.summary?.created > 0) {
        toast.warning(
          `Upload completed with ${result.summary.created} created and ${result.summary.failed} failed. Check details below.`
        )
      } else {
        toast.error("Upload failed. Please check the errors below.")
      }
    } catch (error: any) {
      console.error("Error uploading data:", error)
      let errorMessage = "Failed to upload data"
      
      if (error?.response?.data) {
        const data = error.response.data
        // Handle validation errors (Laravel format)
        if (data.errors) {
          const errors = data.errors
          const errorMessages = Object.entries(errors).map(([field, messages]: [string, any]) => {
            const msg = Array.isArray(messages) ? messages.join(", ") : messages
            return `${field}: ${msg}`
          })
          errorMessage = errorMessages.join("; ")
        }
        // Handle messages format (another common format)
        else if (data.messages) {
          const messages = data.messages
          const errorMessages = Object.entries(messages).map(([field, msg]: [string, any]) => {
            const message = Array.isArray(msg) ? msg.join(", ") : msg
            return `${field}: ${message}`
          })
          errorMessage = errorMessages.join("; ")
        }
        // Handle bulk upload specific error format
        else if (data.data?.failed && Array.isArray(data.data.failed)) {
          const failedErrors = data.data.failed.map((err: any, idx: number) => {
            return `Row ${err.index || err.row || idx + 1}: ${err.error || JSON.stringify(err)}`
          }).join("; ")
          errorMessage = `Upload failed for some rows: ${failedErrors}`
        }
        // Handle simple message format
        else {
          errorMessage = data.message || data.error || data.detail || errorMessage
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage, {
        duration: 10000, // Show longer for bulk upload errors
      })
      
      setUploadResult({
        success: false,
        created: 0,
        failed: previewData.length,
        errors: error?.response?.data?.data?.failed || [{ error: errorMessage }],
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreviewData([])
    setUploadResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getColumnMapping = () => {
    if (previewData.length === 0) return {}
    const columns = Object.keys(previewData[0])
    const mapping: Record<string, string> = {}
    columns.forEach((col) => {
      mapping[col] = col
    })
    return mapping
  }

  const downloadTemplate = () => {
    if (templateColumns.length === 0) {
      toast.error("No template columns defined")
      return
    }

    try {
      // Create headers row - clean up column names for display
      const headers = templateColumns.map(col => {
        // Remove explanations in parentheses for cleaner headers, but keep the key info
        const cleanCol = col.split('(')[0].trim()
        return cleanCol
      })

      // Create instruction row
      const instructionRow = templateColumns.map((col, index) => {
        if (index === 0) {
          return 'INSTRUCTIONS: Fill in your data below. Remove this instruction row before uploading.'
        }
        if (col.includes('(')) {
          // Extract the hint from parentheses
          return col.match(/\(([^)]+)\)/)?.[1] || ''
        }
        return ''
      })

      // Helper function to generate example value based on column
      const getExampleValue = (col: string, rowIndex: number = 0): string => {
        const colLower = col.toLowerCase()
        
        // Date fields
        if (colLower.includes('date_of_birth') || colLower.includes('dob')) {
          return rowIndex === 0 ? '2010-05-15' : rowIndex === 1 ? '2011-08-20' : '2012-03-10'
        }
        if (colLower.includes('employment_date') || colLower.includes('hire_date')) {
          return rowIndex === 0 ? '2020-01-15' : rowIndex === 1 ? '2019-06-01' : '2021-03-20'
        }
        if (colLower.includes('date') && !colLower.includes('birth') && !colLower.includes('employment') && !colLower.includes('hire')) {
          return '2024-01-15'
        }
        
        // Email fields
        if (colLower.includes('email')) {
          return rowIndex === 0 ? 'john.doe@example.com' : rowIndex === 1 ? 'jane.smith@example.com' : 'bob.wilson@example.com'
        }
        
        // Phone fields
        if (colLower.includes('phone')) {
          return rowIndex === 0 ? '+1234567890' : rowIndex === 1 ? '+1234567891' : '+1234567892'
        }
        
        // Gender
        if (colLower.includes('gender')) {
          return rowIndex === 0 ? 'male' : rowIndex === 1 ? 'female' : 'male'
        }
        
        // Class fields
        if (colLower.includes('class_id') || colLower.includes('class_name') || colLower.includes('class ')) {
          return rowIndex === 0 ? 'JSS1' : rowIndex === 1 ? 'JSS2' : 'SS1'
        }
        
        // Arm fields
        if (colLower.includes('arm_id') || colLower.includes('arm_name') || colLower.includes('arm ')) {
          return rowIndex === 0 ? 'A' : rowIndex === 1 ? 'B' : 'A'
        }
        
        // Department
        if (colLower.includes('department_id') || colLower.includes('department_name') || colLower.includes('department ')) {
          return rowIndex === 0 ? 'Science' : rowIndex === 1 ? 'Mathematics' : 'English'
        }
        
        // Blood group
        if (colLower.includes('blood_group') || colLower.includes('blood group')) {
          return rowIndex === 0 ? 'O+' : rowIndex === 1 ? 'A+' : 'B+'
        }
        
        // Names
        if (colLower.includes('first_name') || colLower.includes('first name')) {
          return rowIndex === 0 ? 'John' : rowIndex === 1 ? 'Jane' : 'Bob'
        }
        if (colLower.includes('last_name') || colLower.includes('last name')) {
          return rowIndex === 0 ? 'Doe' : rowIndex === 1 ? 'Smith' : 'Wilson'
        }
        if (colLower.includes('middle_name') || colLower.includes('middle name')) {
          return rowIndex === 0 ? 'Michael' : rowIndex === 1 ? 'Elizabeth' : 'James'
        }
        
        // Address
        if (colLower.includes('address')) {
          return rowIndex === 0 ? '123 Main Street, City' : rowIndex === 1 ? '456 Oak Avenue, Town' : '789 Pine Road, Village'
        }
        
        // Qualification
        if (colLower.includes('qualification')) {
          return rowIndex === 0 ? 'B.Ed' : rowIndex === 1 ? 'M.Sc' : 'Ph.D'
        }
        
        // Experience
        if (colLower.includes('experience_years') || colLower.includes('experience years')) {
          return rowIndex === 0 ? '5' : rowIndex === 1 ? '10' : '3'
        }
        
        // Boolean fields
        if (colLower.includes('uses_transport') || colLower.includes('is_boarder')) {
          return rowIndex === 0 ? 'true' : rowIndex === 1 ? 'false' : 'true'
        }
        
        // Route/Transport
        if (colLower.includes('route_id') || colLower.includes('route id')) {
          return '1'
        }
        if (colLower.includes('pickup_point') || colLower.includes('pickup point')) {
          return 'Main Gate'
        }
        if (colLower.includes('pickup_time') || colLower.includes('pickup time')) {
          return '07:30'
        }
        
        // Hostel
        if (colLower.includes('hostel_name') || colLower.includes('hostel name')) {
          return 'Boys Hostel'
        }
        if (colLower.includes('block')) {
          return 'A'
        }
        if (colLower.includes('room_number') || colLower.includes('room number')) {
          return rowIndex === 0 ? '101' : rowIndex === 1 ? '102' : '103'
        }
        if (colLower.includes('bed_number') || colLower.includes('bed number')) {
          return rowIndex === 0 ? '1' : rowIndex === 1 ? '2' : '3'
        }
        
        // Medical
        if (colLower.includes('allergies')) {
          return 'Peanuts, Dairy'
        }
        if (colLower.includes('medications')) {
          return 'Inhaler, Vitamins'
        }
        if (colLower.includes('doctor_name') || colLower.includes('doctor name')) {
          return 'Dr. Smith'
        }
        if (colLower.includes('doctor_phone') || colLower.includes('doctor phone')) {
          return '+1234567890'
        }
        if (colLower.includes('hospital')) {
          return 'City Hospital'
        }
        
        // Parent/Guardian
        if (colLower.includes('parent_name') || colLower.includes('parent name')) {
          return rowIndex === 0 ? 'John Doe Sr.' : rowIndex === 1 ? 'Jane Smith' : 'Bob Wilson'
        }
        if (colLower.includes('parent_email') || colLower.includes('parent email')) {
          return rowIndex === 0 ? 'parent1@example.com' : rowIndex === 1 ? 'parent2@example.com' : 'parent3@example.com'
        }
        if (colLower.includes('emergency_contact') || colLower.includes('emergency contact')) {
          return '+1234567890'
        }
        
        // Position/Employment
        if (colLower.includes('position')) {
          return rowIndex === 0 ? 'Senior Teacher' : rowIndex === 1 ? 'Head of Department' : 'Teacher'
        }
        if (colLower.includes('employment_type') || colLower.includes('employment type')) {
          return 'full_time'
        }
        if (colLower.includes('salary')) {
          return '50000'
        }
        
        return ''
      }

      // Create multiple sample data rows (3 examples)
      const sampleRows = [0, 1, 2].map(rowIndex => 
        templateColumns.map(col => getExampleValue(col, rowIndex))
      )

      // Create worksheet data: headers, instructions, then sample rows
      const worksheetData = [
        headers,
        instructionRow,
        ...sampleRows
      ]

      // Create workbook
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

      // Set column widths for better readability
      const colWidths = headers.map((header) => ({
        wch: Math.max(header.length + 5, 18)
      }))
      worksheet['!cols'] = colWidths

      // Add worksheet to workbook
      const sheetName = `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Template`
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.substring(0, 31)) // Excel sheet name limit

      // Generate filename
      const filename = `${entityType}_bulk_upload_template.xlsx`

      // Write file and trigger download
      XLSX.writeFile(workbook, filename)
      
      toast.success(`Sample Excel file downloaded: ${filename}`, {
        description: 'The file includes 3 sample rows. Fill in your data and remove the instruction row before uploading.'
      })
    } catch (error: any) {
      console.error("Error generating template:", error)
      toast.error(`Failed to generate template: ${error.message}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Upload {entityType.charAt(0).toUpperCase() + entityType.slice(1)}</CardTitle>
        <CardDescription>Upload an Excel file (.xlsx, .xls, or .csv) to create multiple {entityType} at once</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!file && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <div className="space-y-2">
                <Label htmlFor="excel-upload" className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Select Excel File
                    </span>
                  </Button>
                </Label>
                <Input
                  id="excel-upload"
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <p className="text-sm text-muted-foreground">Maximum {maxRows} rows per file</p>
              </div>
            </div>

            {templateColumns.length > 0 && (
              <div className="space-y-3">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Expected Columns:</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={downloadTemplate}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Sample Excel
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {templateColumns.map((col) => (
                      <Badge key={col} variant="secondary">
                        {col}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    💡 <strong>Tip:</strong> Click "Download Sample Excel" to get a template file with 3 example rows showing the correct format. 
                    Fill in your data, remove the instruction row, and upload it here.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {file && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{previewData.length} rows ready to upload</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {previewData.length > 0 && (
              <div className="space-y-2">
                <div className="overflow-x-auto max-h-64 overflow-y-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        {Object.keys(previewData[0]).map((key) => (
                          <th key={key} className="px-3 py-2 text-left font-medium">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 10).map((row, index) => (
                        <tr key={index} className="border-t">
                          {Object.values(row).map((value: any, colIndex) => (
                            <td key={colIndex} className="px-3 py-2">
                              {String(value || "").substring(0, 30)}
                              {String(value || "").length > 30 ? "..." : ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {previewData.length > 10 && (
                    <p className="p-2 text-xs text-muted-foreground text-center">
                      Showing first 10 rows of {previewData.length} total rows
                    </p>
                  )}
                </div>
              </div>
            )}

            {uploadResult && (
              <div className={`p-4 rounded-lg ${uploadResult.success ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"}`}>
                <div className="flex items-center gap-2 mb-2">
                  {uploadResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <p className="font-medium">
                    {uploadResult.created} created, {uploadResult.failed} failed
                  </p>
                </div>
                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    {uploadResult.errors.slice(0, 5).map((error: any, index: number) => (
                      <p key={index} className="text-xs text-red-600">
                        Row {error.index || error.row || "?"}: {error.error || JSON.stringify(error)}
                      </p>
                    ))}
                    {uploadResult.errors.length > 5 && (
                      <p className="text-xs text-muted-foreground">... and {uploadResult.errors.length - 5} more errors</p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleUpload}>
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload {previewData.length} {entityType}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleRemoveFile}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

