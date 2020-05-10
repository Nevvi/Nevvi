provider "aws" {
  profile = "default"
  region = "us-east-1"
}

data "aws_caller_identity" "current" {}

terraform {
  backend "s3" {
    bucket = "nevvi-production-terraform-remote-state"
    key    = "terraform-state"
    region = "us-east-1"
  }
}

module "website" {
  source = "../modules/website"
  site_name = "nevvi.net"
  site_zone = "nevvi.net."
  site_cert_name = "nevvi.net"
  cloudfront_cname_aliases = ["nevvi.net", "www.nevvi.net"]
  environment = var.environment
}