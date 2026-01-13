# Script para limpar ícones PWA desnecessários
# Mantém apenas os 11 ícones essenciais

$pastaIcones = "\\10.15.4.252\controladoria\Natanael_BI\Natanael_BI_py\PAINEL_POWERBI\BI_PORTAL_SECURE\assets\img\pwa-icons"

# Lista dos 11 ícones que devem ser mantidos
$iconesEssenciais = @(
    "16.png",
    "32.png",
    "64.png",
    "128.png",
    "144.png",
    "152.png",
    "180.png",
    "192.png",
    "256.png",
    "512.png",
    "1024.png"
)

Write-Host "🧹 Limpando ícones PWA desnecessários..." -ForegroundColor Cyan
Write-Host ""

# Obter todos os arquivos PNG na pasta
$todosArquivos = Get-ChildItem -Path $pastaIcones -Filter "*.png"

$removidos = 0
$mantidos = 0

foreach ($arquivo in $todosArquivos) {
    if ($iconesEssenciais -contains $arquivo.Name) {
        Write-Host "✅ Mantido: $($arquivo.Name)" -ForegroundColor Green
        $mantidos++
    } else {
        try {
            Remove-Item -Path $arquivo.FullName -Force
            Write-Host "🗑️  Removido: $($arquivo.Name)" -ForegroundColor Yellow
            $removidos++
        } catch {
            Write-Host "❌ Erro ao remover: $($arquivo.Name)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 Resumo:" -ForegroundColor White
Write-Host "   ✅ Mantidos: $mantidos arquivos" -ForegroundColor Green
Write-Host "   🗑️  Removidos: $removidos arquivos" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ Limpeza concluída! Apenas os 11 ícones essenciais foram mantidos." -ForegroundColor Green
Write-Host ""

# Opcional: Remover o README.md também
$readmePath = Join-Path $pastaIcones "README.md"
if (Test-Path $readmePath) {
    Remove-Item -Path $readmePath -Force
    Write-Host "📄 README.md também foi removido." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
