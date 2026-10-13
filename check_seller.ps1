$files = Get-ChildItem -Path "seller\html\*.html"
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    $hasHeader = $content.Contains('sellerHeader')
    $hasFooter = $content.Contains('sellerFooter')
    $hasNavJs = $content.Contains('seller-nav.js')
    Write-Host "$($f.Name): Header=$hasHeader, Footer=$hasFooter, NavJs=$hasNavJs"
}
