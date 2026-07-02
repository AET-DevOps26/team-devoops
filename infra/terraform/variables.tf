variable "resource_group_name" {
  description = "Name of the Azure resource group to create and manage"
  type        = string
  default     = "rg-team-devoops"
}

variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "germanywestcentral"
}

variable "vm_size" {
  description = "Azure VM size"
  type        = string
  default     = "Standard_D2_v4"
}

variable "admin_username" {
  description = "Admin username for the VM"
  type        = string
  default     = "azureuser"
}

variable "admin_ssh_public_key" {
  description = "SSH public key content for VM admin access (paste the full key string)"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Short name used to prefix all Azure resources"
  type        = string
  default     = "team-devoops"
}
