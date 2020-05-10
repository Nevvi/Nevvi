provider "aws" {
  profile = "default"
  region = "us-east-1"
}

data "aws_caller_identity" "current" {}

terraform {
  backend "s3" {
    bucket = "nevvi-development-terraform-remote-state"
    key    = "terraform-state"
    region = "us-east-1"
  }
}

module "website" {
  source = "../modules/website"
  site_name = "development.nevvi.net"
  site_zone = "nevvi.net."
  site_cert_name = "*.nevvi.net"
  cloudfront_cname_aliases = ["development.nevvi.net"]
  environment = var.environment
}