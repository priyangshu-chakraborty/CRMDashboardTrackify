variable "project_name" { default = "crm-dashboard" }
variable "aws_region"   { default = "us-east-2" } # Ohio
variable "aws_profile"  { default = "default" }
variable "vpc_cidr"     { default = "10.0.0.0/16" }
variable "public_subnet_cidr" { default = "10.0.1.0/24" }
variable "instance_type" { default = "t3.micro" }
variable "key_name" {
  description = "EC2 key pair name"
  default     = "win-pwd"
}
variable "allow_ssh_cidr" { default = "0.0.0.0/0" }
variable "root_volume_size_gb" { default = 16 }
