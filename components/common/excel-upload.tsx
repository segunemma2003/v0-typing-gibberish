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
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to upload data"
      toast.error(errorMessage)
      setUploadResult({
        success: false,
        created: 0,
        failed: previewData.length,
        errors: [{ error: errorMessage }],
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

      // Create example/hint rows for guidance
      const exampleRow = templateColumns.map(col => {
        const colLower = col.toLowerCase()
        // Add helpful examples based on column type
        if (colLower.includes('date_of_birth') || colLower.includes('dob') || colLower.includes('date')) {
          return '2020-01-15'
        }
        if (colLower.includes('email')) {
          return 'student@example.com'
        }
        if (colLower.includes('phone')) {
          return '+1234567890'
        }
        if (colLower.includes('gender')) {
          return 'male'
        }
        if (colLower.includes('class_id') || colLower.includes('class_name')) {
          return 'JSS1'
        }
        if (colLower.includes('arm_id') || colLower.includes('arm_name')) {
          return 'A'
        }
        if (colLower.includes('blood_group')) {
          return 'O+'
        }
        if (colLower.includes('first_name')) {
          return 'John'
        }
        if (colLower.includes('last_name')) {
          return 'Doe'
        }
        return ''
      })

      // Create instruction row
      const instructionRow = templateColumns.map((col, index) => {
        const colLower = col.toLowerCase()
        if (index === 0) {
          return 'Fill in your data below. Remove this row before uploading.'
        }
        if (col.includes('(')) {
          // Extract the hint from parentheses
          return col.match(/\(([^)]+)\)/)?.[1] || ''
        }
        return ''
      })

      // Create worksheet data: headers, instructions, example
      const worksheetData = [
        headers,
        instructionRow,
        exampleRow
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
      
      toast.success(`Template downloaded: ${filename}`, {
        description: 'Fill in your data and upload it back here'
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
                      Download Template
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
                    💡 <strong>Tip:</strong> Download the template above to get an Excel file with the correct column structure. 
                    Fill it with your data and upload it here.
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
              <Button onClick={handleUpload} disabled={uploading || previewData.length === 0}>
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
              <Button variant="outline" onClick={handleRemoveFile} disabled={uploading}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

