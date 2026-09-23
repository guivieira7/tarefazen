# Infraestrutura como Código do TarefaZen (seção 7 do PGCS).
#
# Este arquivo descreve, em alto nível, o provisionamento da VPS que hospeda
# os ambientes de Staging e Produção via Docker Compose. Como o projeto é
# acadêmico e roda em uma VPS única gerenciada manualmente, o provider real
# (ex.: hcloud, aws, digitalocean) deve ser configurado conforme o provedor
# efetivamente contratado antes de rodar `terraform apply`.

terraform {
  required_version = ">= 1.5"
  # backend remoto (recomendado): armazena o state fora da máquina local,
  # conforme exigido na seção 7.1 do PGCS.
  # backend "s3" {
  #   bucket = "tarefazen-terraform-state"
  #   key    = "infra/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

variable "environment" {
  description = "Ambiente provisionado (staging ou production)"
  type        = string
  default     = "staging"
}

variable "server_size" {
  description = "Tamanho da VPS"
  type        = string
  default     = "small"
}

# Exemplo ilustrativo de recurso a ser adaptado ao provedor real de nuvem.
# resource "hcloud_server" "tarefazen" {
#   name        = "tarefazen-${var.environment}"
#   server_type = var.server_size
#   image       = "docker-ce"
#   location    = "hil"
# }

output "environment" {
  value = var.environment
}
