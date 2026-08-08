# ADR-004: Terraform Infrastructure as Code (IaC)

## Status
Accepted

## Context
Production deployments require reproducible infrastructure provisioning across development, staging, and production environments.

## Decision
We manage cloud resources via **Terraform** (`infra/terraform/production/main.tf`):
- MongoDB Atlas cluster configuration.
- AWS S3 backup snapshot parameters.
- Secret management and environment variable validation.

## Consequences
- Infrastructure is fully declared as code and version-controlled.
