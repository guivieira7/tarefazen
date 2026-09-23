# ADR-001: Adoção de Trunk-Based Development (GitHub Flow)

**Status:** Aceito
**Data:** 2026-09-22

## Contexto
O TarefaZen é desenvolvido individualmente, em um contexto acadêmico, com necessidade de manter uma branch sempre implantável e integrar mudanças com frequência, conforme descrito no PGCS (seção 3.3).

## Decisão
Adotar Trunk-Based Development / GitHub Flow: a branch `main` é protegida e sempre implantável; mudanças são feitas em branches `feature/<descrição>` de vida curta e integradas via Pull Request, com pipeline de CI obrigatório antes do merge.

## Consequências
- Reduz o acúmulo de mudanças não integradas e o risco de conflitos grandes.
- Exige que o pipeline de CI seja rápido e confiável, já que ele é o único "portão" antes do merge (não há revisão de terceiros formalizada no projeto individual).
- Correções emergenciais usam branches `hotfix/<descrição>`, aplicadas diretamente e reintegradas à `main`.
