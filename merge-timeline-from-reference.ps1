# Merge only the Timeline section (and required hooks) from reference campaigns.html into your base file.
# Requires Windows PowerShell 5+.
#
# Usage:
#   .\merge-timeline-from-reference.ps1 -Base "C:\path\to\your\original\campaigns.html" `
#       -Reference "C:\Users\Aaron\Desktop\Reginald - Copy\campaigns.html" `
#       -Out "C:\Users\Aaron\Desktop\Reginald\campaigns.html"
#
# Restore your original base from File Explorer -> Properties -> Previous Versions if needed.

param(
  [Parameter(Mandatory=$true)][string]$Base,
  [Parameter(Mandatory=$true)][string]$Reference,
  [Parameter(Mandatory=$true)][string]$Out
)

$utf8 = New-Object System.Text.UTF8Encoding $false
$baseText = [IO.File]::ReadAllText($Base, $utf8)
$refText = [IO.File]::ReadAllText($Reference, $utf8)

$startTag = "`n// ═══════════════════════════════════════════════════════════════════════════`n// TIMELINE`n// ═══════════════════════════════════════════════════════════════════════════"
$worldTag = "`n// ═══════════════════════════════════════════════════════════════════════════`n// WORLD STATE`n// ═══════════════════════════════════════════════════════════════════════════"

$i0b = $baseText.IndexOf($startTag)
$i1b = $baseText.IndexOf($worldTag, $i0b)
$i0r = $refText.IndexOf($startTag)
$i1r = $refText.IndexOf($worldTag, $i0r)

if ($i0b -lt 0 -or $i1b -lt 0) { throw "TIMELINE/WORLD markers not found in Base." }
if ($i0r -lt 0 -or $i1r -lt 0) { throw "TIMELINE/WORLD markers not found in Reference." }

$newBlock = $refText.Substring($i0r, $i1r - $i0r)
$result = $baseText.Substring(0, $i0b) + $newBlock + $baseText.Substring($i1b)

$result = $result.Replace(
  "const { useState, useEffect, useCallback, useRef } = React;",
  "const { useState, useEffect, useCallback, useRef, useMemo } = React;"
)

$refLucide = [regex]::Match($refText, '(?s)    // Lucide icons from global\n    const \{ ChevronDown.*?\n    const FilterIcon = Filter \|\| Layers;\n').Value
if ($refLucide) {
  $result = [regex]::Replace($result, '(?s)    // Lucide icons from global\n    const \{ ChevronDown.*?\n', $refLucide, 1)
}

$result = $result -replace '\{tab==="timeline"\s+&&\s*<TimelineView\s+data=\{data\}\s+setData=\{setData\}/>\}', '{tab==="timeline"  && <TimelineView data={data} setData={setData} onNav={setTab}/>}'

[IO.File]::WriteAllText($Out, $result, $utf8)
Write-Host "Wrote $Out"
