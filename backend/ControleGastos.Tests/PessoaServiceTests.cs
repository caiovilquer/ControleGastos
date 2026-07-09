using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;
using ControleGastos.Api.Services;
using ControleGastos.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Tests;

public class PessoaServiceTests : IDisposable
{
    private readonly TestDbContextFactory _factory;
    private readonly PessoaService _service;

    public PessoaServiceTests()
    {
        _factory = new TestDbContextFactory();
        _service = new PessoaService(_factory.DbContext);
    }

    // Teste de fumaça: prova que a infraestrutura de testes (SQLite
    // in-memory + AppDbContext real) funciona ponta a ponta.
    [Fact]
    public async Task CriarAsync_DevePermitirLerAPessoaDeVoltaComObterPorId()
    {
        var request = new CriarPessoaRequest { Nome = "Ana", Idade = 25 };

        var criada = await _service.CriarAsync(request, CancellationToken.None);
        var lida = await _service.ObterPorIdAsync(criada.Id, CancellationToken.None);

        Assert.Equal(criada.Id, lida.Id);
        Assert.Equal("Ana", lida.Nome);
        Assert.Equal(25, lida.Idade);
    }

    // Prova, via SQLite in-memory, que o cascade delete configurado em
    // AppDbContext (OnDelete(DeleteBehavior.Cascade)) remove as transações
    // de uma pessoa quando ela é excluída — regra de negócio do desafio.
    [Fact]
    public async Task ExcluirAsync_DeveRemoverTransacoesVinculadas_QuandoPessoaEExcluida()
    {
        var dbContext = _factory.DbContext;

        var pessoa = TestDataBuilder.CriarPessoa("Ana", 25);
        dbContext.Pessoas.Add(pessoa);
        await dbContext.SaveChangesAsync();

        dbContext.Transacoes.Add(TestDataBuilder.CriarTransacao(pessoa.Id, "Salário", 1000m, TipoTransacao.Receita));
        await dbContext.SaveChangesAsync();

        Assert.Equal(1, await dbContext.Transacoes.CountAsync());

        await _service.ExcluirAsync(pessoa.Id, CancellationToken.None);

        Assert.Equal(0, await dbContext.Transacoes.CountAsync());
        Assert.Equal(0, await dbContext.Pessoas.CountAsync());
    }

    public void Dispose() => _factory.Dispose();
}
