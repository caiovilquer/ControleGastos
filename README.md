# Controle de Gastos Residenciais

[![CI](https://github.com/caiovilquer/ControleGastos/actions/workflows/ci.yml/badge.svg)](https://github.com/caiovilquer/ControleGastos/actions/workflows/ci.yml)

Sistema com cadastro de pessoas, registro de transações (receitas e despesas) e consulta de totais por pessoa e geral.

## Stack

- **Back-end**: .NET 8 (C#) Web API com controllers, EF Core + SQLite (persistência em arquivo), FluentValidation, xUnit
- **Front-end**: React + TypeScript (Vite), Tailwind CSS + shadcn/ui

## Estrutura

```
backend/
  ControleGastos.Api/
  ControleGastos.Tests/
frontend/
```

## Funcionalidades

- **Pessoas**: criação, listagem e deleção (deleção remove transações vinculadas em cascata)
- **Transações**: criação e listagem; menores de 18 anos podem registrar apenas despesas
- **Totais**: receitas, despesas e saldo por pessoa + total geral

## Como executar

Instruções detalhadas serão adicionadas ao final do desenvolvimento.

Requisitos: .NET 8 SDK e Node.js 20+.
