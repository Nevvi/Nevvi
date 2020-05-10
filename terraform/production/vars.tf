variable "site_name" {
  description = "My site"
  default = "nevvi.net"
}

variable "site_zone" {
  description = "My site zone"
  default = "nevvi.net."
}

variable "site_cert_name" {
  description = "My site cert"
  default = "*.nevvi.net"
}

variable "environment" {
  description = "Environment"
  default = "production"
}