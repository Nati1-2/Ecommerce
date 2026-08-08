# 🏗️ Terraform Infrastructure as Code (IaC) — Production Blueprint
# Provider Configuration for Cloud Infrastructure Provisioning

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "~> 1.12.0"
    }
  }
}

variable "mongodb_atlas_api_pub_key" {
  type        = string;
  description = "MongoDB Atlas Programmatic API Public Key"
}

variable "mongodb_atlas_api_pri_key" {
  type        = string;
  description = "MongoDB Atlas Programmatic API Private Key"
}

variable "project_id" {
  type        = string;
  description = "MongoDB Atlas Project ID"
}

# Production MongoDB Atlas Cluster Resource
resource "mongodbatlas_cluster" "production_cluster" {
  project_id   = var.project_id
  name         = "nati-store-prod-cluster"
  cluster_type = "REPLICASET"
  
  replication_specs {
    num_shards = 1
    regions_config {
      region_name     = "US_EAST_1"
      electable_nodes = 3
      priority        = 7
      read_only_nodes = 0
    }
  }

  provider_backup_enabled      = true
  auto_scaling_disk_gb_enabled = true
  mongo_db_major_version       = "7.0"
  provider_name                = "AWS"
  provider_instance_size_name  = "M10"
}

output "mongodb_connection_string" {
  value     = mongodbatlas_cluster.production_cluster.connection_strings[0].standard_srv
  sensitive = true
}
