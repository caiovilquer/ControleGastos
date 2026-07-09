using ControleGastos.Api.Models;

namespace ControleGastos.Tests.Helpers;

// Helpers simples para montar dados de teste, sem framework de fixture.
public static class TestDataBuilder
{
    public static Pessoa CriarPessoa(string nome = "Pessoa Teste", int idade = 30)
        => new()
        {
            Nome = nome,
            Idade = idade
        };

    public static Transacao CriarTransacao(
        int pessoaId,
        string descricao = "Transação teste",
        decimal valor = 100m,
        TipoTransacao tipo = TipoTransacao.Despesa)
        => new()
        {
            PessoaId = pessoaId,
            Descricao = descricao,
            Valor = valor,
            Tipo = tipo
        };
}
