export const exportToCSV = (products) => {
  const headers = ['Name,SKU,Category,Price,Quantity,LowStockThreshold,SerialNumber,Manufacturer']
  const rows = products.map(p =>
    `"${p.name}","${p.sku}","${p.category?.name || ''}",${p.price},${p.quantity},${p.lowStockThreshold},"${p.serialNumber || 'N/A'}","${p.manufacturer || 'N/A'}"`
  )
  const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', `aerokeep_inventory_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}