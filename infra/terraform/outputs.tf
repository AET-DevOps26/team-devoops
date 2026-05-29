output "vm_public_ip" {
  description = "Public IP of the VM. Copy this to the VM_HOST secret in the GitHub 'production' environment."
  value       = azurerm_public_ip.main.ip_address
}

output "vm_fqdn" {
  description = "Public FQDN of the VM (Azure-provided). Used as the Host in Traefik routing and Let's Encrypt."
  value       = azurerm_public_ip.main.fqdn
}

output "ssh_connection" {
  description = "SSH connection string for the VM"
  value       = "ssh ${var.admin_username}@${azurerm_public_ip.main.ip_address}"
}
